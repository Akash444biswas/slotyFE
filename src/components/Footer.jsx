import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <h3 className="footer-logo">Slotify</h3>
            <p className="footer-description">
              The modern way to schedule appointments and manage your business.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#testimonials" className="footer-link">Testimonials</a></li>
              <li><a href="#" className="footer-link">Pricing</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">API Documentation</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        {/* Copyright */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Slotify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
