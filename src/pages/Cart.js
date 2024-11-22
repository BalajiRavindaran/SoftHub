import React, { useState, useEffect, useContext } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Cart.css";
import AuthContext from "../components/AuthContext";

function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  const [removingItemId, setRemovingItemId] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const API_URL =
    "https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment";

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
      const response = await fetch(
        `https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
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
    return items
      .reduce((total, item) => total + parseFloat(item.price), 0)
      .toFixed(2);
  };

  const handleRemove = async (productId) => {
    setRemovingItemId(productId); // Trigger animation

    try {
      const response = await fetch(
        `https://p3aqkfift3.execute-api.ca-central-1.amazonaws.com/Cart/Cart?userName=${userSub}&productId=${productId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      // Remove item from state after animation
      setTimeout(() => {
        setItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
        setRemovingItemId(null); // Reset state
      }, 500);
    } catch (err) {
      console.error(err.message);
      alert("Error removing item.");
      setRemovingItemId(null); // Reset state on error
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setProcessingPayment(true);
    setPaymentResult(null);

    const requestData = {
      amount: parseInt(calculateTotal() * 100), // Convert to cents
      currency: "cad",
      description: "Payment for cart items",
      receipt_email: userDetails?.email || "customer@example.com",
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: JSON.stringify(requestData) }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      const { client_secret } = parsedData;

      if (!client_secret) {
        throw new Error("Client Secret is missing from backend response");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setPaymentResult({ error: error.message });
      } else if (paymentIntent.status === "succeeded") {
        setPaymentResult({ success: "Payment succeeded!" });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setPaymentResult({ error: "Payment failed" });
    } finally {
      setProcessingPayment(false);
    }
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
              <div
                className={`cart-item ${
                  removingItemId === item.productId ? "cart-item-removing" : ""
                }`}
                key={item.productId}
              >
                <img
                  src={item["title-image"]}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                </div>
                <div className="cart-item-actions">
                  <span className="cart-item-price">${item.price}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(item.productId)}
                  >
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
          <div className="payment-section">
            <CardElement />
            <button
              className="payment-button"
              onClick={handlePayment}
              disabled={processingPayment}
            >
              {processingPayment ? "Processing..." : "Buy Now"}
            </button>
          </div>
          {paymentResult && (
            <div className="payment-result">
              {paymentResult.error ? (
                <div className="error-message">{paymentResult.error}</div>
              ) : (
                <div className="success-message">{paymentResult.success}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CartPage;
