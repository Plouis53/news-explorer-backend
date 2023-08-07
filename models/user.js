const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { UnauthorizedError } = require("../errors/unauthorized-error");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [300, "Name cannot exceed 30 characters"],
    role: {
      type: String,
      default: "Clark Kent", // Set default value for role field
    },
  },
  avatar: {
    type: String,
    required: [true, "Avatar is required"],
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png", // Set default value for avatar field
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (value) => {
        console.log(value, "THIS IS THE EMAIL");
        return validator.isEmail(value);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Add the select field to hide the password by default
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((endUser) => {
      if (!endUser) {
        throw new UnauthorizedError("Incorrect email or password");
      }

      return bcrypt.compare(password, endUser.password).then((isMatch) => {
        if (!isMatch) {
          throw new UnauthorizedError("Incorrect email or password");
        }

        return endUser;
      });
    });
};

module.exports = mongoose.model("user", userSchema);