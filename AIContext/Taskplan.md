# Implementation Task Plan: Reader Hub

This plan follows a "Vertical Slice" approach, ensuring each phase results in a functional part of the application.

## Phase 1: Foundation & Environment Setup
* **1.1 Repository Setup:** Initialize a GitHub repository and a React project (Vite recommended).
* **1.2 Firebase Initialization:** * Create a Firebase project.
    * Enable **Firestore** and **Authentication** (Email/Password).
    * Create a `.env` file in React to store Firebase config keys securely.
* **1.3 Main Layout & CSS:**
    * Build the `MainLayout` wrapper using CSS Grid.
    * Implement the "Always-on" **Sidebar** for desktop (1024px+).
    * Implement the **Hamburger Menu** for mobile (320px) to toggle the Sidebar.
* **1.4 Routing:** Install `react-router-dom` and set up the 5+ distinct routes as empty placeholder components.

## Phase 2: Authentication & Global State
* **2.1 AuthContext:** Create a Context provider to manage the Firebase Auth state and current user `id`.
* **2.2 Login & Signup Pages:** Build the `AuthForm` component and connect it to `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
* **2.3 Protected Routes:** Create a `ProtectedRoute` component to redirect unauthenticated users to the Login page.
* **2.4 ThemeContext:** Implement the Light/Dark mode logic so that toggling updates CSS variables globally.

## Phase 3: Search & API Integration
* **3.1 API Service:** Write utility functions to fetch from **Google Books** and **Open Library**.
* **3.2 Normalization Logic:** Create a function to merge API results into a single object, ensuring no property uses `_id`.
* **3.3 Search UI:** Implement the `SearchPage` with a search bar and a fluid "auto-fill" grid layout.
* **3.4 Placeholder Assets:** Implement the theme-aware SVG placeholders for books missing cover art.

## Phase 4: Library & Firestore CRUD
* **4.1 Add to Library:** Implement the "Add" button that saves the normalized book data permanently to the user's Firestore sub-collection.
* **4.2 Library Dashboard:** Use `onSnapshot` to display a real-time grid of books on the Home and Library pages.
* **4.3 Progress Slider:** * Add the range input to `BookCard` for books in the "Reading" status.
    * Implement debounced Firestore updates for the slider.
* **4.4 Success Toasts:** Connect the `ToastContext` to trigger a visual notification whenever a book is added or progress is updated.

## Phase 5: Global Event Hub
* **5.1 Event Collection:** Set up the root `events` collection in Firestore.
* **5.2 Event Creation Form:** Build a form for users to input `title`, `description`, and `venue`.
* **5.3 Global Feed:** Implement the `EventHub` to display all events from Firestore to every authenticated user.

## Phase 6: Final Polish & Accessibility
* **6.1 Semantic HTML:** Audit the code to ensure proper use of `<nav>`, `<header>`, `<main>`, and `<section>`.
* **6.2 ARIA Labels:** Add descriptive labels to the Hamburger Menu, Theme Toggle, and Progress Slider.
* **6.3 Error Handling:** Wrap API-dependent components in React Error Boundaries to handle service outages gracefully.