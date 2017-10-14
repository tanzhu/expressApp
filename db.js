'use strict'
const mongoose = require('mongoose');
const DB_URL = 'localhost:27017/getpic';
// 连接mongodb
mongoose.connect(DB_URL);
// 实例化连接对象
const db = mongoose.connection
db.on('error', console.error.bind(console, '连接错误：'));
db.once('open', (callback) => {
  console.log('MongoDB连接成功！！')
});

module.exports = mongoose;