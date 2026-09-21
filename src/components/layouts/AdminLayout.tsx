import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = 'Restaurant Admin';
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
    { path: '/admin/menu',      label: 'Menu',      icon: BookOpen },
    { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
    { path: '/admin/feedback',  label: 'Feedback',  icon: MessageSquare },
    { path: '/admin/settings',  label: 'Settings',  icon: Settings },
  ];

  const currentLabel = navItems.find(item => item.path === location.pathname)?.label || 'Admin';

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Brand */}
      <div style={{
        padding: '1.75rem 1.5rem 1.25rem',
        borderBottom: '1px solid rgba(180,83,9,.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #b45309, #78350f)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(180,83,9,.3)',
          }}>
            <ShoppingBag size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '.95rem', color: '#111827', lineHeight: 1.2 }}>
              Restaurant Admin
            </p>
            <p style={{ fontSize: '.72rem', color: '#9ca3af', marginTop: 2 }}>Management Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem .75rem', overflowY: 'auto' }}>
        <p style={{
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em',
          color: '#9ca3af', textTransform: 'uppercase',
          padding: '.25rem .75rem .75rem',
        }}>Navigation</p>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNav}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem',
                padding: '.7rem .875rem',
                borderRadius: 10,
                marginBottom: 2,
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '.875rem',
                color: isActive ? '#b45309' : '#4b5563',
                background: isActive ? '#fffbeb' : 'transparent',
                transition: 'all .15s ease',
                position: 'relative',
              }}
            >
              <Icon size={17} style={{ flexShrink: 0, opacity: isActive ? 1 : .7 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={14} style={{ opacity: .5 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '.75rem', borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '.75rem',
            width: '100%', padding: '.7rem .875rem',
            borderRadius: 10, border: 'none', background: 'transparent',
            cursor: 'pointer', color: '#6b7280', fontSize: '.875rem',
            fontWeight: 500, transition: 'all .15s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2';
            (e.currentTarget as HTMLButtonElement).style.color = '#dc2626';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = '#6b7280';
          }}
        >
          <LogOut size={17} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #f3f4f6',
        display: 'flex', flexDirection: 'column',
        boxShadow: '1px 0 0 #f3f4f6',
      }} className="hidden md:flex md:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
          className="md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 240,
          background: '#fff',
          borderRight: '1px solid #f3f4f6',
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        }}
        className="md:hidden"
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '.875rem 1rem',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, border: 'none', background: '#f3f4f6',
              cursor: 'pointer', color: '#6b7280',
            }}
          >
            <X size={16} />
          </button>
        </div>
        <SidebarContent onNav={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          background: '#fff',
          borderBottom: '1px solid #f3f4f6',
          padding: '0 1.25rem',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.875rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fff', cursor: 'pointer', color: '#374151',
              }}
            >
              <Menu size={18} />
            </button>
            <div className="hidden md:block">
              <h2 style={{
                fontSize: '1rem', fontWeight: 600,
                color: '#111827', margin: 0,
              }}>{currentLabel}</h2>
            </div>
          </div>
          <div style={{
            fontSize: '.8rem', color: '#9ca3af', fontWeight: 500,
          }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1, overflow: 'auto',
          padding: '1.5rem',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
