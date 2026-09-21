import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { ShoppingBag, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentNotificationBanner from '../../components/PaymentNotificationBanner';

export default function AdminDashboard() {
  const { orders, reservations, feedbacks, settings } = useData();
  const { restaurantId } = useAuth();
  const { restaurants } = useSuperAdmin();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => order.createdAt.split('T')[0] === today);
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingReservations = reservations.filter(r => r.status === 'pending').length;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      sub: `${newOrders} new`,
      icon: ShoppingBag,
      iconBg: '#fffbeb', iconColor: '#b45309',
      link: '/admin/orders',
    },
    {
      label: 'Reservations',
      value: reservations.length,
      sub: `${pendingReservations} pending`,
      icon: Calendar,
      iconBg: '#fffbeb', iconColor: '#b45309',
      link: '/admin/reservations',
    },
    {
      label: 'Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      sub: `${todayOrders.length} orders today`,
      icon: TrendingUp,
      iconBg: '#fffbeb', iconColor: '#b45309',
      link: '/admin/orders',
    },
    {
      label: 'Avg Rating',
      value: avgRating,
      sub: `${feedbacks.length} reviews`,
      icon: Star,
      iconBg: '#fffbeb', iconColor: '#b45309',
      link: '/admin/feedback',
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentFeedbacks = feedbacks.slice(0, 4);

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    new:       { label: 'New',       bg: '#fffbeb', color: '#b45309' },
    accepted:  { label: 'Accepted',  bg: '#f0fdfa', color: '#0d9488' },
    preparing: { label: 'Preparing', bg: '#eff6ff', color: '#2563eb' },
    completed: { label: 'Completed', bg: '#f0fdf4', color: '#16a34a' },
    rejected:  { label: 'Rejected',  bg: '#fef2f2', color: '#dc2626' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Payment Notifications (from super admin) */}
      <PaymentNotificationBanner />

      {/* Persistent Payment Status */}
      {(() => {
        const restaurantData = restaurants.find(r => r.id === restaurantId);
        if (!restaurantData) return null;
        const isPaid = restaurantData.dueAmount === 0;
        return (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '.875rem',
            padding: '1rem 1.25rem',
            borderRadius: 12,
            background: isPaid ? '#f0fdf4' : '#fff7ed',
            border: `1px solid ${isPaid ? '#bbf7d0' : '#fed7aa'}`,
          }}>
            {isPaid
              ? <CheckCircle size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
              : <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
            }
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '.875rem', color: isPaid ? '#15803d' : '#92400e' }}>
                {isPaid ? 'Account is up to date' : 'Payment Due'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '.8rem', color: isPaid ? '#166534' : '#9a3412' }}>
                {isPaid
                  ? 'All payments have been received. Thank you!'
                  : restaurantData.subscription === 'trial'
                  ? 'One-time setup fee of ₹1,500 is pending. Please contact your account manager.'
                  : 'Monthly fee of ₹1,000 is pending. Please contact your account manager.'}
              </p>
            </div>
          </div>
        );
      })()}

      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#111827', margin: 0 }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '.875rem', margin: '4px 0 0' }}>
          Here's an overview of {settings.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              style={{
                background: '#fff',
                border: '1px solid #f3f4f6',
                borderRadius: 16,
                padding: '1.25rem 1.5rem',
                textDecoration: 'none',
                display: 'block',
                transition: 'box-shadow .15s, transform .15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,.08)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: 40, height: 40,
                  background: stat.iconBg,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={stat.iconColor} />
                </div>
                <ArrowRight size={14} color="#d1d5db" />
              </div>
              <p style={{ margin: '0 0 .25rem', fontSize: '.8rem', color: '#9ca3af', fontWeight: 500 }}>
                {stat.label}
              </p>
              <p style={{ margin: '0 0 .25rem', fontSize: '1.75rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>
                {stat.value}
              </p>
              <p style={{ margin: 0, fontSize: '.75rem', color: '#9ca3af' }}>{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            padding: '1.125rem 1.5rem',
            borderBottom: '1px solid #f9fafb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{
              display: 'flex', alignItems: 'center', gap: '.25rem',
              fontSize: '.8rem', color: '#b45309', textDecoration: 'none', fontWeight: 500,
            }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            {recentOrders.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '.875rem' }}>
                No orders yet
              </div>
            ) : (
              recentOrders.map((order, idx) => {
                const sc = statusConfig[order.status] || statusConfig.new;
                return (
                  <div key={order.id} style={{
                    padding: '.875rem 1.5rem',
                    borderBottom: idx < recentOrders.length - 1 ? '1px solid #f9fafb' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '.875rem', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.customerName}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '.75rem', color: '#9ca3af' }}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · ₹{order.total.toLocaleString()}
                      </p>
                    </div>
                    <span style={{
                      padding: '.25rem .625rem',
                      borderRadius: 999,
                      fontSize: '.72rem',
                      fontWeight: 600,
                      background: sc.bg,
                      color: sc.color,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {sc.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{
            padding: '1.125rem 1.5rem',
            borderBottom: '1px solid #f9fafb',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Recent Feedback</h2>
            <Link to="/admin/feedback" style={{
              display: 'flex', alignItems: 'center', gap: '.25rem',
              fontSize: '.8rem', color: '#b45309', textDecoration: 'none', fontWeight: 500,
            }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            {recentFeedbacks.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '.875rem' }}>
                No feedback yet
              </div>
            ) : (
              recentFeedbacks.map((feedback, idx) => (
                <div key={feedback.id} style={{
                  padding: '.875rem 1.5rem',
                  borderBottom: idx < recentFeedbacks.length - 1 ? '1px solid #f9fafb' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.375rem' }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '.875rem', color: '#111827' }}>
                      {feedback.customerName || 'Anonymous'}
                    </p>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star
                          key={i}
                          size={12}
                          style={{
                            fill: i <= feedback.rating ? '#f59e0b' : 'none',
                            color: i <= feedback.rating ? '#f59e0b' : '#d1d5db',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{
                    margin: 0, fontSize: '.8rem', color: '#6b7280', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {feedback.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}