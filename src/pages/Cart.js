import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import AuthContext from '../components/AuthContext';

function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  useEffect(() => {
    // If the user is authenticated, fetch their cart items from the API
    if (isAuthenticated && userSub) {
      fetchCartItems(userSub);
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userSub]);

  const fetchCartItems = async (userSub) => {
    try {
      const response = await fetch(`https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }
      const data = await response.json();
      setItems(data.cartItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
  };  

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img src={item['title-image']} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">${(item.price)}</span>
                  <button className="remove-button" onClick={() => handleRemove(item.productId)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="total-container">
            <span className="total-text">Total:</span>
            <span className="total-amount">${calculateTotal()}</span>
          </div>
          <button className="payment-button">Buy Now</button>
        </>
      )}
    </div>
  );
}

export default CartPage;
