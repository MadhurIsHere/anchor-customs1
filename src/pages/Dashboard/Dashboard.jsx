import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { Package, Clock, CheckCircle, Truck, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        // Fetch from orders_v2 with joined order_items
        const { data, error } = await supabase
          .from('orders_v2')
          .select(`
            *,
            order_items (*)
          `)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return '#3498db';
      case 'printing': return '#f39c12';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#00a86b';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'received': return <Clock size={14} />;
      case 'printing': return <Package size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>Hello, {currentUser?.user_metadata?.full_name || 'Customer'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your orders and account details</p>
          </div>
          <div className="card" style={{ padding: '1rem 2rem', background: 'var(--bg-offset)' }}>
            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Orders Placed</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{orders.length}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>Your Orders</h2>
        
        {loading ? <p>Loading orders...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Package size={40} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                <p>No orders yet.</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                {/* Order Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Order ID</span>
                    <span style={{ fontWeight: '800', color: 'var(--navy)', fontSize: '1.1rem' }}>{order.display_id}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Date</span>
                    <span style={{ fontWeight: '500' }}>{formatDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Status</span>
                    <span style={{ 
                      color: getStatusColor(order.order_status), 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {getStatusIcon(order.order_status)} {order.order_status}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>₹{order.total_amount}</span>
                  </div>
                </div>

                {/* Products List */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.8rem', display: 'block' }}>
                    {order.order_items?.length || 0} Product{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                  </span>
                  
                  {order.order_items?.map((item, idx) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      alignItems: 'center',
                      padding: '0.7rem 0',
                      borderBottom: idx < order.order_items.length - 1 ? '1px solid var(--border)' : 'none'
                    }}>
                      {(item.cover_photo || (item.images && item.images.length > 0)) && (
                        <img 
                          src={item.cover_photo || item.images?.[0]} 
                          alt={item.template_name}
                          style={{ width: '50px', height: '65px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} 
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold', margin: 0 }}>{item.template_name}</h4>
                        {item.custom_text && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>✨ {item.custom_text}</p>
                        )}
                      </div>
                      <span style={{ fontWeight: '700', color: 'var(--accent)', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                        {item.price === 0 ? 'FREE' : `₹${item.price}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.8rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={12} /> {order.shipping_address.full || `${order.shipping_address.house}, ${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state} - ${order.shipping_address.pincode}`}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
