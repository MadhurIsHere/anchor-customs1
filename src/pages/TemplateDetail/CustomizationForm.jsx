import React, { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Send, Loader } from 'lucide-react';
import { TEMPLATES } from '../../utils/data';
import { supabase } from '../../supabase/config';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';

const CustomizationForm = () => {
  const { id, pages } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const template = TEMPLATES.find(t => t.id === id);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: currentUser?.email || '',
    address: '',
    customText: '',
    specialNotes: ''
  });

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressionOptions = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  const onDropPhotos = useCallback(acceptedFiles => {
    if (photos.length + acceptedFiles.length > 50) {
      toast.error('Maximum 50 photos allowed');
      return;
    }
    setPhotos(prev => [...prev, ...acceptedFiles]);
  }, [photos]);

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file, bucket, type, details) => {
    const fileExt = file.name.split('.').pop();
    const safeName = (details.fullName || 'customer').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeAddress = (details.address || '').replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
    
    let fileName;
    if (type === 'cover') {
      fileName = `cover_${safeName}_${safeAddress}_${Date.now()}.${fileExt}`;
    } else {
      fileName = `${safeName}_inner_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    }
    
    // Compress before upload
    console.log(`Compressing ${type} photo...`);
    let fileToUpload = file;
    try {
      fileToUpload = await imageCompression(file, compressionOptions);
      console.log(`Original: ${file.size / 1024 / 1024}MB, Compressed: ${fileToUpload.size / 1024 / 1024}MB`);
    } catch (e) {
      console.warn('Compression failed, uploading original', e);
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileToUpload, {
        contentType: file.type,
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error('Please enter your Full Name');
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error('Please enter your WhatsApp Number');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your Delivery Address');
      return;
    }
    if (!coverPhoto) {
      toast.error('Please upload a cover photo');
      return;
    }
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);

    try {
      const coverUrl = await uploadFile(coverPhoto, 'photos', 'cover', formData);
      setUploadProgress(30);
      
      const photoUrls = [];
      const totalPhotos = photos.length;
      
      for (let i = 0; i < totalPhotos; i++) {
        const url = await uploadFile(photos[i], 'photos', 'inner', formData);
        photoUrls.push(url);
        setUploadProgress(30 + ((i + 1) / totalPhotos) * 65);
      }

      const customOrder = {
        userId: currentUser.id,
        templateId: id,
        templateName: template.name,
        pages: parseInt(pages),
        price: pages === '10' ? template.price10 : template.price12,
        customerDetails: formData,
        images: [coverUrl, ...photoUrls],
        status: 'pending_payment',
        created_at: new Date().toISOString()
      };

      addToCart(customOrder);
      toast.success('Optimized & Added to Cart!');
      navigate('/cart');

    } catch (error) {
      console.error(error);
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Personalize Your {template.name}</h1>
        
        <form onSubmit={handleSubmit} className="card form-container">
          <div className="responsive-grid">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="fullName" className="input-field" onChange={handleInputChange} />
            </div>
            <div className="input-group">
              <label className="input-label">WhatsApp Number</label>
              <input type="tel" name="whatsapp" className="input-field" onChange={handleInputChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Delivery Address</label>
            <textarea name="address" className="input-field" rows="3" onChange={handleInputChange}></textarea>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Cover Photo</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <input 
                type="file" 
                ref={coverInputRef}
                hidden 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setCoverPhoto(file);
                    toast.success('Cover photo selected!');
                  }
                }} 
              />
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={() => coverInputRef.current.click()}
              >
                <Upload size={18} /> Choose Cover
              </button>
              {coverPhoto && <span style={{ fontSize: '0.8rem', color: 'var(--accent)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>✓ {coverPhoto.name}</span>}
            </div>
          </div>

          <div style={{ margin: '2rem 0' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Inner Photos (Max 50)</h3>
            <div style={{ 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: '2.5rem', 
              textAlign: 'center',
              backgroundColor: '#fcfcfc'
            }}>
              <input 
                type="file" 
                ref={fileInputRef}
                hidden 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  if (files.length === 0) return;
                  
                  if (photos.length + files.length > 50) {
                    toast.error('Maximum 50 photos allowed');
                    return;
                  }
                  
                  setPhotos(prev => [...prev, ...files]);
                  toast.success(`${files.length} photos added!`);
                }} 
              />
              <button 
                type="button"
                className="btn btn-outline" 
                style={{ margin: '0 auto' }}
                onClick={() => fileInputRef.current.click()}
              >
                <ImageIcon size={18} /> Select Multiple Photos
              </button>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                Selected: <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>{photos.length}</span> / 50
              </p>
            </div>

            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.8rem', marginTop: '1.5rem' }}>
                {photos.map((file, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(idx)}
                      style={{ 
                        position: 'absolute', top: '5px', right: '5px', 
                        background: 'rgba(255,255,255,0.8)', color: 'black', 
                        border: 'none', borderRadius: '50%', padding: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Custom Content / Text for Inside</label>
            <textarea name="customText" className="input-field" rows="4" placeholder="Any quotes, titles, or stories you want included..." onChange={handleInputChange}></textarea>
          </div>

          <div className="input-group">
            <label className="input-label">Special Instructions</label>
            <input type="text" name="specialNotes" className="input-field" placeholder="e.g. sequence of photos, color preferences" onChange={handleInputChange} />
          </div>

          {isUploading && (
            <div style={{ margin: '2rem 0' }}>
              <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }}></div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '0.5rem' }}>Crafting your heirloom... {Math.round(uploadProgress)}%</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className="btn btn-accent" 
            style={{ width: '100%', padding: '1.2rem', gap: '1rem' }}
          >
            {isUploading ? <Loader className="spin" /> : <Send size={20} />}
            {isUploading ? 'Uploading...' : 'Add to Cart'}
          </button>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default CustomizationForm;
