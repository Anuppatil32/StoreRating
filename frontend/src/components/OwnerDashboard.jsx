import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [password, setPassword] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const navigate = useNavigate();
  const ownerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/owner/my-ratings", {
          params: { ownerId }
        });
        setRatings(response.data);
        const avgRating = response.data.reduce((sum, rating) => sum + rating.rating, 0) / response.data.length;
        setAverageRating(avgRating.toFixed(2));
      } catch (err) {
        console.error("Error fetching store ratings", err);
      }
    };

    if (ownerId) {
      fetchRatings();
    }
  }, [ownerId]);

  const handlePasswordUpdate = async () => {
    try {
      await axios.put("http://localhost:5050/api/owner/update-password", {
        password,
        ownerId,
      });
      alert("Password updated successfully.");
      setPassword("");
      setShowPasswordSection(false);
    } catch (err) {
      console.error("Error updating password", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="owner-dashboard">
      <nav className="owner-navbar">
        <h2 className="owner-navbar-logo">My Store Dashboard</h2>
        <div className="owner-navbar-actions">
          <button className="btn" onClick={() => setShowPasswordSection(!showPasswordSection)}>
            {showPasswordSection ? "Cancel" : "Update Password"}
          </button>
          <button className="btn owner-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="owner-dashboard-content">
        <section className="owner-ratings-summary">
          <h3>Average Store Rating: <span>{averageRating || "N/A"}</span></h3>
        </section>

        <section className="owner-ratings-list">
          <h3>User Feedback</h3>
          {ratings.length === 0 ? (
            <p>No ratings available yet.</p>
          ) : (
            <ul>
              {ratings.map((rating) => (
                <li key={rating.id}>
                  <div><strong>User:</strong> {rating.User.name}</div>
                  <div><strong>Rating:</strong> {rating.rating}</div>
                  <div className="owner-rating-comment"><strong>Comment:</strong> {rating.comment}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {showPasswordSection && (
          <section className="owner-update-password">
            <h3>Update Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <button className="btn owner-primary-btn" onClick={handlePasswordUpdate}>Save Password</button>
          </section>
        )}
      </main>
    </div>
  );
};

export default OwnerDashboard;
