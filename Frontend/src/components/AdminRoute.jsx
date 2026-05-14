import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gold">
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
