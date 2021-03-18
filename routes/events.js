const express = require("express");
const Event = require("../models/Event.model");

const router = express.Router();

router.get("/", (req, res) => {
  Event.find().then((alLEvents) => {
    console.log("alLEvents:", alLEvents);
  });
});

// router.get("/lucky")

module.exports = router;
