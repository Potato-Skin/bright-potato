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
    .populate("attendees")
    .then((thatSingleEvent) => {
      // console.log("thatSingleEvent:", thatSingleEvent);
      console.log("BREAKING CODE");
      if (!thatSingleEvent) {
        return goHomeYoureDrunk(res);
      }

      let isOrganizingMember;
      let isNotGoingToEventYet;
      let canLeaveEvent;
      let isMember;

      if (req.session.user) {
        if (thatSingleEvent.organizer.members.includes(req.session.user._id)) {
          isOrganizingMember = true;
        }

        const isInAttendees = thatSingleEvent.attendees.find((user) => {
          return user.username === req.session.user.username;
        });

        if (!isInAttendees) {
          isNotGoingToEventYet = true;
        }
        if (isInAttendees && !isOrganizingMember) {
          canLeaveEvent = true;
        }

        if (isInAttendees) {
          isMember = true;
        }
      }

      const sum = thatSingleEvent.ratings.reduce((acc, val) => {
        return acc + val;
      }, 0);

      // sum ? -> checks if number is not 0

      const rating = sum ? sum / thatSingleEvent.ratings.length : 0;

      // console.log("thatSingleEvent:", thatSingleEvent);
      res.render("events/single-event", {
        event: thatSingleEvent,
        isOrganizingMember,
        isNotGoingToEventYet,
        canLeaveEvent,
        isMember,
        rating,
      });
    });
});

router.get("/:dynamic/delete", isLoggedMiddleware, (req, res) => {
  Event.findById(req.params.dynamic)
    .populate("organizer")
    .then((event) => {
      // console.log("event:", event);
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

router.get(
  "/:dynamic/join",
  isLoggedMiddleware,
  eventExistsMiddleware,
  (req, res) => {
    Event.findById(req.params.dynamic)
      .populate("attendees")
      .then((foundEvent) => {
        if (!foundEvent) {
          return goHomeYoureDrunk(res);
        }

        const isInEventAlready = foundEvent.attendees.find(
          (user) => user.username === req.session.user.username
        );
        if (isInEventAlready) {
          return res.redirect(`/events/${foundEvent.slug}`);
        }

        if (foundEvent.attendees.length >= foundEvent.maxAttendees) {
          return res.redirect(`/events/${foundEvent.slug}`);
        }
        // {
        //   $push: {attendees: req.session.user._id}
        // }

        // IF we reach here, we can join the event
        Event.findByIdAndUpdate(
          foundEvent._id,
          {
            $addToSet: { attendees: req.session.user._id },
          },
          { new: true }
        ).then((updatedEvent) => {
          console.log("updatedEvent:", updatedEvent);
          return res.redirect(`/events/${foundEvent.slug}`);
        });
      });
  }
);

function eventExistsMiddleware(req, res, next) {
  Event.findById(req.params.dynamic)
    .populate("attendees")
    .populate("organizer")
    .then((foundEvent) => {
      if (!foundEvent) {
        return goHomeYoureDrunk(res);
      }
      req.event = foundEvent;
      next();
    });
}

router.get(
  "/:dynamic/leave",
  isLoggedMiddleware,
  eventExistsMiddleware,
  (req, res) => {
    const foundEvent = req.event;
    const isInEvent = req.event.attendees.find(
      (user) => user.username === req.session.user.username
    );
    if (!isInEvent) {
      return res.redirect(`/events/${foundEvent.slug}`);
    }

    Event.findByIdAndUpdate(
      foundEvent._id,
      {
        $pull: { attendees: req.session.user._id },
      },
      { new: true }
    ).then((updated) => {
      console.log("updated:", updated);
      res.redirect(`/events/${updated.slug}`);
    });

    // Event.findById(req.params.dynamic)
    //   .populate("attendees")
    //   .then((foundEvent) => {
    //     if (!foundEvent) {
    //       return goHomeYoureDrunk(res);
    //     }

    //     const isInEvent = foundEvent.attendees.find(
    //       (user) => user.username === req.session.user.username
    //     );

    //     if (!isInEvent) {
    //       return res.redirect(`/events/${foundEvent.slug}`);
    //     }

    //     Event.findByIdAndUpdate(
    //       foundEvent._id,
    //       {
    //         $pull: { attendees: req.session.user._id },
    //       },
    //       { new: true }
    //     ).then((updated) => {
    //       // console.log("updated:", updated);
    //       res.redirect(`/events/${updated.slug}`);
    //     });
    //   });
  }
);

router.post(
  "/:dynamic/rating",
  isLoggedMiddleware,
  eventExistsMiddleware,
  (req, res) => {
    console.log(req.body); // -> {rating: number} -> rating: "number"
    const rating = +req.body.rating;
    if (!rating) {
      // if rating is NaN because some hacker tried to send us a request from something like postman with a body of rating: bananas
      return goHomeYoureDrunk(res);
    }
    if (rating > 5 || rating < 1) {
      return goHomeYoureDrunk(res);
    }

    Event.findByIdAndUpdate(
      req.event._id,
      {
        $push: { ratings: rating },
      },
      { new: true }
    ).then((updated) => {
      console.log("updated:", updated);
      res.redirect(`/events/${updated.slug}`);
    });
  }
);

// [1, 1, 1] -> $push
// [1] -> $addToSet

module.exports = router;
