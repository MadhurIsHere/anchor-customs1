import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';

// Listener to handle adding free gift after successful login
const FreeGiftListener = () => {
  const { currentUser } = useAuth();
  const { addToCart, cartItems } = useCart();

  React.useEffect(() => {
    if (currentUser && localStorage.getItem('claimFreeGift') === 'true') {
      const hasGift = cartItems.some(item => item.id === 'free_gift_surprise' || item.templateId === 'free_gift_surprise');
      if (!hasGift) {
        const freeGift = {
          id: 'free_gift_surprise',
          templateId: 'free_gift_surprise',
          templateName: 'Free Surprise Gift',
          pages: 'Special Surprise',
          price: 0,
          images: ['/products/Surprise-box.jpeg'],
          coverImage: '/products/Surprise-box.jpeg',
          coverPhoto: '/products/Surprise-box.jpeg',
          status: 'free_gift',
          customerDetails: {
            fullName: currentUser.user_metadata?.full_name || '',
            whatsapp: '',
            email: currentUser.email || '',
            address: '',
            specialNotes: 'Free Gift claimed via promo ribbon'
          }
        };
        addToCart(freeGift);
        toast.success('Welcome! Your Free Surprise Gift has been added to your cart! 🎁', { duration: 5000 });
      }
      localStorage.removeItem('claimFreeGift');
    }
  }, [currentUser, cartItems, addToCart]);

  return null;
};

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import TemplateDetail from './pages/TemplateDetail/TemplateDetail';
import CustomizationForm from './pages/TemplateDetail/CustomizationForm';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout/Checkout';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FAQ from './pages/FAQ';

import Terms from './pages/Legal/Terms';
import Privacy from './pages/Legal/Privacy';
import Refund from './pages/Legal/Refund';
import Shipping from './pages/Legal/Shipping';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <FreeGiftListener />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/template/:id" element={<TemplateDetail />} />
                <Route path="/customize/:id/:pages" element={<CustomizationForm />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/faq" element={<FAQ />} />
                
                {/* Legal Pages for Razorpay Compliance */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/shipping" element={<Shipping />} />
                
                <Route path="/contact" element={
                  <div className="section-padding container" style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>Contact Us</h1>
                    <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontSize: '1.1rem' }}>
                        <strong>Email Us:</strong><br />
                        <a href="mailto:anchorcustoms1@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '1.15rem', fontWeight: '600' }}>
                          anchorcustoms1@gmail.com
                        </a>
                      </p>
                      <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border)' }}></div>
                      <p style={{ margin: 0, fontSize: '1.1rem' }}>
                        <strong>Follow Us:</strong><br />
                        <a 
                          href="https://www.instagram.com/anchor.customs?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '1.15rem', fontWeight: '600' }}
                        >
                          @anchor.customs
                        </a>
                      </p>
                    </div>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="bottom-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
