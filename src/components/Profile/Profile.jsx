import React, { useState, useEffect } from 'react';
import { FaPencilAlt, FaCheckCircle, FaTimes, FaCheck } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from "firebase/auth"; // Import Firebase update function
import { db } from "../../firebase"; 
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('light');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [completedCount, setCompletedCount] = useState(0);

    // Generate 20 diverse avatars using DiceBear API
    const avatarList = Array.from({ length: 20 }, (_, i) => 
        `https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky${i}`
    );

    // Stats States
    const [lifetimeCount, setLifetimeCount] = useState(0);
    const [goalCount, setGoalCount] = useState(0);
    const [pagesToday, setPagesToday] = useState(0);
    const [isEditingPages, setIsEditingPages] = useState(false);
    const [tempPages, setTempPages] = useState(0);

    // 1. Fetch Stats & Milestone Data
    useEffect(() => {
        if (!user) return;

        // A. Fetch Lifetime Count from userStats
        const statsRef = doc(db, "userStats", user.uid);
        const unsubStats = onSnapshot(statsRef, (docSnap) => {
            if (docSnap.exists()) {
                setLifetimeCount(docSnap.data().lifetimeReadCount || 0);
                setPagesToday(docSnap.data().pagesToday || 0);
                setTempPages(docSnap.data().pagesToday || 0);
            }
        });

        // B. Fetch Current Goal (Reading + To Read)
        const q = query(collection(db, "library"), where("userId", "==", user.uid));
        const unsubLibrary = onSnapshot(q, (snapshot) => {
            const activeBooks = snapshot.docs.filter(doc => 
                doc.data().status === 'reading' || doc.data().status === 'toRead'
            );
            setGoalCount(activeBooks.length);
        });

        return () => { unsubStats(); unsubLibrary(); };
    }, [user]);

    // 2. Handle Pages Today Update
    const savePages = async () => {
        setIsEditingPages(false);
        setPagesToday(tempPages);
        const statsRef = doc(db, "userStats", user.uid);
        await setDoc(statsRef, { pagesToday: parseInt(tempPages) }, { merge: true });
    };

    const milestones = [
        { label: "Books Read", value: lifetimeCount },
        { label: "Current Goal", value: goalCount },
        { label: "Pages Today", value: pagesToday, isEditable: true }
    ];

    const handleAvatarChange = async (newUrl) => {
        try {
            await updateProfile(user, { photoURL: newUrl });
            setIsModalOpen(false);
            // The AuthContext will automatically detect the change and update the sidebar!
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };

   

    return (
        <div className={`profile-container ${theme}-mode`}>
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <img 
                        src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Reader"} 
                        alt="Profile" 
                        className="profile-img" 
                    />
                    {/* Trigger Modal */}
                    <button className="edit-btn-float" onClick={() => setIsModalOpen(true)}>
                        <FaPencilAlt />
                    </button>
                </div>  
                <h2 className="user-name">{user?.displayName || "Reader Hub User"}</h2>
                <p className="join-info">
                    Member since {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "February 2026"}
                </p>               
            </div>

            {/* --- AVATAR SELECTION MODAL --- */}
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content avatar-modal">
                        <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
                        <h3>Choose Your Avatar</h3>
                        <div className="avatar-grid">
                            {avatarList.map((url, index) => (
                                <img 
                                    key={index} 
                                    src={url} 
                                    alt={`Avatar ${index}`} 
                                    className={`selectable-avatar ${user?.photoURL === url ? 'selected' : ''}`}
                                    onClick={() => handleAvatarChange(url)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Account Settings Section */}
            <div className="settings-form">
                <h3 className="section-title">Account Settings</h3>
                <div className="field-group">
                    <label>Display Name</label>
                    <div className="input-row">
                        <input type="text" defaultValue={user?.displayName || ""} />
                        <FaPencilAlt className="icon-muted" />
                    </div>
                </div>

                <div className="field-group">
                    <label>Email</label>
                    <div className="input-row">
                        <input type="email" defaultValue={user?.email || ""} disabled />
                    </div>
                </div>                
            </div>

            {/* Theme & Milestones (Keep your existing code below) */}
            {/* ... */}
            <div className="milestones-area">
                <h3 className="section-title">Milestones</h3>
                <div className="milestone-grid">
                    {milestones.map((item, idx) => (
                        <div key={idx} className="m-card">
                            {item.isEditable ? (
                                isEditingPages ? (
                                    <div className="edit-pages-wrapper">
                                        <input 
                                            type="number" 
                                            value={tempPages} 
                                            onChange={(e) => setTempPages(e.target.value)}
                                            onBlur={savePages} // Save when moving away
                                            autoFocus
                                            className="m-input"
                                        />
                                    </div>
                                ) : (
                                    <span className="m-value clickable" onClick={() => setIsEditingPages(true)}>
                                        {item.value}
                                    </span>
                                )
                            ) : (
                                <span className="m-value">{item.value}</span>
                            )}
                            <span className="m-label">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;