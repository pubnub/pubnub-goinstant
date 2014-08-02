var valueExists = function(v) {
    return (!!(typeof v !== 'undefined' && v !== null));
};

var isFunction = function(fn) {
    return (!!(typeof fn !== 'undefined' && fn !== null && typeof fn === 'function'));
};

/* **********************************************
     Begin goinstant2.js
********************************************** */

var pubnub_goinstant = (function () {
    var instance;

    function init() {

        // **********************************************************************
        // Private Members
        // **********************************************************************
        var _pubnub = null;
        var _user = null;

        // **********************************************************************
        // Private API
        // **********************************************************************
        function _connect() {

        }
        return {

            // **********************************************************************
            // Public Members
            // **********************************************************************


            // **********************************************************************
            // Public API
            // **********************************************************************


            // goinstant.connect(url);
            // goinstant.connect(url, optionsObject);
            // goinstant.connect(url, callback(errorObject, connectionObject, roomObject))
            // goinstant.connect(url, optionsObject, callback(errorObject, connectionObject, roomObject...))
            //
            // PubNub Apps aren't connected to directly, because they can have multiple keys
            // instead, you connect to a specific app-key-set
            //
            // Convert url to pubnub version: https://pubnub/publishkey/subscribekey/secretkey
            //
            connect: function(url, a, b) {
                return this.Connection(url, a, b);
            },

            Connection: function (url, a, b){

                var keys = url.slice(15).split("/");
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

                if (hasOptions) {
                    if (_.has(options, 'user')) {
                        _user = options.user;
                        //console.log(_user);
                    }
                }



                _pubnub = PUBNUB.init({
                    publish_key: keys[0],
                    subscribe_key: keys[1],
                    secret_key: keys[2]
                });

                return new goinstant2.Connection(_pubnub);
            }
        };
    }

    return { 

        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function () {
            if ( !instance ) {
                instance = init();
            }
            return instance;
        }

    };

})();

window.goinstant2 = pubnub_goinstant.getInstance(); 

/* **********************************************
     Begin connection.js
********************************************** */

goinstant2.Connection = function Connection(pubnubConnection, user){

    var _user = user;
    var _context = {
        connection: this,
        user: user,
        rooms: [],
        pubnub: pubnubConnection
    };

    function _connect_room(name){
        var room = new goinstant2.Room(_context, name, _user);
        _context.rooms.push(room);
        return room;
    }

    _connect_room('lobby');

    return {
        room: function(name) {
            _connect_room(name);
        },
        rooms: function(){
            return _context.rooms;
        },
        then: function(fn) {
            fn(_context);
        }
    }
};


/* **********************************************
     Begin room.js
********************************************** */

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

/* **********************************************
     Begin channel.js
********************************************** */

goinstant2.Channel = function Channel(context, name){

    var _context = context;
    var _pubnub = _context.pubnub;
    var _name = name;

    var _state = {
        joined: false
    };

    var _onEvents = {
        message: null
    };

    (function init() {
        var subscribeInfo = {
            channel: _name,
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

    })();

    function _message(msg, env, channel) {
        if (isFunction(_onEvents.message)){
            message(msg);
        }
    }

    function _publish(msg, errorCallback){
        var callbackValues = {
            err: null
        };

        var error = function error(err) {
            if (err !== null && typeof err !== 'undefined') {
                callbackValues.err = err;
            }
        };

        _pubnub.publish({
            channel: _name,
            message: msg,
            error: error
        });

        if (isFunction(errorCallback)) {
            errorCallback(callbackValues);
        }
    }


    return {
        message: function(msg, errorCallback) {
            _publish(msg, errorCallback);
        },
        on: function(eventName, receiveCallback){
            if (hasValue(eventName) && eventName === 'message') {
                if (isFunction(receiveCallback)) {
                    _onEvents.message = receiveCallback;
                }
            }
        }
    }
};

/* **********************************************
     Begin key.js
********************************************** */

goinstant2.Key = function Key(context, roomName, keyName, pubnubConnection){

    var _context = context;
    var _pubnub = pubnubConnection;
    var _roomID = roomName;
    var _keyID = keyName;

    var _key = _roomID + "/" + keyName;
    var _value = null;

    function _getValue() {
        console.log("TODO: Key._getValue(" + key + ")");
    }

    return {
        get: function(fn) {

            var returnValues = {
                err: null,
                value: _value,
                context: null
            };
            return returnValues;
        },
        key: function(keyName) {
            return new goinstant2.Key(_roomID, _keyID + "/" + keyName, _pubnub);
        },
        parent: function(){
            console.log("TODO: return parent key");
        }
    };
};

/* **********************************************
     Begin compiled.js
********************************************** */

/* Compilation: File for CodeKit to compile all the classes together */
