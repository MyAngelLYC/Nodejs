var socket = io.connect();

$(document).ready(function(){
	socket.on('connectResult', function(retInfo){
		showMessage(retInfo.result);
	})
});

function showMessage(message){
	$('#messages').append(message);
}