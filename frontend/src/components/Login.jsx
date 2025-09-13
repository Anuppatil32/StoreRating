import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/AuthForm.css";

const Login = ({ role }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/${role}/login`, {
                email,
                password,
            });
    
            const { token, user } = response.data;
    
            localStorage.setItem(`${user.role}Token`, token);
            localStorage.setItem("user", JSON.stringify(user)); // store full user with role
            setMessage("Login successful!");
    
            navigate(`/${user.role}-dashboard`);
        } catch (err) {
            setMessage(err.response?.data?.message || "Login failed");
        }
    };
    

    return (
        <div className="auth-wrapper">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                <button type="submit">Login</button>
                {message && <p className="response-message">{message}</p>}
            </form>
        </div>
    );
};

export default Login;
