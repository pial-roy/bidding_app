import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../utils/api';

const BiddingPage = () => {
    const { itemId } = useParams(); // Get the itemId from the URL
    const [product, setProduct] = useState({});
    const [bidAmount, setBidAmount] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchItem = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.ITEM(itemId)); // Use itemId in the endpoint
            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItem(); // Fetch item when the component mounts
    }, [itemId]);

    const handleBid = async (e) => {
        e.preventDefault();
        const bidValue = parseFloat(bidAmount);
        if (isNaN(bidValue) || bidValue <= product.current_highest_bid) {
            alert('Please place a valid bid higher than the current highest bid.');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.PLACE_BID(itemId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',  // Include cookies in the request
                body: JSON.stringify({
                    amount: bidValue,
                    item_id: itemId,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'An error occurred while placing the bid.');
            }

            alert('Bid placed successfully!');
            setBidAmount('');
            fetchItem(); // Refetch the updated bids
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;

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