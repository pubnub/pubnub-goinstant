# Intro 

With GoInstant shutting down, and there being so many similarities between PubNub and GoInstant, 
we thought being helpful to help GoInstant users transition over to PubNub.

We have a few ways of helping out, a migration tool for sync'd data stores, a guide describing
similarities and differences between GoInstant and PubNub, 
and this SDK drop in that should help keep most applications up and running!

The main page for the PubNub-GoInstant SDK is here: http://pubnub.github.io/pubnub-goinstant/
The README for the current status of the wrapper is here: https://github.com/pubnub/pubnub-goinstant/tree/gh-pages

The drop-in pubnub-goinstant SDK resembles GoInstant in vast majority of operations, however there are some notable differences in terms of workflow and when certain events happen.

## GoInstant Connections and Users

With PubNub connections to the platform actually happen on "subscribe" (joining a channel). In GoInstant, if no room or rooms are specified, it automatically will join the "lobby" room. So, to simulate that, the pubnub-goinstant wrapper will do the same and automatically join "lobby" if no Room is specified. Connections in GoInstant have events for connect/disconnect as well, but of course, when using PubNub that event is actually on a Room, we bubble up that event from Room objects in the Room collection.

PubNub doesn't currently have the equivalent of the GoInstant Authentication API. We've considered making one, but it doesn't exist right now in production. So in lieu of that, instead of using that Authentication API, there are numerous SSO services that you could use, and merely pass the social login token received post authentication to the Connection.connect() method. 

In GoInstant it creates a "Guest xxxx" user if no user is specified on the with the connect() method. The pubnub-goinstant wrapper simulates this behavior as well and handles it in the Connection class, creating an anonymous user. In PubNub we identify users with UUID's so a uuid is also created. 

Lastly, GoInstant uses a url for an App with an AppID to make a connection. PubNub however, uses a set of keys, publish, subscribe and secret keys. In order to keep methods syntactically the same, I simply converted the keys from PubNub into a url form (which is quite long), and also have the option for passing in an argument object with the information as well. 

## Rooms, Keys, Channels and Users

Keys in GoInstant are basically DataSync objects in PubNub, and Channels are, well, channels too in PubNub. One notable difference is that Rooms in GoInstant are *namespaces* for Keys and Channels. Meaning that Keys and Channels "belong to" Rooms (or Rooms "have" Keys and Channels). 

In PubNub we don't have that abstract container of a Room or enforce that abstraction.  This means that the pubnub-goinstant wrapper has to take that into consideration and avoid name collisions for Keys and Channels. We solve this by creating a prefix for Keys and Channels based on the room name. So the "root" of Keys and Channels that are on a room ("/") are actually ROOM::[roomName] so the lobby room is actually ```ROOM:::lobby```. The users Key ```room.self()``` which in GoInstant would be ```/.users/{userId}``` is translated to a Key that is at ```ROOM:::lobby.'.users'``` and if you created a Channel on the room called ```/chat``` the actual channel that is subscribe to is ```ROOM:::lobby.chat```. 

For users of pubnub-goinstant, you of course don't need to know or worry about how the library controls the namespace as it is handled automatically. However, if you are exporting and importing your Key data from GoInstant to PubNub, it's helpful to know where to put the data!!

In GoInstant because there isn't a Presence feature like PubNub has, they simulate it through the users Key ```room.self()``` as a DataSync object. In PubNub we have Presence, and it is extremely fast. So when a Room is joined, we actually subscribe to that room as it's own channel ```ROOM:::lobby``` to handle the ```join``` and ```leave``` events rather than use the ```room.self()``` Key and DataSync. While technically that channel can also send and receive messages like any other channel, we ignore them to maintain the Room abstraction.



## GoInstant Keys and PubNub Data Sync

In PubNub DataSync, the sync objects aren't tied to any namespace (Rooms for GoInstant), instead they are independent objects kept in sync. 
