import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SuperAdminProvider } from './contexts/SuperAdminContext';

// Customer pages
import RestaurantHome from './pages/customer/RestaurantHome';
import MenuPage from './pages/customer/MenuPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ReservePage from './pages/customer/ReservePage';
import FeedbackPage from './pages/customer/FeedbackPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';
import AdminReservations from './pages/admin/AdminReservations';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminSettings from './pages/admin/AdminSettings';

// Super Admin pages
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import RestaurantsManagement from './pages/superadmin/RestaurantsManagement';
import PaymentManagement from './pages/superadmin/PaymentManagement';
import SuperAdminAnalytics from './pages/superadmin/SuperAdminAnalytics';
import SuperAdminSettings from './pages/superadmin/SuperAdminSettings';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import CustomerRouteWrapper from './components/CustomerRouteWrapper';

export default function App() {
  return (
    <Router>
      <SuperAdminProvider>
        <AuthProvider>
          <Routes>
            {/* Customer Routes - with slug-based DataProvider */}
            <Route
              path="/r/:slug/*"
              element={
                <CustomerRouteWrapper>
                  <Routes>
                    <Route index element={<RestaurantHome />} />
                    <Route path="menu" element={<MenuPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="reserve" element={<ReservePage />} />
                    <Route path="feedback" element={<FeedbackPage />} />
                  </Routes>
                </CustomerRouteWrapper>
              }
            />

            {/* Restaurant Admin Routes - with auth-based DataProvider */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <DataProvider>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="menu" element={<AdminMenu />} />
                        <Route path="reservations" element={<AdminReservations />} />
                        <Route path="feedback" element={<AdminFeedback />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Routes>
                    </AdminLayout>
                  </DataProvider>
                </ProtectedRoute>
              }
            />

            {/* Super Admin Routes */}
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route
              path="/superadmin/*"
              element={
                <SuperAdminProtectedRoute>
                  <SuperAdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<SuperAdminDashboard />} />
                      <Route path="restaurants" element={<RestaurantsManagement />} />
                      <Route path="payments" element={<PaymentManagement />} />
                      <Route path="analytics" element={<SuperAdminAnalytics />} />
                      <Route path="settings" element={<SuperAdminSettings />} />
                    </Routes>
                  </SuperAdminLayout>
                </SuperAdminProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/r/demo-restaurant" replace />} />
          </Routes>
        </AuthProvider>
      </SuperAdminProvider>
    </Router>
  );
}