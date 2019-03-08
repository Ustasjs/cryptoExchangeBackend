require("module-alias/register");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");

require("dotenv").config();

const app = express();
require("./models/db");

const indexRouter = require("./routes");
const userTokenRouter = require("./routes/user_token");
const usersRouter = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("./config/passport-config");
app.use(passport.initialize({ userProperty: "payload" }));

// cors
if (app.get("env") === "development") {
  app.use(function(req, res, next) {
    const allowedOrigins = [process.env.CLIENT_URL];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    next();
  });
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/user_token", userTokenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
/* eslint-disable-next-line no-unused-vars */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
