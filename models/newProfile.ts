import mongoose from "mongoose";

const newProfileSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    finePerDay: {
      type: Number,
    },
    fineActive: {
      type: Boolean,
      default: false,
    },
    fineStartDate: {
      type: Date,
      default: undefined,
    },
    fineEndDate: {
      type: Date,
      default: undefined,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const newProfile = mongoose.model("newProfile", newProfileSchema);
