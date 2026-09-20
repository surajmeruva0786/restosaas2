import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { ShoppingBag, Calendar, MessageSquare, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PaymentNotificationBanner from '../../components/PaymentNotificationBanner';

export default function AdminDashboard() {
  const { orders, reservations, feedbacks, settings, loading } = useData();
  const { restaurantId } = useAuth();
  const { restaurants } = useSuperAdmin();

  // Debug logging
  console.log('AdminDashboard - Loading:', loading);
  console.log('AdminDashboard - Orders:', orders.length, orders);
  console.log('AdminDashboard - Reservations:', reservations.length, reservations);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(
    order => order.createdAt.split('T')[0] === today
  );
  // Only count completed orders towards revenue
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      color: 'bg-orange-50 text-orange-600',
      link: '/admin/orders',
    },
    {
      label: 'Total Reservations',
      value: reservations.length,
      icon: Calendar,
      color: 'bg-green-50 text-green-600',
      link: '/admin/reservations',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/orders',
    },
    {
      label: 'Total Feedback',
      value: feedbacks.length,
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/feedback',
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentFeedbacks = feedbacks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Payment Notifications (from super admin) */}
      <PaymentNotificationBanner />

      {/* Persistent Payment Status */}
      {(() => {
        const restaurantData = restaurants.find(r => r.id === restaurantId);
        if (!restaurantData) return null;
        const isPaid = restaurantData.dueAmount === 0;
        return (
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-lg border ${
              isPaid
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            {isPaid ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold text-sm ${isPaid ? 'text-green-800' : 'text-orange-800'}`}>
                {isPaid ? 'Payment Status: Paid' : 'Payment Status: Due'}
              </p>
              <p className={`text-xs mt-0.5 ${isPaid ? 'text-green-700' : 'text-orange-700'}`}>
                {isPaid
                  ? 'Your account is up to date.'
                  : 'Your account has a pending payment. Please contact your account manager.'}
              </p>
            </div>
          </div>
        );
      })()}

      <div>
        <h1 className="text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with {settings.name} today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900 text-2xl">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-900">{order.customerName}</p>
                      <p className="text-gray-600 text-sm">
                        {order.items.length} items • ₹{order.total}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        order.status === 'new'
                          ? 'bg-orange-100 text-orange-700'
                          : order.status === 'accepted'
                            ? 'bg-teal-100 text-teal-700'
                            : order.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : order.status === 'preparing'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Recent Feedback</h2>
            <Link to="/admin/feedback" className="text-orange-600 hover:text-orange-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentFeedbacks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No feedback yet</div>
            ) : (
              recentFeedbacks.map(feedback => (
                <div key={feedback.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < feedback.rating ? 'text-orange-400' : 'text-gray-300'
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {feedback.customerName && (
                          <span className="text-gray-700 text-sm">{feedback.customerName}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{feedback.comment}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {new Date(feedback.createdAt).toLocaleString()}
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