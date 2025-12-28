import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSuperAdmin } from './SuperAdminContext';

interface AuthContextType {
  isAuthenticated: boolean;
  restaurantId: string | null;
  login: (username: string, password: string, restaurantId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const { restaurants } = useSuperAdmin();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth) {
      const data = JSON.parse(auth);
      setIsAuthenticated(true);
      setRestaurantId(data.restaurantId);
    }
  }, []);

  const login = async (username: string, password: string, restId: string): Promise<boolean> => {
    // Find restaurant by slug (restId is the slug)
    const restaurant = restaurants.find(r => r.slug === restId);

    if (!restaurant) {
      console.error('Restaurant not found');
      return false;
    }

    // Check credentials against restaurant's admin credentials
    if (username === restaurant.adminUsername && password === restaurant.adminPassword) {
      setIsAuthenticated(true);
      setRestaurantId(restaurant.id);
      localStorage.setItem('adminAuth', JSON.stringify({ restaurantId: restaurant.id }));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRestaurantId(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, restaurantId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
