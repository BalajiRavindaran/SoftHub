import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './MyProduct.css';
import Filter from '../components/Filter';
import '../components/Filter.css';
import LoadingSpinner from '../components/LoadingSpinner';
import AddProductForm from './AddProductForm';
import './AddProductForm.css';


const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const { categorySlug } = useParams(); // Get categorySlug from URL parameters
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://dseobqi29d.execute-api.ca-central-1.amazonaws.com/dev/?provider_id=2`
            );
            const data = await response.json();
            setProducts(data.body.products);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        let isInPriceRange = true;
        let meetsMinRating = true;

        if ((minPrice !== '' || maxPrice !== '') && product.price) {
            const priceValue = parseFloat(product.price.replace('$', ''));
            isInPriceRange = (minPrice === '' || parseFloat(minPrice.replace('$', '')) <= priceValue) &&
                (maxPrice === '' || priceValue <= parseFloat(maxPrice.replace('$', '')));
        }

        if (rating > 0) {
            meetsMinRating = product.rating >= rating;
        }

        return isInPriceRange && meetsMinRating;
    });

    const handleEdit = (productId) => {
        console.log(`Editing product: ${productId}`);
        navigate(`/edit/${productId}`);
        // Implement edit functionality here
    };

    const handleDelete = (productId) => {
        console.log(`Deleting product: ${productId}`);
        // Implement delete functionality here
    };

    const handleSearch = async () => {
        console.log("handleSearch function called");
        try {
            const payload = {
                queryStringParameters: {
                    searchTerm: searchTerm,
                    category: categorySlug
                }
            };

            const response = await fetch('https://r9hor2144d.execute-api.ca-central-1.amazonaws.com/dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                redirect: "follow"
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${await response.text()}`);
            }

            const data = await response.json();
            setFilteredResults(data.body);
        } catch (error) {
            console.error('Error fetching search results:', error.message || error);
        }
    };

    const closeMenu = () => {
        // Close menu logic here
        // For example, you might want to update a state variable
        setShowForm(false);
      };

    return (
        <div className="my-products-container">
            {/* Search bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Filter */}
            <Filter
                minPrice={minPrice}
                maxPrice={maxPrice}
                rating={rating}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setRating={(newRating) => setRating(newRating)}
            />

            {/* Product grid */}
            <div className="product-grid">
                <div className="add-product-button" >
                    <button onClick={() => 
                        navigate("/addProducts")
                    }>+</button>
                </div>
                {filteredProducts.map(product => (
                    <div key={product['product-id']} className="product-card">
                        <img src={product.imgUrl} alt={product.name} className="product-image" />
                        <div className="product-details-info">
                            <div className="product-actions">
                                <button onClick={() => handleEdit(product['product-id'])}>Edit</button>
                                <button onClick={() => handleDelete(product['product-id'])}>Delete</button>
                            </div>
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-price">{product.price}</p>
                            <p className="product-rating">⭐ {product.rating} ({product.reviews} reviews)</p>
                            <p className="product-description">{product.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyProducts;