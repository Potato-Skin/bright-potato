const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const LOCATION_ENUM = [
  "Berlin",
  "Amsterdam",
  "Den Haag",
  "Canary Islands",
  "Madrid",
  "Nuremberg",
  "Africa",
  "Utrecht",
];

const eventSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 10,
  },
  location: {
    type: String,
    default: "Berlin",
    enum: LOCATION_ENUM,
  },
  date: Date,
  attendees: {
    type: [String],
    default: [],
  },
  venue: {
    type: String,
    required: true,
  },
  mainPic: {
    type: String,
    default: "",
  },
  organizer: {
    type: String,
  },
  maxAttendees: {
    type: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  fee: {
    type: String,
  },
  description: {
    type: String,
    min: 20,
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;
