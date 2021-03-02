const express = require("express");
const cors = require("cors");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const Admin = require("./../models/admin");
const jwt = require("jsonwebtoken");

const ArticleController = require("../Controllers/ArticleController");
const AdminController = require("../Controllers/AdminController");

const { verifyAccessToken } = require("../helpers/jwt_helper");
const { authSchema } = require("../helpers/validation_schema");

// const corsOptions = {
//   origin: [
//     "http://www.example.com",
//     "http://localhost:8080",
//     "http://localhost:8080/articles/new/edit02",
//   ],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

router.use(cors());

//使用者登入,返回token
router.post("/api/login", async (req, res) => {
  const username = req.body.username;

  //need to be changed
  const user = { name: username };
  jwt.sign(user, "secretkey", (err, token) => {
    res.json({
      token: token,
    });
  });
});

//register測試區，在資料庫中新增admin
router.post("/api/register", async (req, res) => {
  let payload = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  let new_user = new Admin(payload);
  await new_user.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true });
    }
  });
});

//register測試區02，看({req, auth, res})有什麼用處
router.post("/api/register02", AdminController.register02);

router.post("/api/login2", async (req, res) => {
  //測試，引入‘authSchema’
  const result = await authSchema.validateAsync(req.body);

  const user = await Admin.findOne({ email: result.email });
  if (!user) return createError.NotFound("User not registered");

  const isMatch = await Admin.methods.isValidPassword(result.password);
  if (!isMatch) return createError.Unauthorized("Username/password not valid");

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  res.send({ accessToken, refreshToken });
});

//測試AdminController.login
router.post("/api/login3", AdminController.login);

//post新文章，返回文章ID
router.post("/api/post/new", ArticleController.newPost);
// router.post("/api/post/new", async (req, res) => {
//   let payload = {
//     title: req.body.title,
//     quill: req.body.quill,
//     imgUrl: req.body.imgUrl,
//   };
//   let new_article = new Article(payload);
//   await new_article.save((err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(new_article.id);
//       res.send(new_article.id);
//     }
//   });
// });

//測試，拿到所有user data
router.get("/api/allUser", AdminController.gerAllUser);

//nuxt auth 之 endpoint，利用中間件“verifyAccessToken”解碼JWT，再傳至AdminController.user來回傳
router.get("/api/user", verifyAccessToken, AdminController.user);

//拿到所有文章
router.get("/api/posts/all", ArticleController.getAllPost);

//文章顯示by id
router.get("/api/post/:id", ArticleController.getPostById);

//更新文章by id
router.post("/api/post/update", ArticleController.updatePost);
// router.post("/api/post/update", (req, res) => {
//   let payload = req.body;
//   let id = req.body._id; //這邊要微注意_id
//   Article.findByIdAndUpdate(id, payload, (err, result) => {
//     if (err) res.send({ success: false, mes: err });

//     res.send({ success: true, result: result });
//   });
// });

//刪除文章by id
router.post("/api/post/delete", ArticleController.deletePost);
// router.post("/api/post/delete", (req, res) => {
//   let id = req.body._id;
//   Article.findById(id).deleteOne((err, result) => {
//     if (err) res.send({ success: false, msg: err });

//     res.send({ success: true, result: result });
//   });
// });

module.exports = router;
