import mongoose from "mongoose";

const newTransactionSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newProfile",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
export const newTransaction = mongoose.model(
  "newTransaction",
  newTransactionSchema
);


