import { newTransaction } from "../models/newTransaction";
import { Request, Response } from "express";
export const createTransaction = async (req: Request, res: Response) => {
  try {
    await newTransaction.create(req.body);
    return res.json({
      status: true,
      message: "Transaction created successfully",
    });
  } catch (err: any) {
    console.log("Error creating transaction:", err);
    return res.json({ status: false, message: "Error creating transaction" });
  }
};

export const fetchAllTransactionsByProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const transactions = await newTransaction
      .find({ profileId: req.params.profileId })
      .sort({ createdAt: -1 });
    return res.json({ status: true, transactions });
  } catch (err: any) {
    console.log("Error fetching transactions:", err);
    return res.json({ status: false, message: "Error fetching transactions" });
  }
};
