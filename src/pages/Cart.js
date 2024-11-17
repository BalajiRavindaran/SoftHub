import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const staticItems = [
  { id: 1, name: "Product 1", price: 2000 },
  { id: 2, name: "Product 2", price: 1800 },
  { id: 3, name: "Product 3", price: 3000 },
];

function CartPage() {
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const API_URL = 'https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment';

  useEffect(() => {
    // Check if the URL contains the client_secret to confirm the payment after redirection
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentClientSecret = urlParams.get('client_secret');

    if (paymentIntentClientSecret) {
      confirmPayment(paymentIntentClientSecret);
    }
  }, []);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setPaymentResult(null);

    const requestData = {
      amount: calculateTotal(),
      currency: 'usd',
      description: 'Payment for cart items',
      receipt_email: 'bladycore@gmail.com',
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: JSON.stringify(requestData),
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      const parsedData = JSON.parse(data.body);
      const { client_secret } = parsedData;

      if (!client_secret) {
        throw new Error('Client Secret is missing from backend response');
      }

      // Step 1: Confirm the payment using the client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentResult({ error: error.message });
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentResult({ success: 'Payment succeeded!' });
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setPaymentResult({ error: 'Payment failed' });
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (clientSecret) => {
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setPaymentResult({ error: error.message });
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentResult({ success: 'Payment succeeded!' });
      }
    } catch (error) {
      console.error('Error during payment confirmation:', error);
      setPaymentResult({ error: 'Payment confirmation failed' });
    }
  };

  const calculateTotal = () => {
    return staticItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shopping Cart</h1>
      <ul>
        {staticItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price / 100}
          </li>
        ))}
      </ul>

      <div>
        <h3>Total: ${calculateTotal() / 100}</h3>
        <CardElement />
        <button onClick={handlePayment} disabled={loading || !stripe || !elements}>
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
      </div>

      {paymentResult && (
        <div style={{ marginTop: '20px' }}>
          <h2>Payment Result:</h2>
          {paymentResult.error ? (
            <pre style={{ color: 'red' }}>{paymentResult.error}</pre>
          ) : (
            <pre>{JSON.stringify(paymentResult.paymentData, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default CartPage;
