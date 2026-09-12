export interface DashboardData {
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    expiringSoonProducts: number;
    todaySales: number | string;
}