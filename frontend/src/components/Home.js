import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const username = location.state?.username || 'Guest';

  return (
    <div>
      <h1>Welcome, {username}!</h1>
      <p>Enjoy shopping at the Retail Auction App.</p>
    </div>
  );
};

export default Home;