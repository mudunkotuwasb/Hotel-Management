import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const userRole = user?.role || 'admin';

  const getPageTitle = (pathname: string) => {
    const titles: { [key: string]: string } = {
      '/': 'Dashboard',
      '/rooms': 'Room Management',
      '/bookings': 'Bookings & Reservations',
      '/housekeeping': 'Housekeeping',
      '/dining': 'Dining & Menu',
      '/inventory': 'Inventory Management',
      '/billing': 'Billing',
      '/reports': 'Reports & Analytics',
      '/settings': 'Settings'
    };
    return titles[pathname] || 'Hotel Management';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={getPageTitle(location.pathname)}
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
