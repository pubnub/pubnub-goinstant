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
