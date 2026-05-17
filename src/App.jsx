import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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
                
                {/* Legal Pages for Razorpay Compliance */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/shipping" element={<Shipping />} />
                
                <Route path="/contact" element={
                  <div className="section-padding container" style={{ maxWidth: '800px' }}>
                    <h1 style={{ marginBottom: '2rem' }}>Contact Us</h1>
                    <div className="card" style={{ padding: '2rem' }}>
                      <p><strong>Support Email:</strong> hello@anchorcustoms.com</p>
                      <p><strong>WhatsApp Support:</strong> +91 99999 88888</p>
                      <p><strong>Office Address:</strong> Anchor Customs, High Street Mall, New Delhi, India - 110001</p>
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
