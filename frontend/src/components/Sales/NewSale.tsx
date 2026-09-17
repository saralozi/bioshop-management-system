import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import api from '../../services/api';
import type { Product } from '../../types/product';
import './Sales.css';

interface NewSaleItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

function NewSale() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [saleItems, setSaleItems] = useState<NewSaleItem[]>([]);

  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingSale, setSavingSale] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products');

        setProducts(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  function handleAddItem() {
    setError('');

    const selectedProduct = products.find(
      (product) => product.id === Number(productId),
    );

    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    const selectedQuantity = Number(quantity);

    if (selectedQuantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (selectedProduct.sellingPrice === null) {
      setError('This product does not have a selling price');
      return;
    }

    const alreadyAdded = saleItems.find(
      (item) => item.productId === selectedProduct.id,
    );

    if (alreadyAdded) {
      setError('This product is already in the sale');
      return;
    }

    const newItem: NewSaleItem = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      quantity: selectedQuantity,
      unitPrice: Number(selectedProduct.sellingPrice),
    };

    setSaleItems((currentItems) => [
      ...currentItems,
      newItem,
    ]);

    setProductId('');
    setQuantity('1');
  }

  function handleRemoveItem(productId: number) {
    setSaleItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId,
      ),
    );
  }

  async function handleSubmitSale() {
    if (saleItems.length === 0) {
      setError('Add at least one product to the sale');
      return;
    }

    try {
      setSavingSale(true);
      setError('');

      const response = await api.post('/sales', {
        items: saleItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      navigate(`/sales/${response.data.id}`);
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;

        if (backendMessage) {
          setError(
            Array.isArray(backendMessage)
              ? backendMessage.join(', ')
              : backendMessage,
          );
        } else {
          setError('Failed to complete sale');
        }
      } else {
        setError('Failed to complete sale');
      }
    } finally {
      setSavingSale(false);
    }
  }

  let totalAmount = 0;

  for (const item of saleItems) {
    totalAmount += item.unitPrice * item.quantity;
  }

  if (loadingProducts) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="new-sale-page">
      <button
        className="btn btn-sm btn-outline-secondary mb-4"
        onClick={() => navigate('/sales')}
      >
        Back
      </button>

      <div className="mb-4">
        <h1>New Sale</h1>
        <p className="text-muted">
          Add products and complete a new sale.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="new-sale-product-section mb-5">
        <h2 className="mb-3">Add Product</h2>

        <div className="row g-3 align-items-end">
          <div className="col-md-7">
            <label className="form-label">
              Product
            </label>

            <select
              className="form-select"
              value={productId}
              onChange={(event) =>
                setProductId(event.target.value)
              }
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
                    {product.sellingPrice
                      ? ` - ${Number(
                        product.sellingPrice,
                      ).toFixed(2)} ALL`
                      : ''}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-3">
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
            />
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-success w-100"
              onClick={handleAddItem}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="mb-3">Sale Items</h2>

        <div className="sales-table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {saleItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.name}</td>

                  <td>{item.quantity}</td>

                  <td>
                    {item.unitPrice.toFixed(2)} ALL
                  </td>

                  <td>
                    {(
                      item.unitPrice *
                      item.quantity
                    ).toFixed(2)}{' '}
                    ALL
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleRemoveItem(
                          item.productId,
                        )
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {saleItems.length === 0 && (
            <p className="sales-empty">
              No products added yet.
            </p>
          )}
        </div>
      </div>

      <div className="new-sale-footer">
        <div>
          <span className="text-muted">
            Total
          </span>

          <h2>
            {totalAmount.toFixed(2)} ALL
          </h2>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/sales')}
          >
            Cancel
          </button>

          <button
            className="btn btn-success"
            onClick={handleSubmitSale}
            disabled={
              savingSale ||
              saleItems.length === 0
            }
          >
            {savingSale
              ? 'Completing...'
              : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewSale;