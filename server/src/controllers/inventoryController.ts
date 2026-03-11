import { Request, Response } from 'express';
import YarnInventory from '../models/YarnInventory';
import Notification from '../models/Notification';
import { notifyDataChange } from '../config/socket';

export const addYarnStock = async (req: Request, res: Response) => {
  try {
    const yarn = new YarnInventory(req.body);
    await yarn.save();
    
    // Check for low stock
    if (yarn.stockQuantity <= yarn.lowStockThreshold) {
      const notification = new Notification({
        title: 'Low Yarn Stock',
        message: `Yarn ${yarn.yarnType} (${yarn.color}) is low on stock: ${yarn.stockQuantity} units remaining.`,
        type: 'LowStock'
      });
      await notification.save();
    }
    notifyDataChange('Inventory');
    res.status(201).json(yarn);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getYarnInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await YarnInventory.find().populate('vendor', 'name');
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateYarnStock = async (req: Request, res: Response) => {
  try {
    const yarn = await YarnInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!yarn) return res.status(404).json({ message: 'Yarn stock not found' });

    if (yarn.stockQuantity <= yarn.lowStockThreshold) {
      const notification = new Notification({
        title: 'Low Yarn Stock Alert',
        message: `Yarn ${yarn.yarnType} (${yarn.color}) is low on stock: ${yarn.stockQuantity} units remaining.`,
        type: 'LowStock'
      });
      await notification.save();
    }
    notifyDataChange('Inventory');
    res.json(yarn);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
