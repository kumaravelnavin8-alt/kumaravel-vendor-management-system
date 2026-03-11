import { Request, Response } from 'express';
import Loom from '../models/Loom';
import Production from '../models/Production';
import Order from '../models/Order';
import YarnInventory from '../models/YarnInventory';
import Vendor from '../models/Vendor';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalLooms = await Loom.countDocuments();
    const runningLooms = await Loom.countDocuments({ status: 'Running' });
    const idleLooms = await Loom.countDocuments({ status: 'Idle' });
    
    // Today's Production
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayProduction = await Production.aggregate([
      { $match: { date: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: '$metersProduced' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const lowYarnStock = await YarnInventory.countDocuments({ 
       $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] } 
    });

    const vendorBalances = await Vendor.aggregate([
      { $group: { _id: null, total: { $sum: '$outstandingBalance' } } }
    ]);

    res.json({
      totalLooms,
      runningLooms,
      idleLooms,
      todayProduction: todayProduction[0]?.total || 0,
      pendingOrders,
      lowYarnStock,
      totalVendorBalance: vendorBalances[0]?.total || 0
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
