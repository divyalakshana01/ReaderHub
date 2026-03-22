import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTrashAlt, FaClock } from "react-icons/fa";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import './Library.css';

const Library = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "library"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const readingBooks = books.filter(b => b.status === 'reading');
  const toReadBooks = books.filter(b => b.status === 'toRead');
  const completedBooks = books.filter(b => b.status === 'completed');

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book from library?")) {
      await deleteDoc(doc(db, "library", id));
    }
  };

  const moveToReading = async (id) => {
    await updateDoc(doc(db, "library", id), { status: 'reading' });
  };

  const BookCard = ({ book, showAdd }) => (
    <div className="book-card">
      <div className="book-card-header">
        <FaClock className="icon-muted" title="Update status" />
        {showAdd && <FaPlusCircle className="icon-action add" onClick={() => moveToReading(book.id)} title="Start Reading" />}
        <FaTrashAlt className="icon-action delete" onClick={() => handleDelete(book.id)} title="Delete book" />
      </div>
      <img src={book.cover} alt={book.title} className="library-book-cover" />
      <p style={{fontSize: '10px', marginTop: '5px', fontWeight: 'bold'}}>{book.title}</p>
    </div>
  );

  return (
    <div className="library-page">
      <header className="library-header">
        <h1>My Library</h1>
        <div className="search-bar-library">
          <input 
            type="text" 
            placeholder="Search your library..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <section className="library-status-section">
        <h2 className="status-label reading">Reading ({readingBooks.length})</h2>
        <div className="book-status-grid">
          {readingBooks.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>

      <section className="library-status-section">
        <h2 className="status-label to-read">To Read ({toReadBooks.length})</h2>
        <div className="book-status-grid">
          {toReadBooks.map(book => <BookCard key={book.id} book={book} showAdd />)}
        </div>
      </section>

      <section className="library-status-section">
        <h2 className="status-label completed">Completed ({completedBooks.length})</h2>
        <div className="book-status-grid">
          {completedBooks.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>
    </div>
  );
};

export default Library;