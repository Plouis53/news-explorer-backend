const jwt = require("jsonwebtoken");
const { REACT_APP_JWT_SECRET = "dev-key" } = process.env;
const exctractBearerToken = (header) => header.replace("Bearer ", "");
const { UnauthorizedError } = require("../errors/unauthorized-error");

module.exports.authorization = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      next(new UnauthorizedError("Authorization required"));
      return;
    }

    const token = exctractBearerToken(authorization);
    let payload;

    try {
      payload = jwt.verify(token, REACT_APP_JWT_SECRET);
    } catch (err) {
      next(new UnauthorizedError("Authorization required"));
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

//8/8/23 const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const { REACT_APP_JWT_SECRET = "dev-key" } = process.env;

// const UnauthorizedError = require("../errors/unauthorized-error");

// const exctractBearerToken = (header) => header.replace("Bearer ", "");

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith("Bearer ")) {
//     return Promise.reject(new UnauthorizedError("Authorization error"));
//   }

//   const token = exctractBearerToken(authorization);
//   let payload;

//   try {
//     payload = jwt.verify(token, REACT_APP_JWT_SECRET);
//   } catch (err) {
//     return Promise.reject(new UnauthorizedError("Authorization error"));
//   }

//   req.user = payload;

//   return next();
// };
