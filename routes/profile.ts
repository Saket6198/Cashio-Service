import express from "express";
import {
  createProfile,
  fetchAllProfiles,
  fetchProfileById,
  fetchProfileSettingsByMonthYear,
  fetchProfileSettingsHistory,
  updateProfile,
} from "../controllers/userProfiles";
import {
  createTransaction,
  deleteTransaction,
  fetchAllTransactionsByProfile,
  fetchTransactionById,
  updateTransaction,
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
profileRouter.get("/profile/settings-history/:profileId", fetchProfileSettingsHistory);
profileRouter.get(
  "/profile/settings-history/:profileId/:year/:month",
  fetchProfileSettingsByMonthYear
);
profileRouter.put("/profile/update/:profileId", updateProfile);
profileRouter.delete("/transaction/:transactionId", deleteTransaction);
profileRouter.patch("/updateTransaction/:transactionId", updateTransaction);
profileRouter.get("/getTransaction/:transactionId", fetchTransactionById);
