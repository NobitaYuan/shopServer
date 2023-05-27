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
    res.send("调用了总产品列表接口");
});

// 导入所有产品到数据库
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
    sql.delete(product,{},1).then(()=>{
        console.log('数据清空成功')
        sql.insert(product,arr).then(()=>{
            console.log('导入所有商品数据成功！')
            res.send('导入所有商品数据成功！')
        })
    })
});

module.exports = router