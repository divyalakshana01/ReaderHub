import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing icons
import './EventCard.css';

const EventCard = ({ event, onDelete, onEdit }) => {
  const [isRsvp, setIsRsvp] = useState(false);

  const imageUrl = event.imageUrl || 'https://via.placeholder.com/150/CAADFF/000000?text=ReaderHub';

  const handleRsvpClick = () => {
    setIsRsvp(!isRsvp);
  };

  const eventDate = event.timestamp.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
  
  const eventTime = event.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="event-card">
      {/* Admin Actions Overlay (Only visible in 'My Events' tab) */}
      {(onDelete || onEdit) && (
        <div className="admin-controls">
          {onEdit && (
            <button className="admin-btn edit" onClick={() => onEdit(event)} title="Edit Event">
              <FaEdit />
            </button>
          )}
          {onDelete && (
            <button className="admin-btn delete" onClick={() => onDelete(event.id)} title="Delete Event">
              <FaTrash />
            </button>
          )}
        </div>
      )}

      <img src={imageUrl} alt={`${event.name} cover`} className="event-card-image" />
      
      <div className="event-card-details">
        <h3 className="event-card-name">{event.name}</h3>
        <p className="event-card-host"><strong>Hosted by:</strong> {event.hostedBy}</p>
        <p className="event-card-venue"><strong>Venue:</strong> {event.venue}</p>
        
        <div className="event-card-datetime">
          <p className="event-card-date">Date: {eventDate}</p>
          <p className="event-card-time">Time: {eventTime}</p>
        </div>
      </div>

      <button 
        className={`event-card-rsvp-btn ${isRsvp ? 'attending' : ''}`}
        onClick={handleRsvpClick}
      >
        {isRsvp ? '✓ Attending' : 'RSVP'}
      </button>
    </div>
  );
};

export default EventCard;