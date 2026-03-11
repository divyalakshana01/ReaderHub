import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ready for the backend:
        console.log("Registering new user:", userData);
    };

    return (
        <div className="login-container"> {/* Reuse container class for consistency */}
            <div className="watermark" aria-hidden="true">ReaderHub</div>

            <main className="login-card" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <h2>Create your Account</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={userData.fullName}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Sign Up
                    </button>
                </form>

                <p className="footer-text">
                    Already have an account? <a href="/login">Log in!</a>
                </p>
            </main>
        </div>
    );
};

export default Signup;