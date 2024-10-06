// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ProductForm from './pages/ProductForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:categorySlug" element={<Products />} />
        <Route path="/products/:categorySlug/:productId" element={<ProductDetails />} />
        <Route path="/provider/add-software" element={<ProductForm isEditMode={false} />} />
        <Route path="/provider/edit-software/:productId" element={<ProductForm isEditMode={true} />} />
      </Routes>
    </Router>
  );
}

export default App;
