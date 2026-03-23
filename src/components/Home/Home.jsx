import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaStar, FaRegStar, FaPlus, FaSpinner, FaBookOpen, FaBookmark } from "react-icons/fa";
import { db } from "../../firebase"; 
import { collection, addDoc, query, where, onSnapshot, deleteDoc, updateDoc,  doc } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext'; 
import './Home.css';



const Home = () => {
    const searchRef = useRef(null);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    
    // This state controls if the dropdown is visible
    const [showDropdown, setShowDropdown] = useState(false);

    // --- NEW: CLICK OUTSIDE LOGIC ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if searchRef exists and if the click happened OUTSIDE of it
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        // Add event listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);
        
        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- 1. Fetch "Reading" books for the Home Dashboard ---
    useEffect(() => {
        if (!user) return;
        // We only fetch books where status is 'reading' for the Home page
        const q = query(
            collection(db, "library"), 
            where("userId", "==", user.uid),
            where("status", "==", "reading")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCurrentlyReading(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [user]);

    // --- 2. Search Logic ---
    useEffect(() => {
        const fetchBooks = async () => {
            if (searchTerm.length < 3) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }
            setLoading(true);
            setShowDropdown(true); 
            try {
                const [gRes, oRes] = await Promise.all([
                    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=5`),
                    fetch(`https://openlibrary.org/search.json?q=${searchTerm}&limit=5`)
                ]);
                const gData = await gRes.json();
                const oData = await oRes.json();

                const combined = [
                    ...(gData.items || []).map(item => ({
                        id: item.id,
                        title: item.volumeInfo.title,
                        author: item.volumeInfo.authors?.[0] || 'Unknown',
                        description: item.volumeInfo.description || 'No description available.',
                        cover: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192"
                    })),
                    ...(oData.docs || []).map(item => ({
                        id: item.key,
                        title: item.title,
                        author: item.author_name?.[0] || 'Unknown',
                        description: "Check this title out on Open Library for a full summary.",
                        cover: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : "https://via.placeholder.com/128x192"
                    }))
                ];
                setSearchResults(combined);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchBooks, 600);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- 3. Unified Add Function ---
    const handleAddBook = async (book, status) => {
        try {
            await addDoc(collection(db, "library"), {
                userId: user.uid,
                title: book.title,
                cover: book.cover,
                author: book.author,
                status: status, // 'reading' or 'toRead'
                progress: 0,
                addedAt: new Date()
            });
            setSelectedBook(null);
            setSearchTerm('');
            setShowDropdown(false);
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    const handleProgressChange = async (bookId, newValue) => {
        const val = parseInt(newValue);

        // 1. Update Local UI State instantly
        setCurrentlyReading(prev => 
            prev.map(b => b.id === bookId ? { ...b, progress: val } : b)
        );

        try {
            const bookRef = doc(db, "library", bookId);
        
            if (val === 100) {
                // Automatically move to Completed
                await updateDoc(bookRef, { 
                    progress: 100, 
                    status: 'completed',
                    completedAt: new Date() 
                });
                alert("Congratulations! Book moved to Completed.");
            } else {
                // Normal progress update
                await updateDoc(bookRef, { progress: val });
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };

    return (
        <div className="home-layout">
            <main className="content-area">
                <div className="search-wrapper" ref={searchRef}>
                    <input
                        type="text"
                        placeholder="Search for your new adventure..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => searchTerm.length >= 3 && setShowDropdown(true)}
                    />
                    <FaSearch className="search-icon" />
                    
                    {/* Updated Search Dropdown logic */}
                    {showDropdown && searchTerm && (
                        <div className="search-dropdown">
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9'}}>
                                Results for "{searchTerm}"                                
                            </div>
                            {loading && <div style={{padding: '15px'}}><FaSpinner className="icon-spin" /> Searching...</div>}
                            {searchResults.map(book => (
                                <div key={book.id} onClick={() => {setSelectedBook(book); setShowDropdown(false);}} className="search-item">
                                    <strong>{book.title}</strong><br/><small>{book.author}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="quote-card">
                    <p className="quote-text">"A reader lives a thousand lives before he dies"</p>
                    <p className="quote-author">-J.Martin</p>
                </div>

                <section className="dashboard-section">
                    <h3>Currently Reading</h3>
                    <div className="currently-reading-grid">
                        {currentlyReading.map(book => (
                            <div key={book.id} className="current-book">
                                <div className="book-img-container">
                                    <img src={book.cover} alt={book.title} />
                                    <button className="remove-btn" onClick={() => deleteDoc(doc(db, "library", book.id))}>×</button>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-fill" style={{ width: `${book.progress}%` }}></div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={book.progress || 0}
                                        className="progress-slider"
                                        onChange={(e) => handleProgressChange(book.id, e.target.value)}
                                        />
                                </div>
                                <span className="progree-percentage">{book.progress || 0}%</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Discover section remains same... */}

                {/* --- DESCRIPTION MODAL WITH TWO BUTTONS --- */}
                {selectedBook && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <button className="close-modal-btn" onClick={() => setSelectedBook(null)}>&times;</button>
                            <img src={selectedBook.cover} alt="Cover" style={{width: '100px', borderRadius: '5px'}} />
                            <h2>{selectedBook.title}</h2>
                            <p>{selectedBook.author}</p>
                            <div className="modal-description">{selectedBook.description.replace(/<[^>]*>?/gm, '')}</div>
                            
                            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                                <button className="submit-event-btn" onClick={() => handleAddBook(selectedBook, 'reading')}>
                                    <FaBookOpen /> Start Reading
                                </button>
                                <button className="submit-event-btn" style={{backgroundColor: '#8c6239'}} onClick={() => handleAddBook(selectedBook, 'toRead')}>
                                    <FaBookmark /> To Read
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;