import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-soft border-b border-navy-100 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-navy-50 mr-4 transition-colors"
          >
            <Menu className="h-5 w-5 text-navy-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
            <p className="text-sm text-navy-500 mt-1">Welcome back, {user?.name || 'User'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-3 rounded-xl hover:bg-navy-50 transition-colors group">
            <Bell className="h-5 w-5 text-navy-600 group-hover:text-primary-600" />
            <span className="notification-dot"></span>
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3 bg-navy-50 rounded-xl p-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-navy-900">{user?.name || 'User'}</p>
              <p className="text-xs text-navy-500">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4 text-navy-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
