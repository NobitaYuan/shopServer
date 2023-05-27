const mongoose = require("../mongoose");
const schema = new mongoose.Schema({
    userid: { type: String }, //用户id
    username: { type: String }, //用户名
    password: { type: String }, //密码
    tel: { type: String }, //电话
    telcode: { type: String }, //验证码
    email: { type: String }, //邮箱
    nickname: { type: String }, //昵称
    qq: { type: String }, //QQ
    wx: { type: String }, //微信
    avatar: { type: String }, //头像
    sex: { type: Number }, // 1 男  0 女 -1 未知
    birthday: { type: String }, //生日
    createTime: { type: String }, //创建的时间
    slogan: { type: String }, //人生格言
    role: { type: Number }, //权限： 1 用户 2 商家 3 超管
});

module.exports = mongoose.model("user", schema);
