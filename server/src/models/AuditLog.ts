import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  user: mongoose.Types.ObjectId;
  action: string;
  module: string;
  targetId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  targetId: { type: String },
  oldValue: { type: Schema.Types.Mixed },
  newValue: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
