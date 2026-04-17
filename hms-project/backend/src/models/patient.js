import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    disease: { type: String },
    admitted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);