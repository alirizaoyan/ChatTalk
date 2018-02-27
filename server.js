var express = require('express');
var path = require('path');
var loginRouter = require('./routes/loginRouter');
var anasayfaRouter = require('./routes/anasayfaRouter');



var app = express();

var server= app.listen(3000);
var io = require('socket.io').listen(server);
var db = require('./models/db');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');



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
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./config/passport')(passport);


io.sockets.on("connection",function (socket) {
    socket.on("gonder",function (data) {
        io.emit("alici",data);
    });
})

