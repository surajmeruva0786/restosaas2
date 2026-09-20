import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Store, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const { restaurants } = useSuperAdmin();

  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter(r => r.isActive).length;
  const inactiveRestaurants = restaurants.filter(r => !r.isActive).length;
  const paymentDueCount = restaurants.filter(r => r.dueAmount > 0).length;

  const stats = [
    {
      label: 'Total Restaurants',
      value: totalRestaurants,
      icon: Store,
      color: 'bg-blue-50 text-blue-600',
      link: '/superadmin/restaurants',
    },
    {
      label: 'Active',
      value: activeRestaurants,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      link: '/superadmin/restaurants',
    },
    {
      label: 'Inactive',
      value: inactiveRestaurants,
      icon: XCircle,
      color: 'bg-red-50 text-red-600',
      link: '/superadmin/restaurants',
    },
    {
      label: 'Payment Due',
      value: paymentDueCount,
      icon: AlertCircle,
      color: 'bg-orange-50 text-orange-600',
      link: '/superadmin/payments',
    },
  ];

  const recentRestaurants = [...restaurants]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Manage all restaurants from one place</p>
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

      {/* Recent Restaurants */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-gray-900">Recently Added Restaurants</h2>
          <Link
            to="/superadmin/restaurants"
            className="text-purple-600 hover:text-purple-700 text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentRestaurants.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No restaurants yet</div>
          ) : (
            recentRestaurants.map(restaurant => (
              <div key={restaurant.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{restaurant.name}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          restaurant.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {restaurant.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {restaurant.dueAmount > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                          Payment Due
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{restaurant.address}</p>
                    <p className="text-gray-500 text-sm">
                      {restaurant.cuisine.join(', ')} • {restaurant.phone}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
