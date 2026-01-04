import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, restaurantId }: { children: ReactNode; restaurantId?: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);

  // Generate restaurant-specific cart key
  const getCartKey = (restId: string) => `cart_${restId}`;

  // Load cart from localStorage when restaurantId changes
  useEffect(() => {
    if (!restaurantId) {
      console.log('[CartContext] No restaurant ID provided, cart will not persist');
      setItems([]);
      return;
    }

    // If restaurant changed, clear current cart and load new one
    if (currentRestaurantId && currentRestaurantId !== restaurantId) {
      console.log('[CartContext] Restaurant changed from', currentRestaurantId, 'to', restaurantId, '- clearing cart');
      setItems([]);
    }

    setCurrentRestaurantId(restaurantId);

    const cartKey = getCartKey(restaurantId);
    const saved = localStorage.getItem(cartKey);

    if (saved) {
      console.log('[CartContext] Loading cart for restaurant:', restaurantId);
      setItems(JSON.parse(saved));
    } else {
      console.log('[CartContext] No saved cart for restaurant:', restaurantId);
      setItems([]);
    }
  }, [restaurantId]);

  // Save cart to localStorage whenever it changes (scoped to current restaurant)
  useEffect(() => {
    if (!currentRestaurantId) return;

    const cartKey = getCartKey(currentRestaurantId);
    localStorage.setItem(cartKey, JSON.stringify(items));
    console.log('[CartContext] Saved cart for restaurant:', currentRestaurantId, 'Items:', items.length);
  }, [items, currentRestaurantId]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
