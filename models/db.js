var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var mongoDB = 'mongodb://aliriza:123Aliriza@ds163119.mlab.com:63119/chat-talk';
mongoose.connect(mongoDB,function (err,err) {
    if(err)
        console.log('mongoose hatasi' + err);
    else
        console.log('mongoose bağlandı ' + mongoDB);
});
// mongodb://localhost/ChatExample