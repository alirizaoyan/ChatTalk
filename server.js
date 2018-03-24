var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var loginRouter = require('./routes/loginRouter');
//var anasayfaRouter = require('./routes/anasayfaRouter');



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

var giris = require('./config/passport');


io.sockets.on('connection', function (socket) {

    socket.on('yeni', function (data) {

            socket.nickname = giris.posta;

            users[socket.nickname] = socket;

            // nicknames.push(socket.nickname);
            updateNicknames();
           // console.log(socket.nickname);
    });



    function updateNicknames() {
       // console.log(users);
      //  console.log(socket.nickname);
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send message', function (data,callback) {
        var msg = data.trim();
        if(msg.substring(0,3)=== '/w '){
            msg = msg.substring(3);
            var ind = msg.indexOf(' ');
            if(ind !== -1){
                var name = msg.substring(0,ind);
                var msg = msg.substring(ind+1);
                if (name in users){
                    users[name].emit('whisper', {msg:msg, nick: socket.nickname});
                    console.log('Whisper !');
                }else {
                    callback('Error! geçerli kullanıcı girin.');
                    console.log(socket.nickname);
                }
            }else {
                callback('Error! lütfen kişisel mesaj girin.');
            }
        }else {
            io.sockets.emit('new message', {msg:msg, nick: socket.nickname});
              console.log(users);
           // console.log(socket.nickname);
           // console.log(giris.posta);
        }

    });
    socket.on('disconnect', function (data) {
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
        console.log('çıkış');
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
});

const kullaniciSayisi = (io,data) =>{
  const room = io.sockets.adapter.rooms[data.name];
  return room ? room.length : 0;
};