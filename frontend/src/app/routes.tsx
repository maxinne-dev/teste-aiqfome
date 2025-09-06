import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '@app/../root/App';
import CustomersListPage from '@modules/customers/pages/CustomersListPage';
import CustomerCreatePage from '@modules/customers/pages/CustomerCreatePage';
import CustomerEditPage from '@modules/customers/pages/CustomerEditPage';

export const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/customers', element: <CustomersListPage /> },
  { path: '/customers/new', element: <CustomerCreatePage /> },
  { path: '/customers/:id', element: <CustomerEditPage /> }
]);

