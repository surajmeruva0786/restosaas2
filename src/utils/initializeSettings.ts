import { getRestaurants, updateSettings } from '../services/firebaseService';

/**
 * Utility script to ensure all restaurants have their settings initialized in Firestore.
 * Run this from the browser console or as a one-time migration.
 */
export const initializeAllRestaurantSettings = async () => {
    try {
        console.log('[initializeAllRestaurantSettings] Starting settings initialization...');

        const restaurants = await getRestaurants();
        console.log(`[initializeAllRestaurantSettings] Found ${restaurants.length} restaurants`);

        for (const restaurant of restaurants) {
            console.log(`[initializeAllRestaurantSettings] Initializing settings for: ${restaurant.name} (${restaurant.id})`);

            try {
                await updateSettings(restaurant.id, {
                    name: restaurant.name,
                    address: restaurant.address,
                    phone: restaurant.phone,
                    whatsapp: restaurant.whatsapp,
                    openingHours: restaurant.openingHours,
                    isOpen: restaurant.isOpen,
                    cuisine: restaurant.cuisine,
                    rating: restaurant.rating,
                });

                console.log(`[initializeAllRestaurantSettings] ✅ Successfully initialized settings for: ${restaurant.name}`);
            } catch (error) {
                console.error(`[initializeAllRestaurantSettings] ❌ Error initializing settings for ${restaurant.name}:`, error);
            }
        }

        console.log('[initializeAllRestaurantSettings] ✅ Settings initialization complete!');
        return { success: true, count: restaurants.length };
    } catch (error) {
        console.error('[initializeAllRestaurantSettings] ❌ Fatal error:', error);
        return { success: false, error };
    }
};

// Auto-run on import (can be disabled by commenting out)
// initializeAllRestaurantSettings();
