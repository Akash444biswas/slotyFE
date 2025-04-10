import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingForm from './BookingForm';

const BusinessDetailPublic = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
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

  const handleBookAppointment = (timeSlot) => {
    console.log('Book Appointment clicked for time slot:', timeSlot);
    setSelectedTimeSlot(timeSlot);
    setShowBookingForm(true);
    console.log('showBookingForm set to:', true);

    // Make sure selectedService is still set
    console.log('Selected service:', selectedService);
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Time Slots</th>
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
                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Time Slots
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && selectedService && (
        <BookingForm
          service={selectedService}
          timeSlot={selectedTimeSlot}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedService(null);
            setSelectedTimeSlot(null);
          }}
          onSuccess={() => {
            setBookingSuccess(true);
            setTimeout(() => {
              setShowBookingForm(false);
              setSelectedService(null);
              setSelectedTimeSlot(null);
              setBookingSuccess(false);
            }, 2000);
          }}
        />
      )}

      {/* Time Slots Modal */}
      {showTimeSlots && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-[1001]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Available Time Slots</h2>
              <button
                onClick={() => {
                  setShowTimeSlots(false);
                  setSelectedService(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mb-4 text-gray-600">Select a time slot for {selectedService.name}</p>

            {timeSlots.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="border rounded-md p-3 hover:bg-blue-50 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {new Date(slot.startTime).toLocaleDateString()} at {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {Math.round((new Date(slot.endTime) - new Date(slot.startTime)) / (1000 * 60))} minutes
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        // Close the time slots modal
                        setShowTimeSlots(false);
                        // Make sure we have the selected service and time slot
                        console.log('Booking with service:', selectedService);
                        console.log('Booking with time slot:', slot);
                        // Then open the booking form
                        handleBookAppointment(slot);
                      }}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No available time slots for this service.</p>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[20000]" style={{ backdropFilter: 'blur(3px)' }}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md relative z-[20001]">
            <div className="text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h2>
              <p className="text-gray-600 mb-4">Your appointment has been booked successfully.</p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetailPublic;