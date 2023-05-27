const admin = require('./collection/admin')
const sql = require('./dbAPI.js')
const md5 = require('md5')
const uuid = require('uuid')


module.exports = function insertAdmin(){
    console.log('调用了函数')
    sql.insert(admin,{
        adminid:'admin_'+uuid.v4(),
        adminname:'NobitaYuan',
        password:md5('123456'),
        role:2,
        checkedKeys:[],
        ip:'0.0.0.0'
    }).then(()=>{
        console.log('NobitaYuan超级管理员插入成功！')
    })

}    
