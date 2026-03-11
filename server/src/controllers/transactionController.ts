import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Vendor from '../models/Vendor';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();

    // Update vendor balance if party is a vendor
    if (transaction.partyRef === 'Vendor' && transaction.partyId) {
      const amount = transaction.type === 'Credit' ? transaction.amount : -transaction.amount;
      await Vendor.findByIdAndUpdate(transaction.partyId, { $inc: { outstandingBalance: amount } });
    }

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
