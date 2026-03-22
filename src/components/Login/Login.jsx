import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 1. Use the custom hook
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // 2. Pull the login function from context

    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // 3. State for button feedback

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        setLoading(true); // Start loading
        
        try {
            // 4. Use the context login function
            await login(credentials.email, credentials.password);
            navigate('/home'); 
        } catch (err) {
            console.error("Login error code:", err.code);
            // Friendly error handling
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Failed to login. Please check your connection.');
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="login-container">
            <div className="watermark" aria-hidden="true">ReaderHub</div>
            <main className="login-card">
                <h2>Welcome back to ReaderHub!</h2>
                
                {/* Error Message Display */}
                {error && <p className="error-message" style={{color: '#d9534f', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}

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
                            disabled={loading} // Disable during call
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                            disabled={loading} // Disable during call
                        />
                    </div>
                    
                    {/* Updated Button with loading state */}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="divider"><span>or</span></div>
                <p className="signup-prompt">
                    Don't have an account? <Link to="/signup">Create one!</Link>
                </p>
            </main>
        </div>
    );
};

export default Login;