const mongoose = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

const { Schema, model } = mongoose;

// Databases
// Collections
// Documents

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
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  venue: {
    type: String,
    required: true,
  },
  mainPic: {
    type: String,
    default:
      "https://res.cloudinary.com/dlfxinw9v/image/upload/v1616837651/event_image_npqdmv.png",
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
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
