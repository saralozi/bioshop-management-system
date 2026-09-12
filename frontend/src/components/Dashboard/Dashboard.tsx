import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { DashboardData } from '../../types/dashboard';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await api.get('/dashboard');
                setDashboardData(response.data);
            } catch (errror) {
                console.error(error);
                setError('Failed to fetch dashboard data');
            } finally {
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
        outOfStockProducts, expiringSoonProducts,
        todaySales } = dashboardData;

    return (
        <div>
            <h1>Dashboard</h1>

            <div>
                <p>Total Products: {totalProducts}</p>
                <p>Low stock products: {lowStockProducts}</p>
                <p>Out of stock products: {outOfStockProducts}</p>
                <p>Expiring soon products: {expiringSoonProducts}</p>
                <p>Today's sales: {todaySales}</p>
            </div>
        </div>
    )
}

export default Dashboard;