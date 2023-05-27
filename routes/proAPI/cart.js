var express = require("express");
var router = express.Router();

// 导入MongoDB数据规则
const product = require("../../db/collection/product");
const cart = require("../../db/collection/cart");
// MongoDB查询接口
const sql = require("../../db/dbAPI");

// uuid
const uuid = require("uuid");

// 接口
router.get("/", (req, res, next) => {
    // 表明被调用
    res.send("调用了购物车接口");
});

// 添加商品至购物车
router.post("/add", (req, res, next) => {
    let userid = req.body.userid || "user_a341c119-28b3-46f6-bc2e-73eee3568932";
    let { proid, num } = req.body;
    num = num * 1 || 1;
    // console.log(userid, proid, num);
    if (userid && proid && num) {
        sql.find(cart, { userid, proid }, { _id: 0, __v: 0 }).then((data) => {
            if (data.length === 0) {
                //购物车无商品
                // 添加商品进去
                const insertData = {
                    cartid: "cart_" + uuid.v4(),
                    userid,
                    proid,
                    flag: true,
                    num,
                };
                sql.insert(cart, insertData).then(() => {
                    res.send({
                        code: "200",
                        message: "加入购物车成功",
                        data: 0,
                    });
                });
            } else {
                //购物车有商品
                // 则更新数据
                // $inc表示对数据的增加或减少，变化的数值等于参数的数值
                sql.update(
                    cart,
                    { userid, proid },
                    { $inc: { num: num } }
                ).then(() => {
                    res.send({
                        code: "200",
                        message: "加入购物车成功",
                        data: 1,
                    });
                });
            }
        });
    } else {
        res.send({
            code: "10020",
            message: "请将userid或proid或num参数携带完整",
        });
    }
});

// 根据用户id获取用户购物车列表
router.post("/list", (req, res, next) => {
    let userid = req.body.userid || "user_a341c119-28b3-46f6-bc2e-73eee3568932";
    if (userid) {
        sql.find(cart, { userid }, { _id: 0, __v: 0 }).then(async (data) => {
            if (data.length === 0) {
                res.send({
                    code: "200",
                    message: "购物车为空",
                    data: 0,
                });
            } else {
                // 返回的用户的购物车数组
                let shopArr = [];

                // 方法一：循环
                for (let i = 0; i < data.length; i++) {
                    await sql
                        .find(
                            product,
                            { proid: data[i].proid },
                            { _id: 0, __v: 0 }
                        )
                        .then((data1) => {
            
                            let pushObj = {};
                            // 从cart数据库中提取数据
                            pushObj.cartid = data[i].cartid;
                            pushObj.userid = data[i].userid;
                            pushObj.num = data[i].num;
                            pushObj.flag = data[i].flag;
                            // 从查询出来的数据中提取数据
                            pushObj.img1 = data1[0].img1;
                            pushObj.proname = data1[0].proname;
                            pushObj.originprice = data1[0].originprice;
                            pushObj.proid = data1[0].proid;
                            pushObj.discount = data1[0].discount;
 
                            shopArr.push(pushObj);
                        });
                }
                res.send({
                    code: "200",
                    message: "获取到购物车列表",
                    data: shopArr,
                });

                // 方法二：用promise.all
                // data.forEach( (item,index)=>{
                //     shopArr.push(sql.find(product,{proid:item.proid}, { _id: 0, __v: 0}))
                // })

                // // shopArr此时为一个promise数组

                // Promise.all(shopArr).then(result => {
                //     // result [[{}],[{}]]
                //     // res.send(result)
                //     const resultarr = []
                //     result.forEach((item, index) => {
                //       // item 代表 [[{}]]  => item [{}] => {}  => item[0]
                //       let obj = {}
                //       // 从购物车数据库获取  --- 依据 是两个数组的索引值一致
                //       obj.cartid = data[index].cartid
                //       obj.userid = data[index].userid
                //       obj.num = data[index].num
                //       obj.flag = data[index].flag
                //       // 提取数据
                //       obj.img1 = item[0].img1
                //       obj.proname = item[0].proname
                //       obj.originprice = item[0].originprice
                //       obj.proid = item[0].proid
                //       obj.discount = item[0].discount
                //       resultarr.push(obj)
                //     })
                //     res.send({
                //       code: '200',
                //       message: '购物车列表',
                //       data: resultarr
                //     })
                //   })
            }
        });
    } else {
        res.send({
            code: "10021",
            message: "请将userid参数补充完整",
        });
    }
});

// 更新购物车商品数量
router.post('/updatenum',(req, res, next)=>{
    let { cartid, num } = req.body
    if(cartid && num){
        sql.update(cart,{cartid},{$set: { num }}).then(()=>{
            res.send({
                code:'200',
                message:'购物车商品数量更新成功'
            })
        })
    }else{
        res.send({
            code:'10022',
            message:'请将cartid或num参数补充完整'
        })
    }
})

// 更新购物车单个商品选中状态 单个
router.post('/selectone',(req, res, next)=>{
    let { cartid, flag } = req.body
    if(cartid && flag){
        sql.update(cart,{cartid},{$set: { flag }}).then(()=>{
            res.send({
                code:'200',
                message:'单个购物车商品选中状态更新成功'
            })
        })
    }else{
        res.send({
            code:'10022',
            message:'请将cartid或flag参数补充完整'
        })
    }
})

// 更新购物车全部商品选中状态 全部
router.post('/selectall',(req, res, next)=>{
    let { userid, flag } = req.body
    if(userid && flag){
        // 参数中的1代表全部
        sql.update(cart,{userid},{$set: { flag }}, 1).then(()=>{
            res.send({
                code:'200',
                message:'全部购物车商品选中状态更新成功'
            })
        })
    }else{
        res.send({
            code:'10022',
            message:'请将userid或flag参数补充完整'
        })
    }
})



// 删除单条购物车数据
router.post('/remove',(req, res, next)=>{
    const {cartid} = req.body
    if(cartid){
        sql.delete(cart,{cartid}).then((result)=>{
            res.send({
                code:'200',
                message:'成功删除单条购物车数据'
            })
        })
    }else{
        res.send({
            code:'10023',
            message:'请将cartid参数补充完整'
        })
    }
})

// 删除用户的所有购物车信息
router.post('/removeall',(req, res, next)=>{
    const {userid} = req.body
    if(userid){
        sql.delete(cart,{userid}).then((result)=>{
            res.send({
                code:'200',
                message:'成功清空购物车'
            })
        })
    }else{
        res.send({
            code:'10024',
            message:'请将userid参数补充完整'
        })
    }
})
module.exports = router;
