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
  res: Response,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { profileId: req.params.profileId };
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (startDate && endDate) {
      filter.created = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      };
    }

    const transactions = await newTransaction
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await newTransaction.countDocuments(filter);
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

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    const deletedTransaction =
      await newTransaction.findByIdAndDelete(transactionId);
    if (!deletedTransaction) {
      return res
        .status(404)
        .json({ status: false, message: "Transaction not found" });
    }
    return res.json({
      status: true,
      message: "Transaction deleted successfully",
    });
  } catch (err: any) {
    console.log("Error deleting transaction:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error deleting transaction" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    const user = await newTransaction.findById(transactionId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Transaction not found" });
    }
    await newTransaction.findByIdAndUpdate(transactionId, req.body, {
      new: true,
    });
    return res.status(200).json({
      status: true,
      message: "Transaction updated successfully",
    });
  } catch (err: any) {
    console.log("Error updating transaction:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error updating transaction" });
  }
};

export const fetchTransactionById = async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    const user = await newTransaction.findById(transactionId);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Transaction not found" });
    }
    return res.status(200).json({ status: true, transaction: user });
  } catch (err: any) {
    console.log("Error fetching transaction:", err);
    return res
      .status(500)
      .json({ status: false, message: "Error fetching transaction" });
  }
};
