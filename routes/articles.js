const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateArticleInfo,
  validateIds,
} = require("../middlewares/validator");
const {
  getArticles,
  addArticle,
  removeArticle,
} = require("../controllers/articles");

router.get("/", auth, getArticles);

router.post("/", auth, validateArticleInfo, addArticle);

router.delete("/:articleId", auth, validateIds, removeArticle);

module.exports = router;
