import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { formatDate } from '../../utils/helpers';
import { CheckCircle, Truck, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) fetchAllOrders();
  }, [isAdmin]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Update failed: ' + error.message);
    }
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>Admin Control</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage incoming magazine orders</p>
          </div>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--bg-offset)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Order Info</th>
                <th style={{ padding: '1rem' }}>Customer & Photos</th>
                <th style={{ padding: '1rem' }}>Template</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr style={{ borderBottom: 'none' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>#{order.id.slice(0, 8)}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '600', display: 'block' }}>{order.customer_details.fullName}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Phone: {order.customer_details.whatsapp}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '500' }}>{order.template_name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{order.pages} Pages</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={order.order_status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.8rem' }}
                      >
                        <option value="received">Received</option>
                        <option value="printing">Printing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#fafafa' }}>
                    <td colSpan="5" style={{ padding: '0.8rem 1rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Delivery Address</strong>
                          {order.customer_details.address}
                        </div>
                        {order.customer_details.customText && (
                          <div>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Custom Content</strong>
                            {order.customer_details.customText}
                          </div>
                        )}
                        {order.customer_details.specialNotes && (
                          <div>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block' }}>Special Instructions</strong>
                            {order.customer_details.specialNotes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && !loading && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
