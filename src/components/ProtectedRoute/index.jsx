import { Navigate, Outlet, useNavigate } from 'react-router';
import useRole from '../../hooks/useRole';

export default function ProtectedRoute({ requiredRole, strict = false }) {
  const { checkUserLevel, role } = useRole();
  const navigate = useNavigate();
  if (strict && role != requiredRole) return navigate(-1);
  return checkUserLevel(requiredRole) ? <Outlet /> : navigate(-1);
}