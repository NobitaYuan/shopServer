// mongoDB curd接口的二次封装
module.exports = {
    // 采用 promise 解决异步操作问题
    // 插入数据
    insert(collectionName, insertData) {
        return new Promise((resolve, reject) => {
            collectionName.insertMany(insertData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    // 删除数据
    delete(collectionName, whereData, deleteNum = 2) {
        // 根据deleteNum来选择所调用的方法
        const deleteType = deleteNum === 1 ? "deleteMany" : "deleteOne";
        return new Promise((resolve, reject) => {
            collectionName[deleteType](whereData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    // 更新数据
    update(collectionName, whereData, updateData, updateNum = 2) {
        const updateType = updateNum === 1 ? "updateMany" : "updateOne";
        return new Promise((resolve, reject) => {
            collectionName[updateType](whereData, updateData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    },
    // 查找数据
    find(collectionName, whereData, showData) {
        return new Promise((resolve, reject) => {
            collectionName.find(whereData, showData).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    // 分页查找
    pagin(collectionName, whereData, showData, count, limitNum) {
        return new Promise((resolve, reject) => {
            collectionName
                .find(whereData, showData)
                .limit(limitNum) //查找的数据数量限制
                .skip((count - 1) * limitNum) //跳过的数据，比如是需要第3页，每页5条，则跳过（3-1）*5 = 10 ，跳过十条数据
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
        });
    },
    //排序查找
    sort(collectionName, whereData, showData, sortData) {
        return new Promise((resolve, reject) => {
            // Search.find({}, { _id:0, __v: 0}).sort({num: -1})
            collectionName
                .find(whereData, showData)
                .sort(sortData)
                .exec((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
        });
    },
    //查询去掉后的当前某列的重复数据
    distinct(collectionName, type) {
        return new Promise((resolve, reject) => {
            collectionName.distinct(type).exec((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    },
    //计数
    count(collectionName, whereData) {
        whereData = whereData || {};
        return new Promise((resolve, reject) => {
            // count() 在某些 版本 不可用
            // countDocuments() ok
            // estimatedDocumentCount() ok
            collectionName
                .find(whereData)
                .estimatedDocumentCount((err, len) => {
                    if (err) throw err;
                    resolve(len);
                });
        });
    },
};
