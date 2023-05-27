var express = require('express');
var router = express.Router();

// 导入MongoDB数据规则
const product = require("../../db/collection/product");

// MongoDB查询接口
const sql = require("../../db/dbAPI");

// uuid
const uuid = require("uuid");

// 接口
router.get("/", (req, res, next) => {
    // 表明被调用
    res.send("调用了购物车接口");
});


module.exports = router