// src/pages/Home.js
import React from 'react';
import './Home.css'; // Add styles for the home page


const Home = () => {
  const categories = [
    {
      title: 'Streaming Services',
      description: 'Software for movies, music, and games',
      imgUrl: '/images/Entertainment.png', // Add suitable images to your project
    },
    {
      title: 'Games',
      description: 'Software for movies, music, and games',
      imgUrl: '/images/Games.png', // Add suitable images to your project
    },
    {
      title: 'Microsoft',
      description: 'All things Microsoft software',
      imgUrl: '/images/Microsoft.png',
    },
    {
      title: 'Video Editors',
      description: 'Top software for editing videos',
      imgUrl: '/images/VEditors.png',
    },
    // Add more categories as needed
  ];

  return (
    <div className="home-container">
      <h1>Explore Software Categories</h1>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-tile">
            <img src={category.imgUrl} alt={category.title} className="category-img" />
            <div className="category-content">
              <h2 className="category-title">{category.title}</h2>
              <p className="category-description">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
