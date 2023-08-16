const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/user");
const { validateUserInfo } = require("../middlewares/validator");

router.get("/me", authorization, getCurrentUser);

router.patch("/me", authorization, validateUserInfo);

module.exports = router;
