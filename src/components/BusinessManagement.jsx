import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingForm from './BookingForm';

const BusinessManagement = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddTimeSlot, setShowAddTimeSlot] = useState(false);
  const [showViewTimeSlots, setShowViewTimeSlots] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // New service form state
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  // New time slot form state
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: '',
    endTime: ''
  });



  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`https://localhost:7208/api/Business/owner/${user.id}`);
        setBusiness(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch business details. Please try again later.');
        setLoading(false);
        console.error('Error fetching business details:', err);
      }
    };

    fetchBusinessDetails();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost:7208/api/Service`, {
        ...newService,
        businessId: business.id,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration)
      });

      setBusiness(prev => ({
        ...prev,
        services: [...prev.services, response.data]
      }));

      setShowAddService(false);
      setNewService({
        name: '',
        description: '',
        price: '',
        duration: ''
      });
    } catch (err) {
      console.error('Error adding service:', err);
      setError('Failed to add service. Please try again.');
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://localhost:7208/api/TimeSlot`, {
        ...newTimeSlot,
        serviceId: selectedService.id
      });

      setShowAddTimeSlot(false);
      setNewTimeSlot({
        startTime: '',
        endTime: ''
      });
    } catch (err) {
      console.error('Error adding time slot:', err);
      setError('Failed to add time slot. Please try again.');
    }
  };







  const handleBookAppointment = (service) => {
    console.log('Book appointment clicked for service:', service);
    // Create a direct copy of the service object to avoid any reference issues
    const serviceCopy = { ...service };
    setSelectedService(serviceCopy);
    setShowBookingConfirmation(true);
    console.log('showBookingConfirmation set to:', true);

    // Force a re-render by using a timeout
    setTimeout(() => {
      console.log('After timeout - showBookingConfirmation:', showBookingConfirmation);
      console.log('After timeout - selectedService:', selectedService);
      // Force another state update to trigger re-render
      setShowBookingConfirmation(prev => prev);
    }, 100);
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

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setShowAddService(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Service
            </button>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Button clicked for service:', service);
                          handleBookAppointment(service);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
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

        {/* Add Service Modal */}
        {showAddService && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Service</h3>
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddService}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Name</label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Time Slot Modal */}
        {showAddTimeSlot && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Time Slot for {selectedService?.name}</h3>
                <button
                  type="button"
                  onClick={() => setShowAddTimeSlot(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAddTimeSlot}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="datetime-local"
                      value={newTimeSlot.startTime}
                      onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="datetime-local"
                      value={newTimeSlot.endTime}
                      onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Add Time Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Time Slots Modal */}
        {showViewTimeSlots && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Time Slots for {selectedService?.name}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowViewTimeSlots(false);
                    setTimeSlots([]);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  {error}
                </div>
              )}

              {loadingTimeSlots ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : timeSlots && timeSlots.length > 0 ? (
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`border rounded p-4 ${slot.isBooked ? 'bg-gray-100' : 'hover:bg-blue-50 cursor-pointer'}`}
                      onClick={() => {}}
                    >
                      <p className="font-medium">Start: {new Date(slot.startTime).toLocaleString()}</p>
                      <p className="font-medium">End: {new Date(slot.endTime).toLocaleString()}</p>
                      {slot.isBooked && (
                        <p className="text-red-500 mt-2">Booked</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No time slots available</p>
              )}
            </div>
          </div>
        )}

        {/* Booking Form Component */}
        {showBookingConfirmation && selectedService && (
          <BookingForm
            service={selectedService}
            onClose={() => {
              setShowBookingConfirmation(false);
              setSelectedService(null);
            }}
            onSuccess={() => {
              setBookingSuccess(true);
              setTimeout(() => {
                setShowBookingConfirmation(false);
                setSelectedService(null);
                setBookingSuccess(false);
              }, 2000);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessManagement;