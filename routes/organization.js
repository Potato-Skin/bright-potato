const express = require("express");
const LOCATION_ENUM = require("../utils/consts");
const isLoggedMiddleware = require("../middlewares/MustBeLoggedIn");
const Organization = require("../models/Organization.model");
const Event = require("../models/Event.model");
const slugify = require("slugify");

const router = express.Router();

// router.get("/baroongaroognga-chungachunga", (req, res) => {
router.get("/my-organization", isLoggedMiddleware, (req, res) => {
  // EVERYONE WHERE I AM THE OWNER
  Organization.find({ owner: req.session.user._id }).then((whereIamOwner) => {
    Organization.find({
      $and: [
        { owner: { $ne: req.session.user._id } },
        { members: { $in: req.session.user._id } },
      ],
    }).then((whereIAmNotOwner) => {
      console.log("owner: ", whereIamOwner);
      console.log("nicht owner: ", whereIAmNotOwner);
      res.render("my-orgs", { owner: whereIamOwner, member: whereIAmNotOwner });

      // {{!-- {{#unless}} --}}

      // {{!-- {{#if owner}}
      // {{!-- USER HAS MULTIPLE (OR ONE) ORG WHERE IS OWNER --}}
      // {{else}}

      // {{!-- USER DOENST OWN ANY ORG --}}
      // {{/if}} --}}
    });
  });
});

router.get("/new", isLoggedMiddleware, (req, res) => {
  res.render("new-organization", {
    locations: LOCATION_ENUM,
  });
});

router.post("/new", isLoggedMiddleware, (req, res) => {
  // const name = req.body.name
  // const description = req.body.description
  // const location = req.body.location
  const { name, description, location } = req.body;

  if (name.length < 6) {
    res.render("new-organization", {
      errorMessage: "Your name is too small",
    });
    return;
  }

  if (!description) {
    return res.render("new-organization", {
      errorMessage: "You need to write a description",
    });
  }

  Organization.findOne({ name }).then((found) => {
    if (found) {
      return res.render("new-organization", {
        errorMessage: "That name is already taken",
      });
    }
    // THere is no organization with this name: we are free to take it
    Organization.create({
      name,
      description,
      location,
      owner: req.session.user._id,
      members: [req.session.user._id],
    })
      .then((createdOrganization) => {
        console.log("createdOrganization:", createdOrganization);
        // http://localhost:3000/organization/${createdOrganization._id}
        res.redirect(`/organization/${createdOrganization._id}`);
      })
      .catch((err) => {
        console.log(err);
        res.render("new-organization", { errorMessage: "Done Biotch" });
      });
  });
});

// /organization/askjgheshjgdsfjhgsfd
router.get("/:mufasa", (req, res) => {
  Organization.findById(req.params.mufasa)
    .populate("owner")
    .populate("members")
    .then((foundOrg) => {
      if (!foundOrg) {
        return res.redirect(`/`);
      }

      let isOwner = false;

      // if (foundOrg.owner.username === req.session.user.username) {
      //   isOwner = true;
      // }
      console.log("req.session:", req.session);
      if (req.session.user) {
        if (foundOrg.owner.username === req.session.user.username) {
          isOwner = true;
        }
      }

      res.render("org/single-organization", {
        organization: foundOrg,
        isOwner,
      });
      console.log("foundOrg:", foundOrg.members[0].name);
    })
    .catch((err) => {
      console.log("err:", err);
      console.log("HOUSTON WE HAVE A PROBLEM");
      res.redirect("/");
    });
});

router.get("/:anotherName/apply", isLoggedMiddleware, (req, res) => {
  Organization.findById(req.params.anotherName)
    .populate("members")
    .then((found) => {
      if (!found) {
        return res.redirect("/");
      }
      const alreadyAMember = found.members.find(
        (oneMember) => oneMember.username === req.session.user.username
      );
      if (alreadyAMember) {
        return res.redirect(`/organization/${found._id}`);
      }
      res.render("org/apply", { orgId: found._id });
    });
});

router.get("/:carrots/create", isLoggedMiddleware, (req, res) => {
  Organization.findOne({
    _id: req.params.carrots,
    members: { $in: req.session.user._id },
  }).then((oneOrg) => {
    console.log("DO YOU EXIST");
    if (!oneOrg) {
      return res.redirect(`/organization/${req.params.carrots}/apply`);
    }
    //
    res.render("org/new-event", { orgId: oneOrg._id, name: oneOrg.name });
  });
});

//

router.post("/:orgId/create", isLoggedMiddleware, (req, res) => {
  //
  Organization.findOne({
    _id: req.params.orgId,
    members: { $in: req.session.user._id },
  }).then((organizationExists) => {
    if (!organizationExists) {
      return res.redirect("/");
    }
    const { name, date, venue, maxAttendees, fee, description } = req.body;

    const slug = slugify(name, {
      lower: true,
    });

    Event.create({
      name,
      date,
      venue,
      maxAttendees,
      fee,
      description,
      slug,
      organizer: organizationExists._id,
    })
      .then((createdEvent) => {
        console.log("createdEvent:", createdEvent);
        res.redirect(`/events/${createdEvent.slug}`);
      })
      .catch((err) => {
        console.log(err);
        res.redirect(`/organization/${req.params.orgId}/create`);
      });
  });
});

module.exports = router;
