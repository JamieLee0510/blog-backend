//連接mongodb
const mongoose = require("mongoose");
const marked = require("marked");

//以下三項東西我也不太懂，看似是web安全的東西
const creatDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = creatDomPurify(new JSDOM().window);

let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quill: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: year + "-" + month + "-" + date,
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
