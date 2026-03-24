import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaStar, FaRegStar, FaPlus, FaSpinner, FaBookOpen, FaBookmark } from "react-icons/fa";
import { db } from "../../firebase"; 
import { collection, addDoc, query, where, onSnapshot, deleteDoc, updateDoc, doc, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../../context/AuthContext'; 
import './Home.css';

// --- HARDCODED FEATURED BOOKS (Trending 2024-2025) ---
const FEATURED_BOOKS = [
    { 
        id: 'feat1', 
        title: "The Women", 
        author: "Kristin Hannah", 
        description: "A gripping story of a young nurse serving in the Vietnam War and her struggle to be heard upon her return.", 
        cover: "https://covers.openlibrary.org/b/id/14421689-L.jpg", 
        rating: 5 
    },
    { 
        id: 'feat2', 
        title: "Fourth Wing", 
        author: "Rebecca Yarros", 
        description: "Enter the brutal world of Basgiath War College, where dragon riders are forged or destroyed.", 
        cover: "https://covers.openlibrary.org/b/id/13880434-L.jpg", 
        rating: 5 
    },
    { 
        id: 'feat3', 
        title: "Yellowface", 
        author: "R.F. Kuang", 
        description: "A dark, satirical thriller about social media, cultural appropriation, and the publishing industry.", 
        cover: "https://covers.openlibrary.org/b/id/13596752-L.jpg", 
        rating: 4 
    },
    { 
        id: 'feat4', 
        title: "Atomic Habits", 
        author: "James Clear", 
        description: "The definitive guide to breaking bad behaviors and adopting good ones through small, consistent changes.", 
        cover: "https://covers.openlibrary.org/b/id/12871131-L.jpg", 
        rating: 5 
    },
    { 
        id: 'feat5', 
        title: "The Alchemist", 
        author: "Paulo Coelho", 
        description: "A fable about following your dream and listening to your heart.", 
        cover: "https://covers.openlibrary.org/b/id/12711693-L.jpg", 
        rating: 4 
    },
    { 
        id: 'feat6', 
        title: "Funny Story", 
        author: "Emily Henry", 
        description: "A shimmering new romance about two opposites who strike up a deal after their exes fall for each other.", 
        cover: "https://covers.openlibrary.org/b/id/14481024-L.jpg", 
        rating: 5 
    },
    { 
        id: 'feat7', 
        title: "Iron Flame", 
        author: "Rebecca Yarros", 
        description: "The high-stakes sequel to Fourth Wing. The resistance is growing, but so is the danger.", 
        cover: "https://covers.openlibrary.org/b/id/14187313-L.jpg", 
        rating: 4 
    },
    { 
        id: 'feat8', 
        title: "Tomorrow, and Tomorrow, and Tomorrow", 
        author: "Gabrielle Zevin", 
        description: "A modern classic about creativity, video game design, and a lifelong friendship.", 
        cover: "https://covers.openlibrary.org/b/id/12886018-L.jpg", 
        rating: 5 
    }
];

// --- QUOTES DATA ---
const QUOTES = [
    { text: "A reader lives a thousand lives before he dies.", author: "J. Martin" },
    { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
    { text: "A room without books is like a body without a soul.", author: "Cicero" },
    { text: "Read the best books first, or you may not have a chance to read them at all.", author: "Henry David Thoreau" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "Books break the shackles of time.", author: "Carl Sagan" },
    { text: "Classic' - a book which people praise and don't read.", author: "Mark Twain" },
    { text: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: "Haruki Murakami" }
];


const Home = () => {
    const searchRef = useRef(null);
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [currentlyReading, setCurrentlyReading] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fade, setFade] = useState(true); // State for the transition effect

    // Initialized directly with the hardcoded list
    const [discoverBooks] = useState(FEATURED_BOOKS);

    // --- QUOTE ROTATION LOGIC ---
    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setFade(false); // Start fade out
            
            setTimeout(() => {
                setQuoteIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
                setFade(true); // Start fade in
            }, 500); // Wait for fade out to finish (0.5s)

        }, 5000); // 5 seconds

        return () => clearInterval(quoteInterval);
    }, []);

    // --- CLICK OUTSIDE LOGIC ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- 1. Fetch "Reading" books from Firestore ---
    useEffect(() => {
        if (!user) return;
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

    // --- 2. Search Logic with DEBOUNCE (Fixes 429 error) ---
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
                        cover: item.volumeInfo.imageLinks?.thumbnail || "https://placehold.co/128x192?text=No+Cover"
                    })),
                    ...(oData.docs || []).map(item => ({
                        id: item.key,
                        title: item.title,
                        author: item.author_name?.[0] || 'Unknown',
                        description: "Check this title out on Open Library for a full summary.",
                        cover: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : "https://placehold.co/128x192?text=No+Cover"
                    }))
                ];
                setSearchResults(combined);
            } catch (error) { 
                console.error("Search API Error:", error); 
            } finally { 
                setLoading(false); 
            }
        };

        const timer = setTimeout(fetchBooks, 1000); 
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // --- ACTIONS ---
    const handleAddBook = async (book, status) => {
    try {
        // 1. Check for duplicates specifically for this user
        const q = query(
            collection(db, "library"), 
            where("userId", "==", user.uid),
            where("title", "==", book.title) // Checking by title prevents duplicates from different APIs
        );
        
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert(`"${book.title}" is already in your library!`);
            setSelectedBook(null);
            return; // Stop the function here
        }

        // 2. If the query is empty, proceed with adding the book
        await addDoc(collection(db, "library"), {
            userId: user.uid,
            title: book.title,
            cover: book.cover,
            author: book.author,
            status: status,
            progress: 0,
            addedAt: new Date()
        });

        // 3. Clean up the UI
        setSelectedBook(null);
        setSearchTerm('');
        setShowDropdown(false);
        
    } catch (error) { 
        console.error("Firestore Add Error:", error); 
    }
};
    const handleProgressChange = async (bookId, newValue) => {
        const val = parseInt(newValue);
        setCurrentlyReading(prev => prev.map(b => b.id === bookId ? { ...b, progress: val } : b));
        try {
            const bookRef = doc(db, "library", bookId);
            if (val === 100) {
                await updateDoc(bookRef, { progress: 100, status: 'completed', completedAt: new Date() });
                alert("Congratulations! Book moved to Completed.");
            } else {
                await updateDoc(bookRef, { progress: val });
            }
        } catch (error) { console.error("Firestore Progress Error:", error); }
    };

    return (
        <div className="home-layout">
            <main className="content-area">
                
                {/* --- SEARCH SECTION --- */}
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
                    
                    {showDropdown && searchTerm && (
                        <div className="search-dropdown">
                            <div style={{padding: '10px', background: '#f9f9f9', fontSize: '12px', color: '#666'}}>
                                Results for "{searchTerm}"
                            </div>
                            {loading && <div style={{padding: '15px'}}><FaSpinner className="icon-spin" /> Searching...</div>}
                            
                            {searchResults.map(book => (
                                <div 
                                    key={book.id} 
                                    className="search-item" 
                                    onClick={() => {setSelectedBook(book); setShowDropdown(false);}}
                                >
                                    <strong>{book.title}</strong><br/><small>{book.author}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="quote-card">
                    <div className={`quote-content ${fade ? 'fade-in' : 'fade-out'}`}>
                        <p className="quote-text">"{QUOTES[quoteIndex].text}"</p>
                        <p className="quote-author">-{QUOTES[quoteIndex].author}</p>
                    </div>
                </div>

                {/* --- CURRENTLY READING --- */}
                <section className="dashboard-section">
                    <h3>Currently Reading</h3>
                    <div className="currently-reading-grid">
                        {currentlyReading.length > 0 ? (
                            currentlyReading.map(book => (
                                <div key={book.id} className="current-book">
                                    <div className="book-img-container">
                        <               img src={book.cover} alt={book.title} />
                                        
                                    </div>
                                    <div className="progress-container">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${book.progress}%` }}
                                        ></div>
                                    <input
                                        type="range" 
                                        min="0" 
                                        max="100"
                                        value={book.progress || 0}
                                        className="progress-slider"
                                        onChange={(e) => handleProgressChange(book.id, e.target.value)}
                                    />
                                </div>
                                <span className="progress-percentage">{book.progress || 0}%</span>
                            </div>
                        ))
                    ) : (
                        /* This part shows only when the library is empty */
                        <div className="no-reading-msg">
                            <p>You aren't reading anything yet. Discover a new book below!</p>
                        </div>
                )}
            </div>
        </section>

                {/* --- DISCOVER NEW BOOKS (HARDCODED) --- */}
                <section className="dashboard-section">
                    <h3>Discover New Books</h3>
                    <div className="discover-grid">
                        {discoverBooks.map(book => (
                            <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)}>
                                <div className="book-poster">
                                    <img src={book.cover} alt={book.title} />
                                </div>
                                <div className="star-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < book.rating ? "#FFD700" : "#ddd"} />
                                    ))}                                
                                </div>
                                {/* --- ADDED TITLE AND AUTHOR --- */}
                                <div className="discover-book-info">
                                    <p className="discover-book-title">{book.title}</p>
                                    <p className="discover-book-author">{book.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- DESCRIPTION MODAL --- */}
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