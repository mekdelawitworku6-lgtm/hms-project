import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: [
      {
        name: String,
        dosage: String,
        instructions: String,
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);