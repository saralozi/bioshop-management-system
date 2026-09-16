export interface Product {
  id: number;
  name: string;
  size: string | null;
  costPrice: string | null;
  sellingPrice: string | null;
  isActive: boolean;

  brand: {
    id: number;
    name: string;
  } | null;

  category: {
    id: number;
    name: string;
  };

  productType: {
    id: number;
    name: string;
  };
}1