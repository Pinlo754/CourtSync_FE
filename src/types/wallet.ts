export interface TransactionAPI {
    $id: number;
    $values: Transaction[];
}
export interface Transaction {
  $id: number;
  transactionId: number;
  bookingId: number;
  userId: number;
  name: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
  updateDate: string;
  description: string;
}
