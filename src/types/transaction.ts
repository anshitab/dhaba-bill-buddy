export interface TransactionItem {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  _id: string;
  timestamp: string | { $date: string };
  items: TransactionItem[];
  total_amount: number;
  transaction_id?: string;
} 