import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Users, 
  Utensils, 
  Package, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  User,
  Navigation
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
}

const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard, 
    roles: ['admin', 'receptionist', 'housekeeping', 'kitchen'],
    badge: null
  },
  { 
    name: 'Rooms', 
    href: '/rooms', 
    icon: Bed, 
    roles: ['admin', 'receptionist', 'housekeeping'],
    badge: null
  },
  { 
    name: 'Bookings', 
    href: '/bookings', 
    icon: Calendar, 
    roles: ['admin', 'receptionist'],
    badge: '3'
  },
  { 
    name: 'Dining', 
    href: '/dining', 
    icon: Utensils, 
    roles: ['admin', 'kitchen', 'receptionist'],
    badge: '5'
  },
  { 
    name: 'Trip Packages', 
    href: '/trip-packages', 
    icon: Navigation, 
    roles: ['admin', 'receptionist'],
    badge: null
  },
  { 
    name: 'Inventory', 
    href: '/inventory', 
    icon: Package, 
    roles: ['admin', 'kitchen'],
    badge: '1'
  },
  { 
    name: 'Billing', 
    href: '/billing', 
    icon: FileText, 
    roles: ['admin', 'receptionist'],
    badge: null
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3, 
    roles: ['admin'],
    badge: null
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings, 
    roles: ['admin'],
    badge: null
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, userRole }) => {
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white shadow-large transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:flex-shrink-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Bed className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-navy-900">Grand Hotel</h1>
              <p className="text-xs text-navy-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-navy-50 transition-colors"
          >
            <X className="h-5 w-5 text-navy-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => `
                    sidebar-item group relative
                    ${isActive ? 'sidebar-item-active' : 'text-navy-600'}
                  `}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-navy-100 bg-navy-50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900 capitalize truncate">
                {userRole}
              </p>
              <p className="text-xs text-navy-500 truncate">Hotel Staff</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-navy-100 transition-colors">
              <LogOut className="h-4 w-4 text-navy-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
