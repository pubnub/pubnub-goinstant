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
        token: "eyJ...(base64url)...p9Q"
    },
    rooms: ['lobby', 'chat'],
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

// THE SPECIAL SAUCE
var conn2 = new goinstant2.Connection(App.pubnubSettings.url, options2);

var room = conn2.room("jasdeep");
room.join();



