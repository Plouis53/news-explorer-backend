const Article = require("../models/articles");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");
const BadRequestError = require("../errors/bad-request-error");

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};
module.exports.addArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.status(201);
      res.send({ data: article });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Data provided is invalid"));
      } else {
        next(err);
      }
    });
};
module.exports.removeArticle = (req, res, next) => {
  const owner = req.user._id;
  Article.findById(req.params.articleId)
    .orFail(() => {
      throw new NotFoundError("Article with this ID does not exist");
    })
    .then((article) => {
      if (String(article.owner) !== owner) {
        return next(
          new ForbiddenError(
            "You do not have permission to remove this resource"
          )
        );
      }
      return article.deleteOne().then(() => res.send({ data: article }));
    })
    .catch(next);
};



// const Article = require("../models/articles");
// const NotFoundError = require("../errors/not-found-error");
// const ForbiddenError = require("../errors/forbidden-error");
// const BadRequestError = require("../errors/bad-request-error");

// module.exports.getArticles = (req, res, next) => {
//   Article.find({ owner: req.user._id })
//     .then((articles) => res.send(articles))
//     .catch(next);
// };

// module.exports.addArticle = (req, res, next) => {
//   const { keyword, title, text, date, source, link, image } = req.body;
//   const owner = req.user._id;

//   Article.create({ keyword, title, text, date, source, link, image, owner })
//     .then((article) => {
//       res.status(201).send(article);
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next(new BadRequestError("Data provided is invalid"));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.removeArticle = async (req, res, next) => {
//   const owner = req.user._id;
//   const articleId = req.params.articleId;

//   try {
//     const article = await Article.findById(articleId);
//     if (!article) {
//       throw new NotFoundError("Article with this ID does not exist");
//     }

//     if (String(article.owner) !== owner) {
//       throw new ForbiddenError(
//         "You do not have permission to remove this resource",
//       );
//     }

//     await article.deleteOne();
//     res.send({ data: article });
//   } catch (err) {
//     next(err);
//   }
// };
