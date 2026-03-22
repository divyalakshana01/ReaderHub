import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaCheckCircle } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext'; // 1. Import useAuth
import './Profile.css';

const Profile = () => {
    const { user } = useAuth(); // 2. Get user data
    const [theme, setTheme] = useState('light');

    const milestones = [
        { label: "Books Read", value: 15 },
        { label: "Current Goal", value: 4 },
        { label: "Pages Today", value: 102 }
    ];

    return (
        <div className={`profile-container ${theme}-mode`}>
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <img 
                        src={user?.photoURL || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="profile-img" 
                    />
                    <button className="edit-btn-float"><FaPencilAlt /></button>
                </div>  
                {/* 3. Dynamic Name */}
                <h2 className="user-name">{user?.displayName || "Reader Hub User"}</h2>
                {/* 4. Display join date if you store it, or static text for now */}
                <p className="join-info">Member since {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "February 2026"}</p>               
            </div>

            <div className="settings-form">
                <h3 className="section-title">Account Settings</h3>

                <div className="field-group">
                    <label>Display Name</label>
                    <div className="input-row">
                        {/* 5. Set value to user.displayName */}
                        <input type="text" defaultValue={user?.displayName || ""} />
                        <FaPencilAlt className="icon-muted" />
                    </div>
                </div>

                <div className="field-group">
                    <label>Email</label>
                    <div className="input-row">
                        {/* 6. Set value to user.email */}
                        <input type="email" defaultValue={user?.email || ""} disabled />
                        <FaPencilAlt className="icon-muted" />
                    </div>
                </div>                
            </div>

            {/* --- Rest of the code (Theme Selector & Milestones) stays the same --- */}
            <div className="theme-selector">
                <h3 className="section-title">Page Theme</h3>
                <div className="theme-cards">
                    <div 
                        className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                    >
                        <div className="preview-box light-preview">
                            <div className="p-sidebar"></div>
                            <div className="p-content">
                                <span className="p-line"></span>
                                <span className="p-line short"></span>
                            </div>
                            {theme === 'light' && <FaCheckCircle className="check-icon" />}
                        </div>
                        <p>Light mode</p>
                    </div>

                    <div 
                        className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                    >
                        <div className="preview-box dark-preview">
                            <div className="p-sidebar"></div>
                            <div className="p-content">
                                <span className="p-line"></span>
                                <span className="p-line short"></span>
                            </div>
                            {theme === 'dark' && <FaCheckCircle className="check-icon" />}
                        </div>
                        <p>Dark mode</p>
                    </div>
                </div>
            </div>

            <div className="milestones-area">
                <h3 className="section-title">Milestones</h3>
                <div className="milestone-grid">
                    {milestones.map((item, idx) => (
                        <div key={idx} className="m-card">
                            <span className="m-value">{item.value}</span>
                            <span className="m-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;