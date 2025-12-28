import { useState } from 'react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { DollarSign, Send, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import PaymentNotificationModal from '../../components/PaymentNotificationModal';

export default function PaymentManagement() {
  const { restaurants, notifications, updateRestaurant } = useSuperAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'upcoming' | 'paid'>('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  const today = new Date();

  const restaurantsWithPaymentStatus = restaurants.map(restaurant => {
    const nextDue = restaurant.nextPaymentDue ? new Date(restaurant.nextPaymentDue) : null;
    const isOverdue = nextDue && nextDue < today && restaurant.dueAmount > 0;
    const isUpcoming = nextDue && nextDue > today && nextDue.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000;
    const isPaid = restaurant.dueAmount === 0;
    
    const pendingNotifications = notifications.filter(
      n => n.restaurantId === restaurant.id && n.status === 'pending'
    ).length;

    return {
      ...restaurant,
      isOverdue,
      isUpcoming,
      isPaid,
      pendingNotifications,
    };
  });

  const filteredRestaurants = restaurantsWithPaymentStatus.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'overdue' && restaurant.isOverdue) ||
      (filterStatus === 'upcoming' && restaurant.isUpcoming) ||
      (filterStatus === 'paid' && restaurant.isPaid);

    return matchesSearch && matchesFilter;
  });

  const handleSendNotification = (restaurantId: string) => {
    setSelectedRestaurant(restaurantId);
    setShowNotificationModal(true);
  };

  const handleMarkAsPaid = (restaurantId: string) => {
    if (confirm('Mark this restaurant as paid? This will clear the due amount.')) {
      updateRestaurant(restaurantId, {
        dueAmount: 0,
        lastPaymentDate: new Date().toISOString(),
        nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  };

  const handleUpdateDueAmount = (restaurantId: string, currentAmount: number) => {
    const amount = prompt(`Update due amount for this restaurant (current: ₹${currentAmount}):`);
    if (amount !== null) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount >= 0) {
        updateRestaurant(restaurantId, { dueAmount: numAmount });
      }
    }
  };

  const totalDues = restaurants.reduce((sum, r) => sum + r.dueAmount, 0);
  const overdueCount = restaurantsWithPaymentStatus.filter(r => r.isOverdue).length;
  const upcomingCount = restaurantsWithPaymentStatus.filter(r => r.isUpcoming).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Payment Management</h1>
        <p className="text-gray-600">Track and notify restaurants about pending payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="text-red-600">{overdueCount} overdue</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Outstanding</p>
          <p className="text-gray-900 text-2xl">₹{totalDues.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-orange-600">{upcomingCount} upcoming</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Due This Week</p>
          <p className="text-gray-900 text-2xl">{upcomingCount}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-green-600">Up to date</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Paid Restaurants</p>
          <p className="text-gray-900 text-2xl">
            {restaurantsWithPaymentStatus.filter(r => r.isPaid).length}
          </p>
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
            <option value="all">All Status</option>
            <option value="overdue">Overdue</option>
            <option value="upcoming">Due This Week</option>
            <option value="paid">Paid Up</option>
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
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Plan</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Due Amount</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Next Due Date</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Status</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.map(restaurant => (
                  <tr
                    key={restaurant.id}
                    className={`hover:bg-gray-50 ${
                      restaurant.isOverdue ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-gray-900">{restaurant.name}</h3>
                        <p className="text-gray-600 text-sm">{restaurant.email}</p>
                        {restaurant.pendingNotifications > 0 && (
                          <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                            {restaurant.pendingNotifications} pending notification
                            {restaurant.pendingNotifications > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs capitalize ${
                          restaurant.subscription === 'premium'
                            ? 'bg-purple-100 text-purple-700'
                            : restaurant.subscription === 'basic'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {restaurant.subscription}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdateDueAmount(restaurant.id, restaurant.dueAmount)}
                        className="text-gray-900 hover:text-purple-600"
                      >
                        ₹{restaurant.dueAmount.toLocaleString()}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {restaurant.nextPaymentDue ? (
                          <>
                            <p className="text-gray-700">
                              {new Date(restaurant.nextPaymentDue).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                            {restaurant.isOverdue && (
                              <p className="text-red-600 text-xs">
                                {Math.floor(
                                  (today.getTime() - new Date(restaurant.nextPaymentDue).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{' '}
                                days overdue
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-gray-500">Not set</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {restaurant.isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          <AlertCircle className="w-3 h-3" />
                          Overdue
                        </span>
                      ) : restaurant.isUpcoming ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                          <Clock className="w-3 h-3" />
                          Due Soon
                        </span>
                      ) : restaurant.isPaid ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          <DollarSign className="w-3 h-3" />
                          Active
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
                        {restaurant.dueAmount > 0 && (
                          <button
                            onClick={() => handleMarkAsPaid(restaurant.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            title="Mark as paid"
                          >
                            Paid
                          </button>
                        )}
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
