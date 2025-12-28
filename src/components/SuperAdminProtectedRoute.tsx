import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSuperAdmin } from '../contexts/SuperAdminContext';

export default function SuperAdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isSuperAdmin } = useSuperAdmin();

  if (!isSuperAdmin) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return <>{children}</>;
}
