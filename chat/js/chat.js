$(function() {
	var box     = PUBNUB.$('wheremessgo');
	var input   = PUBNUB.$('mess');
	var username    = 'Guest 1111'
	$('#username').val(username);

	var pubnub = PUBNUB.init({
	publish_key   : 'pub-c-b79d8c74-314a-4312-8852-a61ca49a5fd2',
	subscribe_key : 'sub-c-4745b1e4-19ba-11e4-bbbf-02ee2ddab7fe',
	uuid : username
	})

			
 // SEND TEXT MESSAGE
    pubnub.bind( 'keyup', input, function(e) {
        (e.keyCode || e.charCode) === 13 && pubnub.publish({
            channel : 'chatchannel',
            message : input.value
        });
     });   

// Listening to others on the same channel
pubnub.subscribe({
			channel : 'chatchannel',
			message : addMessage	
			});
	


  function addMessage(text) {
   
    $('#wheremessgo').append("<li> <img src =/img/avatar.png>" + "<span class= user-name>" + username + "</span>" + "<span class=message li>" + text + "</span> </li>");
   

    input.value = "";
  }



});
