import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BusinessDetailPublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await axios.get(`https://localhost:7208/api/Business/Annoymous/${id}`);
        setBusiness(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch business details. Please try again later.');
        setLoading(false);
        console.error('Error fetching business details:', err);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  const handleBookAppointment = (service) => {
    navigate('/login', { state: { bookingIntent: true, serviceId: service.id } });
  };

  const handleViewTimeSlots = async (service) => {
    try {
      setSelectedService(service);
      const response = await axios.get(`https://localhost:7208/api/TimeSlot/available/${service.id}`);
      setTimeSlots(response.data);
      setShowTimeSlots(true);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to fetch time slots. Please try again.');
    }
  };

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
        {/* Business Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{business?.name}</h1>
          <p className="text-gray-600 mb-6">{business?.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h2>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {business?.address}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {business?.phone}
                </p>
                <p className="flex items-center text-gray-600">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Owner: {business?.ownerName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View Time Slots</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Appointment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {business?.services?.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration} minutes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${service.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewTimeSlots(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Time Slots
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleBookAppointment(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Book Appointment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPublic; 