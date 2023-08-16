// const rateLimit = require("express-rate-limit");

// module.exports.limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

const { JWT_SECRET = "my-secret-key" } = process.env;

module.exports = {
  JWT_SECRET,
};
