$(document).ready(function ()
{
    socket = io.connect();
    var kullanici = req.session.user ;

    $('#mesaj').keyup(function (e) {
        var tus= e.keyCode;
        if(tus==13){
            var mytext = $('#mesaj').val();
            socket.emit("gonder",{"yazi":mytext,"user":kullanici});
            $('#mesaj').val("");
        }
    })
    socket.on("alici",function (data) {
        console.log(data);
        $('#mesajlar').append(
            '<div>' +
            '<li  class="left clearfix"> '+
            '<div class="chat-body clearfix">'+
            '<div class="header"><strong class="primary-font">'+ data.user +'</strong>'+
            '</div>' +data.yazi+ '</div></li></div>');
            document.getElementById("mesajlar").scrollTop = document.getElementById("mesajlar").scrollHeight;

    });

})




//gonderen kişi:'+data.user+