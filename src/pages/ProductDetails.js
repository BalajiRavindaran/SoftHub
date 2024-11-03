import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0',
};

// Sample data for reviews
const sampleReviews = [
  {
    id: 1,
    content: "Amazing product! Highly recommend for anyone looking to improve their workflow.",
    rating: 5,
    postedAt: "2024-10-31 10:00",
  },
  {
    id: 2,
    content: "Good value for the price, but could use more features.",
    rating: 4,
    postedAt: "2024-11-01 14:30",
  },
  {
    id: 3,
    content: "The interface is a bit clunky, but overall it does the job.",
    rating: 3,
    postedAt: "2024-11-02 08:45",
  },
  {
    id: 4,
    content: "Not what I expected. Limited functionality for the price.",
    rating: 2,
    postedAt: "2024-11-02 12:20",
  },
];



const ProductDetails = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [stars, setStars] = useState(0);

  // Fetch product details
  useEffect(() => {
    setLoading(true);
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
  }, [productId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://your-api-url/productReviews`, { params: { productId } });
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  const handlePostReview = async () => {
    if (!newReview || stars === 0) return;

    const reviewData = {
      productId,
      reviewText: newReview,
      stars,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`https://your-api-url/productReviews`, reviewData);
      setReviews([...reviews, reviewData]);
      setNewReview("");
      setStars(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

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
        <h3>Reviews ({reviews.length})</h3>
        <textarea
          placeholder="Write your review here..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <div>
          <label>Rating:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(parseInt(e.target.value))}
          />
        </div>
        <button onClick={handlePostReview}>Post Review</button>

        <div className="review-list">
    {sampleReviews.map((review) => (
      <div key={review.id} className="review-item">
        <p><strong>Rating:</strong> <span className="rating-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
        <p>{review.content}</p>
        <time>Posted on: {review.postedAt}</time>
      </div>
    ))}
  </div>
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <h3>You may also like:</h3>
        <div className="recommended-products">
          <div
            className="recommended-product"
            onClick={() => handleRecommendationClick('video-editors', 3)}
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
