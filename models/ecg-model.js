import mongoose from 'mongoose';

const ecgDataSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  readings: {
    type: [[Number]],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const EcgData = mongoose.model('Ecgdata', ecgDataSchema);

export default EcgData;
