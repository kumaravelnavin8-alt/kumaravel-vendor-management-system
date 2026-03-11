import { Request, Response } from 'express';
import Loom from '../models/Loom';

export const createLoom = async (req: Request, res: Response) => {
  try {
    const loom = new Loom(req.body);
    await loom.save();
    res.status(201).json(loom);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLooms = async (req: Request, res: Response) => {
  try {
    const looms = await Loom.find().populate('workerId', 'name').populate('runningOrder', 'orderId');
    res.json(looms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLoom = async (req: Request, res: Response) => {
  try {
    const loom = await Loom.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loom) return res.status(404).json({ message: 'Loom not found' });
    res.json(loom);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
