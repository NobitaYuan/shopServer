const mongoose = require('mongoose')
const DB_URL = 'mongodb://localhost:27017/conversedb'

// 连接数据库
mongoose.connect(DB_URL,{ useNewUrlParser: true, useUnifiedTopology: true })

// 检测数据库连接状态
mongoose.connection.once('open',()=>{
    console.log('MongoDB数据库：conversedb，连接成功！')
})

mongoose.connection.on('error', () => {
    console.error.bind(console, 'connection error:')
  })
module.exports = mongoose