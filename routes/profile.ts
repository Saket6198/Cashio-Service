import express from "express";
import { createProfile, fetchAllProfiles } from "../controllers/userProfiles";
import { newProfile } from "../models/newProfile";
import { newTransaction } from "../models/newTransaction";
import {
  createTransaction,
  fetchAllTransactionsByProfile,
} from "../controllers/transactions";

export const profileRouter = express.Router();

profileRouter.post("/create", createProfile);

profileRouter.get("/profiles", fetchAllProfiles);

profileRouter.post("/newTransaction", createTransaction);

profileRouter.get(
  "/getAllTransactions/:profileId",
  fetchAllTransactionsByProfile
);
