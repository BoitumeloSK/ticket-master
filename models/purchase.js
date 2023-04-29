const { Schema, model } = require("mongoose");
const purchaseSchema = new Schema({
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  EventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  tickets: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    get: (v) => (v / 100).toFixed(2),
    set: (v) => v * 100,
  },
});

const Purchase = model("Purchase", purchaseSchema);
module.exports = Purchase;
