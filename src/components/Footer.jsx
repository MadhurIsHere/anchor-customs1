import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>ANCHOR CUSTOMS</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', maxWidth: '300px' }}>
              Crafting premium photo magazines that tell your unique stories. Based in India, shipping worldwide.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/gallery" style={{ color: 'rgba(255,255,255,0.7)' }}>Templates</Link></li>
              <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.7)' }}>Contact Us</Link></li>
              <li><Link to="/login" style={{ color: 'rgba(255,255,255,0.7)' }}>My Account</Link></li>
              <li><Link to="/privacy" style={{ color: 'rgba(255,255,255,0.7)' }}>Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Contact</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <Phone size={18} /> +91 98765 43210
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
                <Mail size={18} /> hello@anchorcustoms.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <a href="#"><Instagram size={24} /></a>
                <a href="#"><Facebook size={24} /></a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem', 
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          &copy; {new Date().getFullYear()} Anchor Customs. All rights reserved. Made with love in India.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
