import React, { useState } from 'react';
import { supabase } from '../../supabase/config';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = ({ type }) => {
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
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success('Logged in successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg-offset)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '450px' }}>
        <div className="card" style={{ padding: '3rem' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{type === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
          
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
            <div className="input-group">
              <label className="input-label">Password</label>
              <input type="password" name="password" required className="input-field" onChange={handleInputChange} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              {loading ? 'Processing...' : (type === 'signup' ? 'Sign Up' : 'Login')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {type === 'signup' ? 'Already have an account?' : "Don't have an account?"} {' '}
            <Link to={type === 'signup' ? '/login' : '/signup'} style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              {type === 'signup' ? 'Login' : 'Sign Up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
