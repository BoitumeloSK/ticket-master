const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: String,
  location: String,
  totalTickets: Number,
  ticketPrice: {
    type: Number,
    get: (v) => (v / 100).toFixed(2),
    set: (v) => v * 100,
  },
  published: {
    type: Boolean,
    required: true,
  },
  ticketSales: {
    type: Boolean,
    required: true,
  },
});

const Event = model("Event", eventSchema);
module.exports = Event;
