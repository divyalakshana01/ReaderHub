import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // 1. If Firebase is still checking the login token, show nothing or a spinner
    if (loading) {
        return <div className="loading-screen">Loading ReaderHub...</div>;
    }

    // 2. If no user is logged in, kick them to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If they are logged in, let them through to the page!
    return children;
};

export default ProtectedRoute;