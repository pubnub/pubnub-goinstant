App.pubnubSettings = {
    publish: "pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2",
    subscribe: "sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe",
    secret: "sec-c-OTY5NGI0ODgtMGRkNy00MDkyLWIxODQtN2NmNjhjNzQ4NmEz"
};

App.goinstantSettings = {
    url: "https://goinstant.net/Testjasldkfjklasd/Jasdeep"
};

App.log = function(text, prefix){
    if (prefix !== "") {
        console.log("\t" + prefix + ": " + text);
    }
    else {
        console.log(text);
    }
}

head.load({js_goinstant: "//cdn.goinstant.net/v1/platform.min.js"}, function () {
    console.log("\tGoInstant v1 loaded");

    head.load({js_pubnub: "//rawgit.com/pubnub/javascript/feature-pt74838232-2/web/pubnub.min.js"}, function(){
       console.log("Pubnub 3.6.7 loaded")

        head.load({js_pubnub_goinstant: "js/pubnub-goinstant.js"}, function () {
            console.log("Pubnub-GoInstant loaded")
        });
    });
});

head.ready("js_pubnub_goinstant", function(){
    console.log("COMPLETE: PRE-REQUISITE LIBRARIES");
    head.load({js_dev: "js/dev.js"}, function () {
        console.log("Development Code loaded")
    });

    head.ready("js_dev", function(){
        console.log("(ready)");
    })
});



