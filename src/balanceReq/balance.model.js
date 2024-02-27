const mongoose = require("mongoose");

const { Schema } = mongoose;

const balanceSchema = new Schema({
  transition: {
    type: String,
  },
  transitionId: {},
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Balance", balanceSchema);
