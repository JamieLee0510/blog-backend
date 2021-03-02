const Admin = require("./../models/admin");
const createError = require("http-errors");
const { authSchema } = require("../helpers/validation_schema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwt_helper");

module.exports = {
  register: async (req, res, next) => {
    try {
      // const { email, password } = req.body
      // if (!email || !password) throw createError.BadRequest()
      const result = await authSchema.validateAsync(req.body);

      const doesExist = await Admin.findOne({ email: result.email });
      if (doesExist)
        throw createError.Conflict(
          `${result.email} is already been registered`
        );

      const user = new Admin(result);
      const savedUser = await user.save();
      const accessToken = await signAccessToken(savedUser.username);
      const refreshToken = await signRefreshToken(savedUser.username);
      return res.json({
        status: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  register02: async ({ req, auth, res }) => {
    const userData = req.body;
    // const userData = req.only(["username", "email", "password"]);
    console.log(userData);
    // try {
    //   const user = await Admin.create(userData);

    //   const token = await auth.generate(user);

    //   return res.json({
    //     status: "success",
    //     data: token,
    //   });
    // } catch (err) {
    //   return res.status(400).json({
    //     status: "error",
    //     message:
    //       "There was a problem creating the user, please try again later.",
    //   });
    // }
  },

  login: async (req, res) => {
    try {
      //防止注入攻擊
      const result = await authSchema.validateAsync(req.body);
      const user = await Admin.findOne({ email: result.email });
      if (!user) throw createError.NotFound("User not registered");

      const isMatch = await user.isValidPassword(result.password);
      if (!isMatch) {
        // return res.send({
        //   message: "isValidPassword fail",
        //   password: result.password,
        // });
        throw createError.Unauthorized("Username/password not valid");
      } else {
        const accessToken = await signAccessToken(user.username);
        const refreshToken = await signRefreshToken(user.username);

        console.log("login success");
        return res.send({ accessToken, refreshToken });
      }
    } catch (error) {
      if (error.isJoi === true)
        return res.json(createError.BadRequest("Invalid Username/Password"));
      //   next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      //利用req過來的refreshToken來解析出userID
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);

      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      res.send({ accessToken: accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      });
    } catch (error) {
      next(error);
    }
  },
  gerAllUser: async (req, res) => {
    try {
      const users = await Admin.find().sort({ _id: -1 });
      res.send({ success: true, result: users });
    } catch (err) {
      console.log(err);
    }
  },

  //測nuxt.$auth 的終端 me
  user: (req, res) => {
    const auth = req.payload.username;
    console.log(auth);
    return res.json({
      status: "success",
      data: auth,
    });
  },
};
