import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import routers from './router/router';
import { ToastContainer } from 'react-toastify';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={routers} />
    <ToastContainer position="top-right" autoClose={2000} />
  </React.StrictMode>
);

