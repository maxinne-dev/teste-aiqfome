import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@app/../root/App';
import CustomersListPage from '@modules/customers/pages/CustomersListPage';
import CustomerCreatePage from '@modules/customers/pages/CustomerCreatePage';
import CustomerEditPage from '@modules/customers/pages/CustomerEditPage';
import ProductsPage from '@modules/products/pages/ProductsPage';
import LoginPage from '@modules/auth/pages/LoginPage';
import { RequireAuth } from './RequireAuth';
import Shell from './layout/Shell';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <App /> },
      { path: 'customers', element: <CustomersListPage /> },
      { path: 'customers/new', element: <CustomerCreatePage /> },
      { path: 'customers/:id', element: <CustomerEditPage /> },
      {
        path: 'products',
        element: (
          <RequireAuth>
            <ProductsPage />
          </RequireAuth>
        )
      }
    ]
  }
]);
