export interface MenuItem {
  id?: string;
  item_id?: string;
  name: string;
  price: number;
  category?: string;
  description?: string;
  isAvailable?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Transaction {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  billNumber: string;
  status: string;
  timestamp: string;
}

export interface Bill {
  items: OrderItem[];
  total: number;
  date: Date;
}
