import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import useRole from '../../hooks/useRole';

export default function ProtectedRoute({ requiredRole, strict = false }) {
  const { checkUserLevel, role } = useRole();
  const navigate = useNavigate();

  const shouldRedirect = (strict && role != requiredRole) || !checkUserLevel(requiredRole);

  useEffect(() => {
    if (shouldRedirect) {
      navigate(-1);
    }
  }, [shouldRedirect, navigate]);

  if (shouldRedirect) return null;
  return <Outlet />;
}