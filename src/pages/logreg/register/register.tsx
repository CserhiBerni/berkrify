import React, { useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import "../Auth.css";

const Register: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/auth/register", {
                name,
                email,
                password,
                role: "User"
            });

            localStorage.setItem("token", response.data.access_token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message || "An error occurred during registration"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar onSearch={() => { }} showSearch={false} />
            <div className="auth-container">
                <div className="auth-card">
                    <h2 className="auth-title">Register</h2>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Register"}
                        </button>
                    </form>
                    <div className="auth-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;