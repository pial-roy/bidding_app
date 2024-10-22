import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_ENDPOINTS } from '../utils/api';

const ProductManagerPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    starting_price: '',
    auction_start_time: null,
    duration: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      // Convert auction_start_time to UTC
      const utcAuctionStartTime = newProduct.auction_start_time ? 
        new Date(newProduct.auction_start_time.getTime() - newProduct.auction_start_time.getTimezoneOffset() * 60000) 
        : null;

      const productToAdd = {
        ...newProduct,
        auction_start_time: utcAuctionStartTime,
      };

      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToAdd),
      });

      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', description: '', starting_price: '', auction_start_time: null, duration: '' });
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  const editProduct = async (productId) => {
    try {
      const utcAuctionStartTime = newProduct.auction_start_time ? 
        new Date(newProduct.auction_start_time.getTime() - newProduct.auction_start_time.getTimezoneOffset() * 60000) 
        : null;

      const productToEdit = {
        ...newProduct,
        auction_start_time: utcAuctionStartTime,
      };

      const response = await fetch(`${API_ENDPOINTS.PRODUCTS}${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToEdit),
      });

      if (response.ok) {
        fetchProducts();
        setIsEditing(false);
        setNewProduct({ name: '', description: '', starting_price: '', auction_start_time: null, duration: '' });
        setEditingProductId(null);
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchProducts(); // Refresh product list after deletion
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      editProduct(editingProductId);
    } else {
      addProduct(e);
    }
  };

  return (
    <div>
      <h1>Manage Products</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Starting Price"
          value={newProduct.starting_price}
          onChange={(e) => setNewProduct({ ...newProduct, starting_price: e.target.value })}
          required
        />
        <DatePicker
          selected={newProduct.auction_start_time}
          onChange={(date) => setNewProduct({ ...newProduct, auction_start_time: date })}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Select auction start time"
        />
        <input
          type="number"
          placeholder="Duration (in minutes)"
          value={newProduct.duration}
          onChange={(e) => setNewProduct({ ...newProduct, duration: e.target.value })}
          required
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.starting_price}
            <br />
            {product.description}
            <br />
            Auction starts at: {new Date(product.auction_start_time).toLocaleString()}
            <br />
            Duration: {product.duration} minutes
            <br />
            <button onClick={() => {
              setIsEditing(true);
              setNewProduct({
                name: product.name,
                description: product.description,
                starting_price: product.starting_price,
                auction_start_time: new Date(product.auction_start_time),
                duration: product.duration
              });
              setEditingProductId(product.id);
            }}>Edit</button>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductManagerPage;