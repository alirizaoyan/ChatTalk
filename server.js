var express = require('express');
var path = require('path');
var fs = require('fs');
var options = {
    key: fs.readFileSync(path.join(__dirname, resolveURL('ssl/privatekey.pem'))),
    cert: fs.readFileSync(path.join(__dirname, resolveURL('ssl/certificate.pem')))
};
var app = express();
var server = require('https').createServer(options,app);
var Message = require('./models/message');
var User = require('./models/kullanici');
var GrpMessage = require('./models/grpmessage');

function resolveURL(url) {
    var isWin = !!process.platform.match(/^win/);
    if (!isWin) return url;
    return url.replace(/\//g, '\\');
}



var db = require('./models/db');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var users = {};

server.listen(3000);



app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms





app.use('/node_modules',express.static(path.join(__dirname,'node_modules')));
app.use('/public',express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


// required for passport
app.use(session({ secret: 'bitirmecalismasi' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

require('./config/passport')(passport);



var giris = require('./config/passport');
var friends = {};

 require('./Signaling-Server.js')(server);



const kullaniciSayisi = (io,data) =>{
  const room = io.sockets.adapter.rooms[data.name];
  return room ? room.length : 0;
};