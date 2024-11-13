import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import './ProductDetails.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const stripePromise = loadStripe('pk_test_51QK8A7IKDma6OOXz5P6x8Y82Ph13QXoIeJnPfNkZCy3eNB6qMUhfArnpFwG3CsDEWtw9wQbKHzF4nhwNFjaHUWuD00L6dLJNuO');  // Replace with your Stripe publishable key

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '0',
};

const ProductDetails = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);  
  const [newReview, setNewReview] = useState("");
  const [stars, setStars] = useState(0);
  const [sentiment, setSentiment] = useState(null);

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
        const response = await axios.get(`https://jeyfj1w15j.execute-api.ca-central-1.amazonaws.com/reviews/reviews`, {
          params: { productId }
        });
        setReviews(Array.isArray(response.data.reviews) ? response.data.reviews : []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };
    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await axios.get(`https://jh3oxqtqn4.execute-api.ca-central-1.amazonaws.com/productId/analyzeReview`, {
          params: { productId }
        });
        setSentiment(response.data[0]);
      } catch (error) {
        console.error("Error fetching sentiment analysis:", error);
      }
    };
    fetchSentiment();
  }, [productId]);

  const handlePostReview = async () => {
    if (!newReview || stars === 0) return;

    const reviewData = {
      productId,
      content: newReview,
      rating: stars
    };

    try {
      const response = await axios.post(`https://jeyfj1w15j.execute-api.ca-central-1.amazonaws.com/reviews/reviews`, reviewData);
      setReviews([...reviews, { ...reviewData, postedAt: new Date().toISOString() }]);
      setNewReview("");
      setStars(0);
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // Handle the Buy button click
  const handleBuyButtonClick = async () => {
    const stripe = await stripePromise;  // Load Stripe.js

    try {
      const response = await axios.post('https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment', { 
        amount: product.Price * 100, // amount in cents
        currency: 'usd',
        description: `Payment for ${product.Name}`,
      });

      const { client_secret } = response.data;

      // Confirm the payment using Stripe.js
      const { error } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: CardElement, // cardElement should be a reference to your CardElement component
        },
      });

      if (error) {
        console.error("Payment failed:", error);
        alert('Payment failed');
      } else {
        if (CardElement.status === 'succeeded') {
          alert('Payment successful!');
        }
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert('Error during payment processing');
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
              <span className="tag">Supported Platforms: {product.Platform}</span>
            </div>
            {sentiment && (
                <div className="rainbow">
                  <p>What Everyone Thinks: </p>
                  <p>
                    {Array.from({ length: parseInt(sentiment.label[0]) }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </p>
                </div>
              )}
            <div className="buy-button-container">
              <button className="buy-button" onClick={handleBuyButtonClick}>Buy ${product.Price}</button>
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
          {Array.isArray(reviews) && reviews.map((review) => (
            <div key={review['review-id']} className="review-item">
              <p><strong>Rating:</strong> <span className="rating-stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>
              <p>{review.content}</p>
              <time>Posted on: {new Date(review['posted-at']).toLocaleString()}</time>
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
