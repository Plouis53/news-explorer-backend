const router = require("express").Router();
const articles = require("./articles");
const User = require("./users");
const NotFoundError = require("../errors/not-found-error");
const { signin, createUser } = require("../controllers/user");
const auth = require("../middlewares/auth");
const {
  validateUserInfo,
  validateUserSignin,
} = require("../middlewares/validator");

router.use("/articles", auth, articles);

router.use("/users", auth, User);

router.post("/signin", validateUserSignin, signin);

router.post("/signup", validateUserInfo, createUser);

router.use(() => {
  throw new NotFoundError("This route does not exist");
});

module.exports = router;
