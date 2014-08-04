window.goinstant2 = {};
var hasValue = function(v) {
    return (!!(typeof v !== 'undefined' && v !== null));
};

var isFunction = function(fn) {
    return (!!(typeof fn !== 'undefined' && fn !== null && typeof fn === 'function'));
};

goinstant2.App = function App(){
    var instance;

    function init() {

        // Private Members
        var _useLogging = false;

        // Private API


        return {

            // Public Members

            // Public API

            log: function(text, prefix, method) {
                if (_useLogging) {

                    var out = "";
                    out += hasValue(prefix) ? prefix + ": " : "";
                    out += hasValue(method) ? method + "() - " : "";
                    out += text;

                    console.log(out);
                }
            },
            logging: function(trueFalse) {
                _useLogging = trueFalse;
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

}();
window.goinstant2.App = goinstant2.App.getInstance();
goinstant2.App.logging(true);

LOG = goinstant2.App.log;
window.App = {};

goinstant2.BaseClasses = {};

App.pubnubSettings = {
    publish: "pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2",
    subscribe: "sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe",
    secret: "sec-c-OTY5NGI0ODgtMGRkNy00MDkyLWIxODQtN2NmNjhjNzQ4NmEz",
    url: "https://pubnub/pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2/sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe/sec-c-OTY5NGI0ODgtMGRkNy00MDkyLWIxODQtN2NmNjhjNzQ4NmEz"
};

var pn = PUBNUB.init({
    publish_key: App.pubnubSettings.publish_key,
    subscribe_key: App.pubnubSettings.subscribe_key,
    secret_key: App.pubnubSettings.secret_key,
    use_ssl: true
});

// Some more privileged methods, with some private data.
// Use stampit.mixIn() to make this feel declarative:
goinstant2.BaseClasses.room = stampit().enclose(function () {

    var _roomName = 'unspecified';
    var _joined = false; // private
    var _context = {};
    var _pubnub = null;

    // public methods to access private members
    return stampit.mixIn(this, {
        room: function(name) {
            var r = new goinstant2.Room();
            r.setName(name);
            return r;
        },
        setContext: function(context) {
            _context = context;
            _pubnub = context.pubnub;
            return this;
        },
        setName: function(name) {
            if (_joined) {
                LOG("Changing name to " + name + " requires unsubscribe from " + _roomName, "Room", "setName");
                this.leave(function() {
                    _roomName = name;
                });
            }
            else {
                _roomName = name;
            }
            return this;
        },
        name: function(){
            return _roomName;
        },
        join: function join(callback) {

            var subscribeInfo = {
                channel: _roomName,
                presence: function (msg) {
                    //_presence(msg);
                },
                message: function (msg, env, ch) {
                    //_message(msg, env, ch);
                },
                connect: function() {
                    LOG("PUBNUB connected to " + _roomName, "Room", "join._pubnub.subscribe.connect");
                    _joined = true;
                    callback();
                },
                disconnect: function() {
                    LOG("PUBNUB disconnected " + _roomName, "Room", "join._pubnub.subscribe.disconnect");
                    _joined = false;
                    console.log(_state);
                }
            };

//            if (_user.displayName !== 'undefined') {
//                subscribeInfo.state =  { id: _user.id, displayName: _user.displayName }
//            }

            _pubnub.subscribe(subscribeInfo);

            return this;
        },
        leave: function leave(callback) {
            if (_joined) {
                _pubnub.unsubscribe({ channel: _roomName });
                LOG("PUBNUB unsubscribe to " + _roomName, "Room", "leave");
                _joined = false;
            }
            callback();
            return this;
        },
        joined: function isJoined() {
            return _joined;
        }
    });
});

// More Public methods on private members
var membership = stampit({
        add: function (member) {
            this.members[member.name] = member;
            return this;
        },
        getMember: function (name) {
            return this.members[name];
        }
    },
    {
        members: {}
    });

// Let's set some defaults:
var defaults = stampit().state({
    roomName: 'undecided'
});

// Classical inheritance has nothing on this. No parent/child coupling. No deep inheritance hierarchies.
// Just good, clean code reusability.
goinstant2.Room = stampit.compose(defaults, goinstant2.BaseClasses.room, membership);

// Note that you can override state on instantiation:
var room = new goinstant2.Room({roomName: 'unused'});
room.setContext({ pubnub: pn });
room.setName('what');
console.log(room.name());

// Silly, but proves that everything is as it should be.
room.add({name: 'Homer' }).setName('what').join(function(){
    console.log("NOW: ", room.joined());
    console.log(room);
    room.setName("what2");
    room.leave(function(){
        console.log("NOW: ", room.joined());
        console.log(room);
    });
}).getMember('Homer');

console.log(room);