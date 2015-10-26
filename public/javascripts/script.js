var socket = io.connect();

function addMessage(message, username, time) {
    var isSameUser = username === socket.id ? true : false;
    var theUserClass = isSameUser ? 'self' : 'other';
    console.log([message, username, time]);
    $(".chat").append('<li class="'+theUserClass+'"><div class="avatar"><img src="http://i.imgur.com/lR8JNNg.gif" draggable="false"></div><div class="msg"><p>'+ message + '</p></div></li>');
};

function sendMessage() {
    var message = $('#submit').val().trim()
    var username = socket.id
    if ( message.length >0 ) {
        socket.emit('message', {message:message,username:username});
        addMessage(message, username, new Date().toISOString());
        $('#submit').val('');
    }
};

function setUsername() {
    if ($('#pseudoInput').val() != '') {
        socket.emit('setPseudo', $('#pseudoInput').val())
        $('#chatControls').show();
        $('#pseudoInput').hide();
        $('#pseudoSet').hide();
    }
};

socket.on('message', function(data) {
    console.log(data);
    addMessage(data.message, data.username, new Date().toISOString());
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var coords = "Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude;
    console.log(coords);
}

function askName() {
    var person = prompt("Please enter your name", "hello@alejandrotorres.mx");
    if (person != null) {
        socket.emit('setPseudo', person)
    }
}



$(document).ready(function(){
    getLocation();
    // askName();

    $('body').on('keydown', '#submit', function (e) {
        var key = e.which;
        if(key == 13) {
            sendMessage();
            return false;
        }
    });

});