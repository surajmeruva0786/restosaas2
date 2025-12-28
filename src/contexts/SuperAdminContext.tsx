import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as firebaseService from '../services/firebaseService';

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  isOpen: boolean;
  cuisine: string[];
  rating?: number;
  logo?: string;
  coverImage?: string;
  adminUsername: string;
  adminPassword: string;
  createdAt: string;
  isActive: boolean;
  subscription: 'trial' | 'basic' | 'premium';
  subscriptionExpiry?: string;
  dueAmount: number;
  lastPaymentDate?: string;
  nextPaymentDue?: string;
}

export interface PaymentNotification {
  id: string;
  restaurantId: string;
  restaurantName: string;
  amount: number;
  message: string;
  dueDate?: string;
  sentAt: string;
  readAt?: string;
  status: 'pending' | 'read' | 'paid';
}

interface SuperAdminContextType {
  isSuperAdmin: boolean;
  restaurants: Restaurant[];
  notifications: PaymentNotification[];
  loading: boolean;
  superAdminLogin: (username: string, password: string) => boolean;
  superAdminLogout: () => void;
  addRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => Promise<void>;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  toggleRestaurantStatus: (id: string) => Promise<void>;
  getRestaurantBySlug: (slug: string) => Restaurant | undefined;
  sendPaymentNotification: (restaurantId: string, amount: number, message: string, dueDate?: string) => Promise<void>;
  getRestaurantNotifications: (restaurantId: string) => PaymentNotification[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markNotificationAsPaid: (notificationId: string) => Promise<void>;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('superAdminAuth');
    if (auth) {
      setIsSuperAdmin(true);
    }

    // Subscribe to real-time restaurant updates
    const unsubscribeRestaurants = firebaseService.subscribeToRestaurants((data) => {
      setRestaurants(data);
      setLoading(false);
    });

    // Subscribe to real-time payment notifications
    const unsubscribeNotifications = firebaseService.subscribeToPaymentNotifications((data) => {
      setNotifications(data);
    });

    // Seed initial data if needed
    firebaseService.seedInitialData();

    // One-time sync: Initialize settings for existing restaurants
    const syncSettings = async () => {
      const hasRunSync = localStorage.getItem('settingsSyncedV2'); // Changed flag name to re-run
      if (!hasRunSync) {
        try {
          const restaurants = await firebaseService.getRestaurants();
          for (const restaurant of restaurants) {
            const settings = await firebaseService.getSettings(restaurant.id);
            if (!settings) {
              await firebaseService.updateSettings(restaurant.id, {
                name: restaurant.name,
                address: restaurant.address,
                phone: restaurant.phone,
                whatsapp: restaurant.whatsapp,
                openingHours: restaurant.openingHours,
                isOpen: restaurant.isOpen,
                cuisine: restaurant.cuisine,
                rating: restaurant.rating,
              });
              console.log(`Initialized settings for: ${restaurant.name}`);
            }
          }
          localStorage.setItem('settingsSyncedV2', 'true');
        } catch (error) {
          console.error('Error syncing settings:', error);
        }
      }
    };
    syncSettings();

    return () => {
      unsubscribeRestaurants();
      unsubscribeNotifications();
    };
  }, []);

  const superAdminLogin = (username: string, password: string) => {
    // Super admin credentials
    if (username === 'superadmin' && password === 'super123') {
      setIsSuperAdmin(true);
      localStorage.setItem('superAdminAuth', 'true');
      return true;
    }
    return false;
  };

  const superAdminLogout = () => {
    setIsSuperAdmin(false);
    localStorage.removeItem('superAdminAuth');
  };

  const addRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'createdAt'>) => {
    try {
      await firebaseService.addRestaurant(restaurant);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      throw error;
    }
  };

  const updateRestaurant = async (id: string, restaurant: Partial<Restaurant>) => {
    try {
      await firebaseService.updateRestaurant(id, restaurant);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      throw error;
    }
  };

  const deleteRestaurant = async (id: string) => {
    try {
      await firebaseService.deleteRestaurant(id);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      throw error;
    }
  };

  const toggleRestaurantStatus = async (id: string) => {
    const restaurant = restaurants.find(r => r.id === id);
    if (restaurant) {
      await updateRestaurant(id, { isActive: !restaurant.isActive });
    }
  };

  const getRestaurantBySlug = (slug: string) => {
    return restaurants.find(r => r.slug === slug);
  };

  const sendPaymentNotification = async (
    restaurantId: string,
    amount: number,
    message: string,
    dueDate?: string
  ) => {
    try {
      const restaurant = restaurants.find(r => r.id === restaurantId);
      if (!restaurant) return;

      await firebaseService.addPaymentNotification({
        restaurantId,
        restaurantName: restaurant.name,
        amount,
        message,
        dueDate,
        status: 'pending',
      });
    } catch (error) {
      console.error('Error sending payment notification:', error);
      throw error;
    }
  };

  const getRestaurantNotifications = (restaurantId: string) => {
    return notifications.filter(n => n.restaurantId === restaurantId);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await firebaseService.updateNotificationStatus(
        notificationId,
        'read',
        new Date().toISOString()
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markNotificationAsPaid = async (notificationId: string) => {
    try {
      await firebaseService.updateNotificationStatus(notificationId, 'paid');
    } catch (error) {
      console.error('Error marking notification as paid:', error);
      throw error;
    }
  };

  return (
    <SuperAdminContext.Provider
      value={{
        isSuperAdmin,
        restaurants,
        notifications,
        loading,
        superAdminLogin,
        superAdminLogout,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        toggleRestaurantStatus,
        getRestaurantBySlug,
        sendPaymentNotification,
        getRestaurantNotifications,
        markNotificationAsRead,
        markNotificationAsPaid,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  }
  return context;
}