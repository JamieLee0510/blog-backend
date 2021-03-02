//連接mongodb
const mongoose = require("mongoose");
const marked = require("marked");

//以下三項東西我也不太懂，看似是web安全的東西
const creatDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = creatDomPurify(new JSDOM().window);

// const slugify = require('slugify')

//目前用不到，因為中文在mongodb搜索的問題還沒有解決
// const slugify = function (str) {
//     str = str.replace(/[^a-zA-Z0-9_\u3400-\u9FBF\s-]/g, '') // replace spaces with dashes
//     str = encodeURIComponent(str) // encode (it encodes chinese characters)
//     return str
// }

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  quill: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  article_state: {
    type: String,
    // required: true
  },
});

module.exports = mongoose.model("Article", articleSchema);
