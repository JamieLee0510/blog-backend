const Article = require("./../models/article");
const mongoose = require("mongoose");

module.exports = {
  newPost: async (req, res) => {
    let payload = {
      title: req.body.title,
      quill: req.body.quill,
      imgUrl: req.body.imgUrl,
    };
    let new_article = new Article(payload);
    await new_article.save((err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(new_article.id);
      }
    });
  },
  getAllPost: async (req, res) => {
    const articles = await Article.find().sort({ createdAt: "desc" });
    res.send({ success: true, result: articles });
  },
  getPostById: async (req, res) => {
    //換另外一種寫法
    const article = await Article.findById(req.params.id);
    if (article == null) {
      return res.sendStatus(404);
    } else {
      return res.send({ success: true, result: article });
    }
    // try {
    //   res.send({ success: true, result: article });
    // } catch (e) {
    //   console.log(e);
    // }

    // await Article.findById(req.params.id).then((res, err) => {
    //   if (err) {
    //     return res.send(404);
    //   } else {
    //     return res;
    //   }
    // });
  },
  deletePost: async (req, res) => {
    let article_id = req.body.id;
    Article.deleteOne({ _id: article_id }, (err) => {
      return res.send({ success: false, msg: err });
    });
  },
  updatePost: async (req, res) => {
    let payload = req.body;
    let id = req.body._id; //這邊要微注意_id
    Article.findByIdAndUpdate(id, payload, (err, result) => {
      if (err) res.send({ success: false, mes: err });

      res.send({ success: true, result: result });
    });
  },
};
