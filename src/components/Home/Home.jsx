import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaRegStar, FaTimes, FaPlus } from "react-icons/fa";
import './Home.css';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data - 
    const discoverBooks = [
        
        { id: 1, title: "Zero to One", rating: 5, cover: "https://images-na.ssl-images-amazon.com/images/I/71mKvD89oEL.jpg" },
        { id: 2, title: "Filosofi Teras", rating: 4, cover: "https://images-na.ssl-images-amazon.com/images/I/81L86mN5uLL.jpg" },
        { id: 3, title: "The Fine Print", rating: 4, cover: "https://images-na.ssl-images-amazon.com/images/I/71eSAnYh8rL.jpg" },
        { id: 4, title: "Narnia", rating: 5, cover: "https://images-na.ssl-images-amazon.com/images/I/91u8M2eB7PL.jpg" },
        { id: 5, title: "Deep Work", rating: 5, cover: "https://images-na.ssl-images-amazon.com/images/I/417P9vthS6L.jpg" },
        { id: 6, title: "Animal Farm", rating: 4, cover: "https://images-na.ssl-images-amazon.com/images/I/91LUb8zARWL.jpg" },
        { id: 7, title: "Twisted Love", rating: 4, cover: "https://images-na.ssl-images-amazon.com/images/I/71O6-0mI6rL.jpg" },
        { id: 8, title: "Company of One", rating: 5, cover: "https://images-na.ssl-images-amazon.com/images/I/71u96Uv-C0L.jpg" },
    ];

    const currentlyReading = [
        { id: 1, title: "Soul River", cover: "https://images-na.ssl-images-amazon.com/images/I/81t2CV8NdfL.jpg", progress: 40 },
        { id: 2, title: "Atomic Habits", cover: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg", progress: 65 }
    ];

    const searchResults = discoverBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="home-layout">

            {/* --- MAIN CONTENT ---*/}
            <main className="content-area">
                <div className="search-wrapper" style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search for your new adventure..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                    {searchTerm && (
                        <div className="search-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '100%',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {searchResults.length > 0 ? searchResults.map(book => (
                                <div key={book.id} style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', color: '#333' }}>
                                    {book.title}
                                </div>
                            )) : (
                                <div style={{ padding: '10px', color: '#888' }}>No results found</div>
                            )}
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
                                    <button className="remove-btn">×</button>
                                </div>
                                <div className="progress-container">
                                    <div className="progress-fill" style={{ width: `${book.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <h3>Discover New Books</h3>
                    <div className="genre-tags">
                        <span className="tag active">Sci-fi</span>
                        <span className="tag"></span>
                        <span className="tag"></span>
                        <span className="tag"></span>
                    </div>

                    <div className="discover-grid">
                        {discoverBooks.map(book => (
                            <div key={book.id} className="book-card">
                                <div className="book-poster">
                                    <img src={book.cover} alt={book.title} />
                                    <button className="add-button">+</button>
                                </div>
                                <div className="star-rating">
                                    {[...Array(5)].map((_, index) => (
                                        index < book.rating ? <FaStar key={index} color="#FFD700" /> : <FaRegStar key={index} color="#FFD700" />
                                    ))}                                
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;