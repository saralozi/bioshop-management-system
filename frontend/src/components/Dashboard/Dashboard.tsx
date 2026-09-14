import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { DashboardData } from '../../types/dashboard';
import './dashboard.css';

function Dashboard() {
    console.log('Dashboard component rendered');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await api.get('/dashboard');
                console.log(response.data);

                setDashboardData(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch dashboard data');
            }
            finally {
                setLoading(false)
            }
        }
        fetchDashboardData();
    }, []);

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    if (!dashboardData) {
        return <p>No data available</p>
    }

    const { totalProducts, lowStockProducts,
        outOfStockProducts, expiringSoon,
        todaySales } = dashboardData;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Here's what's happening with your store today.</p>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card card-products">
                    <p className="card-label">Total Products</p>
                    <h2>{totalProducts}</h2>
                </div>

                <div className="dashboard-card card-low-stock">
                    <p className="card-label">Low Stock</p>
                    <h2>{lowStockProducts}</h2>
                </div>

                <div className="dashboard-card card-out-stock">
                    <p className="card-label">Out of Stock</p>
                    <h2>{outOfStockProducts}</h2>
                </div>

                <div className="dashboard-card card-expiring">
                    <p className="card-label">Expiring Soon</p>
                    <h2>{expiringSoon}</h2>
                </div>

                <div className="dashboard-card card-sales">
                    <p className="card-label">Today's Sales</p>
                    <h2>{todaySales} ALL</h2>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;