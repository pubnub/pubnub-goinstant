# GoInstant -> PubNub Code Migration

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