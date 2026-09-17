import { useEffect, useState } from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import api from '../../services/api';
import type { Sale } from '../../types/sale';
import './sales.css';

function SaleDetails() {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSale() {
      try {
        const response = await api.get(
          `/sales/${saleId}`,
        );

        setSale(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load sale');
      } finally {
        setLoading(false);
      }
    }

    fetchSale();
  }, [saleId]);

  if (loading) {
    return <p>Loading sale...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!sale) {
    return <p>Sale not found.</p>;
  }

  return (
    <div className="sale-details-page">
      <button
        className="btn btn-sm btn-outline-secondary mb-4"
        onClick={() => navigate('/sales')}
      >
        Back
      </button>

      <div className="mb-4">
        <h1>Sale #{sale.id}</h1>

        <p className="text-muted">
          {new Date(
            sale.createdAt,
          ).toLocaleString()}
        </p>
      </div>

      <div className="sale-summary-card mb-4">
        <p>Total Amount</p>

        <h3>
          {Number(sale.totalAmount).toFixed(2)} ALL
        </h3>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id}>
                <td>{item.product.name}</td>

                <td>{item.quantity}</td>

                <td>
                  {Number(item.unitPrice).toFixed(2)} ALL
                </td>

                <td>
                  {(
                    Number(item.unitPrice) *
                    item.quantity
                  ).toFixed(2)}{' '}
                  ALL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SaleDetails;