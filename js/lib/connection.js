goinstant2.connect = function(url, a, b){
    return new goinstant2.Connection(url).connect(a, b);

//    // For each room to be joined, connect to it, and push into results array
//    _.forEach(connectToRooms, function(r){
//        var room = this.room(r);
//        resultsArray.rooms.push(room);
//    });

};

goinstant2.Connection = function(url) {
    return new goinstant2.BaseClasses.connection().url(url);
};

goinstant2.BaseClasses.connection = stampit().enclose(function () {

    var _user = null;
    var _pubnub = null;

    var _url, _publishKey, _subscribeKey, _secretKey;

    var _context = {
        connection: this,
        user: null,
        rooms: [],
        pubnub: null,
        keys: {}
    };

    function _processURL () {
        var keys = _url.slice(15).split("/");

        _context.keys = {
            publish_key: keys[0],
            subscribe_key: keys[1],
            secret_key: keys[2],
            origin: "pubsub-beta.pubnub.com"
        }

        // Create PUBNUB object with the appropriate keys
        _pubnub = PUBNUB.init(_context.keys);

        // Store in Context
        _context.pubnub = _pubnub;
    }

    // Public API
    return stampit.mixIn(this, {
        url: function(value) {
            if (value) {
                _url = value;
                _processURL();
                return this;
            }
            return _url;
        },
        context: function() {
            return _context;
        },
        connect: function(a,b) {
            //LOG(name, "Connection", "connect");
            var hasOptions = false;
            var hasCallback = false;
            var usePromise = false;

            var options, callback;

            var connectToRooms = [];

            // If a and b provided, they are options and callback
            // Else if only a is provided, it's either options + promise (object) OR callback (function)
            // Else nothing provided, so use Promise
            if (hasValue(a) && hasValue(b)) {
                hasOptions = true;
                hasCallback = true;
                options = a;
                callback = b;
            }
            else if (isObject(a)) {
                hasOptions = true;
                options = a;
                usePromise = true;
            }
            else if (isFunction(a)) {
                hasCallback = true;
                callback = a;
            }
            else {
                usePromise = true;
            }

            if (hasOptions) {
                if (_.has(options, 'user')) {
                    _user = options.user;
                    //console.log(_user);
                }

                if (_.has(options, "room")) {
                    connectToRooms.push(options.room);
                }
                else if (_.has(options, "rooms")) {
                    _.forEach(options.rooms, function(r){
                        connectToRooms.push(r);
                    });
                }

                if (_.has(options, "visible")) {
                    if (options.visible) {
                        console.warn("#goinstant2.connect option 'visible: false' not available in this SDK");
                    }
                }
            }

            // If no rooms are specified, connect to the 'lobby' room by default
            if (connectToRooms.length == 0) {
                connectToRooms.push('lobby');
            }

            // ***********************************************************************
            // RETURN RESULTS (callback and Q Promise)
            // ***********************************************************************

            // Connect to all the rooms via Promises
            var roomJoinChain = _.map(connectToRooms, function(name){

                var room = new goinstant2.BaseClasses.room();

                room.context(_context).name(name);

                if (hasValue(_user)) {
                    room.setUser(_user);
                }
                return room.join().then(function(result) {
                    _context.rooms.push(room);
                });
            });

            // If we are using a Q Promise, alter the subscribe params and defer resolution
            if (usePromise) {
                LOG("promise created", "Connection", "connect");

                var defer = Q.defer();

                var resultObject = {
                    connection: this,
                    rooms: []
                };

                Q.allSettled(roomJoinChain).then(function(result){
                    INFO("check for errors on room joins", "Connection", "TODO - connect");
                    resultObject.rooms = _context.rooms;

                    LOG("promise resolved", "Connection", "connect");
                    defer.resolve(resultObject);
                });

                return defer.promise

            }
            else {

                LOG("callback pending", "Connection", "connect");

                var err = null;
                var resultsArray = [err];

                // Add this Connection Object to the results array
                resultsArray.push(this);

                INFO("Connection Errors are only generated from Room objects", "Connection", "connect");

                // Connect to Each Room specified
                Q.allSettled(roomJoinChain).then(function(result){
                    INFO("check for errors on room joins", "Connection", "TODO - connect");
                    _.forEach(connectToRooms, function(r){
                        resultsArray.push(r);
                    });

                    LOG("callback executing", "Connection", "connect");
                    // Execute Callback, with resultsArray as the function params
                    callback.apply(this, resultsArray);
                });

                return this;

            }
        },
        room: function(name) {
            LOG(name, "Connection", "connect");
            return _connectRoom(name);
        },
        rooms: function() {

        },
        isGuest: function() {
            return false;
        }

    });
});

