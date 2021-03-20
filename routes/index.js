const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log("user data: , ", req.session);
  res.render("index", { user: req.session.user });
});

module.exports = router;
