// One shared page layout component that can be used across the application to provide a consistent layout structure.
//  It includes a sidebar and a main content area where child components can be rendered.

import type { ReactNode } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import './layout.css';

// define what data layout component will receive as props
interface LayoutProps {
  children: ReactNode;
}

// create layout component
function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;