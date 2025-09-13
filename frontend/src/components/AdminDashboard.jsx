import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [filter, setFilter] = useState("");
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "", email: "", password: "", address: "", role: "user"
  });

  const [newStore, setNewStore] = useState({
    name: "", address: "", ownerId: "", category: "", imageUrl: ""
  });

  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const token = localStorage.getItem(`${role}Token`);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, storesRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5050/api/admin/users", config),
        axios.get("http://localhost:5050/api/admin/stores", config),
        axios.get("http://localhost:5050/api/admin/dashboard", config)
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
      setDashboardStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/admin/create-user", newUser, config);
      setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
      fetchData();
    } catch {
      alert("Failed to add user");
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/admin/create-store", newStore, config);
      setNewStore({ name: "", address: "", ownerId: "", category: "", imageUrl: "" });
      fetchData();
    } catch {
      alert("Failed to add store");
    }
  };

  const handleUserDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5050/api/admin/users/${id}`, config);
      setSelectedUser(res.data);
    } catch {
      alert("Error fetching user details");
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <h1>Admin Panel</h1>
        <div className="nav-buttons">
          <button onClick={() => setSelectedSection("dashboard")}>Dashboard</button>
          <button onClick={() => setSelectedSection("addUser")}>Add User</button>
          <button onClick={() => setSelectedSection("addStore")}>Add Store</button>
          <button onClick={() => setSelectedSection("users")}>User List</button>
          <button onClick={() => setSelectedSection("stores")}>Store List</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <section className="dashboard-section">
  <h2>Dashboard Stats</h2>
  <div className="dashboard-stats">
    <div className="card">
      <h3>Total Users</h3>
      <p className="stat-value">{dashboardStats.totalUsers}</p>
    </div>
    <div className="card">
      <h3>Total Stores</h3>
      <p className="stat-value secondary">{dashboardStats.totalStores}</p>
    </div>
    <div className="card">
      <h3>Total Ratings</h3>
      <p className="stat-value">{dashboardStats.totalRatings}</p>
    </div>
  </div>
</section>


      {selectedSection === "addUser" && (
        <section className="dashboard-section">
          <h2>Add New User</h2>
          <form onSubmit={handleUserSubmit}>
            <input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <input placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="owner">Store Owner</option>
            </select>
            <button type="submit">Add User</button>
          </form>
        </section>
      )}

      {selectedSection === "addStore" && (
        <section className="dashboard-section">
          <h2>Add New Store</h2>
          <form onSubmit={handleStoreSubmit}>
            <input placeholder="Store Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
            <input placeholder="Address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
            <input placeholder="Owner ID" value={newStore.ownerId} onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })} />
            <input placeholder="Category" value={newStore.category} onChange={(e) => setNewStore({ ...newStore, category: e.target.value })} />
            <input placeholder="Image URL" value={newStore.imageUrl} onChange={(e) => setNewStore({ ...newStore, imageUrl: e.target.value })} />
            <button type="submit">Add Store</button>
          </form>
        </section>
      )}

      {selectedSection === "users" && (
        <section className="dashboard-section">
          <h2>User List</h2>
          <input placeholder="Filter by name, email, role" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <ul>
            {users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) ||
              u.email.toLowerCase().includes(filter.toLowerCase()) ||
              u.role.toLowerCase().includes(filter.toLowerCase()))
              .map((u) => (
                <li key={u.id} onClick={() => handleUserDetails(u.id)}>
                  {u.name} - {u.email} - {u.address} - {u.role}
                </li>
              ))}
          </ul>
          {selectedUser && (
            <div className="user-details">
              <h3>User Details</h3>
              <p>Name: {selectedUser.name}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Address: {selectedUser.address}</p>
              <p>Role: {selectedUser.role}</p>
              {selectedUser.role === "owner" && <p>Rating: {selectedUser.rating || "N/A"}</p>}
            </div>
          )}
        </section>
      )}

      {selectedSection === "stores" && (
        <section className="dashboard-section">
          <h2>Store List</h2>
          <ul>
            {stores.map((s) => (
              <li key={s.id}>
                {s.name} - {s.address} - Rating: {s.rating}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
