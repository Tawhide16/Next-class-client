import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { router } from './Router/Route.jsx';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './Provider/AuthProvider.jsx';

// ➕ নতুন কোড
import { QueryClientProvider } from '@tanstack/react-query';

import StripeProvider from './Provider/StripeProvider.jsx';
import { queryClient } from './queryClient.jsx';
 // এই ফাইলটা বানাস নাই? উপরে বলছি কিভাবে বানাবি
 
 // এই ফাইলটা বানাস নাই? উপরে বলছি কিভাবে বানাবি

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StripeProvider>
          <RouterProvider router={router} />
        </StripeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
