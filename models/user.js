const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// const isEmail = require("validator/lib/isEmail");
const { UnauthorizedError } = require("../errors/unauthorized-error");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Incorrect email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Incorrect password or email"),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect password or email"),
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
