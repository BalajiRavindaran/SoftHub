import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import to get params from the URL and navigate
import './Products.css'; 
import Filter from '../components/Filter';
import '../components/Filter.css';

const Products = () => {
  const { categorySlug } = useParams(); // Get categorySlug from URL parameters
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // For navigation purposes
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState(0);
  

  // Sample product data
  const products = [
    { id: 1, name: 'Call of Duty: Warzone', category: 'games', imgUrl: '/images/Games.png', price: '$49.99', rating: 4.5, reviews: 120, description: 'This is an awesome software for gaming.' },
    { id: 5, name: 'Dead by Daylight', category: 'games', imgUrl: '/images/Games.png', price: '$49.99', rating: 4.0, reviews: 60, description: 'This is an awesome software for gaming.' },
    { id: 2, name: 'Windows 10 Pro', category: 'microsoft', imgUrl: '/images/Microsoft.png', price: '$99.99', rating: 4.8, reviews: 200, description: 'This is a popular Microsoft product.' },
    { id: 3, name: 'Adobe Premiere Pro', category: 'video-editors', imgUrl: '/images/VEditors.png', price: '$239.99', rating: 4.7, reviews: 350, description: 'A great tool for video editing.' },
    { id: 4, name: 'Netflix', category: 'streaming-services', imgUrl: '/images/Entertainment.png', price: '$13.99', rating: 4.2, reviews: 500, description: 'A streaming service for movies and TV shows.' },
  ];

  // Categories description
  const categories = {
    'games': 'All the best games available for various platforms.',
    'microsoft': 'Explore the latest and greatest Microsoft products.',
    'video-editors': 'The top software for all your video editing needs.',
    'streaming-services': 'Entertainment software for streaming music, movies, and more.',
  };

  // Filter products by categorySlug and search term
  const filteredProducts = products.filter(product => {
    let isInCategory = true;
    let isInPriceRange = true;
    let meetsMinRating = true;
    let matchesSearch = true;

    // Apply category filter only if categorySlug exists
    if (categorySlug) {
      isInCategory = product.category.toLowerCase() === categorySlug.toLowerCase();
    }

    // Apply price filter only if minPrice or maxPrice is set
    if ((minPrice !== '' || maxPrice !== '') && product.price) {
      const priceValue = parseFloat(product.price.replace('$', ''));
      isInPriceRange = (minPrice === '' || parseFloat(minPrice.replace('$', '')) <= priceValue) &&
                       (maxPrice === '' || priceValue <= parseFloat(maxPrice.replace('$', '')));
    }

    // Apply rating filter only if rating is greater than 0
    if (rating > 0) {
      meetsMinRating = product.rating >= rating;
    }

    // Apply search filter only if searchTerm is not empty
    if (searchTerm.trim()) {
      matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return isInCategory && isInPriceRange && meetsMinRating && matchesSearch;
  });

  // Add these new functions
  const handleCategoryChange = (value) => {
    // Handle category change logic here if needed
    console.log('Selected Category:', value);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleProductClick = (productId) => {
    // Navigate to a dynamic product details page
    navigate(`/products/${categorySlug}/${productId}`);
  };

  return (
    <div className="products-container">
      <h1>{categorySlug.replace('-', ' ').toLocaleUpperCase()}</h1>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      
      <div className='filter-container'>
        <Filter 
          minPrice={minPrice} 
          maxPrice={maxPrice} 
          rating={rating} 
          setSelectedCategory={handleCategoryChange} 
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setRating={handleRatingChange} 
        />
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
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