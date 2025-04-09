import { useState } from 'react';
import '../App.css';
import axios from 'axios';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'User' // Default role
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://localhost:7208/api/User/login', {
        email: loginData.email,
        password: loginData.password
      });

      console.log('Login successful:', response.data);
      setLoginSuccess(true);
      setUser(response.data.user);
      setToken(response.data.token);

      // Store token in localStorage for persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Close modal after 1 second on success and redirect to dashboard
      setTimeout(() => {
        setShowLoginModal(false);
        setLoginSuccess(false);

        // Always redirect to dashboard after successful login
        console.log('Redirecting to dashboard...');
        window.location.href = '/dashboard';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    // Validate form
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://localhost:7208/api/User/register', {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phoneNumber: registerData.phoneNumber,
        role: registerData.role
      });

      console.log('Registration successful:', response.data);
      setRegisterSuccess(true);
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        role: 'User'
      });

      // Close register modal and open login modal after 2 seconds on success
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess(false);
        // Pre-fill the login form with the registered email
        setLoginData(prev => ({
          ...prev,
          email: registerData.email
        }));
        // Show login modal
        setShowLoginModal(true);
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav style={{ backgroundColor: 'white', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div className="container-custom" style={{ padding: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#0284c7', fontSize: '1.5rem', fontWeight: 'bold' }}>Slotify</span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <a href="#features" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Features</a>
            <a href="#testimonials" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Testimonials</a>
            <a href="#contact" style={{ color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Contact</a>
            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#0284c7',
                  border: '1px solid #0284c7',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
              }}>Login</button>
              <button
                onClick={() => setShowRegisterModal(true)}
                style={{
                  backgroundColor: '#0284c7',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
              }}>Register</button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-btn">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ color: '#374151', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg style={{ height: '1.5rem', width: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav animate-fadeIn" style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
            <a href="#features" style={{ display: 'block', padding: '0.5rem 0', color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Features</a>
            <a href="#testimonials" style={{ display: 'block', padding: '0.5rem 0', color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Testimonials</a>
            <a href="#contact" style={{ display: 'block', padding: '0.5rem 0', color: '#374151', textDecoration: 'none', transition: 'color 0.3s' }} className="nav-link">Contact</a>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#0284c7',
                  border: '1px solid #0284c7',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  width: '100%'
              }}>Login</button>
              <button
                onClick={() => setShowRegisterModal(true)}
                style={{
                  backgroundColor: '#0284c7',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  width: '100%'
              }}>Register</button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .nav-link:hover {
          color: #0284c7 !important;
        }

        button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .mobile-menu-btn {
            display: block;
          }
        }
      `}</style>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              &times;
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
              Login to Your Account
            </h2>

            {loginSuccess ? (
              <div style={{
                padding: '1rem',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                Login successful! Redirecting...
              </div>
            ) : null}

            {loginError ? (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                {loginError}
              </div>
            ) : null}

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="login-email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="login-password"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: isLoading ? '#93c5fd' : '#0284c7',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Register here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowRegisterModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              &times;
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
              Create an Account
            </h2>

            {registerSuccess ? (
              <div style={{
                padding: '1rem',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                Registration successful! Redirecting...
              </div>
            ) : null}

            {registerError ? (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                {registerError}
              </div>
            ) : null}

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="firstName"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label
                    htmlFor="lastName"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="phoneNumber"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={registerData.phoneNumber}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="password"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="confirmPassword"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: isLoading ? '#93c5fd' : '#0284c7',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Login here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
