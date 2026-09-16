export interface InventorySummary {
  productId: number;
  name: string;
  brand: string | null;
  size: string | null;
  totalStock: number;
  stockStatus:
    | 'IN_STOCK'
    | 'LOW_STOCK'
    | 'OUT_OF_STOCK';

  expiryStatus:
    | 'NO_ALERT'
    | 'WARNING'
    | 'HIGH'
    | 'URGENT';
}