import { Navigate, Outlet } from 'react-router';
import useRole from '../../hooks/useRole';

export default function ProtectedRoute({ requiredRole, strict = false }) {
  const { checkUserLevel, role } = useRole();
  if(strict && role != requiredRole) return <Navigate to="/" replace />;
  return checkUserLevel(requiredRole) ? <Outlet /> : <Navigate to="/" replace />;
}