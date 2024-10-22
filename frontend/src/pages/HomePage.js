// frontend/src/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { API_ENDPOINTS } from '../utils/api';  // Adjust the path based on your structure

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 60000); // Refresh product list every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    fetch(API_ENDPOINTS.ITEMS, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch products. Please check your token.');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setProducts(data.map(product => ({
          ...product,
          auction_start_time: new Date(product.auction_start_time),
        })));
      } else {
        console.error('Fetched data is not an array:', data);
      }
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  };

  const getTimeLeft = (startTime, duration) => {
    const end = new Date(startTime.getTime() + duration * 60 * 1000); // duration in minutes
    const now = new Date();
    const timeDiff = end - now;

    if (timeDiff <= 0) {
      return 'Auction Ended';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getCountdownUntilAuctionStarts = (startTime) => {
    const now = new Date();
    const timeDiff = startTime - now;

    if (timeDiff <= 0) {
      return 'Auction has started';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const isAuctionOngoing = (startTime, duration) => {
    const end = new Date(startTime.getTime() + duration * 60 * 1000); // duration in minutes
    const now = new Date();
    return now >= startTime && now <= end;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prevProducts => prevProducts.map(product => {
        if (product.auction_start_time && product.duration) {
          return {
            ...product,
            timeLeft: getTimeLeft(product.auction_start_time, product.duration),
            auctionOngoing: isAuctionOngoing(product.auction_start_time, product.duration),
            countdownUntilAuctionStarts: getCountdownUntilAuctionStarts(product.auction_start_time),
          };
        }
        return product;
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []); // Use an empty dependency array to run only once

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {Array.isArray(products) && products.map(product => (
          <li key={product.id}>
            <h3>{product.name} - ${product.starting_price}</h3>
            <p>{product.description}</p>
            <p>Auction starts at: {product.auction_start_time.toLocaleString()}</p>
            {product.auction_start_time && product.duration ? (
              product.auctionOngoing ? (
                <p>Auction ends in: {product.timeLeft}</p>
              ) : (
                <p>Auction starts in: {product.countdownUntilAuctionStarts}</p>
              )
            ) : (
              <p>No auction scheduled</p>
            )}
            {/* Add a link to the bidding page */}
            <Link to={`/bid/${product.id}`}>Place a Bid</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;