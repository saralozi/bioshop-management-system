import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Sale } from '../../types/sale';
import './sales.css';

function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await api.get('/sales');
        setSales(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch sales');
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  if (loading) {
    return <p>Loading sales...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="sales-page">
      <div className="sales-header">
        <div>
          <h1>Sales</h1>
          <p>View your store sales history.</p>
        </div>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>#{sale.id}</td>

                <td>
                  {new Date(sale.createdAt).toLocaleString()}
                </td>

                <td>{sale.items.length}</td>

                <td>{sale.totalAmount} ALL</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sales.length === 0 && (
          <p className="sales-empty">No sales found.</p>
        )}
      </div>
    </div>
  );
}

export default Sales;