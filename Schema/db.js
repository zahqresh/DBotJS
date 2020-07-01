const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const data = new Schema({
    username:String,
    nickname:String,
    roles:Array
});

module.exports = mongoose.model('Data',data)