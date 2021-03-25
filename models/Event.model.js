const mongoose = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

const { Schema, model } = mongoose;

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
      "https://lh3.googleusercontent.com/proxy/hbCXvhWK_5G50PzTD6u7O0HNcvhZzWMIX7jwRH5zNF-l9Ou5nGgWB0JPTIaNtfb_kJQbNWzek5KJ2lXiJ5PAffhQQRY0aPm5-gw9R_xRaxzaBvhDol9Nf_Xh-I-2uiXfFQl9",
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
