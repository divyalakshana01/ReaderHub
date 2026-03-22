import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Import the custom hook

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth(); // 2. Get the signup function from context

    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // 3. State for the loading spinner

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // --- REPLACED LOGIC BELOW ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call the signup function from our AuthContext
            await signup(userData.email, userData.password, userData.fullName);
            
            // If successful, redirect to home
            navigate('/home');
        } catch (err) {
            // Handle common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('That email is already registered.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="watermark" aria-hidden="true">ReaderHub</div>

            <main className="login-card" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
                <h2>Create your Account</h2>

                {/* Display Error Message if it exists */}
                {error && <p className="error-message" style={{ color: '#d9534f', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

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
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="footer-text">
                    Already have an account? <Link to="/login">Log in!</Link>
                </p>
            </main>
        </div>
    );
};

export default Signup;