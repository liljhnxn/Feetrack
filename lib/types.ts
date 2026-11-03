export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
}

export interface FeeRecord {
  feeId: bigint;
  admin: `0x${string}`;
  studentRef: string;
  description: string;
  amount: bigint;
  dueDate: bigint;
  status: PaymentStatus;
  paidTimestamp: bigint;
  createdAt: bigint;
}

export interface FeeStatistics {
  totalRecords: bigint;
  paidRecords: bigint;
  unpaidRecords: bigint;
  totalAmount: bigint;
}

