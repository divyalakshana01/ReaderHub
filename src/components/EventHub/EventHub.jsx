import React, { useState, useEffect } from 'react';
import EventCard from './Eventcard';
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // 1. Added Auth Hook
import './EventHub.css';

const EventHub = () => {
  const { user } = useAuth(); // 2. Access current user
  const [activeTab, setActiveTab] = useState('ongoing');
  const [isModalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    hostedBy: '', // Keep this for now, but we'll default it to user name
    venue: '',
    timestamp: '',
    imageUrl: '',
  });

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      console.log("Raw Events from Firebase:", eventData);
      setEvents(eventData);
    });

    return () => unsubscribe();
  }, []);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        name: newEvent.name,
        hostedBy: user?.displayName || newEvent.hostedBy, // 3. Use Auth Name if available
        userId: user?.uid || null, // 4. Store UID for ownership
        venue: newEvent.venue,
        imageUrl: newEvent.imageUrl || null,
        timestamp: new Date(newEvent.timestamp),
        createdAt: new Date()
      });
      
      toggleModal();
      setNewEvent({ name: '', hostedBy: '', venue: '', timestamp: '', imageUrl: '' });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error: " + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // --- 5. UPDATED FILTERING LOGIC ---
  const getBaseEvents = () => {
    if (activeTab === 'mine') {
      return events.filter(event => event.userId === user?.uid);
    }

    // Helper to get a "YYYY-MM-DD" string for easy comparison
    const getDateString = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const todayStr = getDateString(today);

    if (activeTab === 'ongoing') {
      return events.filter(event => getDateString(event.timestamp) === todayStr);
    }

    if (activeTab === 'upcoming') {
      return events.filter(event => {
        // Just check if the date is strictly after today
        const eventDate = new Date(event.timestamp.getFullYear(), event.timestamp.getMonth(), event.timestamp.getDate());
        return eventDate.getTime() > today.getTime();
      });
    }
    return [];
  };
  const eventsToDisplay = getBaseEvents().filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.hostedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="eventhub-container">
      <div className="eventhub-header">
        <h1 className="eventhub-title">Event Hub</h1>
        <button className="create-event-btn" onClick={toggleModal}>Create Event</button>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search events..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">Create New Event</h2>
            <form className="event-form" onSubmit={handleAddEvent}>
              <input type="text" name="name" value={newEvent.name} onChange={handleInputChange} placeholder="Event Name" required />
              {/* If logged in, we use displayName; if not, we show the input */}
              {!user && <input type="text" name="hostedBy" value={newEvent.hostedBy} onChange={handleInputChange} placeholder="Hosted By" required />}
              <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} placeholder="Venue" required />
              <input type="datetime-local" name="timestamp" value={newEvent.timestamp} onChange={handleInputChange} required />
              <input type="url" name="imageUrl" value={newEvent.imageUrl} onChange={handleInputChange} placeholder="Image URL (optional)" />
              <button type="submit" className="submit-event-btn">Create</button>
            </form>
            <button className="close-modal-btn" onClick={toggleModal}>&times;</button>
          </div>
        </div>
      )}

      {/* --- 6. ADDED THE NEW TAB BUTTON --- */}
      <div className="event-tabs">
        <button className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`} onClick={() => setActiveTab('ongoing')}>
          Ongoing Today
        </button>
        <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
          Upcoming
        </button>
        <button className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => setActiveTab('mine')}>
          My Hosted Events
        </button>
      </div>

      <div className="event-grid">
        {eventsToDisplay.length > 0 ? (
          eventsToDisplay.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              // Only pass delete function if the user is in the "My Events" tab
              onDelete={activeTab === 'mine' ? handleDeleteEvent : null} 
            />
          ))
        ) : (
          <p>No events found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default EventHub;