const express = require("express");
const router = express.Router();
// Excel表格
const xlsx = require("node-xlsx");
// 导入数据规则
const product = require("../../db/collection/product");
// MongoDB查询接口
const sql = require("../../db/dbAPI");
// uuid
const uuid = require("uuid");

// 接口
router.get("/", (req, res, next) => {
    // 表名被调用
    res.send("调用了商品列表接口");
});

// 获取单个商品详情信息
router.get("/detail/:proid", (req, res, next) => {
    // 解构赋值获取商品id
    const { proid } = req.params;
    // 查询结果将不包括{ _id: 0, __v: 0 }字段

    sql.find(product, { proid }, { _id: 0, __v: 0 }).then((data) => {
        // data一般都是数组
        if (data.length === 0) {
            res.send({
                code: "10001",
                message: "未查找到该商品",
            });
        } else {
            res.send({
                code: "200",
                message: "获取单个商品详情信息",
                data: data[0],
            });
        }
    });
});

// 获取商品分页列表
router.get("/list", (req, res, next) => {
    const count = req.query.count * 1 || 1;
    const limitNum = req.query.limitNum * 1 || 10;
    sql.paging(product, {}, { _id: 0, __v: 0 }, count, limitNum).then(
        (data) => {
            if (data.length === 0) {
                res.send({
                    code: "10002",
                    message: "未获取到商品分页列表",
                });
            } else {
                res.send({
                    code: "200",
                    message: "获取商品分页列表",
                    data,
                });
            }
        }
    );
});

// 获取商品秒杀列表
router.get("/seckilllist", (req, res, next) => {
    const count = req.query.count * 1 || 1;
    const limitNum = req.query.limitNum * 1 || 6;
    sql.paging(
        product,
        { isseckill: 1 },
        { _id: 0, __v: 0 },
        count,
        limitNum
    ).then((data) => {
        if (data.length === 0) {
            res.send({
                code: "10003",
                message: "未获取到秒杀商品列表",
            });
        } else {
            res.send({
                code: "200",
                message: "获取秒杀商品列表",
                data,
            });
        }
    });
});

// 获取商品推荐列表
router.get("/recommendlist", (req, res, next) => {
    const count = req.query.count * 1 || 1;
    const limitNum = req.query.limitNum * 1 || 12;
    sql.paging(
        product,
        {
            isrecommend: 1,
        },
        { _id: 0, __v: 0 },
        count,
        limitNum
    ).then((data) => {
        if (data.length === 0) {
            res.send({
                code: "10004",
                message: "未获取到推荐商品列表",
            });
        } else {
            res.send({
                code: "200",
                message: "获取推荐商品列表",
                data,
            });
        }
    });
});

// 获取商品的分类列表
router.get("/categorylist", (req, res, next) => {
    sql.distinct(product, "category").then((data) => {
        if (data.length === 0) {
            res.send({
                code: "10005",
                message: "未获取到商品的分类列表",
            });
        } else {
            res.send({
                code: "200",
                message: "获取商品的分类列表",
                data,
            });
        }
    });
});

// 获取某个分类下的品牌列表
// 例如宠物分类
router.get("/categorybrandlist", (req, res, next) => {
    const { category } = req.query;
    sql.find(product, { category }, { _id: 0, brand: 1 }).then((data) => {
        if (data.length === 0) {
            res.send({
                code: "10006",
                message: "未获取到商品分类的品牌列表",
            });
        } else {
            // 因为每个商品都有品牌字段，所以某个商品的品牌肯定会和另外一个相撞，故需要数组去重
            // data = data.reduce((item,next)=>{
            //     obj[next.brand]? '' :obj[next.brand] = true && item.push(next)
            //     return item
            // },[])
            const obj = {};
            const brandArr = [];
            data.forEach((item) => {
                if (obj[item.brand] == item.brand) {
                } else {
                    brandArr.push(item.brand);
                    obj[item.brand] = item.brand;
                }
            });
            res.send({
                code: "200",
                message: "获取商品分类的品牌列表",
                data: brandArr,
            });
        }
    });
});

// 获取某个分类下的品牌的商品列表
router.get("/categorybrandprolist", (req, res, next) => {
    let { category, brand, count, limitNum } = req.query;
    count = req.query.count * 1 || 1;
    limitNum = req.query.limitNum * 1 || 20;
    if (category && brand) {
        sql.paging(
            product,
            { category, brand },
            { _id: 0, __v: 0 },
            count,
            limitNum
        ).then((data) => {
            if (data.length === 0) {
                res.send({
                    code: "10007",
                    message: "没有更多数据了",
                });
            } else {
                res.send({
                    code: "200",
                    message: "获取某个分类下的品牌的商品列表",
                    data,
                });
            }
        });
    } else {
        res.send({
            code: "200",
            message: "请上传商品或品牌信息",
            data: {},
        });
    }
});

// 导入所有商品到数据库
router.get("/uploadPro", (req, res, next) => {
    const originData = xlsx.parse(`${__dirname}/pro.xlsx`);
    const firstData = originData[0].data;
    const arr = [];
    for (var i = 0; i < firstData.length; i++) {
        if (i !== 0) {
            arr.push({
                proid: "pro_" + uuid.v4(),
                category: firstData[i][0],
                brand: firstData[i][1],
                proname: firstData[i][2],
                banners: firstData[i][3],
                originprice: firstData[i][4],
                sales: firstData[i][5],
                stock: firstData[i][6],
                desc: firstData[i][7],
                issale: firstData[i][8],
                isrecommend: firstData[i][9],
                discount: firstData[i][10],
                isseckill: firstData[i][11],
                img1: firstData[i][12],
                img2: firstData[i][13],
                img3: firstData[i][14],
                img4: firstData[i][15],
            });
        }
    }

    // 拿到 arr 的数据，先清空产品的列表的数据，然后再插入
    sql.delete(product, {}, 1).then(() => {
        console.log("数据清空成功");
        sql.insert(product, arr).then(() => {
            console.log("导入所有商品数据成功！");
            res.send("导入所有商品数据成功！");
        });
    });
});

module.exports = router;
