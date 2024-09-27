import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ProductDetails.css';

const ProductDetails = () => {
  const { categorySlug, productId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate

  const products = [
    {
      id: 1,
      name: 'Call of Duty: Warzone',
      category: 'games',
      imgUrl: '/images/Games.png',
      price: '$49.99',
      rating: 4.5,
      reviews: 120,
      description: 'An action-packed battle royale experience with realistic combat mechanics and an expansive map.',
      features: [
        'Realistic graphics and immersive gameplay',
        'Free-to-play multiplayer mode',
        'Cross-platform support',
        'Variety of weapons and tactical equipment'
      ],
      specifications: {
        developer: 'Infinity Ward',
        releaseDate: 'March 10, 2020',
        platform: 'PC, PlayStation, Xbox',
        size: '150 GB',
      }
    },
    {
      id: 2,
      name: 'Windows 10 Pro',
      category: 'microsoft',
      imgUrl: '/images/Microsoft.png',
      price: '$99.99',
      rating: 4.8,
      reviews: 200,
      description: 'The most versatile version of Windows, designed for professionals and small businesses.',
      features: [
        'BitLocker encryption',
        'Remote Desktop access',
        'Windows Update for Business',
        'Hyper-V virtualization technology',
      ],
      specifications: {
        developer: 'Microsoft',
        releaseDate: 'July 29, 2015',
        platform: 'PC',
        size: '20 GB',
      }
    },
    {
      id: 3,
      name: 'Adobe Premiere Pro',
      category: 'video-editors',
      imgUrl: '/images/VEditors.png',
      price: '$239.99',
      rating: 4.7,
      reviews: 350,
      description: 'A professional video editing software used by filmmakers, YouTubers, and video enthusiasts alike.',
      features: [
        'Advanced color correction tools',
        'Seamless integration with Adobe products',
        'Supports 8K video editing',
        'Powerful video and audio editing tools',
      ],
      specifications: {
        developer: 'Adobe Inc.',
        releaseDate: 'September 23, 2003',
        platform: 'PC, macOS',
        size: '3 GB',
      }
    },
    {
      id: 4,
      name: 'Netflix',
      category: 'streaming-services',
      imgUrl: '/images/Entertainment.png',
      price: '$13.99/month',
      rating: 4.2,
      reviews: 500,
      description: 'A subscription-based streaming service offering a vast collection of TV shows, movies, and documentaries.',
      features: [
        'Access to thousands of movies and TV shows',
        'Offline viewing on mobile devices',
        'Multi-language support',
        '4K Ultra HD and HDR streaming',
      ],
      specifications: {
        developer: 'Netflix, Inc.',
        releaseDate: 'August 29, 1997',
        platform: 'PC, macOS, iOS, Android, Smart TVs',
        size: 'Depends on streaming quality (3 GB/hour for HD)',
      }
    },
    {
      id: 5,
      name: 'Dead by Daylight',
      category: 'games',
      imgUrl: '/images/Games.png',
      price: '$49.99',
      rating: 4.0,
      reviews: 60,
      description: 'A multiplayer (4vs1) horror game where one player takes on the role of a killer, and the other four play as survivors.',
      features: [
        'Asymmetrical multiplayer gameplay',
        'Variety of maps, killers, and survivors',
        'Gruesome horror setting',
        'Regular updates with new characters and maps',
      ],
      specifications: {
        developer: 'Behaviour Interactive',
        releaseDate: 'June 14, 2016',
        platform: 'PC, PlayStation, Xbox, Switch',
        size: '40 GB',
      }
    }
  ];

  const reviews = [
    {
      user: 'Alice',
      rating: 5,
      comment: 'Amazing gameplay! The graphics are stunning and the experience is thrilling.',
    },
    {
      user: 'Bob',
      rating: 4,
      comment: 'Really enjoyed it, but sometimes the matchmaking can be a bit slow.',
    },
    {
      user: 'Charlie',
      rating: 3,
      comment: 'Decent game, but I expected more from the storyline.',
    },
    {
      user: 'Dana',
      rating: 4.5,
      comment: 'Great game overall! I love the variety of weapons and maps available.',
    }
  ];

  const recommendedProducts = products.filter(p => p.id !== parseInt(productId)).slice(0, 3);

  const product = products.find((p) => p.id === parseInt(productId));

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleRecommendationClick = (recProductId) => {
    navigate(`/products/${categorySlug}/${recProductId}`); // Navigate to the product details page
  };

  return (
    <div className="product-page">
      {/* Header Section */}
      <header className="product-header">
        <div className="header-content">
          <img src={product.imgUrl} alt={product.name} className="game-image" />
          <div className="game-info">
            <h1 className="game-title">{product.name}</h1>
            <p className="developer-info">{product.specifications.developer} - {categorySlug}</p>
            <div className="tags">
              <span className="tag">New</span>
              <span className="tag">Supported Platforms: {product.specifications.platform}</span>
            </div>
            <div className="buy-button-container">
              <button className="buy-button">Buy {product.price}</button>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Section */}
      <section className="gallery-section">
        <h2>Gallery</h2>
        <div className="gallery">
          <img src={product.imgUrl} alt={product.name} />
        </div>
      </section>

      {/* Description Section */}
      <section className="description-section">
        <div className="description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-details">
          <p><strong>Developer:</strong> {product.specifications.developer}</p>
          <p><strong>Release Date:</strong> {product.specifications.releaseDate}</p>
          <p><strong>Size:</strong> {product.specifications.size}</p>
        </div>
      </section>

      {/* Features Section */}
      <div className="product-features">
        <h3>Features:</h3>
        <ul>
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h3>Reviews ({reviews.length})</h3>
        {reviews.map((review, index) => (
          <div className="review" key={index}>
            <p><strong>{review.user}</strong> ⭐ {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </section>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <h3>You may also like:</h3>
        <div className="recommended-products">
          {recommendedProducts.map((recProduct) => (
            <div 
              className="recommended-product" 
              key={recProduct.id} 
              onClick={() => handleRecommendationClick(recProduct.id)} // Add click handler
            >
              <img src={recProduct.imgUrl} alt={recProduct.name} className="recommended-image" />
              <h4>{recProduct.name}</h4>
              <p>{recProduct.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Playable Platforms & Capabilities */}
      <section className="playable-capabilities-section">
        <h3>Playable On</h3>
        <div className="playable-platforms">
          <span className="platform">{product.specifications.platform}</span>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
