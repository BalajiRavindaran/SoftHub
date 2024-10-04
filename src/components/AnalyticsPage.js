import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: [],
    totalSales: [],
    popularPackages: []
  });

  const [softwareList, setSoftwareList] = useState([
    {
      "product-id": { "S": "1" },
      "category": { "S": "games" },
      "description": { "S": "This is an awesome software for gaming." },
      "imgUrl": { "S": "https://title-images-s3.s3.ca-central-1.amazonaws.com/1.png" },
      "name": { "S": "Call of Duty: Warzone" },
      "price": { "S": "$49.99" },
      "rating": { "N": "4.5" },
      "reviews": { "N": "120" }
    },
    {
      "product-id": { "S": "2" },
      "category": { "S": "design" },
      "description": { "S": "Powerful design software." },
      "imgUrl": { "S": "https://title-images-s3.s3.ca-central-1.amazonaws.com/2.png" },
      "name": { "S": "Adobe Photoshop" },
      "price": { "S": "$199.99" },
      "rating": { "N": "4.7" },
      "reviews": { "N": "230" }
    }
  ]);

  const [newSoftware, setNewSoftware] = useState({
    "product-id": { "S": "" },
    "category": { "S": "" },
    "description": { "S": "" },
    "imgUrl": { "S": "" },
    "name": { "S": "" },
    "price": { "S": "" },
    "rating": { "N": "" },
    "reviews": { "N": "" }
  });

  const [editIndex, setEditIndex] = useState(null); // To track the index of the software being edited

  // Simulate fetching metrics (dummy data for now)
  useEffect(() => {
    const fetchMetrics = () => {
      setTimeout(() => {
        setMetrics({
          activeUsers: [
            { day: 'Mon', users: 110 },
            { day: 'Tue', users: 130 },
            { day: 'Wed', users: 90 },
            { day: 'Thu', users: 140 },
            { day: 'Fri', users: 150 },
            { day: 'Sat', users: 200 },
            { day: 'Sun', users: 170 }
          ],
          totalSales: [
            { day: 'Mon', sales: 200 },
            { day: 'Tue', sales: 400 },
            { day: 'Wed', sales: 300 },
            { day: 'Thu', sales: 500 },
            { day: 'Fri', sales: 600 },
            { day: 'Sat', sales: 800 },
            { day: 'Sun', sales: 700 }
          ],
          popularPackages: [
            { name: 'Adobe Photoshop', sales: 500 },
            { name: 'Microsoft Office', sales: 300 },
            { name: 'Final Cut Pro', sales: 250 }
          ]
        });
      }, 1000);
    };

    fetchMetrics();
  }, []);

  // Handle form input changes for adding or editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const key = name.split('-')[0];
    const subKey = name.split('-')[1];
    setNewSoftware((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [subKey]: value
      }
    }));
  };

  // Add new software
  const handleAddSoftware = (e) => {
    e.preventDefault();
    if (newSoftware.name.S && newSoftware.category.S && newSoftware.price.S) {
      const confirmation = prompt("Type 'confirm' to add the software:");
      if (confirmation === "confirm") {
        setSoftwareList((prevState) => [...prevState, newSoftware]);
        setNewSoftware({
          "product-id": { "S": "" },
          "category": { "S": "" },
          "description": { "S": "" },
          "imgUrl": { "S": "" },
          "name": { "S": "" },
          "price": { "S": "" },
          "rating": { "N": "" },
          "reviews": { "N": "" }
        }); // Clear the form
        alert("Software added successfully!");
      } else {
        alert("Action canceled!");
      }
    }
  };

  // Remove software
  const handleRemoveSoftware = (index) => {
    const confirmation = prompt("Type 'confirm' to delete the software:");
    if (confirmation === "confirm") {
      setSoftwareList((prevState) => prevState.filter((_, i) => i !== index));
      alert("Software removed successfully!");
    } else {
      alert("Action canceled!");
    }
  };

  // Edit software entry
  const handleEditSoftware = (index) => {
    setEditIndex(index); // Set the index for editing
    setNewSoftware(softwareList[index]); // Populate form with selected software details
  };

  // Save edited software
  const handleSaveSoftware = (e) => {
    e.preventDefault();
    const confirmation = prompt("Type 'confirm' to save the changes:");
    if (confirmation === "confirm") {
      setSoftwareList((prevState) =>
        prevState.map((software, i) => (i === editIndex ? newSoftware : software))
      );
      setEditIndex(null); // Reset edit index
      alert("Software updated successfully!");
    } else {
      alert("Action canceled!");
    }
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      {/* Chart Section */}
      <div className="charts-container">
        {/* Active Users Line Chart */}
        <div className="chart-card">
          <h3>Active Users This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.activeUsers}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Total Sales Line Chart */}
        <div className="chart-card">
          <h3>Total Sales This Week</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.totalSales}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Packages Bar Chart */}
        <div className="chart-card">
          <h3>Popular Packages</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.popularPackages}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Form to Add or Edit Software */}
      <div className="add-software-form">
        <h3>{editIndex !== null ? "Edit Software" : "Add New Software"}</h3>
        <form onSubmit={editIndex !== null ? handleSaveSoftware : handleAddSoftware}>
          <input
            type="text"
            name="product-id-S"
            placeholder="Product ID"
            value={newSoftware["product-id"].S}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="name-S"
            placeholder="Name"
            value={newSoftware.name.S}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category-S"
            placeholder="Category"
            value={newSoftware.category.S}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="price-S"
            placeholder="Price"
            value={newSoftware.price.S}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="description-S"
            placeholder="Description"
            value={newSoftware.description.S}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="imgUrl-S"
            placeholder="Image URL"
            value={newSoftware.imgUrl.S}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="rating-N"
            placeholder="Rating"
            value={newSoftware.rating.N}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="reviews-N"
            placeholder="Reviews"
            value={newSoftware.reviews.N}
            onChange={handleInputChange}
          />
          <button type="submit">{editIndex !== null ? "Save Changes" : "Add Software"}</button>
        </form>
      </div>

      {/* Software List */}
      <div className="software-list">
        <h3>Current Software List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {softwareList.map((software, index) => (
              <tr key={index}>
                <td>{software["product-id"].S}</td>
                <td>{software.name.S}</td>
                <td>{software.category.S}</td>
                <td>{software.price.S}</td>
                <td>
                  <button onClick={() => handleEditSoftware(index)}>Edit</button>
                  <button onClick={() => handleRemoveSoftware(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
