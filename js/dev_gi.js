App.goinstantSettings = {
    url: "https://goinstant.net/Testjasldkfjklasd/Jasdeep"
};

var gi = new goinstant.Connection(App.goinstantSettings.url);

// ****************************************
// GoInstant Room vs Pubnub Channel
// ****************************************

gi.connect(function (err) {
    if (err) {
        // there was an error connecting OR the token was invalid.
        return;
    }
    var room = gi.room('jasdeep');

    room.on('join', function(userObject) {
        console.log(userObject.displayName + ' has joined the room!');
    });

    room.on('leave', function(userObject) {
        console.log(userObject.displayName + ' has left the room!');
    });

    room.join(function(err) {
        if (err) {
            // there as an error joining the room
            return;
        }

        var key = room.key('/jasdeep');
        key.get(function(err, value, context) {
            if (err) {
                // could not retrieve the value
            }

            // display the data.
        });
    });
});

