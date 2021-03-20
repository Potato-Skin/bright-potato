// "password" -> "asdkjghdsfkugsdfkjlysdfuklh2349873q4598wrujtlkawugsfd.gbsvf"
// "password" -> "ads;fjgh sdflgjes4 e98tu7w398ey7 elfdkbnc 90e4ues;/ktn 320.201"

// form
// email
// password: "password"

// "password" =>"ads;fjgh sdflgjes4 e98tu7w398ey7 elfdkbnc 90e4ues;/ktn 320.201" => db

// "password" =>

// How to Hash a Password -> wikhow

// Step 1 -> Get a string (user passwoird)
// Step 2 -> Salt -> Destroy a string
// Step 3 -> Hash the password -> Take the destroyed string and finally introduce the hashing algo
// Step 4 -> Save in the database. You are secure. You did it!
// Step 5 -> Go get yourself some ice cream

const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const saltRounds = 10;

const router = express.Router();

// /auth
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const { name, username, email, password } = req.body;
  console.log("req.body:", req.body);
  User.findOne({ $or: [{ username }, { email }] }).then((found) => {
    if (found) {
      res.render("signup", {
        errorMessage: "Oops, username/email already taken",
      });
      return;
    }
    // Here we know that the username is unique
    const generatedSalt = bcrypt.genSaltSync(saltRounds);
    console.log("generatedSalt:", generatedSalt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);
    console.log("hashedPassword:", hashedPassword);
    User.create({
      username,
      email,
      name,
      password: hashedPassword,
    }).then((createdUser) => {
      console.log("createdUser:", createdUser);
      res.redirect("/");
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).then((found) => {
    // !found => means no user
    if (!found) {
      res.render("login", { errorMessage: "Wrong credentials" });
      return;
    }
    // WE KNOW WE HAVE THE RIGHT USER
    // VALIDATE THE PASSWORD
    const isSamePassword = bcrypt.compareSync(password, found.password);
    // compareSync -> boolean -> compareSync true? the user wrote the exact same password as before. false ? wrong password
    if (!isSamePassword) {
      res.render("login", { errorMessage: "Wrong credentials" });
      return;
    }
    // SUCCESSFUL LOGIN
    res.redirect("/");
  });
});

// npm install bcrypt

module.exports = router;
