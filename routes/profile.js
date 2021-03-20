const express = require("express");

const router = express.Router();
const isLoggedMiddleware = require("../middlewares/MustBeLoggedIn");
const User = require("../models/User.model");
// router.use(isLoggedMiddleware)

router.get("/", isLoggedMiddleware, (req, res) => {
  console.log("req.session.user", req.session.user);

  res.render("profile", { user: req.session.user });
});

router.get("/edit", isLoggedMiddleware, (req, res) => {
  res.render("edit-profile", { user: req.session.user });
});

router.post("/edit", isLoggedMiddleware, (req, res) => {
  const { name, bio } = req.body;

  User.findByIdAndUpdate(
    req.session.user._id, // id of the user that was logged in
    { name, shortBio: bio },
    { new: true }
  ).then((newUser) => {
    console.log("newUser:", newUser);
    req.session.user = newUser;
    res.redirect("/profile");
  });
});

module.exports = router;
