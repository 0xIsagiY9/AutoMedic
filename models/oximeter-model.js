import mongoose from 'mongoose';

const oximeterDataSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  bloodPressure: {
    systolic: {
      type: Number,
      required: true,
    },
    diastolic: { type: Number, required: true },
  },
  oxygenPercentage: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const OximeterData = mongoose.model('Oximeterdata', oximeterDataSchema);

export default OximeterData;
