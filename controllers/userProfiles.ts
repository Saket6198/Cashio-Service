import { newProfile } from "../models/newProfile";
import { profileSettingsHistory } from "../models/profileSettingsHistory";
import { Request, Response } from "express";
import { toMonth, toYear } from "../utils/helper";

const buildHistorySnapshot = (profileData: any) => ({
  month: toMonth(profileData?.month),
  year: toYear(profileData?.year),
  rentAmount: Number(profileData?.rentAmount) || 0,
  previous_month_balance: Number(profileData?.previous_month_balance) || 0,
  gstAmount: Number(profileData?.gstAmount) || 0,
  vatAmount: Number(profileData?.vatAmount) || 0,
  otherCharges: Number(profileData?.otherCharges) || 0,
  note: profileData?.note || "",
  fineActive: Boolean(profileData?.fineActive),
  finePerDay: Number(profileData?.finePerDay) || 0,
  fineStartDate: profileData?.fineStartDate || undefined,
  fineEndDate: profileData?.fineEndDate || undefined,
});

const createHistorySnapshot = async (profileId: string, profileData: any) => {
  const snapshot = buildHistorySnapshot(profileData);

  return profileSettingsHistory.findOneAndUpdate(
    {
      profileId,
      year: snapshot.year,
      month: snapshot.month,
    },
    {
      profileId,
      ...snapshot,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
};

const mapHistoryRecord = (record: any, year: number, month: number) => {
  const grandTotal =
    record.rentAmount +
    record.gstAmount +
    record.vatAmount +
    record.otherCharges;
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return {
    ...record.toObject(),
    year,
    month,
    monthLabel,
    grandTotal,
  };
};

const isCurrentPeriod = (year: number, month: number) => {
  const now = new Date();
  return year === now.getFullYear() && month === now.getMonth() + 1;
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const alreadyExists = await newProfile.findOne({
      name,
    });
    if (alreadyExists) {
      return res
        .status(409)
        .json({ status: false, message: "Profile already exists" });
    }
    const uuid = crypto.randomUUID();
    const createdProfile = await newProfile.create({
      uuid,
      ...req.body,
    });

    await createHistorySnapshot(createdProfile._id.toString(), {
      ...createdProfile.toObject(),
      month: req.body?.month,
      year: req.body?.year,
    });

    return res.json({ status: true, message: "Profile created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const fetchAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await newProfile
      .find({}, { name: 1, uuid: 1, entityType: 1, createdAt: 1 })
      .sort({ createdAt: -1 });
    return res.json({ status: true, profiles });
  } catch (err: any) {
    console.log("Error fetching profiles:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching profiles" });
  }
};

export const fetchProfileById = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId;
    const profile = await newProfile.findOne({ _id: profileId });
    if (!profile) {
      return res.json({ status: false, message: "Profile not found" });
    }
    return res.json({ status: true, profile });
  } catch (err: any) {
    console.log("Error fetching profile:", err);
    return res.json({ status: false, message: "Error fetching profile" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const profileId = req.params.profileId;
    const updateData = req.body;
    const updatedProfile = await newProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true },
    );
    if (!updatedProfile) {
      return res.json({ status: false, message: "Profile not found" });
    }

    await createHistorySnapshot(profileId, {
      ...updatedProfile.toObject(),
      month: updateData?.month,
      year: updateData?.year,
    });

    return res.json({
      status: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.log("Error updating profile:", err);
    return res.json({ status: false, message: "Error updating profile" });
  }
};

export const fetchProfileSettingsHistory = async (
  req: Request,
  res: Response,
) => {
  try {
    const profileId = req.params.profileId;
    const history = await profileSettingsHistory
      .find(
        { profileId },
        {
          month: 1,
          year: 1,
          rentAmount: 1,
          previous_month_balance: 1,
          gstAmount: 1,
          vatAmount: 1,
          otherCharges: 1,
          note: 1,
          fineActive: 1,
          finePerDay: 1,
          fineStartDate: 1,
          fineEndDate: 1,
          createdAt: 1,
        },
      )
      .sort({ year: -1, month: -1, createdAt: -1 });

    const formattedHistory = history.map((item) => {
      const monthLabel = new Date(item.year, item.month - 1, 1).toLocaleString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        },
      );

      const grandTotal =
        item.rentAmount + item.gstAmount + item.vatAmount + item.otherCharges;

      return {
        ...item.toObject(),
        monthLabel,
        grandTotal,
      };
    });

    const availablePeriods = Array.from(
      new Map(
        formattedHistory.map((item) => {
          const key = `${item.year}-${item.month}`;
          return [
            key,
            {
              year: item.year,
              month: item.month,
              monthLabel: item.monthLabel,
            },
          ];
        }),
      ).values(),
    );

    return res.status(200).json({
      status: true,
      history: formattedHistory,
      availablePeriods,
    });
  } catch (err) {
    console.log("Error fetching profile settings history:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching settings history" });
  }
};

export const fetchProfileSettingsByMonthYear = async (
  req: Request,
  res: Response,
) => {
  try {
    const profileId = req.params.profileId;
    const year = Number(req.params.year);
    const month = Number(req.params.month);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid year or month" });
    }

    let record = await profileSettingsHistory
      .findOne({
        profileId,
        year,
        month,
      })
      .sort({ createdAt: -1 });

    if (!record && isCurrentPeriod(year, month)) {
      const previousRecord = await profileSettingsHistory
        .findOne({
          profileId,
          $or: [{ year: { $lt: year } }, { year, month: { $lt: month } }],
        })
        .sort({ year: -1, month: -1, createdAt: -1 });

      const profile = !previousRecord
        ? await newProfile.findById(profileId)
        : null;

      const fallbackSource = previousRecord || profile;

      if (fallbackSource) {
        record = await createHistorySnapshot(profileId, {
          ...fallbackSource.toObject(),
          year,
          month,
        });
      }
    }

    if (!record) {
      return res
        .status(404)
        .json({ status: false, message: "No settings history found" });
    }

    return res.json({
      status: true,
      history: mapHistoryRecord(record, year, month),
    });
  } catch (err) {
    console.log("Error fetching profile settings by month/year:", err);
    return res.status(500).json({
      status: false,
      message: "Error fetching settings for month/year",
    });
  }
};
