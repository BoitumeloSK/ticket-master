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
  eventDate: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  ticketPrice: {
    type: Number,
    set: (v) => (v / 100).toFixed(2),
  },
  published: {
    type: Boolean,
    required: true,
  },
  ticketSales: Boolean,
});

const Event = model("Event", eventSchema);
module.exports = Event;
