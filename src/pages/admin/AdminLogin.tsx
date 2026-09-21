import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, User, Store, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    restaurantId: 'demo-restaurant',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(formData.username, formData.password, formData.restaurantId);
    setLoading(false);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please check your restaurant ID, username, and password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#f9fafb',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Left panel — branding */}
      <div style={{
        display: 'none',
        flex: '0 0 420px',
        background: 'linear-gradient(160deg, #1c0a00 0%, #7c2d12 60%, #b45309 100%)',
        padding: '3rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }} className="lg:flex lg:flex-col">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #b45309, #78350f)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,.2)',
          }}>
            <Store size={20} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
            Restosas
          </span>
        </div>

        <div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '1rem',
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            Manage your restaurant with confidence
          </h1>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1rem', lineHeight: 1.7 }}>
            Orders, reservations, menu, and feedback — all in one place.
          </p>
        </div>

        <p style={{ color: 'rgba(255,255,255,.35)', fontSize: '.8rem' }}>
          © {new Date().getFullYear()} Restosas. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile brand */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '.625rem', marginBottom: '2.5rem',
          }} className="lg:hidden">
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #b45309, #78350f)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(180,83,9,.3)',
            }}>
              <Store size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
              Restosas Admin
            </span>
          </div>

          <h2 style={{
            fontSize: '1.625rem', fontWeight: 700,
            color: '#111827', marginBottom: '.375rem',
          }}>Sign in</h2>
          <p style={{ color: '#6b7280', fontSize: '.9rem', marginBottom: '2rem' }}>
            Enter your credentials to access the dashboard
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Restaurant ID */}
            <div>
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#374151', marginBottom: '.375rem' }}>
                Restaurant ID
              </label>
              <div style={{ position: 'relative' }}>
                <Store size={15} color="#9ca3af" style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                }} />
                <input
                  type="text"
                  required
                  value={formData.restaurantId}
                  onChange={e => setFormData({ ...formData, restaurantId: e.target.value })}
                  placeholder="your-restaurant-id"
                  style={{
                    width: '100%', padding: '.75rem .875rem .75rem 2.25rem',
                    border: '1px solid #e5e7eb', borderRadius: 10,
                    fontSize: '.9rem', color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                    background: '#fff', transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#b45309'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#374151', marginBottom: '.375rem' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="#9ca3af" style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                }} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  style={{
                    width: '100%', padding: '.75rem .875rem .75rem 2.25rem',
                    border: '1px solid #e5e7eb', borderRadius: 10,
                    fontSize: '.9rem', color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                    background: '#fff', transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#b45309'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#374151', marginBottom: '.375rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#9ca3af" style={{
                  position: 'absolute', left: 12, top: '50%',
                  transform: 'translateY(-50%)',
                }} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  style={{
                    width: '100%', padding: '.75rem .875rem .75rem 2.25rem',
                    border: '1px solid #e5e7eb', borderRadius: 10,
                    fontSize: '.9rem', color: '#111827',
                    outline: 'none', boxSizing: 'border-box',
                    background: '#fff', transition: 'border-color .15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#b45309'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 10,
                fontSize: '.85rem', color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
                padding: '.875rem',
                background: loading ? '#b45309' : 'linear-gradient(135deg, #b45309, #78350f)',
                color: '#fff', border: 'none', borderRadius: 10,
                fontSize: '.9rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(180,83,9,.35)',
                transition: 'opacity .15s',
                opacity: loading ? .8 : 1,
              }}
            >
              {loading ? 'Signing in…' : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
