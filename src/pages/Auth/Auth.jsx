import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Auth = () => {
  const { signInWithGoogle } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Supabase will redirect — no navigation needed here
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="section-padding"
      style={{
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-offset) 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="container"
        style={{ maxWidth: '440px', width: '100%' }}
      >
        <div
          className="card"
          style={{
            padding: '3rem 2.5rem',
            boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '1.25rem',
          }}
        >
          {/* Logo / Brand */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: 'var(--shadow), 0 4px 12px rgba(175, 145, 112, 0.15)',
                overflow: 'hidden',
                padding: '0'
              }}
            >
              <img 
                src="/logo_anchor.png" 
                alt="Anchor Customs" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.2rem',
                color: 'var(--navy)',
                marginBottom: '0.4rem',
                lineHeight: 1.2,
              }}
            >
              Welcome to <span style={{ color: 'var(--accent)' }}>Anchor</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Sign in to browse &amp; place custom orders
            </p>
          </div>

          {/* Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.95rem 1.5rem',
              background: '#fff',
              border: '1.5px solid #dadce0',
              borderRadius: '0.75rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#3c4043',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {/* Google "G" SVG icon */}
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {loading ? 'Redirecting…' : 'Continue with Google'}
          </motion.button>

          {/* Footer */}
          <div
            style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Secure authentication powered by Google &amp; Supabase.
              <br />
              We never store your password.
            </p>
          </div>


        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
