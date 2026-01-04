import { useState, useEffect } from 'react';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import { X } from 'lucide-react';

interface RestaurantModalProps {
  restaurantId: string | null;
  onClose: () => void;
}

export default function RestaurantModal({ restaurantId, onClose }: RestaurantModalProps) {
  const { restaurants, addRestaurant, updateRestaurant } = useSuperAdmin();
  const editingRestaurant = restaurantId
    ? restaurants.find(r => r.id === restaurantId)
    : null;

  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true,
    cuisine: '',
    rating: '',
    adminUsername: '',
    adminPassword: '',
    isActive: true,
    subscription: 'trial' as 'trial' | 'basic' | 'premium',
    dueAmount: '0',
    nextPaymentDue: '',
  });

  // Helper function to safely convert nextPaymentDue to date string
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return '';

    try {
      // If it's already a string, try to parse it
      if (typeof date === 'string') {
        return date.split('T')[0];
      }

      // If it's a Date object, convert to ISO string
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }

      // If it has a toDate method (Firestore Timestamp), convert it
      if (typeof (date as any).toDate === 'function') {
        return (date as any).toDate().toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    if (editingRestaurant) {
      setFormData({
        slug: editingRestaurant.slug,
        name: editingRestaurant.name,
        address: editingRestaurant.address,
        phone: editingRestaurant.phone,
        whatsapp: editingRestaurant.whatsapp,
        email: editingRestaurant.email,
        openingHours: editingRestaurant.openingHours,
        isOpen: editingRestaurant.isOpen,
        cuisine: editingRestaurant.cuisine.join(', '),
        rating: editingRestaurant.rating?.toString() || '',
        adminUsername: editingRestaurant.adminUsername,
        adminPassword: editingRestaurant.adminPassword,
        isActive: editingRestaurant.isActive,
        subscription: editingRestaurant.subscription,
        dueAmount: editingRestaurant.dueAmount.toString(),
        nextPaymentDue: formatDateForInput(editingRestaurant.nextPaymentDue),
      });
    }
  }, [editingRestaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const restaurantData = {
      slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      openingHours: formData.openingHours,
      isOpen: formData.isOpen,
      cuisine: formData.cuisine.split(',').map(c => c.trim()).filter(Boolean),
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      adminUsername: formData.adminUsername,
      adminPassword: formData.adminPassword,
      isActive: formData.isActive,
      subscription: formData.subscription,
      dueAmount: parseFloat(formData.dueAmount),
      nextPaymentDue: formData.nextPaymentDue ? new Date(formData.nextPaymentDue).toISOString() : undefined,
    };

    if (restaurantId) {
      updateRestaurant(restaurantId, restaurantData);
    } else {
      addRestaurant(restaurantData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-gray-900">
            {restaurantId ? 'Edit Restaurant' : 'Add New Restaurant'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info */}
          <div>
            <h3 className="text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="my-restaurant"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Will be used in URL: /r/{formData.slug || 'slug'}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Operating Info */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-gray-900 mb-3">Operating Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Opening Hours *</label>
                <input
                  type="text"
                  required
                  value={formData.openingHours}
                  onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cuisine Types *</label>
                <input
                  type="text"
                  required
                  value={formData.cuisine}
                  onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Indian, Chinese, Continental"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Rating (Optional)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={e => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mt-8">
                  <input
                    type="checkbox"
                    checked={formData.isOpen}
                    onChange={e => setFormData({ ...formData, isOpen: e.target.checked })}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Currently Open</span>
                </label>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-gray-900 mb-3">Admin Access Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Admin Username *</label>
                <input
                  type="text"
                  required
                  value={formData.adminUsername}
                  onChange={e => setFormData({ ...formData, adminUsername: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Admin Password *</label>
                <input
                  type="text"
                  required
                  value={formData.adminPassword}
                  onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Subscription & Payment */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-gray-900 mb-3">Subscription & Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Subscription Plan *</label>
                <select
                  value={formData.subscription}
                  onChange={e =>
                    setFormData({ ...formData, subscription: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="trial">Trial</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Due Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.dueAmount}
                  onChange={e => setFormData({ ...formData, dueAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Next Payment Due Date</label>
                <input
                  type="date"
                  value={formData.nextPaymentDue}
                  onChange={e => setFormData({ ...formData, nextPaymentDue: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mt-8">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Restaurant Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {restaurantId ? 'Update Restaurant' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}