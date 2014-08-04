goinstant2.BaseClasses.room = stampit().enclose(function () {


    var _context, _pubnub, _roomName, _pnRoomName, _user, _selfKey, _syncObject;

    var _onEvents = {
        join: null,
        leave: null,
        joinLocal: null,
        leaveLocal: null
    };

    var _joined = false;


    function _presence(msg) {
        LOG(msg, "Room", "_presence[" + _pnRoomName + "]");

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


    // Public API
    return stampit.mixIn(this, {

        name: function (value) {
            LOG(value, "Room", "name");
            if (value) {
                _roomName = value;
                _pnRoomName = "ROOM:::" + value;
                return this;
            }
            return _roomName;
        },
        context: function(value){
            LOG(value, "Room", "context");
            if (value) {
                _context = value;
                _pubnub = _context.pubnub;
                return this;
            }
            return _context;
        },
        joined: function () {
            return _joined;
        },
        self: function () {
            LOG("", "Room", "self");
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            return _selfKey;
        },
        user: function (userID) {
            LOG(userID, "Room", "user");
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            return null;
        },
        users: function () {
            LOG("users collection", "Room", "users");
            INFO("return data sync info (KEY) for user list", "Room", "TODO - users");
            return null;
        },
        key: function (name) {
            LOG(name, "Room", "key");
            var k = new goinstant2.BaseClasses.key();
            k.room(this).context(_context).roomName(_roomName).name(name);
            return k;
        },
        join: function (a,b,c) {
            LOG("PUBNUB subscribe to " + _roomName, "Room", "join");

            var self = this;
            var hasUser = false;
            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            // *** Anaylze Parameters

            if (hasValue(a) && hasValue(b) && hasValue(c)) {
                hasUser = true;
                hasOptions = true;
                hasCallback = true;
                _user = a;
                options = b;
                callback = c;
            }
            else if (hasValue(a) && hasValue(b)) {
                hasUser = true;
                hasCallback = true;
                _user = a;
                callback = b;
            }
            else if (hasValue(a)) {
                hasCallback = true;
                callback = a;
            }
            else {
                usePromise = true;
            }


            // *** Handle User Object settings

            // If no user provided, but was set explicitly
            if (!hasUser && hasValue(_user)) {
                hasUser = true;
            }
            else {
                _user = {};
                hasUser = true;
            }

            // Add Randomized Guest Name if none provided
            if (!hasValue(_user.displayName)) {
                _user.displayName = "Guest " + Math.floor((Math.random() * 100000) + 10000).toString();
            }

            // Add Random UserID if none provided
            if (!hasValue(_user.id)){
                _user.id = _pubnub.uuid();
            }

            // *** Get Sync Object for this user

            LOG("set sync object name " + _pnRoomName, "Room", "name");
            _syncObject = _pnRoomName;

            LOG("create data sync object for '.users'/" + _user.id + " in " + _pnRoomName, "Room", "name");
            _selfKey = new goinstant2.BaseClasses.key();

            var userPath = "'.users'" + "." + _user.id;
            _selfKey.context(_context).syncObject(_syncObject).path(userPath , function(){
                // When ready, set this users value at the path
                _selfKey.set(_user);
            });
            _selfKey.info();


            // *** Configure PUBNUB Subscription

            var subscribeInfo = {
                channel: _pnRoomName,
                presence: function (msg) {
                    _presence(msg);
                },
                message: function (msg, env, ch) {
                    _message(msg, env, ch);
                },
                connect: function () {
                    LOG("PUBNUB connected to " + _pnRoomName, "Room", "join._pubnub.subscribe.connect");
                    _joined = true;
                },
                disconnect: function () {
                    LOG("PUBNUB disconnected " + _pnRoomName, "Room", "join._pubnub.subscribe.disconnect");
                    _joined = false;
                    console.log(_state);
                }
            };


            // Set the PUBNUB state object to the user object
            subscribeInfo.state = _user;


            // *** Return Q Promise or execute callback


            // If we are using a Q Promise, alter the subscribe params and defer resolution
            if (usePromise) {
                LOG("using promise", "Room", "join");

                // Create a a promise object to be resolved
                var defer = Q.defer();

                // Redefine the connect to be when the promise is resolved
                subscribeInfo.connect = function() {
                    _joined = true;
                    var resultObject = {
                        err: null,
                        room: self,
                        user: _user
                    };
                    defer.resolve(resultObject);
                };

                subscribeInfo.error = function(e) {
                    defer.reject(new Error(e));
                };

                // Now do the subscribe
                _pubnub.subscribe(subscribeInfo);

                return defer.promise
            }
            else {
                LOG("using callback", "Room", "join");

                return this;
            }
        },
        leave: function (callback) {
            LOG("PUBNUB unsubscribe to " + _roomName, "Room", "leave");
            _pubnub.unsubscribe({
                channel: _pnRoomName
            });
            if (isFunction(callback)) {
                callback({ err: null });
            }
            return this;
        },
        on: function (eventName, a, b) {
            LOG(eventName, "Room", "on");

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
        off: function (eventName, a, b) {
            _self = this;
            LOG(eventName, "Room", "off");

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

        }
    });
});



