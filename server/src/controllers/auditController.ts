import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, module } = req.query;
    const query: any = {};
    if (module) query.module = module;

    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
      logs,
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};
