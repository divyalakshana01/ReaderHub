import React from 'react';
import { FaPlusCircle, FaTrashAlt, FaClock } from "react-icons/fa";
import './Library.css';

// Mock Data structure for Firestore books
const libraryBooks = [
  // Books in 'reading' section
  { id: 'b1', title: "Soul River", cover: "path/to/soul-river.jpg", status: 'reading' },
  { id: 'b2', title: "The Two Towers", cover: "path/to/two-towers.jpg", status: 'reading' },
  { id: 'b3', title: "Stupore e Tremore", cover: "path/to/stupore.jpg", status: 'reading' },
  // Books in 'toRead' section
  { id: 'b4', title: "Zero to One", cover: "path/to/zero-one.jpg", status: 'toRead' },
  { id: 'b5', title: "The Fine Print", cover: "path/to/fine-print.jpg", status: 'toRead' },
];

const Library = () => {
  // Filter books into their categories
  const readingBooks = libraryBooks.filter(b => b.status === 'reading');
  const toReadBooks = libraryBooks.filter(b => b.status === 'toRead');
  
  // Completed books would have status === 'completed'

  const BookCard = ({ book, showAdd, showStatus }) => (
    <div className="book-card">
      <div className="book-card-header">
        <FaClock className="icon-muted" title="Update status" />
        {showAdd && <FaPlusCircle className="icon-action add" title="Add to currently reading" />}
        <FaTrashAlt className="icon-action delete" title="Delete book" />
      </div>
      <img src={book.cover} alt={book.title} className="library-book-cover" />
      {showStatus && <span className="completed-check">✓</span>}
    </div>
  );

  return (
    <div className="library-page">
      <header className="library-header">
        <h1>My Library</h1>
        <div className="search-bar-library">
          <input type="text" placeholder="Search for your new adventure..." />
          {/* Add a search icon here if needed */}
        </div>
      </header>

      {/* --- Reading Section --- */}
      <section className="library-status-section">
        <h2 className="status-label reading">Reading</h2>
        <div className="book-status-grid">
          {readingBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* --- To Read Section --- */}
      <section className="library-status-section">
        <h2 className="status-label to-read">To Read</h2>
        <div className="book-status-grid">
          {toReadBooks.map(book => (
            <BookCard key={book.id} book={book} showAdd />
          ))}
        </div>
      </section>

      {/* --- Completed Section --- */}
      <section className="library-status-section">
        <h2 className="status-label completed">Completed</h2>
        <div className="book-status-grid completed-grid">
          {/* Mock Completed books */}
          <div className="book-card empty-completed"></div>
          <div className="book-card empty-completed"></div>
        </div>
      </section>
    </div>
  );
};

export default Library;