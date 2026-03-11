import mongoose, { Schema, Document } from 'mongoose';

export interface ILoom extends Document {
  loomNumber: string;
  workerName?: string;
  workerId?: mongoose.Types.ObjectId;
  fabricType?: string;
  runningOrder?: mongoose.Types.ObjectId;
  status: 'Running' | 'Idle' | 'Maintenance';
}

const LoomSchema: Schema = new Schema({
  loomNumber: { type: String, required: true, unique: true },
  workerId: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to a worker user
  workerName: { type: String }, // Manual name if not a registered user
  fabricType: { type: String },
  runningOrder: { type: Schema.Types.ObjectId, ref: 'Order' },
  status: { type: String, enum: ['Running', 'Idle', 'Maintenance'], default: 'Idle' },
}, { timestamps: true });

export default mongoose.model<ILoom>('Loom', LoomSchema);
