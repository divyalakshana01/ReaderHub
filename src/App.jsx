// App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login'; 
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Library from './components/Library/Library';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 1. Redirect empty path to Home by default */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* 2. Define the path for the Login Page */}
        <Route path="/login" element={<Login />} />

        {/* 3. Define the path for the Signup Page */}
        <Route path='/signup' element={<Signup />} />

        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/library" element={<Library />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>      
    </div>
  );
}

export default App;