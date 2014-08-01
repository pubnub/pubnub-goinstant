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

var gi2 = new goinstant2.Connection(App.pubnubSettings.url, options2);


