import React from 'react';
import './ApiDocumentation.css'; // Use this custom CSS file

const ApiDocumentation = () => {
  const apiDetails = [
    {
      endpoint: "/api/products",
      method: "GET",
      description: "Fetches a list of all available products from the database.",
      requestJson: {
        "page": 1,
        "limit": 20
      },
      responseJson: {
        "products": [
          { "id": "1", "name": "Software A", "price": "19.99" },
          { "id": "2", "name": "Software B", "price": "29.99" }
        ],
        "total": 100
      }
    },
    {
      endpoint: "/api/product/{id}",
      method: "GET",
      description: "Fetches details of a single product by its ID.",
      requestJson: {},
      responseJson: {
        "id": "1",
        "name": "Software A",
        "description": "Detailed description of Software A",
        "price": "19.99"
      }
    },
    {
      endpoint: "/api/order",
      method: "POST",
      description: "Creates a new order for a product.",
      requestJson: {
        "userId": "12345",
        "productId": "1",
        "quantity": 2
      },
      responseJson: {
        "orderId": "67890",
        "status": "success",
        "message": "Order created successfully"
      }
    }
    // Add more API information as needed
  ];

  return (
    <div className="api-doc-container">
      <h1 className="api-doc-header">API Documentation</h1>
      <p className="api-doc-description">
        This page provides an overview of all available API endpoints for developers.
        Each section includes an endpoint, method, description, and example JSON request and response.
      </p>
      <div className="api-list">
        {apiDetails.map((api, index) => (
          <div key={index} className="api-item">
            <h2 className="api-endpoint">{api.endpoint} <span className="method">{api.method}</span></h2>
            <p className="api-description">{api.description}</p>

            <div className="api-json-container">
              <div className="api-json">
                <h3>Request JSON</h3>
                <pre>{JSON.stringify(api.requestJson, null, 2)}</pre>
              </div>
              <div className="api-json">
                <h3>Response JSON</h3>
                <pre>{JSON.stringify(api.responseJson, null, 2)}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiDocumentation;
