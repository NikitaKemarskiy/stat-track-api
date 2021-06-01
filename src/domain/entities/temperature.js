const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
  temperature: { type: Number, required: true, },
  timestamp: { type: Date, required: true, },
  userId: { type: Number, required: true, },
  createdAt: { type: Date, required: true, default: () => new Date() },
})

const Temperature = mongoose.model('Temperature', TemperatureSchema);

module.exports = Temperature;
