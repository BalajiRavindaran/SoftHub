import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

function CheckoutPage() {
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const API_URL = 'https://32gw38lfe0.execute-api.ca-central-1.amazonaws.com/default/stripe-lambda/payment';

  useEffect(() => {
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
      currency: 'cad',
      description: 'Payment for checkout items',
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
    // Replace this with your logic for calculating the checkout total
    return 5000; // Placeholder value
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Checkout</h1>
      <div>
        <h3>Total: ${calculateTotal() / 100}</h3>
        <CardElement />
        <button onClick={handlePayment} disabled={loading || !stripe || !elements}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      {paymentResult && (
        <div style={{ marginTop: '20px' }}>
          <h2>Payment Result:</h2>
          {paymentResult.error ? (
            <pre style={{ color: 'red' }}>{paymentResult.error}</pre>
          ) : (
            <pre style={{ color: 'green' }}>{paymentResult.success}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
