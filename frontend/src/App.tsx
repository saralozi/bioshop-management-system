import './App.css'
import Dashboard from './components/Dashboard/Dashboard.js'
import Layout from './components/Layout/Layout.js'
import Products from './components/Products/Products.js'
import Inventory from './components/Inventory/Inventory.js'
import Sales from './components/Sales/Sales.js'
import AddProduct from './components/Products/AddProduct.js'
import EditProduct from './components/Products/EditProduct.js'
import InventoryDetails from './components/Inventory/InventoryDetails.js'
import SaleDetails from './components/Sales/SaleDetails.js'
import NewSale from './components/Sales/NewSale.js'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/products/:productId/edit"
            element={<EditProduct />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/inventory/product/:productId"
            element={<InventoryDetails />}
          />

          <Route
            path="/sales"
            element={<Sales />}
          />

          <Route
            path="/sales/:saleId"
            element={<SaleDetails />}
          />

          <Route
            path='/sales/new'
            element={<NewSale/>}/>
        </Routes>


      </Layout>
    </BrowserRouter>
  )
}

export default App
