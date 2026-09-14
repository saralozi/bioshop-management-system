import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { InventoryBatch } from '../../types/inventory';
import './inventory.css';

function Inventory() {
  const [inventory, setInventory] = useState<InventoryBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await api.get('/inventory');
        setInventory(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  if (loading) {
    return <p>Loading inventory...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div>
          <h1>Inventory</h1>
          <p>View current stock and expiry information.</p>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((batch) => (
              <tr key={batch.id}>
                <td>{batch.product.name}</td>
                <td>{batch.product.brand?.name ?? '-'}</td>
                <td>{batch.product.size ?? '-'}</td>
                <td>{batch.quantity}</td>
                <td>
                  {batch.expiryDate
                    ? new Date(batch.expiryDate).toLocaleDateString()
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inventory.length === 0 && (
          <p className="inventory-empty">No inventory found.</p>
        )}
      </div>
    </div>
  );
}

export default Inventory;