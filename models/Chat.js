var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    messageText : String,
    userIDFK : Number,
    chatRoomIDFK : Number
}, {collection: 'chat'});

var Chat = mongoose.model('Chat',chatSchema);

module.exports = Chat;