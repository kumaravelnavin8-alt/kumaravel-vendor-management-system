import { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog';

export const logAction = async (user: string, action: string, module: string, targetId?: string, oldValue?: any, newValue?: any, ip?: string) => {
  try {
    await AuditLog.create({
      user,
      action,
      module,
      targetId,
      oldValue,
      newValue,
      ipAddress: ip
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

export const auditMiddleware = (module: string) => {
  return (req: any, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function (data) {
      if (req.user && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
        const action = `${req.method} ${req.path}`;
        logAction(req.user.id, action, module, data._id || req.params.id, req.body, data, req.ip);
      }
      return originalJson.call(this, data);
    };
    next();
  };
};
