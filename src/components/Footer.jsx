import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={{ backgroundColor: '#fdfbf9', color: 'var(--text)', padding: isMobile ? '2rem 0 1.5rem' : '4rem 0 2rem', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: isMobile ? '1.5rem' : '3rem',
          marginBottom: isMobile ? '1.5rem' : '3rem'
        }}>
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: isMobile ? '0.5rem' : '1rem', fontFamily: 'var(--font-serif)', fontSize: isMobile ? '1.5rem' : '1.8rem', letterSpacing: '1px', fontWeight: 'bold' }}>Anchor <span style={{ color: 'var(--accent)' }}>Customs</span></h2>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.6' }}>
              Turning your memories into something you can hold forever. Based in Delhi, India, delivering nationwide.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: isMobile ? '0.6rem' : '1.5rem', fontFamily: 'var(--font-serif)' }}>Policies</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.4rem' : '0.8rem' }}>
              <li><Link to="/terms" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Terms & Conditions</Link></li>
              <li><Link to="/privacy" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="/refund" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Refund Policy</Link></li>
              <li><Link to="/shipping" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: isMobile ? '0.6rem' : '1.5rem', fontFamily: 'var(--font-serif)' }}>Contact</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.4rem' : '0.8rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)' }}>
                <Mail size={18} /> anchorcustoms1@gmail.com
              </li>
              <li style={{ marginTop: isMobile ? '0.4rem' : '1rem' }}>
                <a 
                  href="https://www.instagram.com/anchor.customs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: 'var(--accent)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  <Instagram size={24} />
                  <span>@anchor.customs</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: isMobile ? '1rem' : '2rem', 
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-light)'
        }}>
          &copy; {new Date().getFullYear()} Anchor Customs. All rights reserved. Made with love in India.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
