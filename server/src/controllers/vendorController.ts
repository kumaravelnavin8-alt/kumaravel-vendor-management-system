import { Request, Response } from 'express';
import Vendor from '../models/Vendor';

export const createVendor = async (req: Request, res: Response) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
