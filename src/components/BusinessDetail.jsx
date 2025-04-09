import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  });

  // State for managing time slots
  const [showManageSlotsModal, setShowManageSlotsModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: '',
    endTime: ''
  });
  const [timeSlotError, setTimeSlotError] = useState('');

  // State for modifying services
  const [showModifyServiceModal, setShowModifyServiceModal] = useState(false);
  const [serviceToModify, setServiceToModify] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || null;
  const token = localStorage.getItem('token') || null;

  // Fetch business details
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setLoading(true);

        // Fetch business details
        const businessResponse = await axios.get(`https://localhost:7208/api/Business/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setBusiness(businessResponse.data);

        // Fetch services for this business
        const servicesResponse = await axios.get(`https://localhost:7208/api/Service/business/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setServices(servicesResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching business details:', err);
        setError('Failed to load business details. Please try again later.');
        setLoading(false);
      }
    };

    if (token && id) {
      fetchBusinessDetails();
    }
  }, [id, token]);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create service data with business ID
      const serviceData = {
        ...newService,
        businessId: id
      };

      // Call the API to create a new service
      const response = await axios.post('https://localhost:7208/api/Service', serviceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add the new service to the list
      setServices([...services, response.data]);

      // Reset form and close modal
      setNewService({
        name: '',
        description: '',
        duration: 30,
        price: 0
      });
      setShowAddServiceModal(false);
      setLoading(false);
    } catch (err) {
      console.error('Error creating service:', err);
      setError('Failed to create service. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      setLoading(true);

      // Call the API to delete the service
      await axios.delete(`https://localhost:7208/api/Service/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the deleted service from the list
      setServices(services.filter(service => service.id !== serviceId));
      setLoading(false);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleTimeSlotInputChange = (e) => {
    const { name, value } = e.target;
    setNewTimeSlot({
      ...newTimeSlot,
      [name]: value
    });
    // Clear error when user types
    if (timeSlotError) setTimeSlotError('');
  };

  const handleManageSlots = async (service) => {
    try {
      setLoading(true);
      setSelectedService(service);

      // Fetch time slots for this service
      const response = await axios.get(`https://localhost:7208/api/TimeSlot/service/${service.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTimeSlots(response.data);
      setShowManageSlotsModal(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load time slots. Please try again.');
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();

    // Validate that end time is after start time
    const startDateTime = new Date(`2000-01-01T${newTimeSlot.startTime}`);
    const endDateTime = new Date(`2000-01-01T${newTimeSlot.endTime}`);

    if (endDateTime <= startDateTime) {
      setTimeSlotError('End time must be after start time');
      return;
    }

    try {
      setLoading(true);

      // Get current date and combine with selected time
      const today = new Date();
      const startTime = new Date(today);
      const endTime = new Date(today);
      
      // Set the time from the input
      const [startHours, startMinutes] = newTimeSlot.startTime.split(':');
      const [endHours, endMinutes] = newTimeSlot.endTime.split(':');
      
      startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
      endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      // Create time slot data with the required format
      const timeSlotData = {
        serviceId: selectedService.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      };

      // Call the API to create a new time slot
      const response = await axios.post('https://localhost:7208/api/TimeSlot', timeSlotData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add the new time slot to the list
      setTimeSlots([...timeSlots, response.data]);

      // Reset form
      setNewTimeSlot({
        startTime: '',
        endTime: ''
      });

      setLoading(false);
    } catch (err) {
      console.error('Error creating time slot:', err);
      setError('Failed to create time slot. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteTimeSlot = async (timeSlotId) => {
    try {
      setLoading(true);

      // Call the API to delete the time slot
      await axios.delete(`https://localhost:7208/api/TimeSlot/${timeSlotId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the deleted time slot from the list
      setTimeSlots(timeSlots.filter(slot => slot.id !== timeSlotId));

      setLoading(false);
    } catch (err) {
      console.error('Error deleting time slot:', err);
      setError('Failed to delete time slot. Please try again.');
      setLoading(false);
    }
  };

  const handleModifyService = async (service) => {
    setServiceToModify(service);
    setShowModifyServiceModal(true);
  };

  const handleModifyServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create service data for modification
      const serviceData = {
        name: serviceToModify.name,
        description: serviceToModify.description,
        price: serviceToModify.price,
        duration: serviceToModify.duration
      };

      // Call the API to modify the service
      const response = await axios.put(`https://localhost:7208/api/Service/${serviceToModify.id}`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the service in the list
      setServices(services.map(service => 
        service.id === serviceToModify.id ? response.data : service
      ));

      // Reset form and close modal
      setServiceToModify(null);
      setShowModifyServiceModal(false);
      setLoading(false);
    } catch (err) {
      console.error('Error modifying service:', err);
      setError('Failed to modify service. Please try again.');
      setLoading(false);
    }
  };

  const handleModifyServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceToModify({
      ...serviceToModify,
      [name]: value
    });
  };

  // If user is not logged in, show a message
  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to access this page</h1>
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
            <li className="px-6 py-3">
              <a href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
            </li>
            <li className="px-6 py-3 bg-blue-50 border-l-4 border-blue-600">
              <a href="#" className="flex items-center text-blue-600 font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business Details
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
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {loading && !business ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            {error}
          </div>
        ) : business ? (
          <div>
            {/* Business Details Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {new Date(business.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{business.name}</h1>
                <p className="text-gray-600 mb-4">{business.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{business.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Services</h2>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Service
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <img
                  src="https://illustrations.popsy.co/amber/work-from-home.svg"
                  alt="No services"
                  className="w-40 h-40 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No services found</h3>
                <p className="text-gray-500 mb-6">You haven't added any services to this business yet.</p>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Service
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">{service.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{service.duration} minutes</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">₹{service.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                              onClick={() => handleModifyService(service)}
                            >
                              Modify
                            </button>
                            <button
                              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              onClick={() => handleManageSlots(service)}
                            >
                              Manage Slots
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            Business not found
          </div>
        )}
      </div>

      {/* Manage Slots Modal */}
      {showManageSlotsModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Manage Time Slots - {selectedService.name}</h2>
              <button
                onClick={() => setShowManageSlotsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Slots List */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Existing Time Slots</h3>
                {timeSlots.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-md text-gray-500 text-center">
                    No time slots found for this service.
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Start Time
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            End Time
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {timeSlots.map((slot) => (
                          <tr key={slot.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {slot.isBooked ? 'Booked' : 'Available'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteTimeSlot(slot.id)}
                                disabled={slot.isBooked}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Add New Time Slot Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Time Slot</h3>
                <form onSubmit={handleAddTimeSlot} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="mb-4">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={newTimeSlot.startTime}
                      onChange={handleTimeSlotInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={newTimeSlot.endTime}
                      onChange={handleTimeSlotInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {timeSlotError && (
                    <div className="mb-4 text-red-500 text-sm">
                      {timeSlotError}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 hover:bg-blue-700"
                    >
                      {loading ? 'Saving...' : 'Add Time Slot'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modify Service Modal */}
      {showModifyServiceModal && serviceToModify && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Modify Service</h2>
              <button
                onClick={() => setShowModifyServiceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleModifyServiceSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={serviceToModify.name}
                  onChange={handleModifyServiceInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={serviceToModify.description}
                  onChange={handleModifyServiceInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter service description"
                ></textarea>
              </div>

              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={serviceToModify.duration}
                  onChange={handleModifyServiceInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter duration in minutes"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={serviceToModify.price}
                    onChange={handleModifyServiceInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModifyServiceModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail;
