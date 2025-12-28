// Utility function to sync restaurant data to settings
// Run this once to fix existing restaurants that don't have settings

import { getRestaurants, updateSettings } from './firebaseService';

export const syncRestaurantSettings = async () => {
    try {
        const restaurants = await getRestaurants();

        for (const restaurant of restaurants) {
            // Update settings for each restaurant
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

            console.log(`Synced settings for: ${restaurant.name}`);
        }

        console.log('All restaurant settings synced successfully!');
    } catch (error) {
        console.error('Error syncing restaurant settings:', error);
    }
};
