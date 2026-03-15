import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import "../Home/Home.css"; // Keep your sidebar styles here

const Layout = () => {
    return (
        <div className="home-layout">
            <aside className="sidebar">
                <NavLink to="/profile" className="profile-section-link">
                    <div className="profile-section">
                        <img src="https://via.placeholder.com/150" className="avatar" />
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

            {/* This is where Home or Profile content will be injected */}
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;