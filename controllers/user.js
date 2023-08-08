const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

require("dotenv").config();

const { REACT_APP_JWT_SECRET = "dev-key" } = process.env;

const { NotFoundError } = require("../errors/not-found-error");
const { ConflictError } = require("../errors/conflict-error");
const { BadRequestError } = require("../errors/bad-request-error");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          res.send({ name, avatar, email, _id: user._id });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError("User with this email already exists"));
          } else if (err.name === "ValidationError") {
            next(new BadRequestError("Data provided is invalid"));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.signin = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, REACT_APP_JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("User with this ID does not exist");
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
