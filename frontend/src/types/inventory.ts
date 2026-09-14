export interface InventoryBatch {
  id: number;
  quantity: number;
  expiryDate: string | null;

  product: {
    id: number;
    name: string;
    size: string | null;

    brand: {
      id: number;
      name: string;
    } | null;
  };
}