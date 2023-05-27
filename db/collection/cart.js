const mongoose = require("../mongoose");
const schema = new mongoose.Schema({
    cartid: String, //购物车id
    userid: String, //用户id
    proid: String, //商品id
    flag: Boolean, // 当前的数据选中还是未选中
    num: Number, //数量
});

module.exports = mongoose.model("cart", schema);
