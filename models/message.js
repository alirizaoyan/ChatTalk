var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    user: String,
    message: String,
    whom: String
});

module.exports = mongoose.model('Message', messageSchema);