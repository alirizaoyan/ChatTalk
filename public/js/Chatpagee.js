
$(document).ready(function ()
{
    var socket = io.connect();
    var $messageForm = $('#send-message');
    var $messageBox = $('#mesaj');
    var $chat = $('#mesajlar');
    var $users = $('#users');
    var $kisiSayisi = $('#bagliKullanici');
    var oda = document.getElementById("oda");
    var odaGir = document.getElementById("odaGir");

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var today  = new Date();



    var sayi = 0;

    if (sayi == 0){
        socket.emit('yeni');
        sayi++;
    }

    $('#odaGir').on('click', () => {
        socket.emit('joinRoom', { name: $('#oda').val()});
    });

    socket.on('new join', (data)=>{
        $('#bilgi').html('Bu odada <b>'+ data.count +'</b> kişi var.');
    });

    socket.on('log', (data)=>{
        $('#bilgi').append(data.mesaj);
        $('#oda, #odaGir').attr('disabled','disabled');
        $('#odaCik').show();
    });

    socket.on('gonder', function (data) {
       socket.emit('gericevrim', data);
    });

    socket.on('message', function (data) {
        $chat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font" style="color: black">'+ data.nick+" (Çevrimdışı Gelen)"+'</strong><span class="sag">'+ data.time +'</span> '+
            '</div>' +data.msg+'</div></li></div>');
    });

    socket.on('socket leave', (data)=>{
        oda.removeAttribute("disabled");
        odaGir.removeAttribute("disabled");
        $('#odaCik').hide();
    });

    $('#odaCik').on('click', ()=>{
       socket.emit('leave', {name: $('#oda').val()});
    });

    socket.on('leave room', (data)=>{
        $('#bilgi').html('Bu odada <b>'+ data.count +'</b> kişi var.');
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', {mesaj: $messageBox.val(), datee: today.toLocaleDateString("tr-TR",options)}, function (data) {
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
        $chat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font" style="color: red">'+ data.nick+" (Özel)"+'</strong><span class="sag">'+ data.time +'</span> '+
            '</div>' +data.msg+'</div></li></div>');
    });

    socket.on('usernames', function (data) {
      //  alert('selam');

        $kisiSayisi.html('<i class="glyphicon glyphicon-user"></i> Online (' + data.length +')');

        var html ='';
        for(i=0; i<data.length; i++){
            html += data[i]+ '</br>';
            $users.html(html);
        }
        document.getElementById("users").scrollTop = document.getElementById("users").scrollHeight;
    });

});