import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
