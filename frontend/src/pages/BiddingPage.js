// src/BiddingPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../utils/api';

const BiddingPage = () => {
    const { itemId } = useParams(); // Get the itemId from the URL
    const [product, setProduct] = useState({});
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            const response = await fetch(API_ENDPOINTS.ITEM);
            if (response.ok) {
                const data = await response.json();
                setProduct(data);
            } else {
                console.error('Failed to fetch product:', response.statusText);
            }
        };
        fetchItem();
    }, [itemId]);

    const handleBid = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve the stored token
        const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT token to get user info
    
        const response = await fetch(API_ENDPOINTS.PLACE_BID, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include the JWT token
            },
            body: JSON.stringify({
                amount: parseFloat(bidAmount),
                username: user.username, // Include username
                item_id: itemId,  // Include the item ID
                timestamp: new Date().toISOString(), // Add timestamp
            }),
        });
    
        if (response.ok) {
            alert('Bid placed successfully!');
            setBidAmount('');
            // Optionally, refetch the product to update bids
            // fetchItem();
        } else {
            const errorData = await response.json();
            console.error('Error details:', errorData); // Log the error object to the console
            alert(errorData.detail || 'An error occurred while placing the bid.'); // Provide a user-friendly message
        }
    };

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Starting Price: ${product.starting_price}</p>
            <h3>Bids:</h3>
            <ul>
                {product.bids && product.bids.map((bid, index) => (
                    <li key={index}>
                        {bid.username} bid ${bid.amount} at {new Date(bid.timestamp).toLocaleString()}
                    </li>
                ))}
            </ul>

            <form onSubmit={handleBid}>
                <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter your bid"
                    required
                />
                <button type="submit">Place Bid</button>
            </form>
        </div>
    );
};

export default BiddingPage;