import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await axios.get('https://localhost:7208/api/Business/annymous');
        setBusinesses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch businesses. Please try again later.');
        setLoading(false);
        console.error('Error fetching businesses:', err);
      }
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Businesses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{business.name}</h2>
                <p className="text-gray-600 mb-4">{business.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Address:</span> {business.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Phone:</span> {business.phone}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/businessManage/${business.id}`)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessList; 