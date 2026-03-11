// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login'; 
import Signup from './components/Signup/Signup';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 1. Redirect empty path to Login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 2. Define the path for the Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 3. Define the path for the Signup Page */}
        <Route path='/signup' element={<Signup />} />

        {/* Future routes like /home , /profile will go here */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>      
    </div>
  );
}

export default App;