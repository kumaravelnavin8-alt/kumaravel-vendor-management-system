import mongoose, { Schema, Document } from 'mongoose';

export interface IProduction extends Document {
  date: Date;
  loomId: mongoose.Types.ObjectId;
  workerId?: mongoose.Types.ObjectId;
  fabricType: string;
  metersProduced: number;
  shift: 'Day' | 'Night';
}

const ProductionSchema: Schema = new Schema({
  date: { type: Date, default: Date.now },
  loomId: { type: Schema.Types.ObjectId, ref: 'Loom', required: true },
  workerId: { type: Schema.Types.ObjectId, ref: 'User' },
  fabricType: { type: String, required: true },
  metersProduced: { type: Number, required: true },
  shift: { type: String, enum: ['Day', 'Night'], required: true },
}, { timestamps: true });

export default mongoose.model<IProduction>('Production', ProductionSchema);
