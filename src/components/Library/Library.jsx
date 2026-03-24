import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTrashAlt, FaRedo } from "react-icons/fa";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, setDoc, increment} from 'firebase/firestore';
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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this book from library?")) {
      await deleteDoc(doc(db, "library", id));
    }
  };

  const moveToReading = async (id) => {
    await updateDoc(doc(db, "library", id), { status: 'reading' });
  };

  const moveToToRead = async (id) => {
    await updateDoc(doc(db, "library", id), { 
        status: 'toRead', 
        progress: 0 
    });
  };

  const handleProgressChange = async (bookId, newValue) => {
    const val = parseInt(newValue);
    
    // Optimistic update for smoothness
    setBooks(prevBooks => 
      prevBooks.map(b => b.id === bookId ? { ...b, progress: val } : b)
    );

    try {
      const bookRef = doc(db, "library", bookId);
      const statsRef = doc(db, "userStats", user.uid);

      if (val === 100) {
        await updateDoc(bookRef, { 
          progress: 100, 
          status: 'completed', 
          completedAt: new Date() 
        });

        await setDoc(statsRef, { 
          lifetimeReadCount: increment(1) 
        }, { merge: true });

        alert("Congratulations! Book moved to Completed.");
      } else {
        // Fire and forget for intermediate values to prevent stutter
        updateDoc(bookRef, { progress: val });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
  
  const BookCard = ({ book, showAdd, isCompleted }) => (
    <div className="book-card">
      <div className="book-card-header">
        <div className="action-icons">
          {showAdd && (
            <FaPlusCircle 
              className="icon-action add" 
              onClick={() => moveToReading(book.id)} 
              title="Start Reading" 
            />
          )}
          {isCompleted && (
            <FaRedo 
              className="icon-action reset" 
              onClick={() => moveToToRead(book.id)} 
              title="Read Again" 
            />
          )}
          <FaTrashAlt 
            className="icon-action delete" 
            onClick={() => handleDelete(book.id)} 
            title="Delete book" 
          />
        </div>
      </div>
      
      <img src={book.cover} alt={book.title} className="library-book-cover" />
      <p className="library-book-title">{book.title}</p>

      {/* --- UPDATED PROGRESS SECTION (MATCHES HOME.JSX) --- */}
      {book.status === 'reading' && (
        <div style={{ width: '100%', padding: '0 10px' }}>
          <div className="library-progress-container">
            {/* This is the new fill bar that matches the CSS above */}
            <div 
              className="library-progress-fill" 
              style={{ width: `${book.progress || 0}%` }}
            ></div>
      
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={book.progress || 0} 
              className="library-progress-slider"
              onChange={(e) => handleProgressChange(book.id, e.target.value)}
          />
          </div>
          <span className="library-percentage">{book.progress || 0}%</span>
        </div>
      )}
    </div>
  );
  
  const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const readingBooks = filteredBooks.filter(b => b.status === 'reading');
  const toReadBooks = filteredBooks.filter(b => b.status === 'toRead');
  const completedBooks = filteredBooks.filter(b => b.status === 'completed');

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
          {completedBooks.map(book => <BookCard key={book.id} book={book} isCompleted />)}
        </div>
      </section>
    </div>
  );
};

export default Library;