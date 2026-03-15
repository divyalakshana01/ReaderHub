# Functional Requirements Document: Reader Hub

## 1. Project Overview
Reader Hub is a responsive single-page application (SPA) built with **React** and **Firebase Firestore**. It serves as a centralized platform for book lovers to organize their personal libraries, track reading progress in real-time, and engage with a community through event discovery.

## 2. Technical Stack & Architecture
* **Frontend:** React (Multi-page SPA using React Router).
* **Backend/Database:** Firebase Firestore (for real-time data persistence and CRUD).
* **Authentication:** Firebase Auth (Login/Signup and Protected Routes).
* **External APIs:** 
    * **Google Books API:** Primary search and book discovery.
    * **Open Library API:** Metadata enrichment (summaries and high-quality covers).
* **Styling:** Modern CSS (Flexbox/Grid) with support for Responsive Design and Light/Dark modes.

## 3. Core Features & Routes

### A. Authentication & User Profile
* **Identity Management:** Secure Login/Signup functionality using Firebase.
* **Protected Access:** User-specific content is restricted to authenticated sessions.
* **Personalization:** A profile page to update usernames and a toggle switch for **Light and Dark visual themes**.

### B. The Library (Primary CRUD Resource)
The Library manages the user's personal collection across three distinct states stored in Firestore:
* **To Read:** A wishlist of books found via search that the user intends to start.
* **Reading:** Active books featuring a **Progress Slider** to update reading percentage (Update CRUD).
* **Completed:** A permanent record of finished books.
* **Management:** Users can add (Create), view (Read), move (Update), or remove (Delete) books from these categories.

### C. Search & Discovery
* **Search Bar:** Integration with Google Books API to find titles, authors, or ISBNs.
* **Data Enrichment:** Using ISBNs to pull detailed summaries and high-resolution images from the Open Library API.
* **Immediate Feedback:** Books added from the Search page must reflect in the Library immediately without page refreshes.

### D. Event Hub
* **Global Community Space:** A dedicated route for users to browse and create book-related events. 
* **Visibility:** Any event created by an individual user must be **visible to all other users** in real-time.

## 4. UI/UX Requirements
* **Responsive Layout:** 
    * Must support Mobile (320px), Tablet (768px), and Desktop (1024px+).
    * **Home and Library pages** must be displayed in **grids on desktop** viewports.
    * Pages must transition to a **vertically scrollable list on mobile** devices.
* **Accessibility:** Semantic HTML5 elements (nav, main, section), proper heading hierarchies, and ARIA labels.
* **Visual Feedback:** 
    * **Success Toasts:** Implementation of pop-up notifications to confirm successful actions (e.g., "Book added to Library").
    * **State Indicators:** Loading spinners during API/Firestore calls and Error Boundaries for failed requests.

## 5. Technical Constraints & Goals
* **Constraint:** No use of `_id` in code architecture.
* **Constraint:** No ticks or bullet points within JavaScript logic/code blocks.
* **Data Sync:** Managing the complexity of merging data from two different APIs using ISBN as the unique identifier.