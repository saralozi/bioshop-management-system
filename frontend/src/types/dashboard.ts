export interface DashboardData {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    expiringSoon: number;
    todaySales: number | string;
}