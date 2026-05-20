import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, cartTotal } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-offset)', border: '1px solid var(--border)', borderRadius: '50%', padding: '2rem', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
            <ShoppingBag size={48} style={{ color: 'var(--accent)' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', marginBottom: '1rem' }}>Your cart is empty</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: '1.4' }}>Ready to custom design your premium nostalgic print layout?</p>
          <Link to="/gallery" className="btn btn-accent" style={{ padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
            Browse Templates <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        <h1 style={{ marginBottom: '3rem' }}>Your Shopping Cart</h1>
        
        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="card cart-item-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={item.images?.[0] || item.coverImage || item.coverPhoto} alt="Cover" style={{ width: '100px', height: '130px', objectFit: item.id === 'free_gift_surprise' ? 'contain' : 'cover', padding: item.id === 'free_gift_surprise' ? '15px' : '0', background: item.id === 'free_gift_surprise' ? '#f5f5f5' : 'transparent', borderRadius: '4px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.templateName}</h3>
                  {item.id !== 'free_gift_surprise' && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {typeof item.pages === 'number' || (item.pages && !isNaN(Number(item.pages))) ? `${item.pages} Pages Magazine` : item.pages || ''}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: item.id === 'free_gift_surprise' ? '1rem' : '0' }}>
                    <span style={{ fontWeight: 'bold' }}>
                      {item.id === 'free_gift_surprise' ? 'FREE' : `₹${item.price}`}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card glass" style={{ padding: '2rem', position: 'sticky', top: '120px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ color: '#00a86b' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn btn-accent" style={{ width: '100%', padding: '1rem' }}>
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
