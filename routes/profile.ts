import express from "express";
import {
  createProfile,
  fetchAllProfiles,
  fetchProfileById,
  updateProfile,
} from "../controllers/userProfiles";
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

profileRouter.get("/profile/:profileId", fetchProfileById);
profileRouter.put("/profile/update/:profileId", updateProfile);
