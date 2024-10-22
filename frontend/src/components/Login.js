import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../utils/api';  // Adjust the path based on your structure

const Login = () => {
  const [email, setEmail] = useState('');  // Changed from username to email
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Use email instead of username
    });

    let data;  // Declare data here

    if (response.ok) {
      data = await response.json(); // Assign data if response is OK
      localStorage.setItem('token', data.access_token); // Store the token
      login(); // Set authenticated state
      window.location.href = '/home'; // Redirect to home page
    } else {
      alert('Login failed');
    }
    
    // Log data only if it's defined
    if (data) {
      console.log('Login response:', data);
      console.log('Storing token:', data.access_token);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"  // Input type set to email
        placeholder="Email"
        value={email}  // Changed from username to email
        onChange={(e) => setEmail(e.target.value)}  // Set email instead of username
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;