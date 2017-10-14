var mongoose = require('./db.js');
var Schema   = mongoose.Schema;

// 创建schema
const userSchema = new Schema({
    username: String,
    password: String
});
// 创建model
const userModel = mongoose.model('User', userSchema); // newClass为创建或选中的集合

module.exports = userModel;