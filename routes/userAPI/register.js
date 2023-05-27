var express = require("express");
var router = express.Router();
const md5 = require("md5");
// MongoDB curd接口
const sql = require("../../db/dbAPI");

// 用户规则

const user = require("../../db/collection/user");

// uuid
const uuid = require("uuid");

// 接口
router.get("/", (req, res, next) => {
    // 表明被调用
    res.send("调用了用户注册接口");
});

// 获取5位随机数
function getTelCode() {
    return 10000 + Math.floor(Math.random() * 90000);
}
// 获取随机字符串

function getRandomString(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

// 注册
router.post("/dofinishregister", (req, res, next) => {
    let { tel, password } = req.body;
    console.log(tel, password);
    if (tel && password) {
        password = md5(password);
        const registerData = {
            userid: "user_" + uuid.v4(),
            username: "",
            password,
            tel,
            telcode: 00000,
            email: "",
            nickname: "用户" + getRandomString(8),
            qq: "",
            wx: "",
            avatar: "https://wwc.alicdn.com/avatar/getAvatar.do?userNic…&width=60&height=60&type=sns&_input_charset=UTF-8",
            sex: -1,
            birthday: "",
            createTime: Date.now(),
            slogan: "道阻且长 行则将至",
            role: 1,
        };
        sql.find(user, { tel }, { _id: 0, __v: 0 }).then((data) => {
            if (data.length) {
                res.send({
                    code: "10011",
                    message: "用户已注册",
                });
            } else {
                sql.insert(user, registerData).then(() => {
                    res.send({
                        code: "200",
                        message: "用户注册成功",
                        data: {
                            tel,
                        },
                    });
                });
            }
        });
    } else {
        res.send({
            code: "10010",
            message: "请携带电话和密码字段",
        });
    }
});

module.exports = router;
