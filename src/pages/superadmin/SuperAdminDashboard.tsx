import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Store, Users, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const { restaurants } = useSuperAdmin();

  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter(r => r.isActive).length;
  const inactiveRestaurants = restaurants.filter(r => !r.isActive).length;
  
  const subscriptionCounts = {
    trial: restaurants.filter(r => r.subscription === 'trial').length,
    basic: restaurants.filter(r => r.subscription === 'basic').length,
    premium: restaurants.filter(r => r.subscription === 'premium').length,
  };

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
      label: 'Premium Plans',
      value: subscriptionCounts.premium,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      link: '/superadmin/restaurants',
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

      {/* Subscription Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Trial</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {subscriptionCounts.trial}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400"
                style={{
                  width: `${(subscriptionCounts.trial / totalRestaurants) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-900">Basic</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {subscriptionCounts.basic}
              </span>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${(subscriptionCounts.basic / totalRestaurants) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-900">Premium</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {subscriptionCounts.premium}
              </span>
            </div>
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{
                  width: `${(subscriptionCounts.premium / totalRestaurants) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          restaurant.subscription === 'premium'
                            ? 'bg-purple-100 text-purple-700'
                            : restaurant.subscription === 'basic'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {restaurant.subscription}
                      </span>
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
