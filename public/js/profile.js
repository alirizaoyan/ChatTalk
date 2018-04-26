$(document).ready(function () {
    var socket = io.connect();
    socket.on('friends',(data)=>{
        var html ='';
        html += "<a href='/anasayfa' >" +  data+ '</a></br>';
        $('#friends').append(html);

    })
    socket.on('prof',(data) => {
        alert("data = " + data);
    })

})