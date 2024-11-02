// src/components/AdminAnalyticsPage.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './AdminAnalyticsPage.css';

const AdminAnalyticsPage = () => {
  const salesChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const usersChartRef = useRef(null);
  const trafficChartRef = useRef(null); // New chart for traffic

  // Sample data for demonstration
  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const salesData = [20, 40, 30, 50, 60];
  const revenueData = [500, 1000, 1500, 2000, 2500];
  const usersData = [5, 15, 10, 20, 30];
  const trafficData = [300, 400, 500, 700, 600]; // Data for traffic

  const destroyChart = (chartRef) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  };

  useEffect(() => {
    // Sales Chart
    destroyChart(salesChartRef);
    salesChartRef.current = new Chart(document.getElementById("salesChart"), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: salesData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
    });

    // Revenue Chart
    destroyChart(revenueChartRef);
    revenueChartRef.current = new Chart(document.getElementById("revenueChart"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            fill: false,
          },
        ],
      },
    });

    // Users Chart
    destroyChart(usersChartRef);
    usersChartRef.current = new Chart(document.getElementById("usersChart"), {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Users',
            data: usersData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)', 
              'rgba(54, 162, 235, 0.6)', 
              'rgba(255, 206, 86, 0.6)', 
              'rgba(75, 192, 192, 0.6)', 
              'rgba(153, 102, 255, 0.6)'
            ],
          },
        ],
      },
    });

    // Traffic Chart (new)
    destroyChart(trafficChartRef);
    trafficChartRef.current = new Chart(document.getElementById("trafficChart"), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Traffic',
            data: trafficData,
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)', 
              'rgba(255, 206, 86, 0.6)', 
              'rgba(75, 192, 192, 0.6)', 
              'rgba(153, 102, 255, 0.6)', 
              'rgba(255, 159, 64, 0.6)'
            ],
          },
        ],
      },
    });

    return () => {
      destroyChart(salesChartRef);
      destroyChart(revenueChartRef);
      destroyChart(usersChartRef);
      destroyChart(trafficChartRef);
    };
  }, []);

  return (
    <div className="analytics-page">
      <h2>Admin Dashboard</h2>
      <div className="grid-container">
        <div className="chart-container animated"><canvas id="salesChart"></canvas></div>
        <div className="chart-container animated"><canvas id="revenueChart"></canvas></div>
        <div className="chart-container animated"><canvas id="usersChart"></canvas></div>
        <div className="chart-container animated"><canvas id="trafficChart"></canvas></div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
