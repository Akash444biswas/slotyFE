import React from 'react';
import '../App.css';

const Testimonials = () => {
  // Shorter testimonials
  const testimonials = [
    {
      name: 'Sarah J.',
      role: 'Salon Owner',
      content: 'Our no-show rate has dropped by 60% with Slotify!',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    {
      name: 'Michael C.',
      role: 'Fitness Trainer',
      content: 'Slotify lets me focus on clients instead of admin work.',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
    },
    {
      name: 'Emily R.',
      role: 'Dental Practice',
      content: 'Automated reminders saved our staff countless hours.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
  ];

  return (
    <section id="testimonials" style={{ padding: '3rem 0', backgroundColor: 'white' }}>
      <div className="container-custom">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>
            What Our Customers Say
          </h2>
          <p style={{ fontSize: '1rem', color: '#4b5563', maxWidth: '36rem', margin: '0 auto' }}>
            Join thousands of satisfied businesses using Slotify
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              style={{ 
                flex: '1 1 300px', 
                maxWidth: '300px',
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '9999px', marginRight: '0.75rem' }}
                />
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111827', margin: 0 }}>{testimonial.name}</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0 }}>{testimonial.role}</p>
                </div>
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', fontStyle: 'italic', margin: '0 0 0.75rem 0' }}>"{testimonial.content}"</p>
              <div style={{ display: 'flex', color: '#fbbf24' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} style={{ width: '0.9rem', height: '0.9rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: '#0284c7', fontWeight: '600', marginRight: '0.5rem' }}>4.9/5</span>
            <div style={{ display: 'flex', color: '#fbbf24' }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} style={{ width: '0.9rem', height: '0.9rem' }} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>from 500+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
