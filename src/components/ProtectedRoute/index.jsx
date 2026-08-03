import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import useRole from '../../hooks/useRole';

export default function ProtectedRoute({ requiredRole, strict = false }) {
  const { checkUserLevel, role } = useRole();
  const navigate = useNavigate();

  const shouldRedirect = (strict && role !== requiredRole) || !checkUserLevel(requiredRole);

  useEffect(() => {
    if (shouldRedirect) {
      if (role === 'guest') {
        navigate('/login', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [shouldRedirect, navigate, role]);

  if (shouldRedirect) return null;
  return <Outlet />;
}