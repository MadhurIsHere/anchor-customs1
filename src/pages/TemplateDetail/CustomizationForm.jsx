import React, { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, Image as ImageIcon, Send, Loader, ArrowLeft } from 'lucide-react';
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
    specialNotes: ''
  });

  const [coverPhoto, setCoverPhoto] = useState(null);
  const [photos, setPhotos] = useState([]); // Array of { file, preview }
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressionOptions = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  const removePhoto = (index) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      return newPhotos.filter((_, i) => i !== index);
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file, bucket, type, details, folderPath) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folderPath}/${type}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Compress before upload
    let fileToUpload = file;
    try {
      fileToUpload = await imageCompression(file, compressionOptions);
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

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.fullName.trim()) {
      toast.error('Please enter your Full Name');
      return;
    }
    if (!phoneRegex.test(formData.whatsapp.trim())) {
      toast.error('Please enter a valid 10-digit WhatsApp number');
      return;
    }
    
    if (!formData.address.trim()) {
      toast.error('Please provide a delivery address');
      return;
    }

    if (template.id !== 'kaleshi_aurat') {
      if (!coverPhoto) {
        toast.error('Please upload a cover photo');
        return;
      }
      if (photos.length === 0) {
        toast.error('Please upload at least one photo');
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      let finalImages = [];
      
      // Smart Progress Simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev < 45) return prev + 3; // Fast charge to 45%
          if (prev < 85) return prev + 1.5; // Speedy upload phase
          if (prev < 98) return prev + 0.35; // Gentle final wrap-up
          return prev;
        });
      }, 100);

      if (template.id !== 'kaleshi_aurat') {
        const safeName = formData.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const folderPath = `${safeName}_${Date.now()}`;

        const coverUrl = await uploadFile(coverPhoto, 'photos', 'cover', formData, folderPath);
        
        let completed = 0;
        const uploadPromises = photos.map((photo, i) => 
          uploadFile(photo.file, 'photos', 'inner', formData, folderPath)
            .then(url => {
              completed++;
              // Jump progress based on real completion
              const realProgress = 30 + (completed / photos.length * 60);
              setUploadProgress(prev => Math.max(prev, realProgress));
              return url;
            })
        );
        
        const photoUrls = await Promise.all(uploadPromises);
        finalImages = [coverUrl, ...photoUrls];
        clearInterval(progressInterval);
        setUploadProgress(100);
      } else {
        finalImages = [template.image];
        clearInterval(progressInterval);
        setUploadProgress(100);
      }

      const customOrder = {
        userId: currentUser.id,
        templateId: id,
        templateName: template.name,
        pages: parseInt(pages),
        price: pages === '10' ? template.price10 : template.price12,
        customerDetails: {
          ...formData,
          customText: '' // Field removed from UI but kept for compatibility
        },
        images: finalImages,
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

  if (!currentUser) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="card">
            <h1 style={{ marginBottom: '1.5rem' }}>Login Required</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
              Please login with your phone number to start customizing your {template?.name || 'product'}.
            </p>
            <button 
              onClick={() => navigate('/login', { state: { from: `/customize/${id}/${pages}` } })} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button 
          onClick={() => navigate(`/template/${template.id}`)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0', 
            marginTop: '-4rem',
            marginBottom: '2.5rem', 
            fontSize: '1rem', 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer', 
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={18} /> Back to Product
        </button>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{template.name}</h1>
        
        <form onSubmit={handleSubmit} className="card form-container">
          <div className="responsive-grid">
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" name="fullName" className="input-field" onChange={handleInputChange} placeholder="e.g. John Doe" />
            </div>
            <div className="input-group">
              <label className="input-label">WhatsApp Number</label>
              <input 
                type="tel" 
                name="whatsapp" 
                className="input-field" 
                onChange={handleInputChange} 
                placeholder="10-digit number"
                maxLength="10"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>Enter exactly 10 digits without +91 or spaces.</span>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Delivery Address</label>
            <textarea 
              name="address" 
              className="input-field" 
              rows="3" 
              onChange={handleInputChange} 
              placeholder="House No, Street, City, State, Pincode"
            ></textarea>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>Must include City, State, and 6-digit Pincode.</span>
          </div>

          {template.id !== 'kaleshi_aurat' && (
            <>
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
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                  Inner Photos {
                    template.category === 'Calendar' 
                      ? '(Max 12)' 
                      : template.category === 'Frames' 
                        ? '(Max 10-15)' 
                        : '(Max 50)'
                  }
                </h3>
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
                      
                      if (photos.length + files.length > 100) {
                        toast.error('Maximum 100 photos allowed for upload safety');
                        return;
                      }
                      
                      const newPhotos = files.map(file => ({
                        file,
                        preview: URL.createObjectURL(file)
                      }));
                      
                      setPhotos(prev => [...prev, ...newPhotos]);
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
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    Selected: <span style={{ fontWeight: 'bold', color: 'var(--navy)' }}>{photos.length}</span> photos
                  </p>
                  {(template.category === 'Calendar' || template.category === 'Frames') && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem', fontWeight: '500' }}>
                      {template.category === 'Calendar' && "* Recommended: Please upload max 12 photos for the Calendar."}
                      {template.category === 'Frames' && "* Recommended: Please upload 10-15 photos for the Frame."}
                    </p>
                  )}
                </div>
    
                {photos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.8rem', marginTop: '1.5rem' }}>
                    {photos.map((photo, idx) => (
                      <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                        <img src={photo.preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
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
                <label className="input-label">Special Instructions</label>
                <input type="text" name="specialNotes" className="input-field" placeholder="e.g. sequence of photos, color preferences" onChange={handleInputChange} />
              </div>
            </>
          )}

          {isUploading && (
            <div style={{ margin: '2rem 0' }}>
              <div style={{ 
                height: '12px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '6px', 
                overflow: 'hidden', 
                position: 'relative',
                border: '1px solid rgba(0,0,0,0.02)'
              }}>
                <div 
                  className="snake-progress" 
                  style={{ 
                    width: `${uploadProgress}%`, 
                    height: '100%', 
                    transition: 'width 0.25s cubic-bezier(0.1, 0.8, 0.3, 1)' 
                  }}
                ></div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '0.8rem', fontWeight: '500', color: 'var(--navy)' }}>
                Crafting your heirloom... <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{Math.round(uploadProgress)}%</span>
              </p>
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
        
        .snake-progress {
          background-color: var(--accent);
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.35) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.35) 75%,
            transparent 75%,
            transparent
          );
          background-size: 30px 30px;
          animation: snake-slide 0.4s linear infinite;
          box-shadow: 0 0 12px var(--accent);
          border-radius: 6px;
        }
        @keyframes snake-slide {
          from { background-position: 0 0; }
          to { background-position: 30px 0; }
        }
      `}</style>
    </div>
  );
};

export default CustomizationForm;
