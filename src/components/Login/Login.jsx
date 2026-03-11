import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Data ready for your API teammate:", credentials);
    };

    return (
        <div className="login-container">
            <div className="watermark" aria-hidden="true">ReaderHub</div>

            <main className="login-card">
                <h2>Welcome back to ReaderHub!</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                    </div>

                    {/* --- Password Field Added Below --- */}
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            aria-required="true"
                        />
                    </div>

                    <div className="form-options">
                        <a href="/forgot" className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="login-button">
                        Log In
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup">Create one!</Link>
                </p>
            </main>
        </div>
    );
};

export default Login;