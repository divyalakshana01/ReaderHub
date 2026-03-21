import React, { useState } from 'react';
import './EventCard.css';

const EventCard = ({ event, onDelete }) => {
  const [isRsvp, setIsRsvp] = useState(false);

  // Fallback for missing images
  const imageUrl = event.imageUrl || 'https://via.placeholder.com/150/CAADFF/000000?text=ReaderHub';

  const handleRsvpClick = () => {
    setIsRsvp(!isRsvp);
  };

  return (
    <div className="event-card">
      <button className="delete-event-btn" onClick={() => onDelete(event.id)}>&times;</button>
      <img src={imageUrl} alt={`${event.name} book cover`} className="event-card-image" />
      <div className="event-card-details">
        <h3 className="event-card-name">{event.name}</h3>
        <p className="event-card-host">Hosted by: {event.hostedBy}</p>
        <p className="event-card-venue">Venue: {event.venue}</p>
        <p className="event-card-time">Time: {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <button 
        className={`event-card-rsvp-btn ${isRsvp ? 'attending' : ''}`}
        onClick={handleRsvpClick}
      >
        {isRsvp ? 'Attending' : 'RSVP'}
      </button>
    </div>
  );
};

export default EventCard;
