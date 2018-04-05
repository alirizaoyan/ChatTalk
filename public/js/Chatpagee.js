
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

    var $grpMessageForm = $('#grp-send-message');
    var $grpMessageBox = $('#grp-mesaj');
    var $grpChat = $('#grp-mesajlar');
    var $grpPanel = $('#grp-panel');

    var grpOda = document.getElementById("grp-oda");
    var grpOdaGir = document.getElementById("grp-odaGir");

    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var today  = new Date();


    var sayi = 0;

    if (sayi == 0){
        socket.emit('yeni');
        sayi++;
    }

    $('#grp-odaGir').on('click', () => {
       socket.emit('grpRoom', {name: $('#grp-oda').val()});
    });

    socket.on('new grp', (data)=>{
        $('#sayi').html('Group Chat'+'<span class="sag">'+'Odada '+data.count+' kişi var.'+'</span>');
        $('#oda, #odaGir').attr('disabled','disabled');
        $('#grp-oda, #grp-odaGir').attr('disabled','disabled');
        $('#grp-odaCik').show();
    });

    socket.on('new grpJoin', (data)=>{
       $('#grp-mesajlar').append(data.name+ ' kişisi katıldı.</br>');
    });

    $('#odaGir').on('click', () => {
        socket.emit('joinRoom', { name: $('#oda').val()});
    });

    socket.on('new join', (data)=>{
        $('#bilgi').html('Bu odada <b>'+ data.count +'</b> kişi var.');
    });

    socket.on('log', (data)=>{
        $('#bilgi').append(data.mesaj);
        $('#oda, #odaGir').attr('disabled','disabled');
        $('#grp-oda, #grp-odaGir').attr('disabled','disabled');
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
        grpOda.removeAttribute("disabled");
        grpOdaGir.removeAttribute("disabled");
        $('#odaCik').hide();
    });

    $('#odaCik').on('click', ()=>{
       socket.emit('leave', {name: $('#oda').val()});
    });

    socket.on('leave room', (data)=>{
        $('#bilgi').html('Bu odada <b>'+ data.count +'</b> kişi var.');
    });

    $('#grp-odaCik').on('click', ()=>{
       socket.emit('grp leave', {name: $('#grp-oda').val()});
    });

    socket.on('leave grpRoom', (data)=>{
        $('#sayi').html('Group Chat'+'<span class="sag">'+'Odada '+data.count+' kişi var.'+'</span>');
        $('#grp-mesajlar').append(data.name+ ' kişisi çıktı.</br>');
    });

    socket.on('destroy', ()=>{
        $grpChat.empty();
    });

    socket.on('socket grpLeave', (data)=>{
        grpOda.removeAttribute("disabled");
        grpOdaGir.removeAttribute("disabled");
        oda.removeAttribute("disabled");
        odaGir.removeAttribute("disabled");
        $('#grp-odaCik').hide();
    });

    $messageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('send message', {mesaj: $messageBox.val(), datee: today.toLocaleDateString("tr-TR",options)}, function (data) {
            //add stuff later
            // alert("emit'e girdi");
            $chat.append('<span class="error">' + data + "</span></br>");
        });
        $messageBox.val('');
    });

    $grpMessageForm.submit(function (e) {
        e.preventDefault();
        socket.emit('grp message', {mesaj: $grpMessageBox.val(), datee:today.toLocaleDateString("tr-TR",options), name: $('#grp-oda').val(), room: $('#grp-oda').val()}, function (data){
            //daha sonra kullanılabilir.
            $grpChat.append('<span class="error">' + data + "</span></br>");
        });
        $grpMessageBox.val('');
    });

    socket.on('new message', function (data) {
        $chat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font">'+ data.nick+'</strong><span class="sag">'+  today.toLocaleDateString("tr-TR",options)+'</span> '+
            '</div>' +data.msg+'</div></li></div>');
        document.getElementById("panel").scrollTop = document.getElementById("panel").scrollHeight;
    });

    socket.on('new grp message', (data)=>{
        $grpChat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font">'+ data.nick+'</strong><span class="sag">'+  today.toLocaleDateString("tr-TR",options)+'</span> '+
            '</div>' +data.msg+'</div></li></div>');
        document.getElementById("grp-panel").scrollTop = document.getElementById("grp-panel").scrollHeight;
    });

    socket.on('whisper', function (data) {
        $chat.append('<div>' +
            '<li  class="left clearfix">'+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font" style="color: red">'+ data.nick+" (Özel)"+'</strong><span class="sag">'+ data.time +'</span> '+
            '</div>' +data.msg+'</div></li></div>');
    });

    socket.on('usernames', function (data) {

        $kisiSayisi.html('<i class="glyphicon glyphicon-user"></i> Online (' + data.length +')');

        var html ='';
        for(i=0; i<data.length; i++){
            html += data[i]+ '</br>';
            $users.html(html);
        }
        document.getElementById("users").scrollTop = document.getElementById("users").scrollHeight;
    });

});