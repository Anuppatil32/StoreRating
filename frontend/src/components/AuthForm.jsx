import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
    storeName: "",
    storeAddress: "",
    storeCategory: "",
    storeImageUrl: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        // Login
        const { email, password } = formData;
        const response = await axios.post("http://localhost:5050/api/auth/login", {
          email,
          password,
        });

        if (response.data.token && response.data.user) {
          const { token, user } = response.data;

          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem(`${user.role}Token`, token);

          // Update state in App
          setUser(user);

          // Navigate based on role
          navigate(`/${user.role}-dashboard`);
        }
      } else {
        // Register
        const {
          name,
          email,
          password,
          address,
          role,
          storeName,
          storeAddress,
          storeCategory,
          storeImageUrl,
        } = formData;

        let userID;

        if (role === "admin") {
          const response = await axios.post("http://localhost:5050/api/admin/create-user", {
            name,
            email,
            password,
            address,
            role,
          });

          if (response.data.user) {
            setMessage("Admin user registered successfully.");
            setIsLogin(true);
          }
        } else {
          const response = await axios.post("http://localhost:5050/api/auth/signup", {
            name,
            email,
            password,
            address,
            role,
          });

          if (response.data.user) {
            setMessage("User registered successfully. Please log in.");
            setIsLogin(true);
            userID = response.data.user._id;
          }
        }

        // Owner-specific store creation
        if (role === "owner" && userID) {
          const storeResponse = await axios.post("http://localhost:5050/api/stores/create", {
            name: storeName,
            address: storeAddress,
            ownerId: userID,
            category: storeCategory,
            imageUrl: storeImageUrl,
          });

          if (storeResponse.data.store) {
            setMessage("Store created successfully. Please log in.");
            setIsLogin(true);
          }
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
          </>
        )}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {!isLogin && (
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            required
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {/* Owner-specific store fields */}
        {!isLogin && formData.role === "owner" && (
          <>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              placeholder="Store Name"
              required
            />
            <input
              type="text"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              placeholder="Store Address"
              required
            />
            <input
              type="text"
              name="storeCategory"
              value={formData.storeCategory}
              onChange={handleChange}
              placeholder="Store Category"
              required
            />
            <input
              type="text"
              name="storeImageUrl"
              value={formData.storeImageUrl}
              onChange={handleChange}
              placeholder="Store Image URL"
            />
          </>
        )}

        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create an account" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthForm;
