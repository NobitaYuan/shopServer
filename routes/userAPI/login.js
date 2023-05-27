var express = require("express");
var router = express.Router();

// MongoDB curd接口
const sql = require("../../db/dbAPI");
// 用户规则
const user = require("../../db/collection/user");

// 接口
router.get("/", (req, res, next) => {
    // 表明被调用
    res.send("调用了用户注登陆接口");
});

module.exports = router