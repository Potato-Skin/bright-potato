const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    min: 6,
  },
  members: {
    type: [String],
    default: [],
  },
  events: {
    type: [String],
    default: [],
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
