import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#12100c',
                color: '#f5ecd8',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#d4af37', secondary: '#0a0806' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0a0806' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
