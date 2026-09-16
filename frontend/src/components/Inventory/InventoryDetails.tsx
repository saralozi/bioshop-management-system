import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './inventory.css';

interface InventoryBatch {
  id: number;
  quantity: number;
  expiryDate: string | null;
}

interface ProductStockResponse {
  productId: number;
  totalStock: number;
  batches: InventoryBatch[];
}

interface StockMovement {
  id: number;
  quantity: number;
  type: 'STOCK_IN' | 'SALE' | 'EXPIRED';
  createdAt: string;
}

function InventoryDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [productName, setProductName] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(0);

  const [totalStock, setTotalStock] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInventoryDetails() {
      try {
        const [
          productResponse,
          stockResponse,
          movementsResponse,
        ] = await Promise.all([
          api.get(`/products/${productId}`),

          api.get<ProductStockResponse>(
            `/inventory/product/${productId}/stock`,
          ),

          api.get(
            `/inventory/movements?productId=${productId}`,
          ),
        ]);

        setProductName(productResponse.data.name);

        setLowStockThreshold(
          productResponse.data.lowStockThreshold,
        );

        setTotalStock(stockResponse.data.totalStock);

        setBatches(stockResponse.data.batches);

        setMovements(movementsResponse.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load inventory details');
      } finally {
        setLoading(false);
      }
    }

    fetchInventoryDetails();
  }, [productId]);

  if (loading) {
    return <p>Loading inventory details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  let stockStatus = 'In Stock';

  if (totalStock === 0) {
    stockStatus = 'Out of Stock';
  } else if (totalStock <= lowStockThreshold) {
    stockStatus = 'Low Stock';
  }

  return (
    <div className="inventory-details-page">
      <button
        className="btn btn-sm btn-outline-secondary mb-4"
        onClick={() => navigate('/inventory')}
      >
        Back
      </button>

      <div className="mb-4">
        <h1>{productName}</h1>
        <p className="text-muted">
          Inventory details
        </p>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="inventory-detail-card">
            <p>Total Stock</p>
            <h3>{totalStock}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="inventory-detail-card">
            <p>Stock Status</p>
            <h3>{stockStatus}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="inventory-detail-card">
            <p>Low Stock Threshold</p>
            <h3>{lowStockThreshold}</h3>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <h2 className="mb-3">Batches</h2>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
              </tr>
            </thead>

            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td>#{batch.id}</td>

                  <td>{batch.quantity}</td>

                  <td>
                    {batch.expiryDate
                      ? new Date(
                          batch.expiryDate,
                        ).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3">
          Stock Movements
        </h2>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td>
                    {new Date(
                      movement.createdAt,
                    ).toLocaleString()}
                  </td>

                  <td>{movement.type}</td>

                  <td>
                    {movement.quantity > 0
                      ? `+${movement.quantity}`
                      : movement.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryDetails;