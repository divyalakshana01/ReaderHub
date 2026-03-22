import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Import your auth hook
import "../Home/Home.css";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth(); // Get logout function
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // New Logout Handler
    const handleLogout = async (e) => {
        e.preventDefault(); // Prevents the link from just redirecting before logging out
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="home-layout">
            <header className="mobile-header">
                <button className="hamburger-menu" onClick={toggleSidebar}>
                    <FaBars />
                </button>
            </header>

            <aside className={`sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
                <NavLink to="/profile" className="profile-section-link">
                    <div className="profile-section">
                        {/* Dynamic User Data */}
                        <img src={user?.photoURL || "https://via.placeholder.com/150"} className="avatar" alt="User Avatar" />
                        <h3>Hi {user?.displayName || 'Reader'}!</h3>
                    </div>
                </NavLink>
                <nav className="side-menu">
                    <NavLink to="/home" className={({ isActive }) => isActive ? "menu-btn active" : "menu-btn"}>Home</NavLink>
                    <NavLink to="/library" className="menu-btn">My Library</NavLink>
                    <NavLink to="/events" className="menu-btn">Events</NavLink>
                    
                    {/* We keep the NavLink component so your CSS styles stay identical, 
                        but we add the onClick handler to trigger the Firebase logout.
                    */}
                    <NavLink 
                        to="/login" 
                        className="menu-btn logout" 
                        onClick={handleLogout}
                    >
                        Log Out
                    </NavLink>
                </nav>
            </aside>

            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;