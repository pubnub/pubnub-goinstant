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
        DEBUG(1, "Room", "_presence[" + _pnRoomName + "]", "", "", msg);

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
            if (value) {
                _roomName = value;
                _pnRoomName = "ROOM:::" + value;
                return this;
            }
            return _roomName;
        },
        context: function(value){
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
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            return _selfKey;
        },
        setUser: function(userObject) {
            _user = userObject;
        },
        user: function (userID) {
            LOG(userID, "Room", "user");
            INFO("return data sync info (KEY) for user with userID", "Room", "TODO - user");
            if (_user && hasValue(_user.id) && userID === _user.id) {
                return _selfKey;
            }
            else {
                return _key("'.users'" + "." + _userID);
            }
        },
        users: function (empty) {
            LOG("users collection", "Room", "users");
            var users = new goinstant2.BaseClasses.key();

            var usersPath = "'.users'";
            users.room(this).context(_context).syncObject(_syncObject).path(usersPath);

            users.startSync().then(function(){
                LOG("sync ready", "Room", "users");
                users.info();

                if (empty) {
                    users.remove().then(function(){
                        users.info();
                    });
                }
            });

            return users;
        },
        key: function (name) {

            var k = new goinstant2.BaseClasses.key();
            k.room(this).context(_context).syncObject(_syncObject).path(name);

            DEBUG(1, "Room", "key", name, "sync object initialize");

            k.sync(function(){
                DEBUG(1, "Room", "key", k.fullPath(), "sync object ready");
            });

            return k;
        },
        join: function (a,b,c) {

            var self = this;
            var hasUser = false;
            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;
            var deferred;

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
                deferred = Q.defer();
                DEBUG(1, "Room", "join", _pnRoomName, "promise created");
            }

            _context.room = _roomName;

            DEBUG(1, "Room", "join", _roomName, "start join process");

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


            _syncObject = _pnRoomName;

            DEBUG(1, "Room", "join", _pnRoomName, "create this user sync object", { object_id: ".'.users'/" + _user.id, user: _user} );
            _selfKey = new goinstant2.BaseClasses.key();

            var userPath = "'.users'" + "." + _user.id;
            _selfKey.room(this).context(_context).syncObject(_syncObject).path(userPath).initializeData({
                action: "merge",
                value: _user
            });

            DEBUG(1, "Room", "join", _pnRoomName, "sync initiate");

            _selfKey.sync(function(){

                DEBUG(1, "Room", "join", _roomName, "sync complete");

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

                    // Redefine the connect to be when the promise is resolved
                    subscribeInfo.connect = function() {
                        _joined = true;
                        var resultObject = {
                            err: null,
                            room: self,
                            user: _user
                        };
                        DEBUG(1, "Room", "join", _pnRoomName, "promise resolved");
                        deferred.resolve(resultObject);
                    };

                    subscribeInfo.error = function(e) {
                        ERROR("promise rejected", "Room", "join");
                        deferred.reject(new Error(e));
                    };

                    // Now do the subscribe
                    DEBUG(1, "Room", "join", _pnRoomName, "PUBNUB subscribe for presence");
                    _pubnub.subscribe(subscribeInfo);

                    return deferred.promise
                }
                else {
                    LOG("callback pending", "Room", "join");
                    INFO("callback", "Room", "TODO - join");
                    return this;
                }

            });

            if (usePromise) {
                return deferred.promise;
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



