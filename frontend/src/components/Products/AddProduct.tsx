import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface LookupItem {
  id: number;
  name: string;
}

function AddProduct() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<LookupItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [productTypes, setProductTypes] = useState<LookupItem[]>([]);

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [productTypeId, setProductTypeId] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchFormOptions() {
      try {
        const [brandsResponse, categoriesResponse, productTypesResponse] =
          await Promise.all([
            api.get('/brands'),
            api.get('/categories'),
            api.get('/product-types'),
          ]);

        setBrands(brandsResponse.data);
        setCategories(categoriesResponse.data);
        setProductTypes(productTypesResponse.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load product options');
      }
    }

    fetchFormOptions();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      const productData = {
        name,
        size: size || undefined,
        costPrice: costPrice ? Number(costPrice) : undefined,
        sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
        brandId: brandId ? Number(brandId) : undefined,
        categoryId: Number(categoryId),
        productTypeId: Number(productTypeId),
        lowStockThreshold: Number(lowStockThreshold),
      };

      await api.post('/products', productData);

      navigate('/products');
    } catch (error) {
      console.error(error);
      setError('Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1>Add Product</h1>
        <p className="text-muted">
          Add a new product to your store catalog.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">
              Product Name
            </label>

            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Brand
            </label>

            <select
              className="form-select"
              value={brandId}
              onChange={(event) => setBrandId(event.target.value)}
            >
              <option value="">Select brand</option>

              {brands.map((brand) => (
                <option
                  key={brand.id}
                  value={brand.id}
                >
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Category
            </label>

            <select
              className="form-select"
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Product Type
            </label>

            <select
              className="form-select"
              value={productTypeId}
              onChange={(event) =>
                setProductTypeId(event.target.value)
              }
              required
            >
              <option value="">
                Select product type
              </option>

              {productTypes.map((productType) => (
                <option
                  key={productType.id}
                  value={productType.id}
                >
                  {productType.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Size
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="e.g. 50 ml"
              value={size}
              onChange={(event) => setSize(event.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Low Stock Threshold
            </label>

            <input
              type="number"
              className="form-control"
              min="0"
              value={lowStockThreshold}
              onChange={(event) =>
                setLowStockThreshold(event.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Cost Price
            </label>

            <input
              type="number"
              className="form-control"
              min="0"
              step="0.01"
              value={costPrice}
              onChange={(event) =>
                setCostPrice(event.target.value)
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Selling Price
            </label>

            <input
              type="number"
              className="form-control"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(event) =>
                setSellingPrice(event.target.value)
              }
            />
          </div>
        </div>

        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className="btn btn-success"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Add Product'}
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/products')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;