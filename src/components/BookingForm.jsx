import React, { useState } from 'react';
import axios from 'axios';

const BookingForm = ({ service, timeSlot, onClose, onSuccess }) => {
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Name validation - required and max 100 chars
    if (!customerForm.name.trim()) {
      errors.name = 'Name is required';
    } else if (customerForm.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation - required and valid format
    if (!customerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation - required and valid format (allowing various formats)
    if (!customerForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (customerForm.phone.length > 20) {
      errors.phone = 'Phone number must be less than 20 characters';
    } else if (!/^[\d+\-()\s.]+$/.test(customerForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    // Validate form first
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Submitting booking for service:', service);
    console.log('Customer details:', customerForm);

    try {
      setLoading(true);
      console.log('Setting loading state to true');

      // Create customer record with all required fields - exactly matching CustomerCreateDto
      const payload = {
        serviceId: service.id, // This must be a valid GUID
        name: customerForm.name,
        email: customerForm.email,
        phone: customerForm.phone,
        // Include timeSlot ID if available
        ...(timeSlot && { timeSlotId: timeSlot.id })
      };

      console.log('Service ID type:', typeof service.id);
      if (timeSlot) {
        console.log('Time Slot ID:', timeSlot.id);
        console.log('Time Slot Start:', new Date(timeSlot.startTime).toLocaleString());
        console.log('Time Slot End:', new Date(timeSlot.endTime).toLocaleString());
      }

      // Try HTTPS first, then fallback to HTTP if needed
      const httpsUrl = 'https://localhost:7208/api/Customer';
      const httpUrl = 'http://localhost:7208/api/Customer';

      console.log('Sending API request to', httpsUrl, 'with payload:', payload);

      // Add explicit headers to ensure proper content type
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      let response;
      try {
        console.log('Trying HTTPS endpoint...');
        response = await axios.post(httpsUrl, payload, config);
      } catch (httpsError) {
        console.log('HTTPS request failed, trying HTTP instead:', httpsError.message);
        try {
          response = await axios.post(httpUrl, payload, config);
        } catch (httpError) {
          console.log('HTTP request also failed:', httpError.message);
          throw httpError; // Re-throw to be caught by the outer catch block
        }
      }

      console.log('Booking response:', response.data);

      // Store response data
      setResponseData(response.data);

      // Show success message
      setSuccess(true);

      // Reset form
      setCustomerForm({
        name: '',
        email: '',
        phone: ''
      });

      setLoading(false);

      // Don't call onSuccess yet - we'll call it after user dismisses the success message
    } catch (err) {
      console.error('Error booking appointment:', err);

      // More detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
        setError(`API Error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        setError('No response received from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
      }

      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]" style={{ backdropFilter: 'blur(3px)' }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative z-[10000]">
        {success ? (
          // Success message
          <div className="text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-4">Your appointment has been booked successfully.</p>
            <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
              <h3 className="font-medium text-gray-700 mb-2">Booking Details:</h3>
              <p className="text-sm text-gray-600"><span className="font-medium">Service:</span> {service.name}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {responseData?.name || customerForm.name}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {responseData?.email || customerForm.email}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {responseData?.phone || customerForm.phone}</p>

              {timeSlot && (
                <p className="text-sm text-gray-600"><span className="font-medium">Appointment Time:</span> {new Date(timeSlot.startTime).toLocaleString()}</p>
              )}

              {responseData?.createdAt && (
                <p className="text-sm text-gray-600"><span className="font-medium">Booking Created:</span> {new Date(responseData.createdAt).toLocaleString()}</p>
              )}
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                if (onSuccess) onSuccess();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          // Booking form
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">Booking for: <span className="font-semibold">{service.name}</span></p>
              <p className="text-gray-600">Price: <span className="font-semibold">${service.price}</span></p>
              <p className="text-gray-600">Duration: <span className="font-semibold">{service.duration} minutes</span></p>

              {timeSlot && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-800">Selected Time Slot:</p>
                  <p className="text-blue-700">
                    {new Date(timeSlot.startTime).toLocaleDateString()} at {new Date(timeSlot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 bg-red-50 p-3 rounded-md text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerForm.name}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerForm.email}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerForm.phone}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
