GoInstant to PubNub Code Migration
-----------

# Overview

We're sorry to hear about the discontinuation of GoInstant. PubNub offers comparative features to GoInstant and we'd love to have you migrate to our network.

Read below for a general overview of how GoInstant features translate to the PubNub network. The examples below come right from [GoInstant's Getting Started Guide](https://goinstant.com/getting-started) and have been translated to the PubNub SDK.

# Table Of Contents

---

<!-- MarkdownTOC depth=3 -->

- Getting Started
  - Initialization
  - Pub/Sub
  - Security
  - Storage and Sync
- API Reference for Migration
  - Connection
    - Connect
    - Disconnect
    - isGuest
    - loginURL
    - logoutUrl
    - off
    - on
    - PubNub
    - room
    - rooms
  - Rooms
    - Channels
    - Connection
    - Equals
    - Join
    - Joined
    - Key
    - Leave
    - off
    - on
    - ot
    - self
    - user
    - users
    - events
    - Comparison
    - Identifying users
    - Joining Multiple Rooms
    - Promises

<!-- /MarkdownTOC -->


---

# Getting Started

## Initialization

#### GoInstant

Connecting to GoInstant gives you access to store data for your application.

```html
<script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
<script>
var url = 'https://goinstant.net/ACCOUNT/APP';
var connect = goinstant.connect(url);
</script>
```

#### PubNub

Get a new Pubnub instance with publish and subscribe key. Check out our [getting started guide](http://www.pubnub.com/docs/javascript/tutorial/quick-start.html).

```html
<script src="http://cdn.pubnub.com/pubnub.min.js"></script>
<script>
var pubnub = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo'
});
</script>
```

---

## Pub/Sub

![](http://www.pubnub.com/static/images/old/pubnub-galaxy.gif)

#### GoInstant

When you don't need to store data, but need to stream super quick messages between users or devices, use Channels. This is available with the Room#channel interface.

```js
var myChannel = room.channel('notifications');
channel.message({
    time: Date.now(), 
    message: 'A new user has connected'
});
```

#### PubNub

The publish() function is used to send a message to all subscribers of a channel. A successfully published message is replicated across the PubNub Real-Time Network and sent simultaneously to all subscribed clients on a channel.

Check out our [data streams tutorial](http://www.pubnub.com/docs/javascript/tutorial/data-push.html).

```js
pubnub.publish({
    channel: 'notifications',
    message: {
        time: Date.now(), 
        message: 'A new user has connected'
    }
});
```

---

## Security

![](http://www.pubnub.com/static/images/illustrations/security-small.png)

#### GoInstant

Simple security rules for controlling application and data access. In this example all users can read the data inside the person key but only admin users can write.

```js
{
  "$room": {
    "person": {
      "#read": {"users": ["*"]},
      "#write": {"users": [], "groups": ["admin"]}
    }
  }
}
```

#### PubNub

PubNub Access Manager provides fine grain Publish and Subscribe permissions down to person, device or channel. For more on permissions and authentication, check out our [PAM tutorial](http://www.pubnub.com/docs/javascript/tutorial/access-manager.html).

```js

// Grant all users on 'privateChat' read access.

pubnub.grant({
    channel: 'privateChat',
    read: true,
    ttl: 60
});

// Grant any user with ```auth_key``` read and write access.

pubnub.grant({
    channel: 'privateChat',
    auth_key: 'abxyz12-auth-key-987tuv',
    read: true,
    write: true,
    ttl: 60
});
```

---

## Storage and Sync

#### GoInstant

```js
person.get(function(err, value) {
  // value contains {name: 'John Smith', title: 'CEO'}
});

person.on('set', function(value) {
  // value contains the updated contents of our key
});
```

#### PubNub

PubNub offers a similar API called Datasync in private beta. We're giving preferred access to applications migrating from GoInstant. [Apply Here](http://www.pubnub.com/how-it-works/data-sync/#access).

* Automatically sync application data in realtime across a range of devices
Store and share objects throughout your application's lifecycle
Features
* Support for JavaScript, iOS, Android, Python, Java, and many other environments
* Global synchronization with under 1/4 second latency
* Read/Write access control permissions on objects across users and devices
Data encryption via SSL and AES for secure sync

---

# API Reference for Migration

## Connection

### Connect

#### GoInstant

Connect to the GoInstant servers. This will trigger any handlers listening to the connect event.

```js
var url = 'https://goinstant.net/YOURACCOUNT/YOURAPP';
var connection = new goinstant.Connection(url);
connection.connect(function(err) {
  if (err) {
    console.log('Error connecting to GoInstant:', err);
    return;
  }
  // you're connected!
});
```

#### PubNub

PubNub connections are made when the client subscribes to a channel.

```js
// Initialize with Publish & Subscribe Keys
var pubnub = PUBNUB.init({
   publish_key: 'demo',
   subscribe_key: 'demo'
});

// Subscribe with callbacks
pubnub.subscribe({
  channel : 'my_channel',
  message : function( message, env, channel ){
     // RECEIVED A MESSAGE.
     console.log(message)
  },
  connect: function(){console.log("Connected")},
  disconnect: function(){console.log("Disconnected")},
  reconnect: function(){console.log("Reconnected")},
  error: function(){console.log("Network Error")}, 
});
```

### Disconnect

#### GoInstant

Disconnects from the GoInstant servers. This will trigger any handlers listening to the disconnect event.

```js
connection.disconnect(function(err) {
  if (err) {
    console.log("Error disconnecting:", err);
    return;
  }
  // you are disconnected!
});
```

#### PubNub

When subscribed to a single channel, this function causes the client to issue a leave from the channel and close any open socket to the PubNub Network. 

```
// Unsubscribe from 'my_channel'

pubnub.unsubscribe({
  channel : 'my_channel',
});
```

### isGuest

#### GoInstant

Returns true, false, or null based on if the currently logged-in user is a Guest or not. If the connection is not currently established, null is returned, which in a boolean context is "falsy".

```js
var url = 'https://goinstant.net/YOURACCOUNT/YOURAPP';
goinstant.connect(url, function(err, conn) {});
  if (err) {
    console.log("Error connecting:", err);
    // Failed to connect to GoInstant
    // NOTE: conn.isGuest() will return `null` if called here
    return;
  }

  if (conn.isGuest()) {
    showLoginButtons(conn);
  } else {
    joinRooms(conn);
  }
});
```

#### PubNub

The state API is used to get or set key/value pairs specific to a subscriber uuid. A client's uuid is set during [init](http://www.pubnub.com/docs/javascript/api/reference.html#init).

State information is supplied as a JSON object of key/value pairs.

```js
 // Initialize with Custom UUID
 var pubnub = PUBNUB.init({
     publish_key: 'demo',
     subscribe_key: 'demo',
     uuid: 'my_uuid'
 });

// Set state to current uuid
pubnub.state({
  channel  : "my_channel",
  state    : { "isGuest": true },
  callback : function(m){console.log(m)},
  error    : function(m){console.log(m)}
);

// Get state by uuid.
pubnub.state({
  channel  : "my_channel",
  uuid     : "my_uuid",
  callback : function(m){console.log(m)},
  error    : function(m){console.log(m)}
);
```

### loginURL

#### GoInstant

Returns a URL to the GoInstant Authentication API for the Account & App used to create this connection.

```js
var href = connection.loginUrl('facebook');
```

#### PubNub

* Make the Facebook, Twitter, or other OAuth call to identify the user. 
* Use the information returned as the ```auth_key``` or ```uuid``` during ```PUBNUB.init()```.

```js

// Facebook Login for Web 
// https://developers.facebook.com/docs/facebook-login/login-flow-for-web/

FB.api('/me', function(data) {
  
  pubnub = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo',
    uuid: data.name
  });

  pubnub.subscribe({ ... });

});
```

### logoutUrl

#### GoInstant

Returns a URL to the GoInstant Authentication API that allows a user to "sign out" of the Account & App used to create this connection.

```js
window.location = connection.logoutUrl();
```

#### PubNub

Just like our login example, we use ```FB.logout``` then unsubscribe to the channel.

```js
FB.logout(function(response) {
  pubnub.unsubscribe({ ... });
});
```

### off

#### GoInstant

Remove a previously established listener for a Connection event.

```js
connection.off(eventName, callback(errorObject))
```

#### PubNub

Because PubNub's events are registered as callbacks in the ```PUBNUB.subscirbe()``` function we do not offer a way to unregister events.

### on

Create a listener for a Connection event, which listens for events that are fired locally, and so will never be fired when other users connect/disconnect/error.

```js
connection.on(eventName, listener(errorObject))
```

### PubNub 

You can supply callbacks within ```PUBNUB.subscribe()``` for similar events.

```js
pubnub.subscribe({
  channel: 'my_channel',
  message: function( message, env, channel ){
     // RECEIVED A MESSAGE.
  },
  connect: function(){console.log("Connected")},
  disconnect: function(){console.log("Disconnected")},
  reconnect: function(){console.log("Reconnected")},
  error: function(){console.log("Network Error")}, 
});
```

### room

#### GoInstant

Returns a Room object.

```js
var connection = new goinstant.Connection(url);
connection.connect(token, function (err) {

  var room = connection.room('YOURROOM');
  room.join(function(err) {
    if (err) {
      console.log("Error joining room:", err);
      return;
    }

    console.log("Joined room!");
  });
});
```

#### PubNub

PubNub does not have a concept of rooms, only "channels." You can get information about channel permissions using [audit](http://www.pubnub.com/docs/javascript/api/reference.html#audit) and information about the users in a channel using [here_now](http://www.pubnub.com/docs/javascript/api/reference.html#here_now).

### rooms

#### GoInstant

Returns an array of Rooms to the callback. Includes all rooms that currently belong to the application.

```js
connection.rooms.get(function(err, roomsArray) {
  if (err) {
    // A problem occurred during the get.
    throw err;
  }

  roomsArray.forEach(function(room) {
    console.log('Room name:', room.name)
  });
});
```

#### PubNub

PubNub does not supply a method to find all channels within an application. However, you can find all the channels a uuid is connected to with [where_now](http://www.pubnub.com/docs/javascript/api/reference.html#where_now).

## Rooms

### Channels

Channels exist within a room. We only have concept of channels without rooms.

### Connection

We don't have this.

### Equals 

N/A

### Join

Subscribe

### Joined

Boolean if connected. We may have.

### Key

Datasync

### Leave

Unsubscribe

### off

Link  to our events

### on

Link  to our events

### ot

See Datasync

### self

state

### user

n/a - convenience method

### users

here_now

### events

join / leave -> presence

------------------

Other notes

### Comparison

[Go instant connection code]
[PubNub connection code]

### Identifying users

[steal their docs on authenticated user, guest users]
[link to our doc on authentication]

### Joining Multiple Rooms

Rooms are channels.

[their docs on "connecting and joining"]
[our docs for comma seperated / array]

### Promises

We don't support ```.then``` or ```.catch``` but maybe I can write something that does it