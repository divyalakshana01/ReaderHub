import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import "../Home/Home.css";

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
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
                        <img src="https://via.placeholder.com/150" className="avatar" alt="User Avatar" />
                        <h3>Hi Selena!</h3>
                    </div>
                </NavLink>
                <nav className="side-menu">
                    <NavLink to="/home" className="menu-btn">Home</NavLink>
                    <NavLink to="/library" className="menu-btn">My Library</NavLink>
                    <NavLink to="/events" className="menu-btn">Events</NavLink>
                    <NavLink to="/login" className="menu-btn logout">Log Out</NavLink>
                </nav>
            </aside>

            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;