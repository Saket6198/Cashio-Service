import mongoose from "mongoose";

const profileSettingsHistorySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "newProfile",
      required: true,
      index: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    rentAmount: {
      type: Number,
      required: true,
    },
    previous_month_balance: {
      type: Number,
      default: 0,
    },
    gstAmount: {
      type: Number,
      required: true,
    },
    vatAmount: {
      type: Number,
      required: true,
    },
    otherCharges: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    fineActive: {
      type: Boolean,
      default: false,
    },
    finePerDay: {
      type: Number,
      default: 0,
    },
    fineStartDate: {
      type: Date,
      default: undefined,
    },
    fineEndDate: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true },
);

export const profileSettingsHistory = mongoose.model(
  "profileSettingsHistory",
  profileSettingsHistorySchema,
);
