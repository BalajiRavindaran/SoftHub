import React, { useState, useEffect } from 'react';
import './OrdersPage.css';

const OrdersPage = () => {
  // Example data for orders (this could be fetched from an API in a real-world scenario)
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulating API call with mock data
    const mockOrders = [
      { id: 1, product: 'Software A', quantity: 2, totalPrice: 120 },
      { id: 2, product: 'Software B', quantity: 1, totalPrice: 80 },
      { id: 3, product: 'Subscription C', quantity: 3, totalPrice: 300 },
    ];

    setOrders(mockOrders);  // Set orders to the mock data
  }, []);

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="orders-items">
        {orders.length === 0 ? (
          <div className="empty-orders">No orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-item-details">
                <div className="order-item-name">{order.product}</div>
                <div className="order-item-quantity">Quantity: {order.quantity}</div>
              </div>
              <div className="order-item-price">${order.totalPrice}</div>
            </div>
          ))
        )}
      </div>
      {orders.length > 0 && (
        <div className="total-container">
          <div className="total-text">Total Orders: </div>
          <div className="total-amount">
            ${orders.reduce((acc, order) => acc + order.totalPrice, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
