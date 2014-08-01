# GoInstant to PubNub Code Migration

## Overview

We're sorry to hear about the discontinuation of GoInstant. PubNub offers comparative features to GoInstant and we'd love to have you migrate to our network.

Read below for a general overview of how GoInstant features translate to the PubNub network. The examples below come right from [GoInstant's Getting Started Guide](https://goinstant.com/getting-started) and have been translated to the PubNub SDK.

### Initialization

<table>
  <tbody>
    <tr>
      <th>GoInstant</th>
      <th>PubNub</th>
    </tr>
    <tr>
      <td>
        <pre>
        <script src="https://cdn.goinstant.net/v1/platform.min.js"></script>
        <script>
        var url = 'https://goinstant.net/ACCOUNT/APP';
        var connect = goinstant.connect(url);
        </script>
        </pre>
      </td>
      <td>
        Connecting to GoInstant gives you access to store data for your application.
      </td>
    </tr>
    <tr>
      <td>
        <pre>
        <script src="http://cdn.pubnub.com/pubnub.min.js"></script>
        <script>
        var pubnub = PUBNUB.init({
            publish_key: 'demo',
            subscribe_key: 'demo'
        });
        </script>
        </pre>
      </td>
      <td>Get a new Pubnub instance with publish and subscribe key.</td>
    </tr>
  </tbody>
</table>

### Pub/Sub

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

The publish() function is used to send a message to all subscribers of a channel. To publish a message you must first specify a valid publish_key at initialization. A successfully published message is replicated across the PubNub Real-Time Network and sent simultaneously to all subscribed clients on a channel.

```js
pubnub.publish({
    channel: 'notifications',
    message: {
        time: Date.now(), 
        message: 'A new user has connected'
    }
});
```

### Security

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

PubNub Access Manager provides fine grain Publish and Subscribe permissions down to person, device or channel.

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

### Storage and Sync

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

---------

# Direct API Migration

## Connection

### Connect

https://developers.goinstant.com/v1/javascript_api/connection/connect.html

### Disconnect

### isGuest

This is something you can do with user state.

### loginURL

See our section on authentication and PAM.

### logoutUrl

PAM timeout. Unsubscribe.

### off

connect / disconnect / error

### on

connect / disconnect / error

### room

I don't think we have comparable.

### rooms

No comparable. "where_now"

### errors

Link to our errors

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