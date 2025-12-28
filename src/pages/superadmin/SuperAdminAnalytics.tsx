import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function SuperAdminAnalytics() {
  const { restaurants } = useSuperAdmin();

  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.filter(r => r.isActive).length;
  const averageRating =
    restaurants.filter(r => r.rating).length > 0
      ? (
          restaurants.reduce((sum, r) => sum + (r.rating || 0), 0) /
          restaurants.filter(r => r.rating).length
        ).toFixed(1)
      : '0.0';

  const revenueEstimate = {
    trial: 0,
    basic: restaurants.filter(r => r.subscription === 'basic').length * 999,
    premium: restaurants.filter(r => r.subscription === 'premium').length * 2999,
  };

  const totalRevenue = revenueEstimate.trial + revenueEstimate.basic + revenueEstimate.premium;

  const stats = [
    {
      label: 'Monthly Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      change: '+12.5%',
    },
    {
      label: 'Active Restaurants',
      value: activeRestaurants,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      change: '+8.2%',
    },
    {
      label: 'Average Rating',
      value: averageRating,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      change: '+0.3',
    },
    {
      label: 'Total Restaurants',
      value: totalRestaurants,
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
      change: '+5',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Performance metrics across all restaurants</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-green-600 text-sm">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900 text-2xl">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Revenue Breakdown by Plan</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-900">Trial Plan</p>
              <p className="text-gray-600 text-sm">
                {restaurants.filter(r => r.subscription === 'trial').length} restaurants
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-900">₹0</p>
              <p className="text-gray-500 text-sm">Free</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-blue-900">Basic Plan</p>
              <p className="text-blue-700 text-sm">
                {restaurants.filter(r => r.subscription === 'basic').length} restaurants
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-900">₹{revenueEstimate.basic.toLocaleString()}</p>
              <p className="text-blue-600 text-sm">₹999/month each</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="text-purple-900">Premium Plan</p>
              <p className="text-purple-700 text-sm">
                {restaurants.filter(r => r.subscription === 'premium').length} restaurants
              </p>
            </div>
            <div className="text-right">
              <p className="text-purple-900">₹{revenueEstimate.premium.toLocaleString()}</p>
              <p className="text-purple-600 text-sm">₹2,999/month each</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-green-900">Total Monthly Revenue</p>
            <p className="text-green-900 text-xl">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Restaurant Growth */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Restaurant Growth</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Restaurants</span>
            <span className="text-gray-900">{totalRestaurants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Active Restaurants</span>
            <span className="text-green-600">{activeRestaurants}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Inactive Restaurants</span>
            <span className="text-red-600">{totalRestaurants - activeRestaurants}</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-gray-900">Active Rate</span>
            <span className="text-purple-600">
              {totalRestaurants > 0
                ? ((activeRestaurants / totalRestaurants) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
