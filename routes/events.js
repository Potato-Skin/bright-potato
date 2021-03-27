const express = require("express");
const Event = require("../models/Event.model");
const isLoggedMiddleware = require("../middlewares/MustBeLoggedIn");
const Organization = require("../models/Organization.model");
const goHomeYoureDrunk = require("../utils/goHomeYoureDrunk");

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
  Event.findOne({ slug: req.params.dynamicGorilla })
    .populate("organizer")
    .then((thatSingleEvent) => {
      if (!thatSingleEvent) {
        return goHomeYoureDrunk(res);
      }

      let isOrganizingMember;

      if (req.session.user) {
        if (thatSingleEvent.organizer.members.includes(req.session.user._id)) {
          isOrganizingMember = true;
        }
      }

      // console.log("thatSingleEvent:", thatSingleEvent);
      res.render("events/single-event", {
        event: thatSingleEvent,
        isOrganizingMember,
      });
    });
});

router.get("/:dynamic/delete", isLoggedMiddleware, (req, res) => {
  Event.findById(req.params.dynamic)
    .populate("organizer")
    .then((event) => {
      console.log("event:", event);
      if (!event) {
        return goHomeYoureDrunk(res);
      }

      if (!event.organizer.members.includes(req.session.user._id)) {
        return goHomeYoureDrunk(res);
      }

      // GET PAST THE 2 CHECKS WE CAN FINALLY DELETE STUFF
      Event.findByIdAndDelete(event._id).then(() => {
        // WE HAVE DELETED THE EVENT
        Organization.findByIdAndUpdate(event.organizer._id, {
          $pull: { events: event._id },
        }).then(() => {
          goHomeYoureDrunk(res);
        });
      });
    });
});

module.exports = router;
