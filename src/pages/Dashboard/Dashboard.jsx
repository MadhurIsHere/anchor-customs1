import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { Package, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { TEMPLATES } from '../../utils/data';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error(error);
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

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>Hello, {currentUser?.user_metadata?.full_name || 'Customer'}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your orders and account details</p>
          </div>
          <div className="card" style={{ padding: '1rem 2rem', background: 'var(--bg-offset)' }}>
            <span style={{ fontSize: '0.8rem', display: 'block', color: 'var(--text-muted)' }}>Orders Placed</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{orders.length}</span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>Your Orders (Updated)</h2>
        
        {loading ? <p>Loading orders...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Package size={40} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
                <p>No orders yet.</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Order Date</span>
                    <span style={{ fontWeight: '500' }}>{formatDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Order ID</span>
                    <span style={{ fontWeight: '600', color: 'var(--navy)' }}>{order.display_id || `#${order.id.slice(0, 8)}`}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Status</span>
                    <span style={{ 
                      color: getStatusColor(order.order_status), 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Clock size={14} /> {order.order_status}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total</span>
                    <span style={{ fontWeight: 'bold' }}>₹{order.price}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <img src={order.images?.[0]} alt="Cover" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>{order.template_name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
