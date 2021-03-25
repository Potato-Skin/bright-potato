const express = require("express");
const Event = require("../models/Event.model");

const router = express.Router();

router.get("/", (req, res) => {
  const eventName = new RegExp(req.query.event, "i");
  Event.find({ name: { $regex: eventName } }).then((alLEvents) => {
    console.log("alLEvents:", alLEvents);
    res.render("eventPage", { eventList: alLEvents });
  });
});

router.get("/lucky", (req, res) => {
  Event.count().then((countOfEvents) => {
    const randomNumber = Math.floor(Math.random() * countOfEvents);
    Event.findOne()
      .skip(randomNumber)
      .then((singleRandom) => {
        res.redirect(`/events/${singleRandom.slug}`); // redirected to the event page
        // res.render("single-event", { event: singleRandom }); // just display the data
      });
  });
});

router.get("/all", (req, res) => {
  Event.find({}).then((allEvents) => {
    res.render("eventPage", { eventList: allEvents });
  });
});

// /events/*
router.get("/:dynamicGorilla", (req, res) => {
  Event.findOne({ slug: req.params.dynamicGorilla }).then((thatSingleEvent) => {
    console.log("thatSingleEvent:", thatSingleEvent);
    res.render("events/single-event", { event: thatSingleEvent });
  });
});

module.exports = router;
