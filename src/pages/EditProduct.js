import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EditProduct.css';

const EditProductPage = () => {
    const { productId } = useParams();
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                console.log('productId:', productId);
                const response = await axios.get(`https://46x4o900l3.execute-api.ca-central-1.amazonaws.com/productDetails/products`, {
                    params: { productId }
                });
                console.log('Product data:', response.data);
                const productData = response;
                setProductName(productData.data.Name);
                setPrice(productData.data.Price);
                setDescription(productData.data.Description);
                setCategory(productData.data.Category);
                setImageUrl(productData.data['gallery-images'][0]);
            } catch (error) {
                console.error('Error fetching product:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load product data.',
                });
            }
        };
        fetchProduct();
    }, [productId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.put(`/api/products/${productId}`, {
                productName,
                price,
                description,
                category,
                imageUrl
            });

            console.log('Product updated successfully:', response.data);

            Swal.fire({
                icon: 'success',
                title: 'Product Updated!',
                text: 'The product has been updated successfully.',
            }).then(() => {
                // Optionally, navigate back to MyProducts page
                window.history.back();
            });

        } catch (error) {
            console.error('Error updating product:', error);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to update product. Please try again.',
            });
        }
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    return (
        <div className="add-product-page">
            <h1>Edit Product</h1>
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
                    <select value={category} onChange={handleCategoryChange}>
                        <option value="">Select Category</option>
                        <option value="operating Systems">operating Systems</option>
                        <option value="games">games</option>
                        <option value="streaming services">streaming services</option>
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

                <button type="submit">Submit Changes</button>
            </form>
        </div>
    );
};

export default EditProductPage;