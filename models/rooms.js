const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
  },

  starter: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
