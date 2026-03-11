import { Request, Response } from 'express';
import Production from '../models/Production';
import Transaction from '../models/Transaction';
import Order from '../models/Order';
import YarnInventory from '../models/YarnInventory';

export const getProductionReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const filter: any = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const report = await Production.find(filter).populate('loomId', 'loomNumber');
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentReport = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const filter: any = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const report = await Transaction.find(filter);
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
