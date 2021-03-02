const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (username) => {
    return new Promise((resolve, reject) => {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1h",
      };
      JWT.sign({ username: username }, secret, options, (err, token) => {
        if (err) {
          console.log("signAccessToken fail");
          console.log(err.message);
          reject(createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    });
  },

  signRefreshToken: (username) => {
    return new Promise((resolve, reject) => {
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y",
      };
      JWT.sign({ username: username }, secret, options, (err, token) => {
        if (err) {
          console.log("signRefreshToken fail");
          console.log(err.message);
          // reject(err)
          reject(createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) {
      console.log("no header");
      return next(createError.Unauthorized());
    }
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        console.log("verifyAccessToken, JWT verify fail");
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(createError.Unauthorized());
          } else {
            const userId = payload.aud;
            resolve(userId);
          }

          //   client.GET(userId, (err, result) => {
          //     if (err) {
          //       console.log(err.message);
          //       reject(createError.InternalServerError());
          //       return;
          //     }
          //     if (refreshToken === result) return resolve(userId);
          //     reject(createError.Unauthorized());
          //   });
        }
      );
    });
  },
};
