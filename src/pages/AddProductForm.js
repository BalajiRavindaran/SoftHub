import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Assuming your API endpoint is '/api/products'
      const response = await axios.post('https://gr12hosxh1.execute-api.ca-central-1.amazonaws.com/lambda-put-deploy-1', {
        productName,
        price,
        description,
        category,
        imageUrl
      });
      
      console.log('Product added successfully:', response.data);
      
      // After successful addition, you might want to reset the form
      // or redirect to another page
      alert('Product added successfully!');
      
      // Optionally, you could reset the form here
      // setProductName('');
      // setPrice('');
      // setDescription('');
      // setCategory('');
      // setImageUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  
    
    console.log('Product Data:', {
      productName,
      price,
      description,
      category,
      imageUrl
    });

    // Redirect to Products page after submission
    navigate('/products');
  };

  return (
    <div className="add-product-page">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>
          Product Name:
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            step="any"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="operating Systems">operating Systems</option>
            <option value="streaming services">streaming services</option>
            <option value="games">games</option>
            <option value="video-editors">video-editors</option>
          </select>
        </label>

        <label>
          Image URL:
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </label>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;