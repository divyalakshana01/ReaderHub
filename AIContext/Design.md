# Design Document: Reader Hub

## 1. React Component Hierarchy
The application is structured to ensure reusability and responsive behavior across Mobile (320px), Tablet (768px), and Desktop (1024px+).

### A. Core Layout
* **MainLayout**: Wrapper managing the layout logic for the Sidebar and Main content area.
* **Sidebar (Reusable)**: Always-on navigation for desktop; transforms into a hamburger menu for mobile.
* **Header**: Top navigation bar visible only on mobile/tablet to host the Hamburger Menu icon.
* **ThemeToggle (Reusable)**: Component to switch between Light and Dark visual themes.
* **ToastContainer**: Global container to display Success Toasts for user feedback.

### B. Feature-Specific Components
* **BookGrid (Reusable)**: Uses a fluid auto-fill layout for the Dashboard and Library.
* **BookCard (Reusable)**: Displays book metadata.
    * **ProgressSlider (Sub-component)**: Interactive range input for "Reading" status books.
* **EventCard (Reusable)**: Displays community events visible to all users.
* **AuthForm (Reusable)**: Shared form structure for Login and Signup logic.
* **LoadingSpinner (Reusable)**: Visual feedback during API fetches and Firestore writes.

---

## 2. Route Map
Implemented via React Router, featuring Protected Routes for user-specific data.

| Path | Page Component | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/login` | `AuthPage` | Public | Firebase Auth login portal. |
| `/signup` | `AuthPage` | Public | New user registration. |
| `/` | `Dashboard` | Protected | Home view with "Currently Reading" grid and progress sliders. |
| `/library` | `LibraryPage` | Protected | Full Library: To-Read, Reading, and Completed tabs. |
| `/search` | `SearchPage` | Protected | Interface for Google Books API search and book addition. |
| `/events` | `EventHub` | Protected | Global community event feed. |
| `/profile` | `ProfilePage` | Protected | User settings and theme preferences. |

---

## 3. API Normalization Logic
Data from external APIs is "cleaned" and merged before being saved to state or Firestore. **Constraint: No property names shall use `_id`**.

* **Primary Key**: ISBN_13 (extracted from Google Books industryIdentifiers).
* **Data Source 1 (Google Books)**: Provides Title, Author (formatted as a string), and ISBN.
* **Data Source 2 (Open Library)**: Provides Summary and High-Quality Cover URL via ISBN sync.
* **Fallback Strategy**: If no API cover is found, a theme-aware placeholder SVG is used.
* **Persistence**: API data is saved permanently to Firestore upon adding a book to the library.

---

## 4. State Management Strategy
A hybrid approach using React Context and Firestore Real-time Listeners.

* **Global State (Context API)**:
    * **AuthContext**: Manages Firebase Auth user session and UIDs.
    * **ThemeContext**: Manages Global Light/Dark mode state.
    * **ToastContext**: Manages the queue for success/error feedback notifications.
* **Server State (Firestore)**:
    * **Real-time Sync**: Uses onSnapshot to ensure the Library and Event Hub update without page refreshes.
* **Local State (useState)**:
    * Used for temporary search results, form inputs, and the mobile sidebar toggle state.

---

## 5. Firestore Collections & Schemas
**Constraint: Document identifiers must be mapped to the property id (Never use `_id`)**.

### A. Users Collection
* **Path**: `/users/{userId}`
* **Fields**: `id`, `username`, `email`, `themePreference`.

### B. Library Collection (Sub-collection)
* **Path**: `/users/{userId}/library/{bookId}`
* **Fields**: `id`, `isbn`, `title`, `author`, `status` (to-read, reading, completed), `progress` (0-100), `coverUrl`, `summary`.

### C. Events Collection (Global Root)
* **Path**: `/events/{eventId}`
* **Visibility**: Visible to all users.
* **Fields**: `id`, `createdBy` (userId), `title`, `description`, `venue`, `timestamp`.