const { Schema, model } = require("mongoose");
const LOCATION_ENUM = require("../utils/consts");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  locations: {
    type: String,
    default: "Berlin",
    enum: LOCATION_ENUM,
  },
  shortBio: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "",
  },
});

const User = model("User", userSchema);

module.exports = User;
