import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoute({ allowedRoles }) {
  const { role, loading } = useRole();

  if (loading) return <div>Yuklanmoqda...</div>;

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" replace />;
}