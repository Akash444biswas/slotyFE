import React from 'react';
import '../App.css';

const Hero = () => {
  return (
    <section className="hero-gradient" style={{ color: 'white', padding: '5rem 0', position: 'relative' }}>
      <div className="container-custom">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="hero-content">
          <div className="hero-text animate-fadeIn" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.2' }}>
              Book Appointments Effortlessly with Slotify
            </h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#e0f2fe' }}>
              The simplest way to schedule and manage appointments online.
              Save time, reduce no-shows, and delight your customers.
            </p>
            <div className="button-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button className="btn-primary">Book Now</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image animate-slideUp">
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <img
                src="https://placehold.co/600x400/0ea5e9/FFFFFF?text=Slotify+App"
                alt="Slotify App Interface"
                style={{ borderRadius: '0.5rem', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wave SVG divider */}
      <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', overflow: 'hidden' }}>
        <svg
          style={{ position: 'relative', display: 'block', width: '100%', height: '50px' }}
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            style={{ fill: 'white' }}
          ></path>
        </svg>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .hero-content {
            flex-direction: row !important;
            align-items: center;
          }
          .hero-text {
            width: 50%;
            margin-bottom: 0 !important;
            padding-right: 2rem;
          }
          .hero-image {
            width: 50%;
            padding-left: 2rem;
          }
          h1 {
            font-size: 3.5rem !important;
          }
          .button-group {
            flex-direction: row !important;
            gap: 1rem;
          }
        }

        @media (min-width: 1024px) {
          h1 {
            font-size: 4rem !important;
          }
          section {
            padding: 8rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
