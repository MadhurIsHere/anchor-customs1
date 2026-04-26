import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 0, letterSpacing: '1px' }}>
            ANCHOR <span style={{ color: 'var(--accent)' }}>CUSTOMS</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/gallery" className="nav-link">Gallery</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          
          {isAdmin && (
            <Link to="/admin" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Admin</Link>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
            <Link to="/cart" style={{ position: 'relative' }}>
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-10px', 
                  background: 'var(--accent)', 
                  color: 'white', 
                  fontSize: '0.7rem', 
                  padding: '2px 6px', 
                  borderRadius: '50%' 
                }}>
                  {cartItems.length}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <Link to="/dashboard" aria-label="Dashboard"><User size={20} /></Link>
                <button 
                  onClick={handleLogout} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.4rem', 
                    padding: 0,
                    color: 'inherit'
                  }}
                  className="nav-link"
                >
                  <LogOut size={18} />
                  <span style={{ fontSize: '0.7rem' }}>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <style>{`
        .nav-link {
          font-weight: 500;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .nav-link:hover {
          color: var(--accent);
        }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--primary);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          z-index: 1001;
        }
        .mobile-menu a {
          color: var(--text);
          font-weight: 600;
          font-size: 1.1rem;
          text-decoration: none;
        }
      `}</style>
      
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/gallery" onClick={() => setIsMenuOpen(false)}>Gallery</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart ({cartItems.length})</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--accent)', 
                  textAlign: 'left', 
                  padding: 0, 
                  fontSize: '1.1rem', 
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
