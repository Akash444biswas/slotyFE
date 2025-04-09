import React from 'react';
import '../App.css';

const Features = () => {
  const features = [
    {
      title: 'Easy Booking',
      description: 'Simple, intuitive interface for booking appointments in seconds. No more phone tag or email chains.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Real-time Availability',
      description: 'Show your real-time availability to clients, automatically updated as bookings come in.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Smart Reminders',
      description: 'Automated email and SMS reminders to reduce no-shows and keep everyone on schedule.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: 'Seamless Integration',
      description: 'Integrates with your favorite calendar apps like Google Calendar, Outlook, and iCal.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Custom Scheduling',
      description: 'Set your availability, buffer times between appointments, and customize booking rules.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Analytics Dashboard',
      description: 'Track booking patterns, popular time slots, and customer behavior with detailed analytics.',
      icon: (
        <svg style={{ width: '3rem', height: '3rem', color: '#0ea5e9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" style={{ padding: '5rem 0', backgroundColor: '#f9fafb' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            Powerful Features for Seamless Scheduling
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '48rem', margin: '0 auto' }}>
            Everything you need to streamline your appointment booking process and delight your customers.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>{feature.title}</h3>
              <p style={{ color: '#4b5563' }}>{feature.description}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <button className="btn-primary">Explore All Features</button>
        </div>
      </div>

      <style jsx>{`
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr 1fr;
          }
          h2 {
            font-size: 2.25rem !important;
          }
        }

        @media (min-width: 1024px) {
          .features-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;
