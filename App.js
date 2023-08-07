require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate"); // Import celebrate before error-handler
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (error) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Connected to the database");
  }
});

const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.use(requestLogger);

app.use(routes); // our routes
app.use(errorLogger); // enabling the error logger

app.use(errors()); // celebrate error handler should be used before error-handler
app.use(errorHandler); // our centralized handler

app.listen(PORT, () => {
  console.log("hello");
  console.log(`App listening at port ${PORT}`);
  console.log("Working");
});
