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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const transactions = await newTransaction
      .find({ profileId: req.params.profileId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await newTransaction.countDocuments({
      profileId: req.params.profileId,
    });
    const totalPages = Math.ceil(totalTransactions / limit);

    return res.json({
      status: true,
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        limit,
      },
    });
  } catch (err: any) {
    console.log("Error fetching transactions:", err);
    return res.json({ status: false, message: "Error fetching transactions" });
  }
};
