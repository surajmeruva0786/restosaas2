import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SuperAdminSettings() {
  const [formData, setFormData] = useState({
    platformName: 'Restaurant Management Platform',
    supportEmail: 'support@platform.com',
    supportPhone: '+91 1234567890',
    trialDuration: '14',
    basicPrice: '999',
    premiumPrice: '2999',
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Super Admin Settings</h1>
          <p className="text-gray-600">Configure platform-wide settings</p>
        </div>
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Platform Info */}
          <div>
            <h2 className="text-gray-900 mb-4">Platform Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  value={formData.platformName}
                  onChange={e =>
                    setFormData({ ...formData, platformName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={e =>
                      setFormData({ ...formData, supportEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Support Phone</label>
                  <input
                    type="tel"
                    value={formData.supportPhone}
                    onChange={e =>
                      setFormData({ ...formData, supportPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Settings */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-gray-900 mb-4">Subscription Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Trial Duration (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.trialDuration}
                  onChange={e =>
                    setFormData({ ...formData, trialDuration: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Basic Plan Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.basicPrice}
                    onChange={e =>
                      setFormData({ ...formData, basicPrice: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Premium Plan Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.premiumPrice}
                    onChange={e =>
                      setFormData({ ...formData, premiumPrice: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="max-w-3xl">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h2 className="text-red-900 mb-2">Danger Zone</h2>
          <p className="text-red-700 mb-4">
            These actions are irreversible. Please be careful.
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
}
