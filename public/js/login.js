$(document).ready(function () {
    var socket = io.connect();
    var $nickBox= $('#nickname');
    var $nickForm = $('#setNick');



    $nickForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new user', $nickBox.val());
    });
});