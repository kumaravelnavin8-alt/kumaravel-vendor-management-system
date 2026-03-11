import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  phone: string;
  address: string;
  vendorType: 'Yarn Supplier' | 'Fabric Buyer' | 'Dyeing Unit';
  gstNumber?: string;
  outstandingBalance: number;
}

const VendorSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  vendorType: { type: String, enum: ['Yarn Supplier', 'Fabric Buyer', 'Dyeing Unit'], required: true },
  gstNumber: { type: String },
  outstandingBalance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IVendor>('Vendor', VendorSchema);
