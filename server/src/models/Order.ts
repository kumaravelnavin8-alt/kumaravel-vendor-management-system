import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customerName: string;
  fabricType: string;
  quantityMeters: number;
  deliveryDate: Date;
  status: 'Pending' | 'In Production' | 'Completed' | 'Delivered';
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  fabricType: { type: String, required: true },
  quantityMeters: { type: Number, required: true },
  deliveryDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'In Production', 'Completed', 'Delivered'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
