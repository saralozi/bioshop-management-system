export interface SaleItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: string;

  product: {
    id: number;
    name: string;
  };
}

export interface Sale {
  id: number;
  totalAmount: string;
  createdAt: string;
  items: SaleItem[];
}