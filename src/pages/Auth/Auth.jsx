import React, { useState } from 'react';
import { supabase } from '../../supabase/config';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = ({ type: initialType }) => {
  const [type, setType] = useState(initialType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.displayName,
            },
          },
        });
        if (error) throw error;
        toast.success('Check your email for the confirmation link!');
      } else if (type === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Password reset link sent to your email!');
        setType('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'signup') return 'Create Account';
    if (type === 'forgot') return 'Reset Password';
    return 'Welcome Back';
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-offset)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{getTitle()}</h1>
          
          <form onSubmit={handleSubmit}>
            {type === 'signup' && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" name="displayName" required className="input-field" onChange={handleInputChange} />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input type="email" name="email" required className="input-field" onChange={handleInputChange} />
            </div>
            
            {type !== 'forgot' && (
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="input-label">Password</label>
                  {type === 'login' && (
                    <button 
                      type="button" 
                      onClick={() => setType('forgot')}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '0.5rem' }}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input type="password" name="password" required className="input-field" onChange={handleInputChange} />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              {loading ? 'Processing...' : (type === 'signup' ? 'Sign Up' : type === 'forgot' ? 'Send Link' : 'Login')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {type === 'signup' ? 'Already have an account?' : type === 'forgot' ? 'Remembered your password?' : "Don't have an account?"} {' '}
            <button 
              onClick={() => setType(type === 'signup' || type === 'forgot' ? 'login' : 'signup')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {type === 'signup' || type === 'forgot' ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
