require("module-alias/register");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");

require("dotenv").config();

const app = express();
require("./models/db");

const indexRouter = require("./routes");
const userTokenRouter = require("./routes/userToken");
const usersRouter = require("./routes/users");
const candlesRouter = require("./routes/candles");
const stockRouter = require("./routes/stock");

app.disable("etag");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./config/passportConfig");
app.use(passport.initialize({ userProperty: "payload" }));

app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/user_token", userTokenRouter);
app.use("/candles", candlesRouter);
app.use("/stock", stockRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const LoadCurrenciesController = require("./controllers/currencies");
const loadCurrenciesController = new LoadCurrenciesController(60000);

loadCurrenciesController.init();

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
