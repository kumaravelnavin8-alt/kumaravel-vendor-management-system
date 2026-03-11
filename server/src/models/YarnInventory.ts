import mongoose, { Schema, Document } from 'mongoose';

export interface IYarnInventory extends Document {
  yarnType: string;
  denier: string;
  color: string;
  weight: number;
  stockQuantity: number;
  purchasePrice: number;
  vendor: mongoose.Types.ObjectId;
  purchaseDate: Date;
  lowStockThreshold: number;
}

const YarnInventorySchema: Schema = new Schema({
  yarnType: { type: String, required: true },
  denier: { type: String, required: true },
  color: { type: String, required: true },
  weight: { type: Number, required: true }, // weight per unit (e.g., kg)
  stockQuantity: { type: Number, required: true, default: 0 },
  purchasePrice: { type: Number, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  purchaseDate: { type: Date, default: Date.now },
  lowStockThreshold: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.model<IYarnInventory>('YarnInventory', YarnInventorySchema);
