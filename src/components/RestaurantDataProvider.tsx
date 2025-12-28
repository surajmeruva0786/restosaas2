import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import type { Restaurant } from '../contexts/SuperAdminContext';

interface RestaurantDataContextType {
    restaurant: Restaurant | null;
    loading: boolean;
}

const RestaurantDataContext = createContext<RestaurantDataContextType | undefined>(undefined);

export function RestaurantDataProvider({ children }: { children: ReactNode }) {
    const { slug } = useParams<{ slug: string }>();
    const { getRestaurantBySlug, restaurants } = useSuperAdmin();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        // Get restaurant by slug
        const rest = getRestaurantBySlug(slug);
        setRestaurant(rest || null);
        setLoading(false);
    }, [slug, restaurants, getRestaurantBySlug]);

    return (
        <RestaurantDataContext.Provider value={{ restaurant, loading }}>
            {children}
        </RestaurantDataContext.Provider>
    );
}

export function useRestaurantData() {
    const context = useContext(RestaurantDataContext);
    if (!context) {
        throw new Error('useRestaurantData must be used within RestaurantDataProvider');
    }
    return context;
}
