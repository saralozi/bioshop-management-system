import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Product } from '../../types/product';
import './products.css';
import {useNavigate} from "react-router-dom";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <p>Loading products...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="products-page">
            <div className="products-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage and view your store products.</p>
                </div>

                <button className="btn btn-success"onClick={()=> navigate("/products/add")}>Add Product</button>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Cost Price</th>
                            <th>Selling Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.brand?.name ?? '-'}</td>
                                <td>{product.category.name}</td>
                                <td>{product.productType.name}</td>
                                <td>{product.size ?? '-'}</td>
                                <td>
                                    {product.costPrice
                                        ? `${product.costPrice} ALL`
                                        : '-'}
                                </td>
                                <td>
                                    {product.sellingPrice
                                        ? `${product.sellingPrice} ALL`
                                        : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <p className="products-empty">No products found.</p>
                )}
            </div>
        </div>
    );
}

export default Products;