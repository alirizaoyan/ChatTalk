
$(document).ready(function ()
{
    var socket = io.connect();
    var $messageForm = $('#send-message');
    var $messageBox = $('#mesaj');
    var $chat = $('#mesajlar');
    var $users = $('#users');

    var sayi = 0;

    if (sayi == 0){
        socket.emit('yeni');
        sayi++;
    }


    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', $messageBox.val(), function (data) {
            //add stuff later
            $chat.append('<span class="error">' + data + "</span></br>");
        });
        $messageBox.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font">'+ data.nick+'</strong>'+
            '</div>' +data.msg+ '</div></li></div>');
        document.getElementById("mesajlar").scrollTop = document.getElementById("mesajlar").scrollHeight;
    });


    socket.on('whisper', function (data) {
        $chat.append('<span class="whisper"><b>' + data.nick+ ':</b>' + data.msg + "</span></br>");
    });

    socket.on('usernames', function (data) {
      //  alert('selam');
        var html ='';
        for(i=0; i<data.length; i++){
            html += data[i]+ '</br>';
            $users.html(html);
        }
    });

});

//gonderen kişi:'+data.user+  <%= user.local.email %>
/*'<li class="active bounceInDown">'+
'<a href="#" class="clearfix">'+
'<img src="https://bootdey.com/img/Content/user_1.jpg" alt="" class="img-circle">'+
'<div class="friend-name">'+
'<strong>'+html+'</strong>'+
'</div>'+
'<small class="chat-alert label label-danger">1</small>'+
'</a>'+
'</li>'*/