import { useState } from 'react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Send, AlertCircle, CheckCircle, Search } from 'lucide-react';
import PaymentNotificationModal from '../../components/PaymentNotificationModal';

export default function PaymentManagement() {
  const { restaurants, notifications, updateRestaurant } = useSuperAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'due' | 'paid'>('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const restaurantsWithStatus = restaurants.map(restaurant => {
    const isPaid = restaurant.dueAmount === 0;
    const pendingNotifications = notifications.filter(
      n => n.restaurantId === restaurant.id && n.status === 'pending'
    ).length;
    return { ...restaurant, isPaid, pendingNotifications };
  });

  const filteredRestaurants = restaurantsWithStatus.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'due' && !restaurant.isPaid) ||
      (filterStatus === 'paid' && restaurant.isPaid);

    return matchesSearch && matchesFilter;
  });

  const handleSendNotification = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    setShowNotificationModal(true);
  };

  const handleTogglePaid = (restaurantId: string, currentlyPaid: boolean) => {
    if (currentlyPaid) {
      // Mark as due (set a nominal due flag)
      updateRestaurant(restaurantId, { dueAmount: 1 });
    } else {
      // Mark as paid
      updateRestaurant(restaurantId, {
        dueAmount: 0,
        lastPaymentDate: new Date().toISOString(),
      });
    }
  };

  const dueCount = restaurantsWithStatus.filter(r => !r.isPaid).length;
  const paidCount = restaurantsWithStatus.filter(r => r.isPaid).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Track restaurant payment status and send reminders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-orange-600 text-sm font-medium">{dueCount} restaurant{dueCount !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Payment Due</p>
          <p className="text-gray-900 text-2xl">{dueCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-green-600 text-sm font-medium">Up to date</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Paid Restaurants</p>
          <p className="text-gray-900 text-2xl">{paidCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All</option>
            <option value="due">Payment Due</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Restaurant Payment List */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No restaurants found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Restaurant</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Status</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.map(restaurant => (
                  <tr
                    key={restaurant.id}
                    className={`hover:bg-gray-50 ${!restaurant.isPaid ? 'bg-orange-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-gray-900">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm">{restaurant.email}</p>
                        {restaurant.pendingNotifications > 0 && (
                          <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {restaurant.pendingNotifications} pending reminder{restaurant.pendingNotifications > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {restaurant.isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          <AlertCircle className="w-3 h-3" />
                          Payment Due
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendNotification(restaurant.id)}
                          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-1"
                          title="Send payment reminder"
                        >
                          <Send className="w-4 h-4" />
                          Notify
                        </button>
                        <button
                          onClick={() => handleTogglePaid(restaurant.id, restaurant.isPaid)}
                          className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                            restaurant.isPaid
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          title={restaurant.isPaid ? 'Mark as payment due' : 'Mark as paid'}
                        >
                          {restaurant.isPaid ? 'Mark Due' : 'Mark Paid'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedRestaurant && (
        <PaymentNotificationModal
          restaurantId={selectedRestaurant}
          onClose={() => {
            setShowNotificationModal(false);
            setSelectedRestaurant(null);
          }}
        />
      )}
    </div>
  );
}
