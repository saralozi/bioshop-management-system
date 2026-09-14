import { NavLink } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>BioShop</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Sales
        </NavLink>

        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          Inventory
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;