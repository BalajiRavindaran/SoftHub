import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const AnalyticsPage = () => {
  const [data, setData] = useState(null);

  // Make an API call to fetch the data
  useEffect(() => {
    // Replace with your actual API endpoint
    axios
      .get('https://bcre43v783.execute-api.ca-central-1.amazonaws.com/default/GET-Provider-Dashboard?provider-id=1234567890') 
      .then(response => {
        setData(response.data); // Assuming the data structure from your example
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Prepare the bar chart data
  const barChartData = {
    labels: ['Performance'],
    datasets: [
      {
        label: 'Total Orders',
        data: [data.performance.total_orders],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Sales ($)',
        data: [data.performance.total_sales],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare the line chart data
  const lineChartData = {
    labels: ['Performance'],
    datasets: [
      {
        label: 'Orders Trend',
        data: [data.performance.total_orders],  // You can extend this array for multiple time points
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
      {
        label: 'Sales Trend',
        data: [data.performance.total_sales],  // Extend this array for multiple time points
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  // Chart options (you can modify them as needed)
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Orders and Sales Performance',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.datasetIndex === 0) {
              return `Orders: ${tooltipItem.raw}`;
            } else {
              return `Sales: $${tooltipItem.raw}`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Analytics Page</h1>
      <div style={{ margin: '20px 0' }}>
        <h2>Provider Performance</h2>
        <p>Provider ID: {data.provider_id}</p>
        <p>Total Orders: {data.performance.total_orders}</p>
        <p>Total Sales: ${data.performance.total_sales.toFixed(2)}</p>
      </div>

      <div style={{ width: '80%', margin: 'auto', marginBottom: '40px' }}>
        <h3>Bar Chart: Orders and Sales</h3>
        <Bar data={barChartData} options={chartOptions} />
      </div>

      <div style={{ width: '80%', margin: 'auto' }}>
        <h3>Line Chart: Orders and Sales Trend</h3>
        <Line data={lineChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
