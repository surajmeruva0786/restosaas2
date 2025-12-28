import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Settings,
  LogOut,
  X,
  Menu,
  Crown,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { superAdminLogout } = useSuperAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    superAdminLogout();
    navigate('/superadmin/login');
  };

  const navItems = [
    { path: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/superadmin/restaurants', label: 'Restaurants', icon: Store },
    { path: '/superadmin/payments', label: 'Payments', icon: DollarSign },
    { path: '/superadmin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/superadmin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white">
        <div className="p-6 border-b border-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 text-yellow-300" />
            <h1 className="text-white">Super Admin</h1>
          </div>
          <p className="text-purple-200 text-sm">Master Control Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'text-purple-100 hover:bg-purple-500/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-purple-100 hover:bg-purple-500/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white z-50 transform transition-transform md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-purple-500">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-300" />
            <h1 className="text-white">Super Admin</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-purple-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'text-purple-100 hover:bg-purple-500/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-purple-100 hover:bg-purple-500/50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-gray-900 md:block hidden">
              {navItems.find(item => item.path === location.pathname)?.label || 'Super Admin'}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">Super Administrator</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}