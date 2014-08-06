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

var options = {
    user: {
        displayName: 'Roger User',
        token: "eyJ...(base64url)...p9Q",
        id: "1234"
    },
    room: "jasdeep"
};

var options2 = {
    user: {
        provider: 'mydomain.com',
        id: 'mydomain.com:user_id',
        displayName: 'Authenticated User',
        groups: [
            { id: 'admin', displayName: 'Administrators' },
            { id: 'moderator', displayName: 'Moderators' }
        ],
        exp: 1391136012, // Optional
        iat: 1391126012, // Optional
        nbf: 1391127012  // Optional
    },
    room: "jasdeep",
    rooms: ['lobby', 'chat'],
};


console.log("");
console.log("CONNECT WITH CALLBACK");

// Connect with Promise
var conn1 = new goinstant2.Connection(App.pubnubSettings.url);

conn1.connect(options, function(err){
    if (err) {
        // there was an error connecting OR the token was invalid.
        return;
    }
    else {
        console.log("connection ready!");
    }


//    var room = conn1.room('myRoom');
//    room.join(function(err) {
//        if (err) {
//            // there as an error joining the room
//            return;
//        }
//
//        var key = room.key('/stock-prices/CRM');
//        key.get(function(err, value, context) {
//            if (err) {
//                // could not retrieve the value
//            }
//
//            // display the data.
//        });
//    });
});


//console.log("");
//console.log("CONNECT WITH PROMISE");
//
//// Connect with Promise
//var conn2 = goinstant2.connect(App.pubnubSettings.url, options2);
//
//conn2.then(function(conn) {
//    console.log('connection: ', conn.connection);
//    console.log('rooms: ', conn.rooms);
//
//
//});
//
//
//conn2.catch(function(err) {
//    console.log('Error connecting:', err);
//});

var v;

var x1 = function() {
    console.log("x1");
    return conn1.room('myRoom');
};

var x2 = function(room) {
    console.log("x2");
    console.log(room.room);
    v = room.room.key('testKey');
    console.log(v);
    y = v.get();
    console.log(y);
    return v;
};

var x3 = function(key) {
    console.log("x3");
    key.info();
    return key.add("addedValue1");
};

var x4 = function(key){
    console.log("x4");
    key.info();
    return key.add("addedValue2");
};

var x5 = function(key){
    console.log("x5");
    key.info();
    return key.merge({ merge: "mergeValue"});
};

var x6 = function(key) {
    console.log("x5");
    key.info();
    return key.merge({ merge: "mergeValue2"});
};


x = setTimeout(function() {

    try {
        //x1().then(x2).then(x3).then(x4).then(x5).then(x6);
    }
    catch (e) {
        console.error(e);
    }
}, 5000);

