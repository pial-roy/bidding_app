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

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS, {
        method: 'GET',
        credentials: 'include'  // Include cookies in the request
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Function to add a new product
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
        credentials: 'include' // Include credentials
      });

      if (response.ok) {
        fetchProducts(); // Refresh product list
        setNewProduct({ name: '', description: '', starting_price: '', auction_start_time: null, duration: '' }); // Reset form
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      alert('Error adding product: ' + error.message);
    }
  };

  // Function to edit an existing product
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
        credentials: 'include' // Include credentials
      });

      if (response.ok) {
        fetchProducts(); // Refresh product list
        setIsEditing(false); // Reset editing state
        setNewProduct({ name: '', description: '', starting_price: '', auction_start_time: null, duration: '' }); // Reset form
        setEditingProductId(null); // Clear editing product ID
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // Function to delete a product
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${API_ENDPOINTS.PRODUCTS}${productId}`, {
          method: 'DELETE',
          credentials: 'include' // Include credentials
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

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      editProduct(editingProductId); // Edit the product
    } else {
      addProduct(e); // Add a new product
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
          required
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
            <h3>{product.name}</h3>
            <p>Starting Price: ${product.starting_price}</p>
            <p>Description: {product.description}</p>
            <p>Auction starts at: {new Date(product.auction_start_time).toLocaleString()}</p>
            <p>Duration: {product.duration} minutes</p>
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