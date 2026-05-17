import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Auth = () => {
  const { demoLogin, signInWithPhone, verifyOtp } = useAuth();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    demoLogin();
    const from = location.state?.from || '/';
    navigate(from);
  };

  // Handle timer for resend OTP
  React.useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    try {
      const { data, error } = await signInWithPhone(formattedPhone);
      
      if (error) throw error;
      if (data?.type === 'error') throw new Error(data.message || 'Failed to send OTP');
      
      setStep('otp');
      setTimer(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Check your Msg91 configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    try {
      const { error } = await verifyOtp(formattedPhone, otp);
      
      if (error) throw error;

      toast.success('Logged in successfully!');
      const from = location.state?.from || '/';
      navigate(from);
    } catch (error) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding" style={{ 
      background: 'linear-gradient(135deg, var(--bg) 0%, var(--bg-offset) 100%)', 
      minHeight: '90vh', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container" 
        style={{ maxWidth: '450px' }}
      >
        <div className="card" style={{ 
          padding: '3rem 2rem', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.8)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
              Welcome <span style={{ color: 'var(--accent)' }}>Back</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {step === 'phone' ? 'Secure login via Phone OTP' : `Enter the 6-digit code sent to +91 ${phone}`}
            </p>
          </div>
          
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div style={{ 
                    padding: '0.8rem 1rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)', 
                    backgroundColor: 'var(--bg-offset)', 
                    color: 'var(--navy)', 
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>+91</div>
                  <input 
                    type="tel" 
                    value={phone} 
                    required 
                    autoFocus
                    className="input-field" 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Enter 10 digits"
                    maxLength="10"
                    style={{ flex: 1, fontSize: '1.1rem', letterSpacing: '1px' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || phone.length < 10} 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '1.2rem', 
                  fontSize: '1.1rem', 
                  marginTop: '1rem',
                  boxShadow: 'var(--gold-glow)',
                  opacity: (loading || phone.length < 10) ? 0.7 : 1
                }}
              >
                {loading ? 'Processing...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="input-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Enter OTP</label>
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                  >
                    Change Number
                  </button>
                </div>
                <input 
                  type="text" 
                  value={otp} 
                  required 
                  autoFocus
                  className="input-field" 
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                  placeholder="• • • • • •"
                  maxLength="6"
                  style={{ textAlign: 'center', letterSpacing: '0.8rem', fontSize: '1.5rem', fontWeight: 'bold', height: '60px' }}
                />
              </div>

              <button type="submit" disabled={loading || otp.length < 6} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', boxShadow: 'var(--gold-glow)' }}>
                {loading ? 'Verifying...' : 'Complete Login'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                {timer > 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Resend code in <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>{timer}s</span></p>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Didn't receive code? Resend
                  </button>
                )}
              </div>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              type="button" 
              onClick={handleDemoLogin}
              style={{ 
                background: 'rgba(175, 145, 112, 0.1)', 
                border: '1px dashed var(--accent)', 
                color: 'var(--accent)', 
                padding: '0.6rem 1rem', 
                borderRadius: 'var(--radius)', 
                fontSize: '0.8rem', 
                fontWeight: '600', 
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Bypass Login (Developer Mode)
            </button>
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
             <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                Secure authentication provided by Anchor Customs. <br/>
                We respect your privacy.
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
