import React, { useState, useEffect } from 'react'; // Added useEffect
import EventCard from './Eventcard';
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'; // Added deleteDoc, doc
import { FaSearch } from 'react-icons/fa';
import './EventHub.css';

const EventHub = () => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [isModalOpen, setModalOpen] = useState(false);
  const [events, setEvents] = useState([]); // Start with an empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    hostedBy: '',
    venue: '',
    timestamp: '',
    imageUrl: '',
  });

  // --- 1. FETCH DATA (Real-time) ---
  useEffect(() => {
    // Create a query to get events ordered by time
    const q = query(collection(db, "events"), orderBy("timestamp", "asc"));
    
    // Subscribe to the collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Crucial: Convert Firebase Timestamp back to JS Date object
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setEvents(eventData);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. ADD DATA TO FIREBASE ---
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        name: newEvent.name,
        hostedBy: newEvent.hostedBy,
        venue: newEvent.venue,
        imageUrl: newEvent.imageUrl || null,
        timestamp: new Date(newEvent.timestamp), // Save as a Date object
        createdAt: new Date()
      });
      
      toggleModal();
      setNewEvent({ name: '', hostedBy: '', venue: '', timestamp: '', imageUrl: '' });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event. Check your Firebase rules!");
    }
  };

  // --- 3. DELETE DATA FROM FIREBASE ---
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // --- 4. FILTERING LOGIC (Stays the same) ---
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const baseEvents = activeTab === 'ongoing'
    ? events.filter(event => {
        const eventDate = new Date(event.timestamp.getFullYear(), event.timestamp.getMonth(), event.timestamp.getDate());
        return eventDate.getTime() === today.getTime();
      })
    : events.filter(event => {
        const eventDate = new Date(event.timestamp.getFullYear(), event.timestamp.getMonth(), event.timestamp.getDate());
        return eventDate.getTime() > today.getTime();
      });

  const eventsToDisplay = baseEvents.filter(event =>
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
              <input type="text" name="hostedBy" value={newEvent.hostedBy} onChange={handleInputChange} placeholder="Hosted By" required />
              <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} placeholder="Venue" required />
              <input type="datetime-local" name="timestamp" value={newEvent.timestamp} onChange={handleInputChange} required />
              <input type="url" name="imageUrl" value={newEvent.imageUrl} onChange={handleInputChange} placeholder="Image URL (optional)" />
              <button type="submit" className="submit-event-btn">Create</button>
            </form>
            <button className="close-modal-btn" onClick={toggleModal}>&times;</button>
          </div>
        </div>
      )}

      <div className="event-tabs">
        <button className={`tab-btn ${activeTab === 'ongoing' ? 'active' : ''}`} onClick={() => setActiveTab('ongoing')}>
          Ongoing Today
        </button>
        <button className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
          Upcoming
        </button>
      </div>

      <div className="event-grid">
        {eventsToDisplay.length > 0 ? (
          eventsToDisplay.map(event => <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} />)
        ) : (
          <p>No events found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default EventHub;