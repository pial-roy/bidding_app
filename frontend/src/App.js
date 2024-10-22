import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProductManagerPage from './pages/ProductManagerPage';
import BiddingPage from './pages/BiddingPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected route component to restrict access
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/admin/products" element={<ProductManagerPage />} />
          <Route path="/bid/:itemId" element={<ProtectedRoute element={<BiddingPage />}  />} />
          <Route path="/" element={
            <div>
              <h1>Welcome to the Retail Auction App!</h1>
              <p>Go to <a href="/register">Register</a> or <a href="/login">Login</a></p>
            </div>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;