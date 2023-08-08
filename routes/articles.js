const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const {
  validateArticleInfo,
  validateIds,
} = require("../middlewares/validator");
const {
  getArticles,
  addArticle,
  removeArticle,
} = require("../controllers/articles");

router.get("/", authorization, getArticles);

router.post("/", authorization, validateArticleInfo, addArticle);

router.delete("/:articleId", authorization, validateIds, removeArticle);

module.exports = router;
