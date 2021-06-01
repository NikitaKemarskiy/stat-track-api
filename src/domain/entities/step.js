const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  stepsAmount: { type: Number, required: true, },
  from: { type: Date, required: true, },
  till: { type: Date, required: true, },
  userId: { type: Number, required: true, },
  createdAt: { type: Date, required: true, default: () => new Date() },
})

const Step = mongoose.model('Step', StepSchema);

module.exports = Step;
