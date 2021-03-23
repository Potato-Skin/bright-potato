const mongoose = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    min: 6,
  },
  // members: {
  //   type: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: ""
  //     }
  //   ], // [{users}]
  //   default: [],
  // },
  // ref: User => User.model.js -> model('User'). Thats how we make the relation work
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  // events: {
  //   type: [String], // [{events}]
  //   default: [],
  // },
  location: {
    type: String,
    default: "Berlin",
    enum: LOCATION_ENUM,
  },
  description: {
    type: String,
    required: true,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
