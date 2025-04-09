import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBusiness, setNewBusiness] = useState({
    name: '',
    description: '',
    address: '',
    phone: ''
  });

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token') || null;

  // Use a state variable to control when to fetch data
  const [shouldFetch, setShouldFetch] = useState(true);

  // Function to fetch businesses
  const fetchBusinesses = async () => {
    if (!shouldFetch) return;

    try {
      setLoading(true);

      // Get the user ID from the user object
      const userId = user?.id;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching businesses for user:', userId);

      // Call the API with the owner ID
      const response = await axios.get(`https://localhost:7208/api/Business/owner/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBusinesses(response.data);
      setShouldFetch(false); // Prevent further fetches
      setLoading(false);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Failed to load businesses. Please try again later.');
      setLoading(false);
      setShouldFetch(false); // Prevent further fetches on error
    }
  };

  // Only fetch on initial mount or when explicitly triggered
  useEffect(() => {
    if (token && user && shouldFetch) {
      fetchBusinesses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch]); // Only depend on shouldFetch to prevent unnecessary API calls

  const handleCreateBusiness = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get the user ID from the user object
      const userId = user?.id;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      // Create business data with owner ID
      const businessData = {
        ...newBusiness,
        ownerId: userId
      };

      // Log the payload being sent
      console.log('Creating business with payload:', businessData);

      // Call the API to create a new business
      const response = await axios.post('https://localhost:7208/api/Business', businessData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Log the response
      console.log('Business created successfully:', response.data);

      // Add the new business to the list for immediate UI update
      setBusinesses([...businesses, response.data]);

      // No need to trigger a fetch - we already have the new business

      // Reset form and close modal
      setNewBusiness({
        name: '',
        description: '',
        address: '',
        phone: ''
      });
      setShowCreateModal(false);
      setLoading(false);
    } catch (err) {
      console.error('Error creating business:', err);
      setError('Failed to create business. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness({
      ...newBusiness,
      [name]: value
    });
  };

  // If user is not logged in, show a message
  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access the dashboard</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-md z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Slotify</h1>
          <p className="text-sm text-gray-500">Business Dashboard</p>
        </div>

        <div className="mt-8">
          <ul>
            <li className="px-6 py-3 bg-blue-50 border-l-4 border-blue-600">
              <a href="#" className="flex items-center text-blue-600 font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
            </li>
            <li className="px-6 py-3">
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Appointments
              </a>
            </li>
            <li className="px-6 py-3">
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customers
              </a>
            </li>
            <li className="px-6 py-3">
              <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
            </li>
          </ul>
        </div>

        <div className="absolute bottom-0 w-full p-6">
          <div className="flex items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`}
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 mr-4">My Businesses</h1>
            <button
              onClick={() => setShouldFetch(true)}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
              title="Refresh"
              disabled={loading || shouldFetch}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Business
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error}
          </div>
        ) : businesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm p-8">
            <img
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt="No businesses"
              className="w-48 h-48 mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No businesses found</h2>
            <p className="text-gray-500 mb-6 text-center">You haven't created any businesses yet. Create your first business to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md flex items-center text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Business
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    {new Date(business.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{business.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{business.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {business.address}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {business.phone}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Manage Business
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Business Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 h-full cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">Add New Business</h3>
              <p className="text-gray-500 text-sm text-center">Create a new business to manage appointments</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Business Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Business</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateBusiness}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newBusiness.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business name"
                />
              </div>



              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newBusiness.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your business"
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newBusiness.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business address"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newBusiness.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
                >
                  {loading ? 'Creating...' : 'Create Business'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
