import React, { useState, useEffect } from 'react';
import EventCard from './Eventcard';
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './EventHub.css';

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500", 
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500", 
  "https://images.unsplash.com/photo-1529148482759-b35b25c5f217?w=500", 
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500", 
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500", 
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500", 
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500", 
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500", 
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500", 
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", 
];

const EventHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null); // Tracks which event is being edited
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    hostedBy: '',
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
      setEvents(eventData);
    });
    return () => unsubscribe();
  }, []);

  const toggleModal = () => {
    if (isModalOpen) {
      setEditingEventId(null); // Reset editing mode when closing
      setNewEvent({ name: '', hostedBy: '', venue: '', timestamp: '', imageUrl: '' });
    }
    setModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  // Function to open modal in Edit Mode
  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setNewEvent({
      name: event.name,
      hostedBy: event.hostedBy,
      venue: event.venue,
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      timestamp: event.timestamp.toISOString().substring(0, 16),
      imageUrl: event.imageUrl
    });
    setModalOpen(true);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.imageUrl) {
      alert("Please select an image for your event!");
      return;
    }
    try {
      const eventData = {
        name: newEvent.name,
        hostedBy: user?.displayName || newEvent.hostedBy,
        userId: user?.uid || null,
        venue: newEvent.venue,
        imageUrl: newEvent.imageUrl,
        timestamp: new Date(newEvent.timestamp),
      };

      if (editingEventId) {
        // UPDATE Existing Event
        await updateDoc(doc(db, "events", editingEventId), eventData);
      } else {
        // CREATE New Event
        await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: new Date()
        });
      }

      toggleModal();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Error: " + error.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getBaseEvents = () => {
    if (activeTab === 'mine') {
      return events.filter(event => event.userId === user?.uid);
    }
    const getDateString = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const todayStr = getDateString(today);

    if (activeTab === 'ongoing') {
      return events.filter(event => getDateString(event.timestamp) === todayStr);
    }

    if (activeTab === 'upcoming') {
      return events.filter(event => {
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
      <div className="eventhub-fixed-controls">
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
      </div>

      <div className="event-scroll-viewport">
        <div className="event-grid">
          {eventsToDisplay.length > 0 ? (
            eventsToDisplay.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onDelete={activeTab === 'mine' ? handleDeleteEvent : null} 
                onEdit={activeTab === 'mine' ? handleEditClick : null} // Pass Edit function
              />
            ))
          ) : (
            <p className="no-events-msg">No events found in this category.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content large-modal">
            <h2 className="modal-title">{editingEventId ? "Edit Event" : "Create New Event"}</h2>
            <form className="event-form" onSubmit={handleAddEvent}>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Name</label>
                  <input type="text" name="name" value={newEvent.name} onChange={handleInputChange} placeholder="E.g. Book Club Monthly" required />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input type="text" name="venue" value={newEvent.venue} onChange={handleInputChange} placeholder="E.g. Bellevue Library" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date & Time</label>
                  <input type="datetime-local" name="timestamp" value={newEvent.timestamp} onChange={handleInputChange} required />
                </div>
                {!user && (
                  <div className="form-group">
                    <label>Hosted By</label>
                    <input type="text" name="hostedBy" value={newEvent.hostedBy} onChange={handleInputChange} placeholder="Your Name" required />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Select Event Cover</label>
                <div className="image-selection-grid">
                  {EVENT_IMAGES.map((url, index) => (
                    <div 
                      key={index} 
                      className={`image-option ${newEvent.imageUrl === url ? 'selected' : ''}`}
                      onClick={() => setNewEvent(prev => ({ ...prev, imageUrl: url }))}
                    >
                      <img src={url} alt={`Option ${index}`} />
                    </div>
                  ))}
                </div>
              </div>              
              <button type="submit" className="submit-event-btn">
                {editingEventId ? "Update Event" : "Create Event"}
              </button>
            </form>
            <button className="close-modal-btn" onClick={toggleModal}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventHub;