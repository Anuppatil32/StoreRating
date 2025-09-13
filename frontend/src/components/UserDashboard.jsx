import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css"; // Make sure to create this file with appropriate styles

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [submittedRatings, setSubmittedRatings] = useState({});
  const [newRating, setNewRating] = useState({});
  const [newComment, setNewComment] = useState({}); // For comment input
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const userId = JSON.parse(localStorage.getItem("user"))?.id; // Assuming user ID is stored in localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // Fetch stores for normal user
    const fetchStores = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/admin/stores", config);
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores", err);
      }
    };

    fetchStores();
  }, []);

  const handleRatingSubmit = async (storeId) => {
    const rating = parseInt(newRating[storeId]);
    const comment = newComment[storeId];
    
    if (rating && comment) {
      try {
        await axios.post(
          "http://localhost:5050/api/user/submit-rating",
          {
            storeId,
            rating,
            comment,
            userId
          },
          config
        );
        setSubmittedRatings({ ...submittedRatings, [storeId]: rating });
      } catch (err) {
        console.error("Error submitting rating", err);
      }
    } else {
      alert("Please provide both rating and comment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="user-dashboard">
      <nav className="user-navbar">
        <h2 className="user-navbar-logo">User Dashboard</h2>
        <div className="user-navbar-actions">
          <button className="btn user-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="user-dashboard-content">
        <section className="user-stores-list">
          <h3>Store Listings</h3>
          <ul className="user-stores">
            {stores.map((store) => (
              <li key={store.id} className="user-store-item">
                <div className="user-store-name">{store.name}</div>
                <div className="user-store-address">{store.address}</div>
                <div className="user-store-rating">Overall Rating: {store.rating}</div>
                <div className="user-rating-form">
                  <label className="user-rating-label">Submit Rating (1-5):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => setNewRating({ ...newRating, [store.id]: e.target.value })}
                    value={newRating[store.id] || ""}
                    className="user-rating-input"
                  />
                  <label className="user-comment-label">Comment:</label>
                  <textarea
                    onChange={(e) => setNewComment({ ...newComment, [store.id]: e.target.value })}
                    value={newComment[store.id] || ""}
                    placeholder="Leave a comment"
                    className="user-comment-input"
                  />
                  <button
                    className="btn user-submit-rating-btn"
                    onClick={() => handleRatingSubmit(store.id)}
                  >
                    Submit Rating
                  </button>
                </div>
                {submittedRatings[store.id] && <div className="user-submitted-rating">Your Rating: {submittedRatings[store.id]}</div>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
