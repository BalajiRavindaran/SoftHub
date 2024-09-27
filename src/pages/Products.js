import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Import to get params from the URL
import './Products.css'; 

const Products = () => {
  const { categorySlug } = useParams(); // Get categorySlug from URL parameters
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    // Sample product data
    {
      id: 1,
      name: 'Call of Duty: Warzone',
      category: 'games',
      imgUrl: '/images/Games.png',
      price: '$49.99',
      rating: 4.5,
      reviews: 120,
      description: 'This is an awesome software for gaming.',
    },
    {
        id: 5,
        name: 'Dead by Daylight',
        category: 'games',
        imgUrl: '/images/Games.png',
        price: '$49.99',
        rating: 4.0,
        reviews: 60,
        description: 'This is an awesome software for gaming.',
      },
    {
      id: 2,
      name: 'Windows 10 Pro',
      category: 'microsoft',
      imgUrl: '/images/Microsoft.png',
      price: '$99.99',
      rating: 4.8,
      reviews: 200,
      description: 'This is a popular Microsoft product.',
    },
    {
      id: 3,
      name: 'Adobe Premiere Pro',
      category: 'video-editors',
      imgUrl: '/images/VEditors.png',
      price: '$239.99',
      rating: 4.7,
      reviews: 350,
      description: 'A great tool for video editing.',
    },
    {
      id: 4,
      name: 'Netflix',
      category: 'streaming-services',
      imgUrl: '/images/Entertainment.png',
      price: '$13.99',
      rating: 4.2,
      reviews: 500,
      description: 'A streaming service for movies and TV shows.',
    },
  ];

  // Filter products by categorySlug and search term
  const filteredProducts = products.filter(
    product =>
      product.category.toLowerCase() === categorySlug.toLowerCase() &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-container">
      <h1>{categorySlug.replace('-', ' ').toLocaleUpperCase()}</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.imgUrl} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price}</p>
              <p className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</p>
              <p className="product-description">{product.description}</p>
            </div>
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
