import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductForm.css';

const ProductFormPage = ({ isEditMode }) => {
  const { productId } = useParams(); // Get the productId from the URL params

  // State for the form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('operating-systems');
  const [description, setDescription] = useState('');
  const [developer, setDeveloper] = useState('');
  const [platform, setPlatform] = useState('PC');
  const [price, setPrice] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [size, setSize] = useState('');
  const [titleImage, setTitleImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // Error state
  const [errors, setErrors] = useState({});

  // Sample data for editing (Replace this with an API call to fetch product details later)
  const sampleProductData = {
    Name: 'Sample Software',
    Category: 'games',
    Description: 'This is a sample description for the software.',
    Developer: 'Sample Developer',
    Platform: 'PC',
    Price: '29.99',
    ReleaseDate: '2023-05-12',
    Size: '2.5',
    TitleImage: 'https://via.placeholder.com/100',
    GalleryImages: [
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
    ],
  };

  // Simulate fetching product data when in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Here you would normally fetch the product details from the backend using the productId
      // Simulating fetch with sample data
      setName(sampleProductData.Name);
      setCategory(sampleProductData.Category);
      setDescription(sampleProductData.Description);
      setDeveloper(sampleProductData.Developer);
      setPlatform(sampleProductData.Platform);
      setPrice(sampleProductData.Price);
      setReleaseDate(sampleProductData.ReleaseDate);
      setSize(sampleProductData.Size);
      setTitleImage(sampleProductData.TitleImage);
      setGalleryImages(sampleProductData.GalleryImages);
    }
  }, [isEditMode, productId]);

  // Handle image changes
  const handleTitleImageChange = (e) => {
    setTitleImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(files.map(file => URL.createObjectURL(file)));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Software name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!developer) newErrors.developer = 'Developer name is required';
    if (!price || isNaN(price)) newErrors.price = 'Valid price is required';
    if (!releaseDate) newErrors.releaseDate = 'Release date is required';
    if (!size || isNaN(size)) newErrors.size = 'Valid size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission (Save data to backend)
      console.log('Form submitted!');
    }
  };

  return (
    <div className="product-form-page">
      <h1>{isEditMode ? 'Edit Software' : 'Add New Software'}</h1>
      <form onSubmit={handleSubmit}>
        {/* Software Name */}
        <div>
          <label htmlFor="name">Software Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter software name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="operating-systems">Operating Systems</option>
            <option value="games">Games</option>
            <option value="productivity">Productivity</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter software description"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        {/* Developer */}
        <div>
          <label htmlFor="developer">Developer</label>
          <input
            type="text"
            id="developer"
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
            placeholder="Enter developer"
          />
          {errors.developer && <p className="error">{errors.developer}</p>}
        </div>

        {/* Platform */}
        <div>
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="PC">PC</option>
            <option value="Mac">Mac</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price">Price ($)</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        {/* Release Date */}
        <div>
          <label htmlFor="release-date">Release Date</label>
          <input
            type="date"
            id="release-date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          {errors.releaseDate && <p className="error">{errors.releaseDate}</p>}
        </div>

        {/* Size */}
        <div>
          <label htmlFor="size">Size (GB)</label>
          <input
            type="text"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Enter size"
          />
          {errors.size && <p className="error">{errors.size}</p>}
        </div>

        {/* Title Image */}
        <div>
          <label htmlFor="title-image">Title Image</label>
          <input type="file" id="title-image" onChange={handleTitleImageChange} />
          {titleImage && <div className="image-preview"><img src={titleImage} alt="Title preview" /></div>}
        </div>

        {/* Gallery Images */}
        <div>
          <label htmlFor="gallery-images">Gallery Images</label>
          <input type="file" id="gallery-images" multiple onChange={handleGalleryImagesChange} />
          {galleryImages.length > 0 && (
            <div className="image-preview">
              {galleryImages.map((image, index) => (
                <img key={index} src={image} alt={`Gallery preview ${index}`} />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit">{isEditMode ? 'Update Software' : 'Add Software'}</button>
      </form>
    </div>
  );
};

export default ProductFormPage;
