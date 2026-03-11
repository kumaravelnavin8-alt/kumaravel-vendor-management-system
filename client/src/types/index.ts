export interface Vendor {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  vendorType: 'Yarn Supplier' | 'Fabric Buyer' | 'Dyeing Unit' | 'Worker/Contractor';
  gstNumber?: string;
  outstandingBalance: number;
}

export interface Loom {
  _id: string;
  loomNumber: string;
  status: 'Running' | 'Idle' | 'Maintenance';
  workerName?: string;
  fabricType?: string;
  lastMaintenance?: string;
}

export interface Transaction {
  _id: string;
  transactionId: string;
  date: string;
  amount: number;
  type: 'Credit' | 'Debit';
  description?: string;
  partyId: string;
  partyName: string;
  partyRef: string;
}

export interface AuditLog {
  _id: string;
  user: {
      _id: string;
      name: string;
  };
  action: string;
  module: string;
  targetId?: string;
  ipAddress?: string;
  timestamp: string;
}
