import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import './ProductDetails.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2, // Show one image at a time
  slidesToScroll: 1,
  centerMode: true, // Keep images centered
  centerPadding: '0', // Remove padding from sides of images
};


const ProductDetails = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate();

  // State to hold product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch product details from API whenever productId changes
  useEffect(() => {
    setLoading(true);
    setProduct(null);  // Reset product state to trigger re-render
  
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`https://46x4o900l3.execute-api.ca-central-1.amazonaws.com/productDetails/products`, {
          params: { productId }
        });
  
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Add productId as a dependency to re-fetch on productId change

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  // Handle recommendation click
  const handleRecommendationClick = (recProductCategory, recProductId) => {
    navigate(`/products/${recProductCategory}/${recProductId}`);
  };

  return (
    <div className="product-page">
      {/* Header Section */}
      <header className="product-header">
        <div className="header-content">
          <img src={product['title-image']} alt={product.Name} className="game-image" />
          <div className="game-info">
            <h1 className="game-title">{product.Name}</h1>
            <p className="developer-info">{product.Developer} - {categorySlug}</p>
            <div className="tags">
              <span className="tag">New</span>
              <span className="tag">Supported Platforms: {product.Platform}</span>
            </div>
            <div className="buy-button-container">
              <button className="buy-button">Buy {product.Price}</button>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="gallery-section">
  <h2>Gallery</h2>
  <Slider {...settings}>
    {product['gallery-images'].map((imgUrl, index) => (
      <div key={index} className="gallery">
        <img src={imgUrl} alt={`Gallery ${index + 1}`} />
      </div>
    ))}
  </Slider>
</section>


      {/* Description Section */}
      <section className="description-section">
        <div className="description">
          <h3>Description</h3>
          <p>{product.Description}</p>
        </div>
        <div className="product-details">
          <p><strong>Developer:</strong> {product.Developer}</p>
          <p><strong>Release Date:</strong> {product.ReleaseDate}</p>
          <p><strong>Size:</strong> {product.Size}</p>
        </div>
      </section>

      {/* Features Section */}
      <div className="product-features">
        <h3>Features:</h3>
        <ul>
          {product.Features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h3>Reviews ({product.Reviews})</h3>
        {/* Add review logic or a review section here */}
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <h3>You may also like:</h3>
        <div className="recommended-products">
          {/* This is just a placeholder. You may want to fetch recommendations dynamically */}
          {/* Example of static recommendation */}
          <div
            className="recommended-product"
            onClick={() => handleRecommendationClick('video-editors', 3)} // Handle click to navigate to the recommended product
          >
            <img src="/images/VEditors.png" alt="Recommended product" />
            <h4>Adobe Premiere Pro</h4>
            <p>$239.99</p>
          </div>
        </div>
      </section>

      {/* Playable Platforms & Capabilities */}
      <section className="playable-capabilities-section">
        <h3>Playable On</h3>
        <div className="playable-platforms">
          <span className="platform">{product.Platform}</span>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
