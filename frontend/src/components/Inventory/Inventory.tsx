import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { InventorySummary } from '../../types/inventory';
import type { Product } from '../../types/product';
import './inventory.css';
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [inventory, setInventory] =
    useState<InventorySummary[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [savingStock, setSavingStock] = useState(false); // track POST requests

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchInventory() {
      try {
        const [inventoryResponse, productsResponse] =
          await Promise.all([
            api.get('/inventory/summary'),
            api.get('/products'),
          ])

        setInventory(inventoryResponse.data);
        setProducts(productsResponse.data)
      } catch (error) {
        console.error(error);
        setError('Failed to fetch inventory');
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  async function handleAddStock(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault(); // prevent refreshing of page

    try {
      setSavingStock(true);
      setError('');

      await api.post('/inventory', {
        productId: Number(productId),
        quantity: Number(quantity),
        expiryDate: expiryDate || undefined,
      });

      const response =
        await api.get('/inventory/summary');

      setInventory(response.data); // update the table with new data

      setProductId('');
      setQuantity('');
      setExpiryDate('');

      setShowAddStockModal(false);
    } catch (error) {
      console.error(error);
      setError('Failed to add stock');
    } finally {
      setSavingStock(false);
    }
  }

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
          <p>
            View current inventory and stock levels.
          </p>
        </div>

        <button
          className="btn btn-success"
          onClick={() => setShowAddStockModal(true)}
        >
          Add Stock
        </button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Total Stock</th>
              <th>Stock Status</th>
              <th>Expiry Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.brand ?? '-'}</td>
                <td>{item.size ?? '-'}</td>
                <td>{item.totalStock}</td>

                <td>
                  <span
                    className={`inventory-status ${item.stockStatus.toLowerCase()}`}
                  >
                    {item.stockStatus === 'IN_STOCK'
                      ? 'In Stock'
                      : item.stockStatus === 'LOW_STOCK'
                        ? 'Low Stock'
                        : 'Out of Stock'}
                  </span>
                </td>

                <td>
                  <span
                    className={`expiry-status ${item.expiryStatus.toLowerCase()}`}
                  >
                    {item.expiryStatus === 'NO_ALERT'
                      ? 'No Alert'
                      : item.expiryStatus.charAt(0) +
                      item.expiryStatus
                        .slice(1)
                        .toLowerCase()}
                  </span>
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() =>
                        navigate(`/inventory/product/${item.productId}`)
                      }
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showAddStockModal && (
          <div className="stock-modal-backdrop">
            <div className="stock-modal">

              <div className="stock-modal-header">
                <div>
                  <h2>Add Stock</h2>
                  <p>Add a new inventory batch.</p>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowAddStockModal(false)
                  }
                />
              </div>

              <form onSubmit={handleAddStock}>

                <div className="mb-3">
                  <label className="form-label">
                    Product
                  </label>

                  <select
                    className="form-select"
                    value={productId}
                    onChange={(event) =>
                      setProductId(event.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select product
                    </option>

                    {products
                      .filter((product) => product.isActive)
                      .map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                        >
                          {product.name}
                          {product.size
                            ? ` - ${product.size}`
                            : ''}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Quantity
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={expiryDate}
                    onChange={(event) =>
                      setExpiryDate(event.target.value)
                    }
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowAddStockModal(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={savingStock}
                  >
                    {savingStock
                      ? 'Saving...'
                      : 'Add Stock'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {inventory.length === 0 && (
          <p className="inventory-empty">
            No inventory found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Inventory;