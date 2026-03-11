import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'LowStock' | 'Order' | 'Payment';
  isRead: boolean;
  userId?: mongoose.Types.ObjectId; // Optional - send to specific user or all admins
}

const NotificationSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['LowStock', 'Order', 'Payment'], required: true },
  isRead: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);
