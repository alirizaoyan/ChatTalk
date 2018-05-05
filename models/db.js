var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
var mongoDB = 'mongodb://aliriza:123Aliriza@ds163119.mlab.com:63119/chat-talk';
mongoose.connect(mongoDB,options,function (data,err) {
    if(err)
        console.log('mongoose hatasi' + err);
    else
        console.log('mongoose bağlandı ' + mongoDB);
});
// mongodb://localhost/ChatExample