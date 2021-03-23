const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  // let user;
  // if (req.session.user) {
  //   user = req.session.user;
  // }
  // res.render("index", { user });
  res.render("index"); // no longer necessary to send user. its being sent in the middleware in app.js -> res.locals.user
});

module.exports = router;
