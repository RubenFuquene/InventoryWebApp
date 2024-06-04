import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import Home from '../components/Home';
import ProtectedRoute from './ProtectedRoute';
import AuthRedirect from './AuthRedirect';
import Categories from '../components/Categories';
import Products from '../components/Products';
import Movements from '../components/Movements';
import Inventory from '../components/Inventory';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/login" element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>} />
        <Route path="/categories" element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="/add-movement" element={
          <ProtectedRoute>
            <Movements />
          </ProtectedRoute>
        } />
        <Route path="/inventories" element={
          <ProtectedRoute>
            <Inventory />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;