import { useState } from 'react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Send, AlertCircle, CheckCircle, Search, IndianRupee, History } from 'lucide-react';
import PaymentNotificationModal from '../../components/PaymentNotificationModal';

export default function PaymentManagement() {
  const { restaurants, notifications, platformPayments, totalRevenue, recordPayment } = useSuperAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'due' | 'paid'>('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'history'>('restaurants');
  const [recording, setRecording] = useState<string | null>(null);

  const restaurantsWithStatus = restaurants.map(restaurant => {
    const isPaid = restaurant.dueAmount === 0;
    const pendingNotifications = notifications.filter(
      n => n.restaurantId === restaurant.id && n.status === 'pending'
    ).length;
    // Determine payment type from subscription field
    const paymentType: 'setup' | 'monthly' =
      restaurant.subscription === 'trial' ? 'setup' : 'monthly';
    return { ...restaurant, isPaid, pendingNotifications, paymentType };
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

  const handleMarkPaid = async (restaurantId: string, type: 'setup' | 'monthly') => {
    const label = type === 'setup' ? '₹1,500 setup fee' : '₹1,000 monthly fee';
    if (!confirm(`Record ${label} payment for this restaurant?`)) return;
    setRecording(restaurantId);
    try {
      await recordPayment(restaurantId, type);
    } finally {
      setRecording(null);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <IndianRupee className="w-6 h-6" />
            </div>
            <span className="text-purple-600 text-sm font-medium">All time</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue Collected</p>
          <p className="text-gray-900 text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">{platformPayments.length} payment{platformPayments.length !== 1 ? 's' : ''} recorded</p>
        </div>

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

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'restaurants'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4" />
          Payment History
        </button>
      </div>

      {activeTab === 'restaurants' ? (
        <>
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

          {/* Restaurant List */}
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
                      <th className="px-6 py-3 text-left text-gray-900 text-sm">Amount Due</th>
                      <th className="px-6 py-3 text-left text-gray-900 text-sm">Status</th>
                      <th className="px-6 py-3 text-left text-gray-900 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRestaurants.map(restaurant => (
                      <tr
                        key={restaurant.id}
                        className={`hover:bg-gray-50 ${!restaurant.isPaid ? 'bg-orange-50/40' : ''}`}
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
                            <span className="text-gray-400 text-sm">—</span>
                          ) : (
                            <div>
                              <p className="text-gray-900 font-semibold">
                                ₹{restaurant.paymentType === 'setup' ? '1,500' : '1,000'}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {restaurant.paymentType === 'setup' ? 'One-time setup fee' : 'Monthly fee'}
                              </p>
                            </div>
                          )}
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
                              {restaurant.paymentType === 'setup' ? 'Setup Due' : 'Monthly Due'}
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
                            {!restaurant.isPaid && (
                              <button
                                onClick={() => handleMarkPaid(restaurant.id, restaurant.paymentType)}
                                disabled={recording === restaurant.id}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-60"
                                title={`Record ₹${restaurant.paymentType === 'setup' ? '1,500' : '1,000'} payment`}
                              >
                                {recording === restaurant.id ? 'Saving...' : 'Mark Paid'}
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
        </>
      ) : (
        /* Payment History Tab */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {platformPayments.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payments recorded yet</p>
              <p className="text-gray-400 text-sm mt-1">Payments will appear here when marked as paid</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-900 text-sm">Restaurant</th>
                    <th className="px-6 py-3 text-left text-gray-900 text-sm">Type</th>
                    <th className="px-6 py-3 text-left text-gray-900 text-sm">Amount</th>
                    <th className="px-6 py-3 text-left text-gray-900 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {platformPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{payment.restaurantName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs ${
                            payment.type === 'setup'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {payment.type === 'setup' ? 'Setup Fee' : 'Monthly Fee'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-semibold">₹{payment.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.paidAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-gray-900 font-semibold">Total Revenue</td>
                    <td className="px-6 py-4 text-gray-900 font-bold text-lg">₹{totalRevenue.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
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
