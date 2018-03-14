
$(document).ready(function ()
{
    var socket = io.connect();
    var $messageForm = $('#send-message');
    var $messageBox = $('#mesaj');
    var $chat = $('#mesajlar');
    var $users = $('#users');
    var $kisiSayisi = $('#bagliKullanici');

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var today  = new Date();

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
            '<div class="header"><strong class="primary-font">'+ data.nick+'</strong><span class="sag">'+  today.toLocaleDateString("tr-TR",options)+'</span> '+
            '</div>' +data.msg+'</div></li></div>');
        document.getElementById("panel").scrollTop = document.getElementById("panel").scrollHeight;
    });


    socket.on('whisper', function (data) {
        $chat.append('<span class="whisper"><b>' + data.nick+ ':</b>' + data.msg + "</span></br>");
    });

    socket.on('usernames', function (data) {
      //  alert('selam');

        $kisiSayisi.html('<i class="glyphicon glyphicon-user"></i> Online (' + data.length +')');

        var html ='';
        for(i=0; i<data.length; i++){
            html += data[i]+ '</br>';
            $users.html(html);
        }
    });

});