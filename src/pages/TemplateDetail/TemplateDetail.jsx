import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TEMPLATES } from '../../utils/data';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart, AlertTriangle, Heart, Maximize2, X, CheckCircle, User, Smartphone, MapPin, Search } from 'lucide-react';
import { getCustomizationConfig } from '../../utils/customizationConfig';
import { motion, AnimatePresence } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { supabase } from '../../supabase/config';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../utils/cloudinary';

const TemplateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find(t => t.id === id);
  const { addToCart, cartItems } = useCart();
  const { currentUser } = useAuth();
  const [selectedOption, setSelectedOption] = useState('10');
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [checkingStock, setCheckingStock] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [standingSpread, setStandingSpread] = useState(0);
  const [standingDir, setStandingDir] = useState(1); // 1 = forward, -1 = backward
  const [selectedImage, setSelectedImage] = useState(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [orderForm, setOrderForm] = useState({ fullName: '', email: '', whatsapp: '', house: '', street: '', city: '', state: '', pincode: '', specialNotes: '', customizationMessage: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [innerFiles, setInnerFiles] = useState([]);

  const bookRef = useRef();
  const miniBookRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isComboOrHamper = template && (template.category === 'Hamper' || template.category === 'Combo' || template.category === 'Combos');
  const needsImages = template && !template.isHotWheels && !['Apparel', 'Cap', 'Keychain', 'Bouquet'].includes(template.category);

  const lastTapRef = useRef(0);
  const longPressTimeoutRef = useRef(null);

  // Handle double tap or long press zoom
  const handlePageGesture = (e, imgUrl) => {
    if (e.touches && e.touches.length > 0) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapRef.current;
      
      // Double tap (within 300ms)
      if (tapLength < 300 && tapLength > 0) {
        setSelectedImage(imgUrl);
        e.preventDefault();
        return;
      }
      lastTapRef.current = currentTime;

      // Long press (after 500ms)
      if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = setTimeout(() => {
        setSelectedImage(imgUrl);
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextButtonClick = () => {
    if(bookRef.current) bookRef.current.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    if(bookRef.current) bookRef.current.pageFlip().flipPrev();
  };

  if (!template) return <div>Template not found</div>;
  const sliderImages = (template.category === 'Calendar' || template.category === 'Standing Magazine')
    ? [] // Use flipbook
    : (template.gallery || [template.image]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const currentPrice = selectedOption === '10' ? template.price10 : template.price12;

  const getCategoryGroup = (cat) => {
    const groups = {
      'Magazines': ['Magazine', 'Standing Magazine'],
      'Premium Gifts': ['Hamper', 'Scrapbook', 'Calendar'],
      'Combos': ['Combo'],
      'Photo Frames': ['Frames', 'Frame', 'Aesthetic'],
      'Apparel & Accessories': ['Apparel', 'Cap', 'Keychain'],
      'Hot Wheels': ['Hot Wheels']
    };
    for (const [groupName, list] of Object.entries(groups)) {
      if (list.includes(cat)) return groupName;
    }
    return 'Other';
  };

  const groupName = getCategoryGroup(template.category);

  const handleProceed = () => {
    navigate(`/customize/${id}/${selectedOption}`);
  };

  // Hot Wheels: check stock via Supabase orders
  useEffect(() => {
    if (template?.isHotWheels && template.id !== 'hotwheels_bouquet') {
      if (!currentUser) {
        setIsSoldOut(false);
        setCheckingStock(false);
        return;
      }
      setCheckingStock(true);
      supabase
        .from('orders')
        .select('id')
        .eq('template_id', template.id)
        .eq('user_id', currentUser.id)
        .eq('payment_status', 'paid')
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) setIsSoldOut(true);
          else setIsSoldOut(false);
          setCheckingStock(false);
        })
        .catch(() => setCheckingStock(false));
    }
  }, [template, currentUser]);

  const alreadyInCart = cartItems.some(item => item.templateId === template?.id);

  const handleAddHotWheelsToCart = () => {
    if (!currentUser) {
      toast.error('Please login to purchase.');
      navigate('/login');
      return;
    }
    if (isSoldOut) {
      toast.error('You have already purchased this Hot Wheels model! (Limit 1 per account)');
      return;
    }
    if (alreadyInCart) {
      toast.error('This Hot Wheels car is already in your cart!');
      return;
    }
    addToCart({
      templateId: template.id,
      templateName: template.name,
      pages: 0,
      price: template.price10,
      images: [template.image],
      coverImage: template.image,
      coverPhoto: template.image,
      isHotWheels: true,
      customerDetails: {
        fullName: currentUser.user_metadata?.full_name || '',
        whatsapp: '',
        email: currentUser.email || '',
        address: '',
        specialNotes: ''
      }
    });
    toast.success(`${template.name} added to cart! 🏎️`);
  };

  const getPhotoLimits = () => {
    const config = getCustomizationConfig(template);
    if (config) {
      return { min: config.minPhotos, max: config.maxPhotos || 30 };
    }
    return { min: 1, max: 30 };
  };

  const handleAddToCartClick = () => {
    if (!currentUser) { toast.error('Please login to add items to cart.'); navigate('/login'); return; }
    if (template.isHotWheels) { handleAddHotWheelsToCart(); return; }
    if (needsImages) {
      setOrderForm({ fullName: currentUser?.user_metadata?.full_name || '', email: currentUser?.email || '', whatsapp: '', house: '', street: '', city: '', state: '', pincode: '', specialNotes: '', customizationMessage: '' });
      setCoverFile(null);
      setInnerFiles([]);
      setShowCartModal(true);
    } else {
      addToCart({ templateId: template.id, templateName: template.name, pages: parseInt(selectedOption), price: currentPrice, images: [], coverPhoto: template.image, customerDetails: { fullName: currentUser?.user_metadata?.full_name || '', email: currentUser?.email || '' } });
      toast.success('Added to cart! 🛒');
    }
  };

  const handleBuyNowClick = () => {
    if (!currentUser) { toast.error('Please login to purchase.'); navigate('/login'); return; }
    if (template.isHotWheels && isSoldOut) { toast.error('You have already purchased this Hot Wheels model! (Limit 1 per account)'); return; }
    if (template.isHotWheels && alreadyInCart) { navigate('/checkout'); return; }
    setOrderForm({ fullName: currentUser?.user_metadata?.full_name || '', email: currentUser?.email || '', whatsapp: '', house: '', street: '', city: '', state: '', pincode: '', specialNotes: '', customizationMessage: '' });
    setCoverFile(null);
    setInnerFiles([]);
    setShowBuyNowModal(true);
  };

  const submitOrderForm = async (isBuyNow) => {
    if (isBuyNow) {
      if (!orderForm.fullName.trim()) { toast.error('Please enter your full name.'); return; }
      const mobileClean = orderForm.whatsapp.replace(/\D/g, '');
      if (mobileClean.length !== 10) { toast.error('Enter a valid 10-digit whatsapp number.'); return; }
      if (!orderForm.house.trim() || !orderForm.street.trim() || !orderForm.city.trim() || !orderForm.state.trim() || !orderForm.pincode.trim()) { 
        toast.error('Please fill all address fields.'); return; 
      }
    }
    
    const config = getCustomizationConfig(template);
    
    if (config.requiresCover && !coverFile) {
      toast.error('Please upload a cover photo.');
      return;
    }
    if (config.maxPhotos > 0) {
      if (innerFiles.length < config.minPhotos) {
        toast.error(`Please select at least ${config.minPhotos} inner photos.`); return;
      }
      if (innerFiles.length > config.maxPhotos) {
        toast.error(`You can select maximum ${config.maxPhotos} inner photos.`); return;
      }
    }
    if (config.customTextFields.length > 0 && !orderForm.customizationMessage.trim()) {
      toast.error(`Please fill out: ${config.customTextFields[0].label}`);
      return;
    }
    
    setIsUploading(true);
    try {
      let coverUrl = template.image;
      let innerUrls = [];
      
      if (needsImages) {
        if (coverFile) {
          const cUrl = await uploadToCloudinary(coverFile);
          coverUrl = cUrl || template.image;
        }
        if (innerFiles.length > 0) {
          innerUrls = await Promise.all(innerFiles.map(file => uploadToCloudinary(file)));
        }
      }
      
      const fullAddress = `${orderForm.house}, ${orderForm.street}, ${orderForm.city}, ${orderForm.state} - ${orderForm.pincode}`;
      
      addToCart({ 
        templateId: template.id, 
        templateName: template.name, 
        category: template.category,
        isHotWheels: template.isHotWheels,
        pages: parseInt(selectedOption), 
        price: currentPrice, 
        images: innerUrls, 
        coverPhoto: coverUrl, 
        customerDetails: { 
          fullName: isBuyNow ? orderForm.fullName : (currentUser?.user_metadata?.full_name || ''), 
          email: isBuyNow ? orderForm.email : (currentUser?.email || ''), 
          mobile: isBuyNow ? orderForm.whatsapp : '', 
          address: isBuyNow ? fullAddress : '', 
          specialNotes: orderForm.specialNotes,
          customText: orderForm.customizationMessage
        } 
      });
      
      if (isBuyNow) {
        setShowBuyNowModal(false);
        navigate('/checkout');
      } else {
        setShowCartModal(false);
        toast.success('Added to cart! 🛒');
      }
    } catch (error) {
      toast.error('Failed to upload images. Check your connection or try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBuyNowSubmit = (e) => { e.preventDefault(); submitOrderForm(true); };
  const handleCartSubmit = (e) => { e.preventDefault(); submitOrderForm(false); };


  // Dynamically configure book dimensions & aspect ratios to eliminate margins
  let bookWidth = isMobile ? 370 : 280;
  let bookHeight = isMobile ? 500 : 380;
  let wrapperAspectRatio = isMobile ? '0.73' : '1.47';
  let wrapperMaxWidth = isMobile ? '100%' : '800px';

  if (template.category === 'Calendar' || template.category==='Standing Magazine') {
    bookWidth = 280;
    bookHeight = 420;
    wrapperAspectRatio = '1.5';
    wrapperMaxWidth = '600px';
  
  } else if (template.category === 'Scrapbook') {
    bookWidth = isMobile ? 440 : 380;
    bookHeight = isMobile ? 320 : 280;
    wrapperAspectRatio = isMobile ? '1.36' : '2.71';
    wrapperMaxWidth = '100%';
  }

  // Calculate display pages with blanks for desktop physical items
  const { displayPages, displayLabels } = useMemo(() => {
    if (!template || !template.pages) return { displayPages: [], displayLabels: {} };
    
    let pages = [];
    let labels = {};

    if (isMobile || !template.pageLabels) {
      pages = [...template.pages];
      if (template.pageLabels) {
        if (Array.isArray(template.pageLabels)) {
          template.pageLabels.forEach((label, i) => labels[i] = label);
        } else {
          labels = { ...template.pageLabels };
        }
      }
    } else {
      // Desktop mode: pad physical items with blank pages so they occupy 1 page per spread
      let currentIndex = 0; 
      
      for (let i = 0; i < template.pages.length; i++) {
        let label = null;
        if (Array.isArray(template.pageLabels)) {
          label = template.pageLabels[i];
        } else if (template.pageLabels) {
          label = template.pageLabels[i];
        }

        const isMagazine = !label || label === 'Customized Magazine';
        
        if (isMagazine) {
          pages.push(template.pages[i]);
          if (label) labels[currentIndex] = label;
          currentIndex++;
        } else {
          // Physical item: MUST be on the LEFT page, RIGHT page must be blank.
          // Since showCover=true, 0 is right cover, 1 is left, 2 is right...
          // Left page means ODD index (currentIndex % 2 === 1)
          const isCurrentLeft = (currentIndex % 2 === 1);
          
          if (!isCurrentLeft) {
            pages.push('BLANK');
            currentIndex++;
          }
          
          pages.push(template.pages[i]);
          labels[currentIndex] = label;
          labels[currentIndex + 1] = label; // Apply to right side of spread
          currentIndex++;
          
          pages.push('BLANK');
          currentIndex++;
        }
      }
    }
    
    return { displayPages: pages, displayLabels: labels };
  }, [template, isMobile]);

  return (
    <div className="section-padding">
      <div className="container">
        <button 
          onClick={() => navigate(`/?category=${encodeURIComponent(groupName)}`)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: isMobile ? '-0.5rem' : '-4rem',
            marginBottom: isMobile ? '1rem' : '2.5rem', 
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
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="detail-flex" style={{ gap: isMobile ? '0' : '3rem' }}>
          {/* Interactive HTMLFlipBook Animation */}
          <div style={{ 
            flex: isMobile ? 'none' : (template.category === 'Calendar' ? '2 1 600px' : '1.3 1 450px'),
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: isMobile ? '0' : '1rem 0',
            width: '100%',
            marginBottom: '0'
          }}>
            {/* Removed Elegant Tab Selector for Hampers & Combos */}

            {/* STANDING MAGAZINE: Custom 2-page stacked vertical viewer with animation */}
            {template.category === 'Standing Magazine' && template.pages && template.pages.length > 0 && (() => {
              const pages = template.pages;
              const totalSpreads = Math.ceil(pages.length / 2);
              const topImg = pages[standingSpread * 2];
              const bottomImg = pages[standingSpread * 2 + 1];

              const goNext = () => {
                setStandingDir(1);
                setStandingSpread(s => s < totalSpreads - 1 ? s + 1 : 0);
              };
              const goPrev = () => {
                setStandingDir(-1);
                setStandingSpread(s => s > 0 ? s - 1 : totalSpreads - 1);
              };
              const goTo = (i) => {
                setStandingDir(i > standingSpread ? 1 : -1);
                setStandingSpread(i);
              };

              // 3D page-flip variants: next flips up (rotateX), prev flips down
              const variants = {
                enter: (dir) => ({
                  rotateX: dir > 0 ? 90 : -90,
                  opacity: 0,
                  scale: 0.95,
                }),
                center: {
                  rotateX: 0,
                  opacity: 1,
                  scale: 1,
                },
                exit: (dir) => ({
                  rotateX: dir > 0 ? -90 : 90,
                  opacity: 0,
                  scale: 0.95,
                }),
              };

              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '420px' }}>
                  {/* Spread counter */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Spread {standingSpread + 1} / {totalSpreads}
                  </div>
                  {/* 3D flip stacked pages viewer */}
                  <div style={{ position: 'relative', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', borderRadius: '8px', background: '#fff', perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
                    <AnimatePresence custom={standingDir} mode="wait">
                      <motion.div
                        key={standingSpread}
                        custom={standingDir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          duration: 0.45,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        style={{
                          width: '100%',
                          transformOrigin: '50% 50%',
                          backfaceVisibility: 'hidden',
                          borderRadius: '8px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Top page */}
                        <div style={{ width: '100%', borderBottom: '2px solid #e0e0e0', overflow: 'hidden' }}>
                          {topImg && (
                            <img
                              src={topImg}
                              alt={`Page ${standingSpread * 2 + 1}`}
                              loading="lazy"
                              onClick={() => setSelectedImage(topImg)}
                              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }}
                            />
                          )}
                        </div>
                        {/* Bottom page */}
                        <div style={{ width: '100%', overflow: 'hidden' }}>
                          {bottomImg ? (
                            <img
                              src={bottomImg}
                              alt={`Page ${standingSpread * 2 + 2}`}
                              loading="lazy"
                              onClick={() => setSelectedImage(bottomImg)}
                              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', cursor: 'zoom-in' }}
                            />
                          ) : (
                            <div style={{ width: '100%', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', color: '#ccc', fontSize: '0.85rem' }}>Back cover</div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    {/* Prev arrow — outside AnimatePresence so it never animates away */}
                    <button
                      onClick={goPrev}
                      onTouchStart={goPrev}
                      style={{ position: 'absolute', top: '50%', left: '0.75rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 99, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', touchAction: 'manipulation' }}
                      aria-label="Previous Spread"
                    >
                      <ChevronLeft size={24} color="#000" />
                    </button>
                    {/* Next arrow */}
                    <button
                      onClick={goNext}
                      onTouchStart={goNext}
                      style={{ position: 'absolute', top: '50%', right: '0.75rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 99, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', touchAction: 'manipulation' }}
                      aria-label="Next Spread"
                    >
                      <ChevronRight size={24} color="#000" />
                    </button>
                  </div>
                  {/* Dot indicators */}
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {Array.from({ length: totalSpreads }).map((_, i) => (
                      <div
                        key={i}
                        onClick={() => goTo(i)}
                        style={{ width: i === standingSpread ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === standingSpread ? 'var(--accent)' : '#ddd', cursor: 'pointer', transition: 'all 0.3s ease' }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* RENDER INTERACTIVE FLIPBOOK PREVIEW (all categories except Standing Magazine) */}
            {template.pages && template.pages.length > 0 && template.category !== 'Standing Magazine' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '0.5rem' : '2rem', width: '100%', maxWidth: '800px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: wrapperMaxWidth, 
                  height: isMobile ? (template.category === 'Magazine' ? '50vh' : (template.category === 'Calendar' ? '60vh' : '40vh')) : 'auto',
                  aspectRatio: isMobile ? 'auto' : wrapperAspectRatio,
                  boxShadow: isMobile ? 'none' : '0 10px 30px rgba(0,0,0,0.15)', 
                  borderRadius: isMobile ? '0' : '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  transform: (template.category === 'Calendar') ? 'rotate(-90deg)' : 'none',
                  margin: (template.category === 'Calendar') ? '4rem 0' : (isMobile ? '0' : '0'),
                  position: 'relative'
                }}>
                  {displayLabels && displayLabels[currentPage] && (
                    <div style={{
                      position: 'absolute',
                      top: isMobile ? '-25px' : '-50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--accent)',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      zIndex: 20,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      whiteSpace: 'nowrap'
                    }}>
                      {displayLabels[currentPage]}
                    </div>
                  )}
                  <HTMLFlipBook 
                    ref={bookRef}
                    onFlip={(e) => setCurrentPage(e.data)}
                    width={bookWidth} 
                    height={bookHeight} 
                    size="stretch"
                    minWidth={150}
                    maxWidth={600}
                    minHeight={200}
                    maxHeight={800}
                    drawShadow={!(template.category === 'Calendar')}
                    maxShadowOpacity={(template.category === 'Calendar') ? 0 : 0.5}
                    showCover={!isMobile}
                    usePortrait={isMobile || template.category === 'Calendar'}
                    mobileScrollSupport={true}
                    className="magazine-flipbook"
                  >
                    {/* Front Cover */}
                    <div 
                      className="page page-cover" 
                      style={{ 
                        backgroundColor: template.pageBg || '#fff', 
                        overflow: 'hidden', 
                        cursor: 'zoom-in',
                        position: 'relative'
                      }}
                      onClick={() => setSelectedImage(template.pages[0])}
                      onTouchStart={(e) => handlePageGesture(e, template.pages[0])}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: (template.category === 'Calendar') ? 'transparent' : 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.2) 3%, transparent 10%)', zIndex: 10, pointerEvents: 'none' }}></div>
                      {displayPages[0] && displayPages[0] !== 'BLANK' && (
                        <img 
                          src={displayPages[0]} 
                          alt="Cover" 
                          style={{ 
                            width: (template.category === 'Calendar') ? '420px' : '100%', 
                            height: (template.category === 'Calendar') ? '280px' : '100%', 
                            objectFit: template.imageFit || 'cover',
                            transform: (template.category === 'Calendar') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                            position: (template.category === 'Calendar') ? 'absolute' : 'relative',
                            top: (template.category === 'Calendar') ? '50%' : 'auto',
                            left: (template.category === 'Calendar') ? '50%' : 'auto',
                            minWidth: (template.category === 'Calendar') ? '420px' : 'none',
                            minHeight: (template.category === 'Calendar') ? '280px' : 'none',
                            padding: '1rem'
                          }} 
                        />
                      )}
                    </div>

                    {/* Inside Pages */}
                    {displayPages.slice(1).map((pageImg, idx) => (
                      <div 
                        key={idx} 
                        className="page" 
                        style={{ 
                          backgroundColor: template.pageBg || '#fff', 
                          overflow: 'hidden', 
                          cursor: 'zoom-in',
                          position: 'relative',
                          borderLeft: !isMobile && idx % 2 !== 0 ? '1px solid #eee' : 'none', 
                          borderRight: !isMobile && idx % 2 === 0 ? '1px solid #eee' : 'none'
                        }}
                        onClick={() => setSelectedImage(pageImg)}
                        onTouchStart={(e) => handlePageGesture(e, pageImg)}
                        onTouchEnd={handleTouchEnd}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: (template.category === 'Calendar') ? 'transparent' : (idx % 2 !== 0 ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%)' : 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 10%)'), zIndex: 10, pointerEvents: 'none' }}></div>
                        {pageImg && pageImg !== 'BLANK' && (
                          <img 
                            src={pageImg} 
                            alt={`Page ${idx + 2}`} 
                            loading="lazy" 
                            style={{ 
                              width: (template.category === 'Calendar') ? '420px' : '100%', 
                              height: (template.category === 'Calendar') ? '280px' : '100%', 
                              objectFit: template.imageFit || 'cover',
                              transform: (template.category === 'Calendar') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                              position: (template.category === 'Calendar') ? 'absolute' : 'relative',
                              top: (template.category === 'Calendar') ? '50%' : 'auto',
                              left: (template.category === 'Calendar') ? '50%' : 'auto',
                              minWidth: (template.category === 'Calendar') ? '420px' : 'none',
                              minHeight: (template.category === 'Calendar') ? '280px' : 'none',
                              padding: '1rem'
                            }} 
                          />
                        )}
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>
                
                {/* Navigation Controls */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={prevButtonClick} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }} aria-label="Previous Page">
                    <ChevronLeft size={20} />
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{(template.category === 'Calendar') ? 'Flip Up to view pages' : 'Drag or Click to Flip'}</span>
                  <button onClick={nextButtonClick} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }} aria-label="Next Page">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* RENDER STATIC PHOTO GALLERY SLIDER */}
            {(!template.pages || template.pages.length === 0 || (template.gallery && template.gallery.length > 0)) && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '100%', 
                maxWidth: '500px',
                marginTop: (template.pages && template.pages.length > 0) ? '4rem' : '0'
              }}>
                {template.pages && template.pages.length > 0 && template.gallery && template.gallery.length > 0 && (
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--navy)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Also included in this package:</h3>
                )}
                <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#fff' }}>
                  {sliderImages[currentSlide]?.match(/\.(mp4|mov|MOV)$/) ? (
                    <video
                      src={sliderImages[currentSlide]}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        display: 'block', 
                        objectFit: template.imageFit || 'cover',
                        maxHeight: '450px',
                        background: '#000'
                      }}
                    />
                  ) : template.magazinePages && currentSlide === 0 ? (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: isMobile ? '0.73' : '1.47', background: '#fdfdfd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {/* Buttons are OUTSIDE the flipbook container so the library cannot intercept their touch events */}
                      <button 
                        onTouchStart={(e) => { 
                          e.stopPropagation(); 
                          const pf = miniBookRef.current?.pageFlip();
                          if (pf) {
                            if (pf.getCurrentPageIndex() === 0) {
                              setCurrentSlide(sliderImages.length - 1);
                            } else {
                              pf.flipPrev();
                            }
                          }
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const pf = miniBookRef.current?.pageFlip();
                          if (pf) {
                            if (pf.getCurrentPageIndex() === 0) {
                              setCurrentSlide(sliderImages.length - 1);
                            } else {
                              pf.flipPrev();
                            }
                          }
                        }}
                        style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 99999, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', touchAction: 'manipulation' }}
                        aria-label="Previous Magazine Page"
                      >
                        <ChevronLeft size={24} color="#000" />
                      </button>
                      <button 
                        onTouchStart={(e) => { 
                          e.stopPropagation(); 
                          const pf = miniBookRef.current?.pageFlip();
                          if (pf) {
                            const currentIdx = pf.getCurrentPageIndex();
                            const pageCount = pf.getPageCount();
                            const isAtEnd = currentIdx + (isMobile ? 1 : 2) >= pageCount;
                            if (isAtEnd) {
                              setCurrentSlide(1);
                            } else {
                              pf.flipNext();
                            }
                          }
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const pf = miniBookRef.current?.pageFlip();
                          if (pf) {
                            const currentIdx = pf.getCurrentPageIndex();
                            const pageCount = pf.getPageCount();
                            const isAtEnd = currentIdx + (isMobile ? 1 : 2) >= pageCount;
                            if (isAtEnd) {
                              setCurrentSlide(1);
                            } else {
                              pf.flipNext();
                            }
                          }
                        }}
                        style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 99999, boxShadow: '0 2px 8px rgba(0,0,0,0.25)', touchAction: 'manipulation' }}
                        aria-label="Next Magazine Page"
                      >
                        <ChevronRight size={24} color="#000" />
                      </button>
                      <HTMLFlipBook 
                        width={isMobile ? 300 : 280} 
                        height={isMobile ? 424 : 380} 
                        size="stretch"
                        minWidth={150}
                        maxWidth={600}
                        minHeight={200}
                        maxHeight={800}
                        showCover={!isMobile}
                        usePortrait={isMobile}
                        drawShadow={true}
                        maxShadowOpacity={0.5}
                        mobileScrollSupport={false}
                        className="flipbook-wrapper"
                        ref={miniBookRef}
                      >
                        {template.magazinePages.map((pageImg, idx) => (
                          <div key={idx} className="page" style={{ 
                            backgroundColor: '#fff', 
                            overflow: 'hidden',
                            borderLeft: !isMobile && idx % 2 !== 0 ? '1px solid #eee' : 'none', 
                            borderRight: !isMobile && idx % 2 === 0 ? '1px solid #eee' : 'none'
                          }}>
                            <div style={{ position: 'absolute', inset: 0, background: (!isMobile && idx > 0 && idx < template.magazinePages.length - 1) ? (idx % 2 !== 0 ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%)' : 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 10%)') : 'transparent', zIndex: 10, pointerEvents: 'none' }}></div>
                            <img src={pageImg} alt={`Page ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </HTMLFlipBook>
                    </div>
                  ) : (
                    <img 
                      src={sliderImages[currentSlide]} 
                      alt={`${template.name} view ${currentSlide + 1}`} 
                      loading="lazy"
                      onClick={() => setSelectedImage(sliderImages[currentSlide])}
                      style={{ 
                        width: '100%', 
                        height: template.aspectRatio ? '100%' : 'auto', 
                        aspectRatio: template.aspectRatio || 'auto',
                        display: 'block', 
                        objectFit: template.imageFit || 'cover', 
                        cursor: 'zoom-in' 
                      }} 
                    />
                  )}
                  
                  {sliderImages.length > 1 && !(template.magazinePages && currentSlide === 0) && (
                    <>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide((prev) => (prev > 0 ? prev - 1 : sliderImages.length - 1)); }}
                        style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft size={24} color="#000" />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentSlide((prev) => (prev < sliderImages.length - 1 ? prev + 1 : 0)); }}
                        style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        aria-label="Next Slide"
                      >
                        <ChevronRight size={24} color="#000" />
                      </button>
                    </>
                  )}
                  
                  {sliderImages.length > 1 && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', paddingBottom: '1.5rem', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                          {sliderImages.map((imgUrl, i) => (
                            <div 
                              key={i} 
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                borderRadius: '8px', 
                                overflow: 'hidden',
                                border: i === currentSlide ? '3px solid var(--accent)' : '2px solid transparent', 
                                transition: 'all 0.3s ease', 
                                cursor: 'pointer', 
                                boxShadow: i === currentSlide ? '0 4px 10px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)' 
                              }}
                              onClick={() => setCurrentSlide(i)}
                            >
                              {imgUrl.match(/\.(mp4|mov|MOV)$/) ? (
                                <video src={imgUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                              ) : (
                                <img src={imgUrl} alt={`Thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                          ))}
                        </div>
                        {template.galleryLabels && template.galleryLabels[currentSlide] && (
                          <div style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 'bold', 
                            color: 'var(--navy)', 
                            fontFamily: 'var(--font-serif)',
                            letterSpacing: '1px'
                          }}>
                            {template.galleryLabels[currentSlide]}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Direct link button below slider removed */}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: '0.9 1 350px', textAlign: 'center' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>{template.category}</span>
            <h1 className="responsive-title" style={{ margin: isMobile ? '0 0 0.3rem 0' : '1rem 0', fontSize: isMobile ? '1.8rem' : '2.5rem', lineHeight: '1.2' }}>{template.name}</h1>
            
            <div style={{ marginBottom: isMobile ? '0.5rem' : '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                {template.originalPrice && (
                  <span style={{ fontSize: '1.4rem', textDecoration: 'line-through', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                    ₹{template.originalPrice}
                  </span>
                )}
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--navy)' }}>
                  Price: ₹{currentPrice}
                </span>
                {template.originalPrice && (
                  <>
                    <span style={{ 
                      background: 'rgba(212, 175, 55, 0.1)', 
                      color: 'var(--accent)', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '20px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                      Save ₹{template.originalPrice - currentPrice}
                    </span>
                    <div style={{ flexBasis: '100%', height: '0' }}></div>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#ff4d4f',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.2rem'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      Limited Time Offer
                    </span>
                  </>
                )}
              </div>
              
              <div style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {(!template.name?.toLowerCase().includes('bouquet') && !template.name?.toLowerCase().includes('combo') && !template.category?.toLowerCase().includes('bouquet') && !template.category?.toLowerCase().includes('combo') && (
                  template.name?.toLowerCase().includes('frame') || 
                  template.name?.toLowerCase().includes('cap') || 
                  template.name?.toLowerCase().includes('hot wheels') || 
                  template.name?.toLowerCase().includes('hotwheels') ||
                  template.isHotWheels ||
                  template.category?.toLowerCase().includes('hot wheels') ||
                  template.category?.toLowerCase().includes('frame') ||
                  template.category?.toLowerCase().includes('cap')))
                  ? '🚚 ₹80 Shipping Charge applies at checkout.'
                  : '✨ FREE Shipping across India!'}
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: isMobile ? '0.5rem' : '2rem', lineHeight: '1.5' }}>
              {template.description}
            </p>

            {/* Stock Badge for Hot Wheels */}
            {template.isHotWheels && template.id !== 'hotwheels_bouquet' && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.2rem',
                borderRadius: '30px',
                background: isSoldOut ? 'rgba(220,38,38,0.1)' : 'rgba(245,158,11,0.1)',
                border: isSoldOut ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(245,158,11,0.3)',
                color: isSoldOut ? '#dc2626' : '#d97706',
                fontSize: '0.85rem',
                fontWeight: '800',
                marginBottom: '1.5rem',
                letterSpacing: '1px'
              }}>
                {isSoldOut ? '❌ SOLD OUT' : '🔥 LIMITED STOCK — Only 1 left!'}
              </div>
            )}

            {/* Page Count selector removed per user request */}


            {/* Customizable Field Notice */}
            {template.customizableField && (
              <div style={{
                margin: '0 0 1.8rem 0',
                padding: '1.4rem 1.6rem',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(26,34,56,0.07) 100%)',
                border: '2px solid var(--accent)',
                borderRadius: '14px',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(212,175,55,0.10)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>✨</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--accent)'
                  }}>Customise Your Product</span>
                </div>
                <p style={{
                  fontSize: '1.15rem',
                  fontWeight: '800',
                  color: 'var(--navy)',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.4',
                  fontFamily: 'var(--font-serif)'
                }}>
                  {template.customizableField.label}
                </p>
                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {template.customizableField.hint}
                </p>
              </div>
            )}

            {!(showBuyNowModal || showCartModal) && (
              <div className="mobile-sticky-bottom" style={{ display: 'flex', flexDirection: 'row', gap: isMobile ? '0.4rem' : '0.8rem' }}>
                <button
                  onClick={handleAddToCartClick}
                  disabled={template.isHotWheels && (isSoldOut || checkingStock)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: isMobile ? '0.6rem' : '1.1rem', fontSize: isMobile ? '0.85rem' : '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: (template.isHotWheels && isSoldOut) ? 0.5 : 1, cursor: (template.isHotWheels && isSoldOut) ? 'not-allowed' : 'pointer' }}
                >
                  {checkingStock ? 'Checking...' : (template.isHotWheels && isSoldOut) ? '❌ Out of Stock' : !currentUser ? <><ShoppingCart size={16} /> Login to Add</> : <><ShoppingCart size={16} /> Add to Cart</>}
                </button>
                <button
                  onClick={handleBuyNowClick}
                  disabled={template.isHotWheels && (isSoldOut || checkingStock)}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: isMobile ? '0.6rem' : '1.1rem', fontSize: isMobile ? '0.9rem' : '1.1rem', boxShadow: (template.isHotWheels && isSoldOut) ? 'none' : 'var(--gold-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: (template.isHotWheels && isSoldOut) ? 0.5 : 1, cursor: (template.isHotWheels && isSoldOut) ? 'not-allowed' : 'pointer' }}
                >
                  {!currentUser ? 'Login to Buy' : 'Buy Now'} <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>


        {/* Detailed Product Information */}
        {template.details && (
          <div style={{ marginTop: isMobile ? '1rem' : '4rem', textAlign: 'left', background: 'var(--bg-offset)', padding: isMobile ? '1.2rem' : '3rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: isMobile ? '1rem' : '1.5rem', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-serif)', color: 'var(--navy)', margin: 0 }}>About This Product</h3>
            </div>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
              {template.details.intro}
            </p>

            {isMobile && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.3rem', 
                  color: 'var(--accent)', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Swipe left <span style={{ display: 'inline-flex', animation: 'swipePulse 1.5s infinite' }}><ArrowRight size={14} style={{ marginLeft: '2px' }} /></span>
                </span>
              </div>
            )}

            <div style={{ 
              display: 'flex',
              flexDirection: 'row',
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              overflowX: isMobile ? 'auto' : 'visible',
              gap: isMobile ? '1.5rem' : '3rem',
              width: '100%',
              scrollbarWidth: 'none',
              paddingBottom: isMobile ? '1rem' : '0'
            }}>
              {template.details.included && (
                <div style={{ flex: isMobile ? '0 0 240px' : '1 1 250px', maxWidth: isMobile ? '240px' : 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>What's Included:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.included.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.required && template.details.required.length > 0 && (
                <div style={{ flex: isMobile ? '0 0 240px' : '1 1 250px', maxWidth: isMobile ? '240px' : 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Things Required:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.required.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.perfectFor && (
                <div style={{ flex: isMobile ? '0 0 240px' : '1 1 250px', maxWidth: isMobile ? '240px' : 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Perfect For:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.perfectFor.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.whatMakesItSpecial && (
                <div style={{ flex: isMobile ? '0 0 240px' : '1 1 250px', maxWidth: isMobile ? '240px' : 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>What Makes It Special:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.whatMakesItSpecial.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.importantInfo && (
                <div style={{ flex: isMobile ? '0 0 240px' : '1 1 250px', maxWidth: isMobile ? '240px' : 'none' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Important Information:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.importantInfo.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', borderLeft: '5px solid var(--accent)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', color: 'var(--navy)' }}>Privacy Policy</h4>
              <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
                Your order will never be posted on our page without your permission. We completely respect your privacy and ensure that all your memories and pictures remain safe and personal.
              </p>
            </div>
          </div>
        )}

        {/* Recommended Products Section Moved below description */}
        <div style={{ marginTop: isMobile ? '3rem' : '6rem', textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: isMobile ? '2rem' : '4rem' }}>
          <h3 className="no-clamp" style={{ fontSize: isMobile ? '1.8rem' : '2.8rem', marginBottom: isMobile ? '1.5rem' : '2.5rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>You may also like</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: '1.5rem'
          }}>
            {TEMPLATES
              .filter(t => t.id !== template.id && (t.category === template.category || t.popular))
              .slice(0, 4)
              .map(item => (
                <Link key={item.id} to={`/template/${item.id}`} className="product-card-wrapper" onClick={() => window.scrollTo(0, 0)}>
                  <div className="template-card" style={{ height: 'auto', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ aspectRatio: item.aspectRatio || '4/5', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {(item.popular || item.id === 'mag_normal') && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '0.5rem', 
                          right: '0.5rem', 
                          background: 'linear-gradient(135deg, #D4AF37 0%, #B5852A 100%)', 
                          color: 'white',
                          padding: '0.3rem 0.6rem', 
                          borderRadius: '15px', 
                          fontSize: '0.65rem', 
                          fontWeight: 900,
                          boxShadow: '0 4px 10px rgba(212, 175, 55, 0.4)',
                          zIndex: 10,
                          letterSpacing: '0.5px'
                        }}>
                          BEST SELLER
                        </div>
                      )}
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: item.imageFit || 'cover' }} />
                    </div>
                    <div style={{ padding: '1rem', background: '#fff' }}>
                      <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--navy)' }}>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>Price: ₹{item.price10}</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '4px' }}>View</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {/* ── COMMON MODAL FORM ── */}
      {(showBuyNowModal || showCartModal) && (
        <div onClick={(e) => { if (e.target === e.currentTarget) { setShowBuyNowModal(false); setShowCartModal(false); } }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 8000, display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fcfcfc', borderRadius: isMobile ? '24px 24px 0 0' : '20px', width: '100%', maxWidth: '600px', maxHeight: '92vh', overflowY: 'auto', padding: isMobile ? '1.5rem 1.2rem' : '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--navy)', fontFamily: 'var(--font-serif)' }}>{showBuyNowModal ? 'Complete Your Order' : 'Add Details'}</h2>
              <button onClick={() => { setShowBuyNowModal(false); setShowCartModal(false); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            
            <form onSubmit={showBuyNowModal ? handleBuyNowSubmit : handleCartSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {showBuyNowModal && (
                <>
                  <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Full Name *</label>
                      <input type="text" value={orderForm.fullName} onChange={(e) => setOrderForm(p => ({ ...p, fullName: e.target.value }))} placeholder="e.g. John Doe" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>WhatsApp Number *</label>
                      <input type="tel" value={orderForm.whatsapp} onChange={(e) => setOrderForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="10-digit number" maxLength={10} required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enter exactly 10 digits without +91 or spaces.</span>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--navy)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Delivery Address</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>House / Flat / Apartment No. *</label>
                        <input type="text" value={orderForm.house} onChange={(e) => setOrderForm(p => ({ ...p, house: e.target.value }))} placeholder="e.g. Flat 101, Building A" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Street / Area / Locality *</label>
                        <input type="text" value={orderForm.street} onChange={(e) => setOrderForm(p => ({ ...p, street: e.target.value }))} placeholder="e.g. Sector 15, Park Road" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>City *</label>
                        <input type="text" value={orderForm.city} onChange={(e) => setOrderForm(p => ({ ...p, city: e.target.value }))} placeholder="e.g. New Delhi" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>State *</label>
                        <input type="text" value={orderForm.state} onChange={(e) => setOrderForm(p => ({ ...p, state: e.target.value }))} placeholder="e.g. Delhi" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Pincode *</label>
                        <input type="text" value={orderForm.pincode} onChange={(e) => setOrderForm(p => ({ ...p, pincode: e.target.value }))} placeholder="6-digit PIN" required={showBuyNowModal} style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(() => {
                const config = getCustomizationConfig(template);
                
                return (
                  <>
                    {config.requiresCover && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Cover Photo *</label>
                        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} style={{ display: 'none' }} id="coverPhotoInput" />
                        <label htmlFor="coverPhotoInput" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', border: '1px solid var(--accent)', borderRadius: '20px', cursor: 'pointer', color: 'var(--accent)', alignItems: 'center', gap: '0.5rem' }}>
                          ↑ Choose Cover
                        </label>
                        {coverFile && <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: 'var(--navy)' }}>✓ 1 file selected</span>}
                      </div>
                    )}

                    {config.maxPhotos > 0 && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Inner Photos (Min {config.minPhotos}, Max {config.maxPhotos}) *</label>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem', textAlign: 'center', background: '#fff' }}>
                          <input type="file" accept="image/*" multiple onChange={(e) => setInnerFiles(prev => {
                            const newFiles = Array.from(e.target.files);
                            const combined = [...prev, ...newFiles];
                            return combined.slice(0, config.maxPhotos);
                          })} style={{ display: 'none' }} id="innerPhotosInput" />
                          <label htmlFor="innerPhotosInput" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', border: '1px solid var(--accent)', borderRadius: '20px', cursor: 'pointer', color: 'var(--accent)', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            🖼 Select Multiple Photos
                          </label>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selected: <strong>{innerFiles.length}</strong> photos</div>
                        </div>
                      </div>
                    )}

                    {config.customTextFields.map((field, idx) => (
                      <div key={idx}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>
                          {field.icon} {field.label} *
                        </label>
                        <input type="text" value={orderForm.customizationMessage} onChange={(e) => setOrderForm(p => ({ ...p, customizationMessage: e.target.value }))} placeholder={field.placeholder} required style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                    ))}

                    {config.allowSpecialInstructions && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--navy)', textTransform: 'uppercase' }}>Special Instructions (Optional)</label>
                        <input type="text" value={orderForm.specialNotes} onChange={(e) => setOrderForm(p => ({ ...p, specialNotes: e.target.value }))} placeholder="e.g. sequence of photos, color preferences" style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid var(--border)', borderRadius: '20px', fontSize: '0.95rem', boxSizing: 'border-box' }} />
                      </div>
                    )}
                  </>
                );
              })()}

              <button type="submit" disabled={isUploading} className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', fontSize: '1rem', marginTop: '0.5rem', borderRadius: '20px', boxShadow: 'none', background: 'var(--accent)' }}>
                {isUploading ? 'Uploading Photos...' : (showBuyNowModal ? `Proceed to Pay ₹${currentPrice} →` : <><ShoppingCart size={18} /> Add to Cart</>)}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ZOOM MODAL ── */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'zoom-out'
          }}
        >
          <button 
            style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 10000 }}
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img 
            src={selectedImage.endsWith('.mp4') ? undefined : selectedImage} 
            alt="Zoomed" 
            style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain', display: selectedImage.endsWith('.mp4') ? 'none' : 'block' }}
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.endsWith('.mp4') && (
            <video 
              src={selectedImage}
              autoPlay
              controls
              style={{ maxWidth: '95%', maxHeight: '95%', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateDetail;
