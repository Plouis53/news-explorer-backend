require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate"); // Import celebrate before error-handler
const helmet = require("helmet");
const bodyParser = require("body-parser");

const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/article_db")
  .then((res) => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.use(helmet());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.use(routes); // our routes
app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler should be used before error-handler
app.use(errorHandler); // our centralized handler

app.listen(PORT, () => {
  console.log("hello");
  console.log(`App listening at port ${PORT}`);
  console.log("Connected to the database");
});
