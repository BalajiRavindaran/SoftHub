import React, { useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation } from "react-router-dom";
import './Checkout.css';
import AuthContext from '../components/AuthContext';

const CheckoutPage = () => {
  const location = useLocation();
  const { productDetails } = location.state || {};
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(''); // Track payment status

  const { isAuthenticated, userDetails } = useContext(AuthContext);
  const userSub = userDetails?.sub;

  const stripe = useStripe();
  const elements = useElements();

  const API_URL = 'https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment';

  useEffect(() => {
    if (productDetails) {
      fetchClientSecret();
    }
  }, [productDetails]);

  const fetchClientSecret = async () => {
    const requestData = {
      amount: productDetails.price * 100,
      currency: 'cad',
      description: productDetails.name + " - " + productDetails.id + " - " + productDetails.description,
      receipt_email: userDetails?.email || "customer@example.com",
      metadata: {
        userSub: userSub,
        productIds: productDetails.id,
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: JSON.stringify(requestData) }),
      });

      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      const { client_secret } = parsedData;

      if (!client_secret) {
        throw new Error('Client Secret is missing from backend response');
      }
      
      setClientSecret(client_secret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
      setPaymentResult({ error: 'Failed to initialize payment.' });
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setPaymentResult(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentResult({ error: error.message });
        setPaymentStatus('failed'); // Update payment status
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentResult({ success: 'Payment succeeded!' });
        setPaymentStatus('success'); // Update payment status
        console.log('Payment succeeded:', paymentIntent);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentResult({ error: 'Payment failed.' });
      setPaymentStatus('failed'); // Update payment status
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <p>Product: {productDetails ? productDetails.name : 'Loading...'}</p>
      <p>Price: ${productDetails ? (productDetails.price) : 'Loading...'}</p>
      <img src={productDetails ? productDetails.image : ''} alt={productDetails ? productDetails.name : ''} />

      <div className="payment-section">
        {clientSecret && (
          <>
            <CardElement />
            <button 
              onClick={handlePayment} 
              disabled={loading || !stripe || !elements}
              className={`pay-button ${paymentStatus === 'success' ? 'success' : paymentStatus === 'failed' ? 'failed' : ''}`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </>
        )}
      </div>

      {paymentResult && (
        <div className="payment-result" style={{ marginTop: '0px' }}>
          {paymentResult.error ? (
            <pre style={{ color: 'red' }}>{paymentResult.error} Please try again... </pre>
          ) : (
            <pre style={{ color: 'green' }}>{paymentResult.success} Redirecting... </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
