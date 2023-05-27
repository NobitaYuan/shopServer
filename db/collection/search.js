const mongoose = require("../mongoose");
const schema = new mongoose.Schema({
  wordid: String,
  keyword: String,
  num: Number
})

module.exports = mongoose.model('search', schema)