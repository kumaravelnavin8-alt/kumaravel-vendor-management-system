import { Request, Response } from 'express';
import Loom from '../models/Loom';
import Production from '../models/Production';
import Order from '../models/Order';
import YarnInventory from '../models/YarnInventory';
import Vendor from '../models/Vendor';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalLooms,
      runningLooms,
      idleLooms,
      todayProductionRes,
      pendingOrders,
      lowYarnStock,
      vendorBalancesRes
    ] = await Promise.all([
      Loom.countDocuments(),
      Loom.countDocuments({ status: 'Running' }),
      Loom.countDocuments({ status: 'Idle' }),
      Production.aggregate([
        { $match: { date: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$metersProduced' } } }
      ]),
      Order.countDocuments({ status: 'Pending' }),
      YarnInventory.countDocuments({ 
         $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] } 
      }),
      Vendor.aggregate([
        { $group: { _id: null, total: { $sum: '$outstandingBalance' } } }
      ])
    ]);

    res.json({
      totalLooms,
      runningLooms,
      idleLooms,
      todayProduction: todayProductionRes[0]?.total || 0,
      pendingOrders,
      lowYarnStock,
      totalVendorBalance: vendorBalancesRes[0]?.total || 0
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
