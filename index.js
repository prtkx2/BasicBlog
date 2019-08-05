var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require("express-session");
var app = express();
var User = require("./models/user");
var blogpost = require("./models/blogpost");

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(
  "mongodb+srv://tester:tester1234@cluster0-owhya.mongodb.net/test?retryWrites=true&w=majority"
);

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  blogpost.find().then(result => res.render("homepage", { results: result }));
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res, next) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      res.redirect("/login");
    }
  );
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect("/profile");
  }
);

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/profile", isLoggedIn, function(req, res) {
  res.render("userpage", { name: req.user.username });
});

app.post("/logout", isLoggedIn, function(req, res) {
  req.logOut();
  res.redirect("/login");
});

app.post("/profile/posts", isLoggedIn, function(req, res) {
  var newpost = new blogpost({
    title: req.body.title,
    content: req.body.content,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  });
  newpost.save().then();
  res.redirect("/profile");
  // console.log(newpost);
  // res.sendStatus(200);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(process.env.PORT);
