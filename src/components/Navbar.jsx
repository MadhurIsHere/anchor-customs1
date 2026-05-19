import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Mobile Header Structure */}
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-header">
          {/* Left Menu Button */}
          <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Centered Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => setIsMenuOpen(false)}>
            <img src="/logo_anchor.png" alt="Anchor Customs" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Right Cart */}
          <div className="mobile-cart-container" style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/cart" style={{ position: 'relative', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={22} color="var(--text)" />
              {cartItems.length > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '0', 
                  right: '0', 
                  background: 'var(--accent)', 
                  color: 'white', 
                  fontSize: '0.6rem', 
                  padding: '2px 5px', 
                  borderRadius: '50%',
                  fontWeight: 'bold'
                }}>
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="desktop-menu" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/faq" className="nav-link">FAQ</Link>
          </div>

          {/* Centered Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
            <Link to="/" className="desktop-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/logo_anchor.png" alt="Anchor Customs" style={{ height: '85px', width: 'auto', objectFit: 'contain' }} />
            </Link>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'flex-end' }}>
            {isAdmin && (
              <Link to="/admin" className="nav-link" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Admin</Link>
            )}

            <Link to="/cart" style={{ position: 'relative', color: 'var(--text)' }}>
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
                <Link to="/dashboard" aria-label="Dashboard" style={{ color: 'var(--text)' }}><User size={20} /></Link>
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
                    color: 'var(--text-muted)'
                  }}
                  className="nav-link"
                >
                  <LogOut size={18} />
                  <span style={{ fontSize: '0.7rem' }}>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 1.2rem', borderRadius: '30px', fontSize: '0.8rem' }}>Login</Link>
            )}
          </div>
        </div>
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
          .desktop-logo { display: none !important; }
          .mobile-header { display: flex !important; }
        }
        
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
          .desktop-logo { display: flex !important; }
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
          
          <div style={{ margin: '0.5rem 0' }}>
            <button 
              onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '0.5rem 0',
                color: 'var(--text)',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-sans)'
              }}
            >
              <span>CATEGORIES</span>
              <span style={{ 
                transform: isCategoriesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <ChevronDown size={18} color="var(--accent)" />
              </span>
            </button>
            
            {isCategoriesDropdownOpen && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.8rem', 
                marginTop: '0.8rem', 
                paddingLeft: '1rem', 
                borderLeft: '2px solid var(--border)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <Link to={`/?category=${encodeURIComponent('Magazines')}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>Magazines</Link>
                <Link to={`/?category=${encodeURIComponent('Premium Gifts')}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>Premium Gifts</Link>
                <Link to={`/?category=${encodeURIComponent('Combos')}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>Combos</Link>
                <Link to={`/?category=${encodeURIComponent('Photo Frames')}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>Photo Frames</Link>
                <Link to={`/?category=${encodeURIComponent('Apparel & Accessories')}`} onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', opacity: 0.8 }}>Apparel</Link>
              </div>
            )}
          </div>


          {currentUser ? (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>My Account</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--accent)' }}>Admin Panel</Link>
              )}
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                style={{ 
                  background: 'var(--bg-offset)', 
                  border: '1px solid var(--border)', 
                  color: 'var(--text)', 
                  textAlign: 'center', 
                  padding: '0.8rem', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius)',
                  marginTop: '1rem'
                }}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn btn-primary" style={{ textAlign: 'center', color: 'white' }}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
