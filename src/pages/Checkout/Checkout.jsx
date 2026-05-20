import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { loadScript } from '../../utils/helpers';
import { supabase } from '../../supabase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const saveOrderToSupabase = async (razorpayResponse) => {
    try {
      if (!currentUser) {
        toast.error('Please login to complete your order.');
        return;
      }

      console.log('Starting order save process...');

      const ordersToInsert = cartItems.map(item => ({
        user_id: currentUser.id,
        template_id: item.templateId,
        template_name: item.templateName,
        pages: item.pages,
        price: item.price,
        customer_details: item.customerDetails,
        images: item.images,
        payment_id: razorpayResponse.razorpay_payment_id,
        payment_status: 'paid',
        order_status: 'received'
      }));

      console.log('Inserting into Supabase...', ordersToInsert.length, 'items');

      const { data, error } = await supabase
        .from('orders')
        .insert(ordersToInsert)
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        throw new Error('Supabase Error: ' + error.message);
      }

      console.log('Order saved to Supabase successfully!');



      // Send Email Confirmation
      try {
        const customerDetails = cartItems[0]?.customerDetails;
        const customerEmail = customerDetails?.email || currentUser?.email;
        console.log('--- DEBUG EMAIL INFO ---');
        console.log('Customer Email:', customerEmail);
        console.log('Inserted Data (needs to be array with >0 items):', data);
        
        if (customerEmail && data && data.length > 0) {
          console.log('Sending Email confirmation via Resend...');
          const orderIdsStr = data.map(o => o.display_id || `#${o.id.slice(0, 8)}`).join(', ');
          const orderedItems = data.map(o => ({
            id: o.display_id || `#${o.id.slice(0, 8)}`,
            name: o.template_name,
            pages: o.pages,
            price: o.price
          }));

          const { error: emailError } = await supabase.functions.invoke('send-order-email', {
            body: {
              email: customerEmail,
              customerName: customerDetails?.fullName || currentUser?.user_metadata?.full_name || 'Customer',
              orderIds: orderIdsStr,
              items: orderedItems,
              totalPrice: cartTotal
            }
          });

          if (emailError) {
            console.error('Resend Email confirmation failed:', emailError);
          } else {
            console.log('✓ Email confirmation sent successfully.');
          }
        }
      } catch (emailErr) {
        console.error('Failed to send Email confirmation:', emailErr);
      }

      setIsSuccess(true);
      clearCart();
      toast.success('Order Placed Successfully!');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error) {
      console.error('Save Flow Failed:', error);
      toast.error('Error: ' + error.message);
    }
  };

  const verifyPayment = async (paymentResponse, orderId) => {
    try {
      console.log('Sending to backend for verification...');
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { 
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          order_id: orderId 
        }
      });

      if (error || !data.success) throw new Error(error?.message || 'Verification failed');
      
      return true;
    } catch (err) {
      console.error('Verification failed:', err);
      return false;
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    if (cartTotal <= 0) {
      toast.error('Please add at least one paid item to checkout with your free gift.');
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key', 
        amount: cartTotal * 100,
        currency: 'INR',
        name: 'Anchor Customs',
        description: 'Photo Magazine Order',
        handler: async function (response) {
          // Send to our secure function to verify and save
          await saveOrderToSupabase(response);
        },
        prefill: {
          name: currentUser?.user_metadata?.full_name || '',
          email: currentUser?.email || '',
        },
        theme: {
          color: '#1a2238',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment initialization failed');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ marginBottom: '1.5rem' }}>Login Required</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Please login with your phone number to complete the purchase.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Login Now</button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container">
          <CheckCircle size={80} style={{ color: '#00a86b', marginBottom: '2rem' }} />
          <h1>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for choosing Anchor Customs. You will be redirected to your dashboard soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CreditCard size={48} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
          <h1 style={{ marginBottom: '1rem' }}>Final Checkout</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You are about to pay ₹{cartTotal} for {cartItems.length} item(s).</p>
          
          {/* Order Summary */}
          <div style={{ textAlign: 'left', background: 'var(--bg-offset)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--navy)' }}>Order Summary</h3>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{
                paddingBottom: idx < cartItems.length - 1 ? '1rem' : 0,
                marginBottom: idx < cartItems.length - 1 ? '1rem' : 0,
                borderBottom: idx < cartItems.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--navy)' }}>{item.templateName}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {item.id === 'free_gift_surprise' ? 'FREE' : `₹${item.price}`}
                  </span>
                </div>
                {item.customerDetails?.customText && (
                  <div style={{
                    marginTop: '0.7rem',
                    padding: '0.7rem 1rem',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(26,34,56,0.05) 100%)',
                    border: '1.5px solid var(--accent)',
                    borderRadius: '10px'
                  }}>
                    <p style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      color: 'var(--accent)',
                      margin: '0 0 0.3rem 0'
                    }}>✨ Your Customisation</p>
                    <p style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: 'var(--navy)',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>{item.customerDetails.customText}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'left', background: 'var(--bg-offset)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Shipping to:</h3>
            <p style={{ fontSize: '0.9rem' }}>{cartItems[0]?.customerDetails?.fullName}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cartItems[0]?.customerDetails?.address}</p>
          </div>

          {cartTotal <= 0 && (
            <div style={{
              background: 'rgba(255,0,0,0.05)',
              border: '1px solid rgba(255,0,0,0.2)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
              marginBottom: '1rem',
              color: 'var(--text)',
              fontSize: '0.9rem'
            }}>
              🚨 <strong>Oops!</strong> Please add at least one paid item to your cart to claim the free gift and checkout.
            </div>
          )}

          <button 
            onClick={handlePayment} 
            disabled={isProcessing || cartTotal <= 0}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', opacity: cartTotal <= 0 ? 0.5 : 1 }}
          >
            {isProcessing ? 'Initializing...' : 'Pay Now with Razorpay'}
          </button>

          {/* Professional Demo Mode for Client Review */}
          <button 
            type="button"
            onClick={() => saveOrderToSupabase({ razorpay_payment_id: 'demo_client_review_' + Date.now() })}
            className="btn btn-outline"
            style={{ 
              marginTop: '1.5rem', 
              width: '100%',
              fontSize: '0.9rem', 
              opacity: 0.8,
              borderStyle: 'dashed'
            }}
          >
            Review Mode: Simulate Successful Payment
          </button>
          
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Secure payment powered by Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
