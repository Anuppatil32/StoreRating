import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/AuthForm.css";

const Register = ({ role }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/${role}/register`, {
                name,
                email,
                password,
            });

            setMessage("Registration successful!");
            navigate(`/${role}-login`);
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-wrapper">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Register</h2>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    required
                />
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

                <button type="submit">Register</button>
                {message && <p className="response-message">{message}</p>}
            </form>
        </div>
    );
};

export default Register;
