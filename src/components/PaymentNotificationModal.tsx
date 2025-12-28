import { useState } from 'react';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import { X, Send } from 'lucide-react';

interface PaymentNotificationModalProps {
  restaurantId: string;
  onClose: () => void;
}

export default function PaymentNotificationModal({
  restaurantId,
  onClose,
}: PaymentNotificationModalProps) {
  const { restaurants, sendPaymentNotification } = useSuperAdmin();
  const restaurant = restaurants.find(r => r.id === restaurantId);

  const [formData, setFormData] = useState({
    amount: restaurant?.dueAmount?.toString() || '',
    message: `Dear ${restaurant?.name},\n\nThis is a friendly reminder that you have a pending payment of ₹${restaurant?.dueAmount} for your ${restaurant?.subscription} subscription.\n\nPlease settle this amount at your earliest convenience to avoid any service interruption.\n\nThank you for your cooperation.`,
    dueDate: restaurant?.nextPaymentDue?.split('T')[0] || '',
  });

  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    sendPaymentNotification(
      restaurantId,
      amount,
      formData.message,
      formData.dueDate || undefined
    );

    setSent(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!restaurant) return null;

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Notification Sent!</h2>
          <p className="text-gray-600">
            Payment reminder has been sent to {restaurant.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Send Payment Notification</h2>
            <p className="text-gray-600 text-sm mt-1">{restaurant.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Current Plan:</span>
                <span className="ml-2 text-gray-900 capitalize">{restaurant.subscription}</span>
              </div>
              <div>
                <span className="text-gray-600">Current Due:</span>
                <span className="ml-2 text-gray-900">₹{restaurant.dueAmount}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 text-gray-900">{restaurant.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Amount (₹) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Due Date (Optional)</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Message *</label>
            <textarea
              required
              rows={8}
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-900 text-sm">
              <strong>Note:</strong> This notification will be visible to the restaurant admin
              when they log in to their dashboard. An email will also be sent to{' '}
              {restaurant.email}.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
