import { useEffect, useState } from 'react';
import api from '../../services/api';
import type { Product } from '../../types/product';
import './products.css';
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [statusFilter, setStatusFilter] =
        useState<'all' | 'active' | 'inactive'>('all');

    const navigate = useNavigate();

    async function handleStatusToggle(product: Product) {
        try {
            const newStatus = !product.isActive;

            await api.patch(
                `/products/${product.id}/status`,
                {
                    isActive: newStatus,
                },
            );

            setProducts((currentProducts) =>
                currentProducts.map((currentProduct) =>
                    currentProduct.id === product.id
                        ? {
                            ...currentProduct,
                            isActive: newStatus,
                        }
                        : currentProduct,
                ),
            );
        } catch (error) {
            console.error(error);
            setError('Failed to update product status');
        }
    }

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


    const filteredProducts = products.filter((product) => {
        if (statusFilter === 'active') {
            return product.isActive;
        }

        if (statusFilter === 'inactive') {
            return !product.isActive;
        }

        return true;
    });

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

                <button className="btn btn-success" onClick={() => navigate("/products/add")}>Add Product</button>
            </div>

            <div className="d-flex gap-2 mb-3">
                <button
                    className={`btn btn-sm ${statusFilter === 'all'
                        ? 'btn-dark'
                        : 'btn-outline-secondary'
                        }`}
                    onClick={() => setStatusFilter('all')}
                >
                    All
                </button>

                <button
                    className={`btn btn-sm ${statusFilter === 'active'
                        ? 'btn-dark'
                        : 'btn-outline-secondary'
                        }`}
                    onClick={() => setStatusFilter('active')}
                >
                    Active
                </button>

                <button
                    className={`btn btn-sm ${statusFilter === 'inactive'
                        ? 'btn-dark'
                        : 'btn-outline-secondary'
                        }`}
                    onClick={() => setStatusFilter('inactive')}
                >
                    Inactive
                </button>
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
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr
                                key={product.id}
                                className={!product.isActive ? 'product-inactive' : ''}
                            >
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

                                <td>
                                    <span
                                        className={
                                            product.isActive
                                                ? 'badge text-bg-success'
                                                : 'badge text-bg-secondary'
                                        }
                                    >
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>

                                <td>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() =>
                                                navigate(`/products/${product.id}/edit`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className={
                                                product.isActive
                                                    ? 'btn btn-sm btn-outline-danger'
                                                    : 'btn btn-sm btn-outline-success'
                                            }
                                            onClick={() => handleStatusToggle(product)}
                                        >
                                            {product.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </div>
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