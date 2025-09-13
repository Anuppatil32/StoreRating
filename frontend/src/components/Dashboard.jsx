import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "./AdminDashboard.jsx";
import UserDashboard from "./UserDashboard";
import OwnerDashboard from "./OwnerDashboard";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and fetch their role
    const fetchRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const response = await axios.get("http://localhost:5050/api/auth/role", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(response.data.role);
      } catch (err) {
        console.error("Error fetching user role", err);
        navigate("/login");
      }
    };

    fetchRole();
  }, [navigate]);

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "user") {
    return <UserDashboard />;
  } else if (role === "owner") {
    return <OwnerDashboard />;
  }

  return <div>Loading...</div>;
};

export default Dashboard;
