import { Request, Response } from 'express';
import Production from '../models/Production';
import Loom from '../models/Loom';

export const addProduction = async (req: Request, res: Response) => {
  try {
    const production = new Production(req.body);
    await production.save();
    
    // Update loom status to Running if it was Idle
    await Loom.findByIdAndUpdate(production.loomId, { status: 'Running' });

    res.status(201).json(production);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductionHistory = async (req: Request, res: Response) => {
  try {
    const history = await Production.find()
      .populate('loomId', 'loomNumber')
      .populate('workerId', 'name')
      .sort({ date: -1 });
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyProduction = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date as string) : new Date();
    searchDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(searchDate);
    nextDate.setDate(searchDate.getDate() + 1);

    const production = await Production.find({
      date: { $gte: searchDate, $lt: nextDate }
    }).populate('loomId', 'loomNumber');
    
    res.json(production);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
