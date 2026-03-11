import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  transactionId: string;
  partyName: string;
  partyId?: mongoose.Types.ObjectId; // Reference to Vendor or User
  partyRef?: 'Vendor' | 'User';
  partyType: 'Vendor' | 'Customer' | 'Worker';
  amount: number;
  type: 'Credit' | 'Debit';
  date: Date;
  description: string;
}

const TransactionSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  partyName: { type: String, required: true },
  partyId: { type: Schema.Types.ObjectId, refPath: 'partyRef' }, // Dynamic ref
  partyRef: { type: String, enum: ['Vendor', 'User'] },
  partyType: { type: String, enum: ['Vendor', 'Customer', 'Worker'], required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Credit', 'Debit'], required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
