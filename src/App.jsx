import { RouterProvider } from 'react-router';
import { authRouter, router } from './router/routes';
import useAuth from './hooks/useAuth';

function App() {
  const { isAuthenticated } = useAuth();
  if(isAuthenticated)
    return <RouterProvider router={router} />;
  else 
    return <RouterProvider router={authRouter} />;
}

export default App;
