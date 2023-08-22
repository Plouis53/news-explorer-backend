const router = require("express").Router();
const articles = require("./articles");
const User = require("./user");
const { signin, createUser } = require("../controllers/user");


const {
  validateUserInfo,
  validateUserSignin,
} = require("../middlewares/validator");
const { NotFoundError } = require("../errors/not-found-error");

router.use("/articles", articles);

router.use("/users", User);

router.post("/signin", validateUserSignin, signin);

router.post("/signup", validateUserInfo, createUser);

router.use( () => {
  throw new NotFoundError(
    "There is NO API with the requested path, or the request was sent to a non-existent address",
  );
});

module.exports = router;
