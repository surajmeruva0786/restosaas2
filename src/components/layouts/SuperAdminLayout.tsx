import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import {
  LayoutDashboard,
  Store,
  Settings,
  LogOut,
  X,
  Menu,
  DollarSign,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

// Single accent — same brand color as admin and customer
const ACCENT = '#b45309';
const ACCENT_BG = '#fffbeb';

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { superAdminLogout } = useSuperAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = 'Restosas — Super Admin';
  }, []);

  const handleLogout = () => {
    superAdminLogout();
    navigate('/superadmin/login');
  };

  const navItems = [
    { path: '/superadmin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
    { path: '/superadmin/restaurants', label: 'Restaurants', icon: Store },
    { path: '/superadmin/payments',    label: 'Payments',    icon: DollarSign },
    { path: '/superadmin/settings',    label: 'Settings',    icon: Settings },
  ];

  const currentLabel = navItems.find(item => item.path === location.pathname)?.label || 'Super Admin';

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      {/* Brand */}
      <div style={{
        padding: '1.75rem 1.5rem 1.25rem',
        borderBottom: '1px solid #f3f4f6',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            width: 36, height: 36,
            background: `linear-gradient(135deg, ${ACCENT}, #78350f)`,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 4px 12px rgba(180,83,9,.25)`,
          }}>
            <ShieldCheck size={18} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '.95rem', color: '#111827', lineHeight: 1.2 }}>
              Super Admin
            </p>
            <p style={{ fontSize: '.72rem', color: '#9ca3af', marginTop: 2 }}>
              Platform Control
            </p>
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
                color: isActive ? ACCENT : '#4b5563',
                background: isActive ? ACCENT_BG : 'transparent',
                transition: 'all .15s ease',
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
            (e.currentTarget as HTMLButtonElement).style.color = '#991b1b';
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

      {/* Main */}
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
              <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {currentLabel}
              </h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <ShieldCheck size={14} color={ACCENT} />
            <span style={{ fontSize: '.8rem', color: '#9ca3af', fontWeight: 500 }}>
              Super Administrator
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}