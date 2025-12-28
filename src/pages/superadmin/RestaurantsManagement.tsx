import { useState } from 'react';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import RestaurantModal from '../../components/RestaurantModal';

export default function RestaurantsManagement() {
  const { restaurants, deleteRestaurant, toggleRestaurantStatus } = useSuperAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterSubscription, setFilterSubscription] = useState<'all' | 'trial' | 'basic' | 'premium'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<string | null>(null);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.phone.includes(searchQuery);

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && restaurant.isActive) ||
      (filterStatus === 'inactive' && !restaurant.isActive);

    const matchesSubscription =
      filterSubscription === 'all' || restaurant.subscription === filterSubscription;

    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const handleAddNew = () => {
    setEditingRestaurant(null);
    setShowModal(true);
  };

  const handleEdit = (id: string) => {
    setEditingRestaurant(id);
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteRestaurant(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Restaurant Management</h1>
          <p className="text-gray-600">{restaurants.length} total restaurants</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Restaurant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <select
            value={filterSubscription}
            onChange={e => setFilterSubscription(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="all">All Plans</option>
            <option value="trial">Trial</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Restaurants List */}
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
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Contact</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Plan</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Status</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Created</th>
                  <th className="px-6 py-3 text-left text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRestaurants.map(restaurant => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-gray-900">{restaurant.name}</h3>
                          <Link
                            to={`/r/${restaurant.slug}`}
                            target="_blank"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                        <p className="text-gray-600 text-sm">/{restaurant.slug}</p>
                        <p className="text-gray-500 text-sm">{restaurant.cuisine.join(', ')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-700">{restaurant.phone}</p>
                        <p className="text-gray-500">{restaurant.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
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
                        onClick={() => toggleRestaurantStatus(restaurant.id)}
                        className={`flex items-center gap-2 ${
                          restaurant.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {restaurant.isActive ? (
                          <ToggleRight className="w-8 h-8" />
                        ) : (
                          <ToggleLeft className="w-8 h-8" />
                        )}
                        <span className="text-sm">
                          {restaurant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(restaurant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(restaurant.id)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(restaurant.id, restaurant.name)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <RestaurantModal
          restaurantId={editingRestaurant}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
