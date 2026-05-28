import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { loadScript } from '../../utils/helpers';
import { supabase } from '../../supabase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, ArrowLeft, Package, MapPin } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, shippingTotal, finalTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Structured address form matching Buy Now flow
  const [shippingForm, setShippingForm] = useState({
    fullName: currentUser?.user_metadata?.full_name || '',
    email: currentUser?.email || '',
    mobile: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [shippingDone, setShippingDone] = useState(false);

  // Pre-fill from first cart item that has details
  React.useEffect(() => {
    const first = cartItems.find(i => i.customerDetails?.mobile || i.customerDetails?.address);
    if (first) {
      setShippingForm(prev => ({
        ...prev,
        fullName: first.customerDetails?.fullName || currentUser?.user_metadata?.full_name || '',
        email: first.customerDetails?.email || currentUser?.email || '',
        mobile: first.customerDetails?.mobile || ''
      }));
    }
  }, []);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const m = shippingForm.mobile.replace(/[^0-9]/g, '');
    if (m.length < 10) { toast.error('Enter a valid 10-digit mobile number.'); return; }
    if (!shippingForm.fullName.trim()) { toast.error('Please enter your full name.'); return; }
    if (!shippingForm.house.trim()) { toast.error('Please enter House / Flat / Apartment No.'); return; }
    if (!shippingForm.street.trim()) { toast.error('Please enter Street / Area / Locality.'); return; }
    if (!shippingForm.city.trim()) { toast.error('Please enter City.'); return; }
    if (!shippingForm.state.trim()) { toast.error('Please enter State.'); return; }
    if (!shippingForm.pincode.trim()) { toast.error('Please enter Pincode.'); return; }
    setShippingDone(true);
  };

  const getFullAddress = () => {
    return `${shippingForm.house}, ${shippingForm.street}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.pincode}`;
  };

  const saveOrderToSupabase = async (razorpayResponse) => {
    try {
      if (!currentUser) {
        toast.error('Please login to complete your order.');
        return;
      }

      console.log('Starting order save process...');

      // 1. Get next sequential order number (#3442, #3443, etc.)
      const { data: counterData, error: counterError } = await supabase
        .rpc('get_next_order_number');

      if (counterError) {
        console.error('Counter error:', counterError);
        throw new Error('Failed to generate order number: ' + counterError.message);
      }

      const displayId = counterData; // e.g. "#3442"
      console.log('Generated Order ID:', displayId);

      // 2. Create single order in orders_v2
      const { data: orderData, error: orderError } = await supabase
        .from('orders_v2')
        .insert({
          display_id: displayId,
          user_id: currentUser.id,
          full_name: shippingForm.fullName,
          email: shippingForm.email,
          mobile: shippingForm.mobile,
          shipping_address: {
            house: shippingForm.house,
            street: shippingForm.street,
            city: shippingForm.city,
            state: shippingForm.state,
            pincode: shippingForm.pincode,
            full: getFullAddress()
          },
          payment_id: razorpayResponse.razorpay_payment_id,
          payment_status: 'paid',
          subtotal: cartTotal,
          shipping_cost: shippingTotal,
          total_amount: finalTotal,
          order_status: 'received'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order insert error:', orderError);
        throw new Error('Failed to create order: ' + orderError.message);
      }

      console.log('Order created:', orderData.id);

      // 3. Insert all cart items as order_items
      const itemsToInsert = cartItems.map(item => ({
        order_id: orderData.id,
        template_id: item.templateId,
        template_name: item.templateName,
        category: item.category || '',
        quantity: 1,
        price: item.price,
        custom_text: item.customerDetails?.customText || null,
        special_instructions: item.customerDetails?.specialNotes || null,
        cover_photo: item.coverPhoto || null,
        images: item.images || []
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Order items insert error:', itemsError);
        throw new Error('Failed to save order items: ' + itemsError.message);
      }

      console.log('Order items saved:', itemsToInsert.length, 'items');

      // 4. Send Email Confirmation
      try {
        const customerEmail = shippingForm.email || currentUser?.email;
        
        if (customerEmail) {
          console.log('Sending email confirmation...');
          const orderedItems = cartItems.map(item => ({
            name: item.templateName,
            price: item.price
          }));

          const response = await fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: customerEmail,
              customerName: shippingForm.fullName,
              mobile: shippingForm.mobile,
              address: getFullAddress(),
              orderIds: displayId,
              items: orderedItems,
              totalPrice: finalTotal
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Email failed:', errorData);
          } else {
            console.log('✓ Email sent successfully.');
          }
        }
      } catch (emailErr) {
        console.error('Email send failed:', emailErr);
      }

      // 5. Show success with order details
      setCompletedOrder({
        displayId,
        items: cartItems,
        subtotal: cartTotal,
        total: finalTotal,
        shipping: shippingTotal,
        date: new Date()
      });
      setIsSuccess(true);
      clearCart();
      toast.success('Order Placed Successfully!');
    } catch (error) {
      console.error('Save Flow Failed:', error);
      toast.error('Error: ' + error.message);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    if (finalTotal <= 0) {
      toast.error('Please add at least one paid item to checkout with your free gift.');
      setIsProcessing(false);
      return;
    }

    try {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key', 
        amount: finalTotal * 100,
        currency: 'INR',
        name: 'Anchor Customs',
        description: `Order - ${cartItems.length} item(s)`,
        handler: async function (response) {
          await saveOrderToSupabase(response);
        },
        prefill: {
          name: shippingForm.fullName || currentUser?.user_metadata?.full_name || '',
          email: shippingForm.email || currentUser?.email || '',
          contact: shippingForm.mobile || ''
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

  // ── SUCCESS SCREEN (Order Preview) ──
  if (isSuccess && completedOrder) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <CheckCircle size={80} style={{ color: '#00a86b', marginBottom: '1.5rem' }} />
          <h1 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for choosing Anchor Customs.</p>
          
          {/* Order Card */}
          <div className="card" style={{ padding: '2rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Order ID</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)' }}>{completedOrder.displayId}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Status</span>
                <span style={{ color: '#3498db', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>Received</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.8rem', display: 'block' }}>Products</span>
              {completedOrder.items.map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.8rem 0',
                  borderBottom: idx < completedOrder.items.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <img 
                    src={item.images?.[0] || item.coverPhoto || item.coverImage} 
                    alt={item.templateName}
                    style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--navy)' }}>{item.templateName}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                    {item.price === 0 ? 'FREE' : `₹${item.price}`}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                <span>Subtotal</span><span>₹{completedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <span>Shipping</span><span>{completedOrder.shipping === 0 ? 'FREE' : `₹${completedOrder.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                <span>Total</span><span>₹{completedOrder.total}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary" 
            style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}
          >
            Go to My Orders →
          </button>
        </div>
      </div>
    );
  }

  // ── INPUT FIELD STYLE ──
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1.5px solid var(--border)',
    borderRadius: '20px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 700,
    marginBottom: '0.3rem',
    color: 'var(--navy)',
    textTransform: 'uppercase'
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '600px' }}>
        <button 
          onClick={() => window.history.state && window.history.state.idx > 0 ? navigate(-1) : navigate('/')} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginBottom: '1.5rem', 
            fontSize: '0.95rem', 
            border: '1px solid var(--border)', 
            background: '#fff', 
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer', 
            color: 'var(--navy)',
            fontFamily: 'var(--font-sans)',
            fontWeight: '600',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ── SHIPPING DETAILS ── */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--navy)', fontFamily: 'var(--font-serif)' }}>
              📦 Shipping Details
            </h2>
            {shippingDone && (
              <button onClick={() => setShippingDone(false)} style={{ background: 'none', border: '1px solid var(--accent)', borderRadius: '6px', padding: '0.3rem 0.7rem', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Edit</button>
            )}
          </div>

          {shippingDone ? (
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
              <p style={{ margin: 0 }}><strong style={{ color: 'var(--navy)' }}>{shippingForm.fullName}</strong> · {shippingForm.email}</p>
              <p style={{ margin: 0 }}>📱 {shippingForm.mobile}</p>
              <p style={{ margin: 0 }}>📍 {getFullAddress()}</p>
            </div>
          ) : (
            <form onSubmit={handleShippingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Row 1: Name & Email */}
              <div style={{ display: 'flex', gap: '1rem', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" value={shippingForm.fullName} onChange={(e) => setShippingForm(p => ({...p, fullName: e.target.value}))} placeholder="e.g. John Doe" required style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={shippingForm.email} onChange={(e) => setShippingForm(p => ({...p, email: e.target.value}))} placeholder="e.g. john@example.com" required style={inputStyle} />
                </div>
              </div>

              {/* Row 2: Mobile */}
              <div>
                <label style={labelStyle}>Mobile Number * <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(WhatsApp)</span></label>
                <input type="tel" value={shippingForm.mobile} onChange={(e) => setShippingForm(p => ({...p, mobile: e.target.value}))} placeholder="10-digit mobile number" maxLength={10} required style={{ ...inputStyle, borderColor: 'var(--accent)' }} />
              </div>

              {/* Address Section */}
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--navy)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> Delivery Address
                </h3>
                
                <div style={{ display: 'flex', gap: '1rem', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>House / Flat / Apartment No. *</label>
                    <input type="text" value={shippingForm.house} onChange={(e) => setShippingForm(p => ({...p, house: e.target.value}))} placeholder="e.g. Flat 101, Building A" required style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Street / Area / Locality *</label>
                    <input type="text" value={shippingForm.street} onChange={(e) => setShippingForm(p => ({...p, street: e.target.value}))} placeholder="e.g. Sector 15, Park Road" required style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: window.innerWidth <= 768 ? 'column' : 'row' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>City *</label>
                    <input type="text" value={shippingForm.city} onChange={(e) => setShippingForm(p => ({...p, city: e.target.value}))} placeholder="e.g. New Delhi" required style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>State *</label>
                    <input type="text" value={shippingForm.state} onChange={(e) => setShippingForm(p => ({...p, state: e.target.value}))} placeholder="e.g. Delhi" required style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Pincode *</label>
                    <input type="text" value={shippingForm.pincode} onChange={(e) => setShippingForm(p => ({...p, pincode: e.target.value}))} placeholder="6-digit PIN" maxLength={6} required style={inputStyle} />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem', fontSize: '0.95rem', borderRadius: '20px' }}>Save & Continue →</button>
            </form>
          )}
        </div>

        {/* ── FINAL CHECKOUT ── */}
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <CreditCard size={48} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
          <h1 style={{ marginBottom: '1rem' }}>Final Checkout</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Subtotal: ₹{cartTotal}</p>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Shipping: {shippingTotal === 0 ? 'FREE' : `+ ₹${shippingTotal}`}</p>
            <p style={{ color: 'var(--text)', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '0.5rem' }}>Total: ₹{finalTotal} for {cartItems.length} item(s).</p>
          </div>
          
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
                    {item.templateId === 'free_gift_surprise' ? 'FREE' : `₹${item.price}`}
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

          {/* Shipping Preview */}
          {shippingDone && (
            <div style={{ textAlign: 'left', background: 'var(--bg-offset)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Shipping to:</h3>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{shippingForm.fullName}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{getFullAddress()}</p>
            </div>
          )}

          {finalTotal <= 0 && (
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
            disabled={isProcessing || finalTotal <= 0 || !shippingDone}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', opacity: (finalTotal <= 0 || !shippingDone) ? 0.5 : 1 }}
          >
            {!shippingDone ? '⬆️ Fill Shipping Details First' : isProcessing ? 'Initializing...' : 'Pay Now with Razorpay'}
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
