
export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Bill {
  items: OrderItem[];
  total: number;
  date: Date;
}
