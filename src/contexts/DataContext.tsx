import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as firebaseService from '../services/firebaseService';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Order {
  id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  notes?: string;
  total: number;
  status: 'new' | 'preparing' | 'completed';
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  customerName?: string;
  createdAt: string;
}

export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  isOpen: boolean;
  cuisine: string[];
  rating?: number;
}

interface DataContextType {
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  reservations: Reservation[];
  feedbacks: Feedback[];
  settings: RestaurantSettings;
  loading: boolean;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateReservationStatus: (id: string, status: Reservation['status']) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Promise<void>;
  updateSettings: (settings: Partial<RestaurantSettings>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialSettings: RestaurantSettings = {
  name: 'Demo Restaurant',
  address: '123 Food Street, Gourmet City',
  phone: '+91 9876543210',
  whatsapp: '+91 9876543210',
  openingHours: '11:00 AM - 11:00 PM',
  isOpen: true,
  cuisine: ['Indian', 'Chinese', 'Continental'],
  rating: 4.5,
};

export function DataProvider({ children, restaurantSlug }: { children: ReactNode; restaurantSlug?: string }) {
  const auth = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  // Resolve restaurant ID from either auth context or slug
  useEffect(() => {
    const resolveRestaurantId = async () => {
      // Priority 1: Use authenticated restaurant ID
      if (auth.restaurantId) {
        setRestaurantId(auth.restaurantId);
        return;
      }

      // Priority 2: Use slug to find restaurant ID
      if (restaurantSlug) {
        try {
          const restaurant = await firebaseService.getRestaurantBySlug(restaurantSlug);
          if (restaurant) {
            setRestaurantId(restaurant.id);
          }
        } catch (error) {
          console.error('Error resolving restaurant by slug:', error);
        }
      }
    };

    resolveRestaurantId();
  }, [auth.restaurantId, restaurantSlug]);

  // Subscribe to real-time updates when restaurantId changes
  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to menu items
    const unsubscribeMenuItems = firebaseService.subscribeToMenuItems(restaurantId, (data) => {
      setMenuItems(data);
    });

    // Subscribe to categories
    const unsubscribeCategories = firebaseService.subscribeToCategories(restaurantId, (data) => {
      setCategories(data);
    });

    // Subscribe to orders
    const unsubscribeOrders = firebaseService.subscribeToOrders(restaurantId, (data) => {
      setOrders(data);
    });

    // Subscribe to reservations
    const unsubscribeReservations = firebaseService.subscribeToReservations(restaurantId, (data) => {
      setReservations(data);
    });

    // Subscribe to feedbacks
    const unsubscribeFeedbacks = firebaseService.subscribeToFeedbacks(restaurantId, (data) => {
      setFeedbacks(data);
    });

    // Subscribe to settings
    const unsubscribeSettings = firebaseService.subscribeToSettings(restaurantId, (data) => {
      if (data) {
        setSettings(data);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeMenuItems();
      unsubscribeCategories();
      unsubscribeOrders();
      unsubscribeReservations();
      unsubscribeFeedbacks();
      unsubscribeSettings();
    };
  }, [restaurantId]);

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.addMenuItem(restaurantId, item);
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      await firebaseService.updateMenuItem(id, item);
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await firebaseService.deleteMenuItem(id);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.addCategory(restaurantId, category);
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      await firebaseService.updateCategory(id, category);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await firebaseService.deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.addOrder(restaurantId, order);
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await firebaseService.updateOrderStatus(id, status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.addReservation(restaurantId, reservation);
    } catch (error) {
      console.error('Error adding reservation:', error);
      throw error;
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      await firebaseService.updateReservationStatus(id, status);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  };

  const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.addFeedback(restaurantId, feedback);
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    if (!restaurantId) return;
    try {
      await firebaseService.updateSettings(restaurantId, newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        menuItems,
        categories,
        orders,
        reservations,
        feedbacks,
        settings,
        loading,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrderStatus,
        addReservation,
        updateReservationStatus,
        addFeedback,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
