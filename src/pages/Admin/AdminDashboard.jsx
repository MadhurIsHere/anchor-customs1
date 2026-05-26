import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { formatDate } from '../../utils/helpers';
import { CheckCircle, Truck, Printer, Mail, DownloadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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

  const sendEmailUpdate = async (order, status) => {
    const email = order.customer_details.email;
    if (!email) {
      toast.error('No email address available for this customer.');
      return;
    }

    const orderId = order.display_id || `#${order.id.slice(0, 8)}`;
    
    const toastId = toast.loading('Sending email update...');
    try {
      const response = await fetch('/api/send-status-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          customerName: order.customer_details.fullName,
          orderId: orderId,
          templateName: order.template_name,
          status: status
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success('Email update sent successfully!', { id: toastId });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Blocked by database security policies (RLS). Please check your Supabase table policies.");
      }
      
      const updatedOrder = data[0];
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      toast.success(`Status updated to ${newStatus}`);
      
      // Prompt to send email update
      if (window.confirm(`Status updated! Do you want to send an email notification to the customer about the ${newStatus} status?`)) {
         sendEmailUpdate(updatedOrder, newStatus);
      }

    } catch (error) {
      toast.error('Update failed: ' + error.message);
    }
  };

  const downloadImagesAsZip = async (order) => {
    let allUrls = [];
    if (order.images && order.images.length > 0) allUrls = [...order.images];
    if (order.cover_photo && !allUrls.includes(order.cover_photo)) {
      allUrls.unshift(order.cover_photo); // Put cover photo first
    }

    if (allUrls.length === 0) {
      toast.error('No images found for this order.');
      return;
    }

    const toastId = toast.loading(`Zipping ${allUrls.length} images... Please wait.`);
    
    try {
      const zip = new JSZip();
      const safeName = order.customer_details.fullName ? order.customer_details.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'customer';
      const folderName = `Order_${order.display_id || order.id.slice(0, 8)}_${safeName}`;
      const folder = zip.folder(folderName);

      const fetchPromises = allUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          
          let ext = url.split('.').pop().split('?')[0];
          if (ext.length > 4 || ext.includes('/')) ext = 'webp'; 
          
          const filename = (url === order.cover_photo) ? `00_COVER.${ext}` : `image_${index.toString().padStart(2, '0')}.${ext}`;
          folder.file(filename, blob);
        } catch (err) {
          console.error('Failed to fetch image:', url, err);
        }
      });

      await Promise.all(fetchPromises);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${folderName}.zip`);
      
      toast.success('Download complete!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create zip file.', { id: toastId });
    }
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="section-padding">
      <div className="container">
        <div className="admin-header" style={{ marginBottom: '2rem' }}>
          <h1 className="admin-title">Admin Control</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage incoming magazine orders</p>
        </div>

        <style>{`
          .admin-title {
            font-size: 3rem;
            margin-bottom: 0.5rem;
          }
          @media (max-width: 768px) {
            .admin-title {
              font-size: 2rem;
            }
            .admin-header {
              text-align: center;
              margin-bottom: 2rem;
            }
          }
        `}</style>

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
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--navy)' }}>{order.display_id || `#${order.id.slice(0, 8)}`}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {order.customer_details.fullName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer_details.email || order.customer_details.whatsapp}</span>
                        <button 
                          onClick={() => sendEmailUpdate(order, order.order_status)}
                          className="btn"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', backgroundColor: 'var(--accent)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Send Email Update"
                        >
                          <Mail size={12} /> Email
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <a 
                          href={order.images?.[0] || order.cover_photo || '#'} 
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          View 1st Photo
                        </a>
                        {(order.images?.length > 0 || order.cover_photo) && (
                          <button 
                            onClick={() => downloadImagesAsZip(order)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <DownloadCloud size={12} /> Zip ({order.images?.length || 0})
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '500' }}>{order.template_name}</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.price}</td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={order.order_status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: 'var(--radius)', 
                          border: '1px solid var(--border)', 
                          fontSize: '0.8rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--text)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="received">Received</option>
                        <option value="printing">Printing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                    <td colSpan="5" style={{ padding: '1rem', fontSize: '0.85rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Delivery Address</strong>
                          <span style={{ opacity: 0.9 }}>{order.customer_details.address}</span>
                        </div>
                        {order.customer_details.customText && (
                          <div>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Custom Content</strong>
                            <span style={{ opacity: 0.9 }}>{order.customer_details.customText}</span>
                          </div>
                        )}
                        {order.customer_details.specialNotes && (
                          <div>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Special Instructions</strong>
                            <span style={{ opacity: 0.9 }}>{order.customer_details.specialNotes}</span>
                          </div>
                        )}
                        <div>
                          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Storage Folder</strong>
                          <code style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'inline-block'
                          }}>
                            {order.images?.[0]?.split('/photos/')?.[1]?.split('/')?.[0] || 'N/A'}
                          </code>
                        </div>
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
