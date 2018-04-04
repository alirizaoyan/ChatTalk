var express = require('express');
var app = express();
var server = require('http').createServer(app);
var serverrtc = require('http').createServer(app);

var Message = require('./models/message');
var User = require('./models/kullanici');
var GrpMessage = require('./models/grpmessage');



var io = require('socket.io').listen(server);
var db = require('./models/db');
var passport = require('passport');
var flash    = require('connect-flash');



var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require('path');
var users = {};

server.listen(3000);



app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms





app.use('/public',express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//app.use('/login',loginRouter);
//app.use('/anasayfa',anasayfaRouter);



// required for passport
app.use(session({ secret: 'bitirmecalismasi' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./config/passport')(passport);

require('./Signaling-Server.js')(serverrtc);

var giris = require('./config/passport');


io.sockets.on('connection', function (socket) {

    socket.on('yeni', function (data) {

            socket.nickname = giris.posta;

            users[socket.nickname] = socket;

        Message.find({
            whom: socket.nickname
        }, (err,veri)=>{
            if(err)
                console.log(err);
            if(veri !== null){
                socket.emit('gonder', veri);
              //  console.log(veri);
            }

        });

            // nicknames.push(socket.nickname);
            updateNicknames();
           // console.log(socket.nickname);
    });



    function updateNicknames() {
       // console.log(users);
      //  console.log(socket.nickname);
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('gericevrim', function (data) {
       // console.log(data);

        for(i=0; i<data.length; i++){
            var isim = data[i].whom;
            var msg = data[i].message.trim();
            var nick = data[i].user;
            var time = data[i].time;

                msg = msg.substring(3);
                var ind = msg.indexOf(' ');

                var msg = msg.substring(ind+1);

            if(isim in users){
                users[isim].emit('message', {msg: msg, nick: nick, time: time});
            }
        }
    });

    socket.on('send message', function (data,callback) {

        console.log(data.mesaj);
        console.log(data.datee);

        var newMsg = new Message();
        var bosluk = "";

        var msg = data.mesaj.trim();
        if(msg.substring(0,3)=== '/w '){
            msg = msg.substring(3);
            var ind = msg.indexOf(' ');
            if(ind !== -1){
                var name = msg.substring(0,ind);
                var msg = msg.substring(ind+1);
                if (name in users){
                    users[name].emit('whisper', {msg:msg, nick: socket.nickname, time: data.datee});

                    newMsg.user = socket.nickname;
                    newMsg.message = data.mesaj;
                    newMsg.whom = name;
                    newMsg.time = data.datee;

                    newMsg.save(function() {
                        console.log(newMsg);
                    });

                    console.log('Whisper !');
                }else{

                    User.find({
                        email: name
                    }, (err,veri)=>{
                        console.log(veri);
                        if(err)
                            console.log(err);
                        if(veri == bosluk){
                            callback('Error! geçerli kullanıcı girin.');
                        }else{
                            newMsg.user = socket.nickname;
                            newMsg.message = data.mesaj;
                            newMsg.whom = name;
                            newMsg.time = data.datee;

                            newMsg.save(function() {
                                console.log(newMsg);
                            });
                            callback('Kullanıcı online olduğunda mesajınız iletilecektir.');
                        }
                    });
                }
            }else {
                callback('Error! lütfen kişisel mesaj girin.');
            }
        }else {
            io.sockets.emit('new message', {msg:msg, nick: socket.nickname});

            newMsg.user = socket.nickname;
            newMsg.message = data.mesaj;
            newMsg.time = data.datee;

            newMsg.save(function() {
                console.log(newMsg);
            });
        }
    });

    socket.on('grp message', (data)=>{
        io.to(data.name).emit('new grp message', {msg:data.mesaj, nick: socket.nickname});

        var newGrpMsg = new GrpMessage();
        newGrpMsg.user = socket.nickname;
        newGrpMsg.message = data.mesaj;
        newGrpMsg.time = data.datee;
        newGrpMsg.group = data.room;

        newGrpMsg.save(function () {
           console.log(newGrpMsg);
        });
    });
    socket.on('disconnect', function (data) {
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
        console.log('çıkış');
    });

    socket.on('grpRoom', (data)=>{
       socket.join(data.name, ()=>{
           io.to(data.name).emit('new grp', {count: kullaniciSayisi(io,data)});
           io.to(data.name).emit('new grpJoin', {name: socket.nickname});
       });
    });

    socket.on('joinRoom', (data) => {
       socket.join(data.name, () => {
           io.to(data.name).emit('new join', {count: kullaniciSayisi(io,data)});
           socket.emit('log', {mesaj: 'Odaya girdiniz.'});
       });
    });

    socket.on('leave', (data)=>{
       socket.leave(data.name, ()=>{
           io.to(data.name).emit('leave room', {count: kullaniciSayisi(io,data)});
           socket.emit('socket leave', {mesaj: 'Odadan ayrıldınız.'});
       });
    });

    socket.on('grp leave', (data)=>{
        socket.leave(data.name, ()=>{
            io.to(data.name).emit('leave grpRoom', {count: kullaniciSayisi(io,data), name: socket.nickname});
            if(kullaniciSayisi(io,data)=== 0){
                socket.emit('destroy');
            }
            socket.emit('socket grpLeave', {mesaj: 'Odadan ayrıldınız.'});
        });
    });
});

const kullaniciSayisi = (io,data) =>{
  const room = io.sockets.adapter.rooms[data.name];
  return room ? room.length : 0;
};