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

    return (
        <div className="home-layout">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="profile-section">
                    <img src="https://i.pravatar.cc/150?u=selena" alt="Selena" className="avatar" />
                    <h3>Hi Selena!</h3>
                </div>
                <nav className="side-menu">
                    <Link to="/home" className="menu-btn active">Home</Link>
                    <Link to="/library" className="menu-btn">My Library</Link>
                    <Link to="/events" className="menu-btn">Events</Link>
                    <Link to="/login" className="menu-btn logout">Log Out</Link>
                </nav>
            </aside>

            {/* --- MAIN CONTENT ---*/}
            <main className="content-area">
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Search for your new adventure..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="search-icon" />
                </div>

                <div className="quote-card">
                    <p className="quote-text">"A reader lives a thousand lives before he dies"</p>
                    <p className="quote-author">-J.Martin</p>
                </div>

                <section className="dashboard-section">
                    <h3>Currently Reading</h3>
                    <div className="currently-reading-grid">
                        <div className="current-book">
                            <div className="book -img-container">
                                <img src="https://images-na.ssl-images-amazon.com/images/I/81t2CV8NdfL.jpg" alt="Soul River" />
                                <button className="remove-btn">×</button>
                            </div>
                            <div className="progress-container">
                                <div className="progress-fill" style={{width: '40%' }}></div>
                            </div>
                        </div>
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