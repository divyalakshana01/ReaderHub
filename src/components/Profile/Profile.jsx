import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import  { FaPencilAlt, FaCheckCircle } from "react-icons/fa";
import './Profile.css';

const Profile = () => {
    const [theme, setTheme] = useState('light');

    const milestones = [
        { label: "Books Read", value: 15 },
        { label: "Current Goal", value: 4 },
        { label: "Pages Today", value: 102 }
    ];

    return (
        <div className={`profile-container ${theme}-mode`}>
            {/* --- User Header --- */}
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <img src="https://via.placeholder.com/150" alt="Profile" className="profile-img" />
                    <button className="edit-btn-float"><FaPencilAlt /></button>
                </div>  
                <h2 className="user-name">Jacoz Selena</h2>
            <p className="join-info">Member since February 2026</p>              
            </div>

            {/* --- Settings Form --- */}

            <div className="settings-form">
                <h3 className="section-title">Account Settings</h3>

                <div className="field-group">
                    <label>Display Name</label>
                    <div className="input-row">
                        <input type="text" defaultValue="Jacoz Selena" />
                        <FaPencilAlt className="icon-muted" />
                    </div>
                </div>

                <div className="field-group">
                    <label>Email</label>
                    <div className="input-row">
                        <input type="email" defaultValue="jacozselena@gmail.com" />
                        <FaPencilAlt className="icon-muted" />
                    </div>
                </div>                
            </div>

            {/* --- Theme Selector --- */}
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

            {/* --- Milestones --- */}
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