import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    DocumentData,
    QueryConstraint,
    setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import type { MenuItem, Category, Order, Reservation, Feedback, RestaurantSettings } from '../contexts/DataContext';
import type { Restaurant, PaymentNotification } from '../contexts/SuperAdminContext';

// ==================== RESTAURANT OPERATIONS ====================

export const getRestaurants = async (): Promise<Restaurant[]> => {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
};

export const getRestaurantBySlug = async (slug: string): Promise<Restaurant | null> => {
    const q = query(collection(db, 'restaurants'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Restaurant;
};

export const getRestaurantById = async (id: string): Promise<Restaurant | null> => {
    const docRef = doc(db, 'restaurants', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Restaurant;
};

export const addRestaurant = async (restaurant: Omit<Restaurant, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'restaurants'), {
        ...restaurant,
        createdAt: Timestamp.now().toDate().toISOString(),
        dueAmount: 0,
    });
    return docRef.id;
};

export const updateRestaurant = async (id: string, data: Partial<Restaurant>): Promise<void> => {
    const docRef = doc(db, 'restaurants', id);
    await updateDoc(docRef, data as DocumentData);
};

export const deleteRestaurant = async (id: string): Promise<void> => {
    const docRef = doc(db, 'restaurants', id);
    await deleteDoc(docRef);
};

export const subscribeToRestaurants = (callback: (restaurants: Restaurant[]) => void) => {
    return onSnapshot(collection(db, 'restaurants'), (snapshot) => {
        const restaurants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
        callback(restaurants);
    });
};

// ==================== MENU ITEMS OPERATIONS ====================

export const getMenuItems = async (restaurantId: string): Promise<MenuItem[]> => {
    const q = query(
        collection(db, 'menuItems'),
        where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
};

export const addMenuItem = async (restaurantId: string, item: Omit<MenuItem, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'menuItems'), {
        ...item,
        restaurantId,
    });
    return docRef.id;
};

export const updateMenuItem = async (id: string, data: Partial<MenuItem>): Promise<void> => {
    const docRef = doc(db, 'menuItems', id);
    await updateDoc(docRef, data as DocumentData);
};

export const deleteMenuItem = async (id: string): Promise<void> => {
    const docRef = doc(db, 'menuItems', id);
    await deleteDoc(docRef);
};

export const subscribeToMenuItems = (restaurantId: string, callback: (items: MenuItem[]) => void) => {
    const q = query(
        collection(db, 'menuItems'),
        where('restaurantId', '==', restaurantId)
    );
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        callback(items);
    });
};

// ==================== CATEGORIES OPERATIONS ====================

export const getCategories = async (restaurantId: string): Promise<Category[]> => {
    const q = query(
        collection(db, 'categories'),
        where('restaurantId', '==', restaurantId),
        orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
};

export const addCategory = async (restaurantId: string, category: Omit<Category, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'categories'), {
        ...category,
        restaurantId,
    });
    return docRef.id;
};

export const updateCategory = async (id: string, data: Partial<Category>): Promise<void> => {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, data as DocumentData);
};

export const deleteCategory = async (id: string): Promise<void> => {
    const docRef = doc(db, 'categories', id);
    await deleteDoc(docRef);
};

export const subscribeToCategories = (restaurantId: string, callback: (categories: Category[]) => void) => {
    const q = query(
        collection(db, 'categories'),
        where('restaurantId', '==', restaurantId),
        orderBy('order', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        callback(categories);
    });
};

// ==================== ORDERS OPERATIONS ====================

export const getOrders = async (restaurantId: string): Promise<Order[]> => {
    const q = query(
        collection(db, 'orders'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const addOrder = async (restaurantId: string, order: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        restaurantId,
        createdAt: Timestamp.now().toDate().toISOString(),
        status: 'new',
    });
    return docRef.id;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
};

export const subscribeToOrders = (restaurantId: string, callback: (orders: Order[]) => void) => {
    const q = query(
        collection(db, 'orders'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
};

// ==================== RESERVATIONS OPERATIONS ====================

export const getReservations = async (restaurantId: string): Promise<Reservation[]> => {
    const q = query(
        collection(db, 'reservations'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
};

export const addReservation = async (
    restaurantId: string,
    reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>
): Promise<string> => {
    const docRef = await addDoc(collection(db, 'reservations'), {
        ...reservation,
        restaurantId,
        createdAt: Timestamp.now().toDate().toISOString(),
        status: 'pending',
    });
    return docRef.id;
};

export const updateReservationStatus = async (id: string, status: Reservation['status']): Promise<void> => {
    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, { status });
};

export const subscribeToReservations = (restaurantId: string, callback: (reservations: Reservation[]) => void) => {
    const q = query(
        collection(db, 'reservations'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
        callback(reservations);
    });
};

// ==================== FEEDBACK OPERATIONS ====================

export const getFeedbacks = async (restaurantId: string): Promise<Feedback[]> => {
    const q = query(
        collection(db, 'feedbacks'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
};

export const addFeedback = async (restaurantId: string, feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'feedbacks'), {
        ...feedback,
        restaurantId,
        createdAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
};

export const subscribeToFeedbacks = (restaurantId: string, callback: (feedbacks: Feedback[]) => void) => {
    const q = query(
        collection(db, 'feedbacks'),
        where('restaurantId', '==', restaurantId),
        orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
        callback(feedbacks);
    });
};

// ==================== SETTINGS OPERATIONS ====================

export const getSettings = async (restaurantId: string): Promise<RestaurantSettings | null> => {
    const docRef = doc(db, 'settings', restaurantId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as RestaurantSettings;
};

export const updateSettings = async (restaurantId: string, settings: Partial<RestaurantSettings>): Promise<void> => {
    const docRef = doc(db, 'settings', restaurantId);
    await setDoc(docRef, settings, { merge: true });
};

export const subscribeToSettings = (restaurantId: string, callback: (settings: RestaurantSettings | null) => void) => {
    const docRef = doc(db, 'settings', restaurantId);
    return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data() as RestaurantSettings);
        } else {
            callback(null);
        }
    });
};

// ==================== PAYMENT NOTIFICATIONS OPERATIONS ====================

export const getPaymentNotifications = async (): Promise<PaymentNotification[]> => {
    const q = query(collection(db, 'paymentNotifications'), orderBy('sentAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentNotification));
};

export const getRestaurantNotifications = async (restaurantId: string): Promise<PaymentNotification[]> => {
    const q = query(
        collection(db, 'paymentNotifications'),
        where('restaurantId', '==', restaurantId),
        orderBy('sentAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentNotification));
};

export const addPaymentNotification = async (notification: Omit<PaymentNotification, 'id' | 'sentAt'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'paymentNotifications'), {
        ...notification,
        sentAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
};

export const updateNotificationStatus = async (id: string, status: PaymentNotification['status'], readAt?: string): Promise<void> => {
    const docRef = doc(db, 'paymentNotifications', id);
    const updateData: any = { status };
    if (readAt) {
        updateData.readAt = readAt;
    }
    await updateDoc(docRef, updateData);
};

export const subscribeToPaymentNotifications = (callback: (notifications: PaymentNotification[]) => void) => {
    const q = query(collection(db, 'paymentNotifications'), orderBy('sentAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentNotification));
        callback(notifications);
    });
};

// ==================== SEED DATA ====================

export const seedInitialData = async () => {
    try {
        // Check if demo restaurant exists
        const demoRestaurant = await getRestaurantBySlug('demo-restaurant');

        if (!demoRestaurant) {
            // Create demo restaurant
            const restaurantId = await addRestaurant({
                slug: 'demo-restaurant',
                name: 'Demo Restaurant',
                address: '123 Food Street, Gourmet City',
                phone: '+91 9876543210',
                whatsapp: '+91 9876543210',
                email: 'demo@restaurant.com',
                openingHours: '11:00 AM - 11:00 PM',
                isOpen: true,
                cuisine: ['Indian', 'Chinese', 'Continental'],
                rating: 4.5,
                adminUsername: 'admin',
                adminPassword: 'admin123',
                isActive: true,
                subscription: 'premium',
                dueAmount: 0,
                lastPaymentDate: new Date().toISOString(),
                nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            });

            // Create demo categories
            const categories = [
                { name: 'Starters', order: 1 },
                { name: 'Main Course', order: 2 },
                { name: 'Beverages', order: 3 },
                { name: 'Desserts', order: 4 },
            ];

            const categoryIds: string[] = [];
            for (const cat of categories) {
                const id = await addCategory(restaurantId, cat);
                categoryIds.push(id);
            }

            // Create demo menu items
            const menuItems = [
                {
                    name: 'Paneer Tikka',
                    description: 'Grilled cottage cheese with aromatic spices',
                    price: 250,
                    category: categoryIds[0],
                    isVeg: true,
                    isAvailable: true,
                },
                {
                    name: 'Chicken Wings',
                    description: 'Crispy fried wings with hot sauce',
                    price: 300,
                    category: categoryIds[0],
                    isVeg: false,
                    isAvailable: true,
                },
                {
                    name: 'Butter Chicken',
                    description: 'Tender chicken in rich tomato gravy',
                    price: 350,
                    category: categoryIds[1],
                    isVeg: false,
                    isAvailable: true,
                },
                {
                    name: 'Dal Makhani',
                    description: 'Creamy black lentils slow-cooked overnight',
                    price: 200,
                    category: categoryIds[1],
                    isVeg: true,
                    isAvailable: true,
                },
                {
                    name: 'Fresh Lime Soda',
                    description: 'Refreshing lime with soda',
                    price: 80,
                    category: categoryIds[2],
                    isVeg: true,
                    isAvailable: true,
                },
                {
                    name: 'Gulab Jamun',
                    description: 'Soft milk dumplings in sugar syrup',
                    price: 120,
                    category: categoryIds[3],
                    isVeg: true,
                    isAvailable: true,
                },
            ];

            for (const item of menuItems) {
                await addMenuItem(restaurantId, item);
            }

            // Create demo settings
            await updateSettings(restaurantId, {
                name: 'Demo Restaurant',
                address: '123 Food Street, Gourmet City',
                phone: '+91 9876543210',
                whatsapp: '+91 9876543210',
                openingHours: '11:00 AM - 11:00 PM',
                isOpen: true,
                cuisine: ['Indian', 'Chinese', 'Continental'],
                rating: 4.5,
            });

            console.log('Demo data seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};
