import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Unable to find the root element for the React application.');
}

createRoot(rootElement).render(
  <StrictMode>
    <RoleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RoleProvider>
  </StrictMode>,
);