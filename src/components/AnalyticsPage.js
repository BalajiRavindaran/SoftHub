import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import './AnalyticsPage.css';
import axios from 'axios';

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [providerId, setProviderId] = useState(''); // For inputting provider-id
  const [showModal, setShowModal] = useState(false); // To control the modal visibility
  const [loading, setLoading] = useState(false);     // Loading state
  const [error, setError] = useState(null);          // Error state

  // Fetch metrics from API based on provider-id
  const fetchMetrics = async (id) => {
    setLoading(true);   // Start loading
    setError(null);     // Reset error state

    try {
      const response = await axios.get(`https://bcre43v783.execute-api.ca-central-1.amazonaws.com/default/GET-Provider-Dashboard?provider-id=${id}`);
      const data = response.data;

      setMetrics(data); // Set metrics from the fetched data
      setSoftwareList(data); // Set software list from the fetched data
      setSelectedProducts([]); // Reset selected products for new metrics
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to fetch metrics. Please try again.'); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle provider-id input
  const handleProviderIdSubmit = () => {
    fetchMetrics(providerId);
    setShowModal(false); // Close the modal after submission
  };

  // Handle selecting and deselecting products
  const handleProductSelect = (productName) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productName)
        ? prevSelected.filter((p) => p !== productName)
        : [...prevSelected, productName]
    );
  };

  // Prepare data for charts based on selected products
  const prepareChartData = (metricName) => {
    const data = selectedProducts.map((product) => {
      const productData = metrics.find((m) => m.name === product);
      return {
        product,
        ...productData && {
          activeUsers: productData.users,
          totalSales: productData.sales,
          reviews: productData.reviews,
          rating: productData.rating,
          conversionRate: productData.conversionRate,
          revenue: productData.revenue,
        }
      };
    });

    return data;
  };

  return (
    <div className="analytics-page">
      <h1>Welcome Provider!</h1>

      {/* Provider ID Modal */}
      {showModal && (
        <div className="modal">
          <h2>Enter Provider ID</h2>
          <input
            type="text"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            placeholder="Enter Provider ID"
          />
          <button onClick={handleProviderIdSubmit}>Submit</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
      <button onClick={() => setShowModal(true)}>Set Provider ID</button>

      {/* Loading and Error Handling */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="charts-container">
          {selectedProducts.length > 0 ? (
            selectedProducts.map((product) => (
              <div key={product} className="chart-group">
                <h2>{product}</h2>
                <div className="charts-grid">
                  {/* Active Users Line Chart */}
                  <div className="chart-card">
                    <h3>Active Users</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <LineChart
                        width={300}
                        height={200}
                        data={Object.entries(prepareChartData(product).find(data => data.product === product).activeUsers || {}).map(([day, userCount]) => ({ day, users: userCount }))}
                      >
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" />
                      </LineChart>
                    </div>
                  </div>

                  {/* Total Sales Line Chart */}
                  <div className="chart-card">
                    <h3>Total Sales</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <LineChart
                        width={300}
                        height={200}
                        data={Object.entries(prepareChartData(product).find(data => data.product === product).totalSales || {}).map(([day, salesCount]) => ({ day, sales: salesCount }))}
                      >
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
                      </LineChart>
                    </div>
                  </div>

                  {/* Total Reviews Bar Chart */}
                  <div className="chart-card">
                    <h3>Total Reviews</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <BarChart width={300} height={200} data={[{ product, reviews: prepareChartData(product).find(data => data.product === product).reviews || 0 }]}>
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Bar dataKey="reviews" fill="#8884d8" />
                      </BarChart>
                    </div>
                  </div>

                  {/* Average Ratings Bar Chart */}
                  <div className="chart-card">
                    <h3>Average Ratings</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <BarChart width={300} height={200} data={[{ product, rating: prepareChartData(product).find(data => data.product === product).rating || 0 }]}>
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Bar dataKey="rating" fill="#82ca9d" />
                      </BarChart>
                    </div>
                  </div>

                  {/* Conversion Rate Bar Chart */}
                  <div className="chart-card">
                    <h3>Conversion Rates</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <BarChart width={300} height={200} data={[{ product, conversionRate: prepareChartData(product).find(data => data.product === product).conversionRate || 0 }]}>
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Bar dataKey="conversionRate" fill="#8884d8" />
                      </BarChart>
                    </div>
                  </div>

                  {/* Revenue Line Chart */}
                  <div className="chart-card">
                    <h3>Revenue</h3>
                    <div style={{ width: '100%', height: 200 }}>
                      <LineChart width={300} height={200} data={[{ product, revenue: prepareChartData(product).find(data => data.product === product).revenue || 0 }]}>
                        <XAxis dataKey="product" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      </LineChart>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Please select products to analyze.</p>
          )}
        </div>
      )}
      
      {/* Software List */}
      <div className="software-list">
        <h3>Select Products to Analyze</h3>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Reviews</th>
            </tr>
          </thead>
          <tbody>
            {softwareList.map((software) => (
              <tr key={software['product-id']}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(software.name)}
                    onChange={() => handleProductSelect(software.name)}
                  />
                </td>
                <td>{software['product-id']}</td>
                <td>{software.name}</td>
                <td>{software.category}</td>
                <td>{software.price}</td>
                <td>{software.rating}</td>
                <td>{software.reviews}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
