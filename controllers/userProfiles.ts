import { newProfile } from "../models/newProfile";
import { Request, Response } from "express";
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
    await newProfile.create({
      uuid,
      ...req.body,
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
    return res.json({ status: false, message: "Error fetching profiles" });
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
