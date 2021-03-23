const express = require("express");
const LOCATION_ENUM = require("../utils/consts");
const isLoggedMiddleware = require("../middlewares/MustBeLoggedIn");
const Organization = require("../models/Organization.model");

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

      res.render("single-organization", { organization: foundOrg });
      console.log("foundOrg:", foundOrg.members[0].name);
    });
});

module.exports = router;
