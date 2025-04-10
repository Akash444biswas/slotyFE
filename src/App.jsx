
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import BusinessDetail from './components/BusinessDetail'
import BusinessList from './components/BusinessList'
import BusinessDetailPublic from './components/BusinessDetailPublic'

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
        <Route path="/login" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/:id"
          element={
            <ProtectedRoute>
              <BusinessDetail />
            </ProtectedRoute>
          }
        />
        <Route path='/businesses' element={<BusinessList />} />
        <Route path='/businessManage/:id' element={<BusinessDetailPublic />} />
      </Routes>
    </Router>
  )
}

export default App
