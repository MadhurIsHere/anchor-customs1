import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/config';
import { formatDate } from '../../utils/helpers';
import { CheckCircle, Truck, Printer, Mail, DownloadCloud, Package } from 'lucide-react';
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
          .from('orders_v2')
          .select(`
            *,
            order_items (*)
          `)
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
    const email = order.email;
    if (!email) {
      toast.error('No email address available for this customer.');
      return;
    }

    const toastId = toast.loading('Sending email update...');
    try {
      // Build product name list for the email
      const productNames = order.order_items?.map(i => i.template_name).join(', ') || 'Order';

      const response = await fetch('/api/send-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          customerName: order.full_name,
          orderId: order.display_id,
          templateName: productNames,
          status: status
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send email');
      toast.success('Email update sent successfully!', { id: toastId });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(`Error: ${error.message}`, { id: toastId });
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('orders_v2')
        .update({ order_status: newStatus })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Blocked by database security policies (RLS). Please check your Supabase table policies.");
      }
      
      const updatedOrder = orders.find(o => o.id === orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      toast.success(`Status updated to ${newStatus}`);
      
      // Prompt to send email update
      if (updatedOrder && window.confirm(`Status updated! Do you want to send an email notification to the customer about the ${newStatus} status?`)) {
         sendEmailUpdate({ ...updatedOrder, order_status: newStatus }, newStatus);
      }

    } catch (error) {
      toast.error('Update failed: ' + error.message);
    }
  };

  // New ZIP structure: O_3442.zip → per-product subfolders
  const downloadImagesAsZip = async (order) => {
    const items = order.order_items || [];
    
    // Check if ANY item has images
    const hasAnyImages = items.some(item => 
      (item.images && item.images.length > 0) || item.cover_photo
    );

    if (!hasAnyImages) {
      toast.error('No images found for this order.');
      return;
    }

    const toastId = toast.loading(`Creating ZIP for ${order.display_id}...`);
    
    try {
      const zip = new JSZip();

      for (const item of items) {
        const allUrls = [];
        if (item.cover_photo) allUrls.push({ url: item.cover_photo, isCover: true });
        if (item.images && item.images.length > 0) {
          item.images.forEach(url => allUrls.push({ url, isCover: false }));
        }
        
        // Skip items with no images
        if (allUrls.length === 0) continue;

        // Create per-product subfolder
        const slug = item.template_name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const itemFolder = zip.folder(slug);

        // Add product_details.txt
        const details = [
          `Product: ${item.template_name}`,
          `Category: ${item.category || 'N/A'}`,
          `Price: ₹${item.price}`,
          `Custom Text: ${item.custom_text || 'N/A'}`,
          `Special Instructions: ${item.special_instructions || 'N/A'}`,
          `Images: ${allUrls.length}`
        ].join('\n');
        itemFolder.file('product_details.txt', details);

        // Download and add images
        const fetchPromises = allUrls.map(async ({ url, isCover }, index) => {
          try {
            const response = await fetch(url);
            const blob = await response.blob();
            let ext = url.split('.').pop().split('?')[0];
            if (ext.length > 4 || ext.includes('/')) ext = 'webp';
            const filename = isCover ? `00_COVER.${ext}` : `image_${index.toString().padStart(2, '0')}.${ext}`;
            itemFolder.file(filename, blob);
          } catch (err) {
            console.error('Failed to fetch image:', url, err);
          }
        });

        await Promise.all(fetchPromises);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${order.display_id}.zip`);
      
      toast.success('Download complete!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to create zip file.', { id: toastId });
    }
  };

  // Count total images across all items
  const getTotalImages = (order) => {
    return (order.order_items || []).reduce((total, item) => {
      let count = 0;
      if (item.cover_photo) count++;
      if (item.images) count += item.images.length;
      return total + count;
    }, 0);
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="section-padding">
      <div className="container">
        <div className="admin-header" style={{ marginBottom: '2rem' }}>
          <h1 className="admin-title">Admin Control</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage incoming orders · {orders.length} total</p>
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
                <th style={{ padding: '1rem' }}>Order</th>
                <th style={{ padding: '1rem' }}>Customer</th>
                <th style={{ padding: '1rem' }}>Products</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr style={{ borderBottom: 'none' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--navy)' }}>{order.display_id}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatDate(order.created_at)}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {order.full_name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', marginTop: '0.3rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.email} · {order.mobile}</span>
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
                        {getTotalImages(order) > 0 && (
                          <button 
                            onClick={() => downloadImagesAsZip(order)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <DownloadCloud size={12} /> ZIP ({getTotalImages(order)} imgs)
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {order.order_items?.map((item, idx) => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Package size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.template_name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>₹{order.total_amount}</span>
                      {order.shipping_cost > 0 && (
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>incl. ₹{order.shipping_cost} shipping</span>
                      )}
                    </td>
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
                          <span style={{ opacity: 0.9 }}>
                            {order.shipping_address?.full || 
                             `${order.shipping_address?.house || ''}, ${order.shipping_address?.street || ''}, ${order.shipping_address?.city || ''}, ${order.shipping_address?.state || ''} - ${order.shipping_address?.pincode || ''}`
                            }
                          </span>
                        </div>
                        {/* Show custom text / special notes for each product */}
                        {order.order_items?.filter(i => i.custom_text).map(item => (
                          <div key={item.id}>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>
                              ✨ {item.template_name} — Custom Content
                            </strong>
                            <span style={{ opacity: 0.9 }}>{item.custom_text}</span>
                          </div>
                        ))}
                        {order.order_items?.filter(i => i.special_instructions).map(item => (
                          <div key={item.id + '_notes'}>
                            <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>
                              📝 {item.template_name} — Special Instructions
                            </strong>
                            <span style={{ opacity: 0.9 }}>{item.special_instructions}</span>
                          </div>
                        ))}
                        <div>
                          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '0.5rem' }}>Payment</strong>
                          <code style={{ 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            padding: '0.3rem 0.6rem', 
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'inline-block'
                          }}>
                            {order.payment_id || 'N/A'}
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
