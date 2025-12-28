import { useSuperAdmin } from '../contexts/SuperAdminContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, X, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PaymentNotificationBanner() {
  const { restaurantId } = useAuth();
  const { restaurants, getRestaurantNotifications, markNotificationAsRead } = useSuperAdmin();
  const [dismissed, setDismissed] = useState<string[]>([]);

  if (!restaurantId) return null;

  const restaurant = restaurants.find(r => r.id === restaurantId);
  const notifications = getRestaurantNotifications(restaurantId).filter(
    n => n.status === 'pending' && !dismissed.includes(n.id)
  );

  if (notifications.length === 0) return null;

  const handleDismiss = (notificationId: string) => {
    setDismissed(prev => [...prev, notificationId]);
    markNotificationAsRead(notificationId);
  };

  return (
    <div className="space-y-3 mb-6">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 mb-1">Payment Due Notification</h3>
                <p className="text-red-800 text-sm mb-3 whitespace-pre-wrap">
                  {notification.message}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-red-700">Amount Due: </span>
                    <span className="text-red-900">₹{notification.amount.toLocaleString()}</span>
                  </div>
                  {notification.dueDate && (
                    <div>
                      <span className="text-red-700">Due Date: </span>
                      <span className="text-red-900">
                        {new Date(notification.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-red-700">Sent: </span>
                    <span className="text-red-900">
                      {new Date(notification.sentAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="text-red-600 hover:text-red-700 p-1 flex-shrink-0"
              title="Mark as read"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
