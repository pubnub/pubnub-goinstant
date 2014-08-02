goinstant2.Room = function Room(context, name, user){

    var _context = context;
    _context.room = this;

    var _pubnub = context.pubnub;

    var _roomName = name;
    var _user = user;

    var _onEvents = {
        join: null,
        leave: null,
        joinLocal: null,
        leaveLocal: null
    };

    var _state = {
        joined: false
    };

    function _presence(msg) {
        if (msg.action === 'join') {
            if (typeof _onEvents.join === 'function') {
                _onEvents.join({ user: msg.uuid });
            }
        }
        else if (msg.action === 'leave' || msg.action === 'timeout') {
            if (typeof _onEvents.leave === 'function') {
                _onEvents.leave({ user: msg.uuid })
            }
        }
    }

    // Since we are simulating the GoInstant Room (which has only presence)
    // we will ignore any incoming messages
    function _message(msg, env, channel) {
        // Ignore messages on this channel
    }

    return {
        join: function(callback) {
            var subscribeInfo = {
                channel: _roomName,
                presence: function (msg) {
                    _presence(msg);
                },
                message: function (msg, env, ch) {
                    _message(msg, env, ch);
                },
                connect: function() {
                    this._state.joined = true;
                },
                disconnect: function() {
                    this._state.joined = false;
                }
            };

            if (_user.displayName !== 'undefined') {
                subscribeInfo.state =  { id: _user.id, displayName: _user.displayName }
            }

            _pubnub.subscribe(subscribeInfo);
        },
        leave: function() {
            _pubnub.unsubscribe({
                channel: _roomName
            })
        },
        on: function(eventName, a, b){

            var hasOptions = false;
            var hasCallback = false;
            var options = null;
            var callback = null;


            if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (typeof a === 'object') {
                hasOptions = true;
                options = a;
            }
            else if (typeof a === 'function') {
                hasCallback = true;
                callback = a;
            }


            if (eventName === 'join') {
                _onEvents.join = callback;
            }
            else if (eventName === 'leave') {
                _onEvents.leave = callback;
            }
        },
        off: function(eventName, a, b){

            var hasEventName = false;
            var hasOptions = false;
            var hasCallback = false;

            var options = null;
            var callback = null;

            if (typeof eventName !== 'undefined' || eventName != null) {
                hasEventName = true;
            }

            if (typeof a !== 'undefined' && typeof b !== 'undefined') {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (typeof a === 'object') {
                hasOptions = true;
                options = a;
            }
            else if (typeof a === 'function') {
                hasCallback = true;
                callback = a;
            }

            // EventName is Specified
            if (hasEventName && hasOptions && hasCallback) {

            }
            else if (hasEventName && hasOptions) {

            }
            else if (hasEventName && hasCallback) {

            }

            // EventName is Null
            if (!hasEventName && !hasOptions && !hasCallback) {
                // De-Register all events
                _onEvents.join = null;
                _onEvents.leave = null;
            }
            else if (!hasEventName && hasOptions && hasCallback) {

            }
            else if (!hasEventName && hasCallback) {

            }

        },
        self: function() {
            console.log("TODO: return data sync info (KEY) for this user")
        },
        user: function(userID) {
            console.log("TODO: return data sync info (KEY) for user with userID")
        },
        users: function() {
            console.log("TODO: return data sync info (KEY) for user list")
        },
        key: function(name) {

        }

    }
};