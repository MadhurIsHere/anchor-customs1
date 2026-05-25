import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TEMPLATES } from '../../utils/data';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeft, ShoppingCart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';
import { supabase } from '../../supabase/config';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

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
  const [miniBookPage, setMiniBookPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const bookRef = useRef();
  const miniBookRef = useRef();
  const autoAdvanceTimerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isComboOrHamper = template && (template.category === 'Hamper' || template.category === 'Combo' || template.category === 'Combos');

  const nextTemplate = useMemo(() => {
    if (!template) return null;
    const sameCategoryTemplates = TEMPLATES.filter(t => t.category === template.category);
    const currentIndex = sameCategoryTemplates.findIndex(t => t.id === template.id);
    if (currentIndex !== -1 && currentIndex < sameCategoryTemplates.length - 1) {
      return sameCategoryTemplates[currentIndex + 1];
    }
    return sameCategoryTemplates[0] || null;
  }, [template]);

  if (!template) return <div>Template not found</div>;

  const sliderImages = (template.category === 'Calendar' || template.category === 'Standing Magazine')
    ? [] // Use flipbook
    : (template.gallery || [template.image]);

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
          const isCurrentLeft = (currentIndex % 2 === 1);
          
          if (!isCurrentLeft) {
            pages.push('BLANK');
            currentIndex++;
          }
          
          pages.push(template.pages[i]);
          labels[currentIndex] = label;
          labels[currentIndex + 1] = label; 
          currentIndex++;
          
          pages.push('BLANK');
          currentIndex++;
        }
      }
    }
    
    return { displayPages: pages, displayLabels: labels };
  }, [template, isMobile]);

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

  // Autoplay and auto-advance logic for Hamper & Combos (miniBook inside slider)
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (template && template.magazinePages && currentSlide === 0) {
      const totalPages = template.magazinePages.length;
      const isLastPage = isMobile ? (miniBookPage === totalPages - 1) : (miniBookPage >= totalPages - 2);

      if (isLastPage) {
        autoAdvanceTimerRef.current = setTimeout(() => {
          if (sliderImages.length > 1) {
            setCurrentSlide(1);
            toast.success('Magazine completed! Loading other parts of hamper... ✨', { duration: 2500, position: 'bottom-center' });
          }
        }, 2500);
      }
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [miniBookPage, currentSlide, template, isMobile, sliderImages.length]);

  // Autoplay for static slides (non-flipbook) in Hampers/Combos
  useEffect(() => {
    let slideTimer = null;
    
    if (sliderImages.length > 1) {
      const isFlipBookSlide = template.magazinePages && currentSlide === 0;
      
      if (!isFlipBookSlide) {
        slideTimer = setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 4000);
      }
    }
    
    return () => {
      if (slideTimer) clearTimeout(slideTimer);
    };
  }, [currentSlide, sliderImages.length, template]);

  // Auto-advance standalone books/magazines to the next product in the same category
  useEffect(() => {
    let timer = null;
    
    if (template && template.pages && template.pages.length > 0) {
      const totalPages = displayPages.length;
      const isLastPage = isMobile ? (currentPage === totalPages - 1) : (currentPage >= totalPages - 2);
      
      if (isLastPage && nextTemplate && nextTemplate.id !== template.id) {
        timer = setTimeout(() => {
          toast.success(`Book completed! Loading next: ${nextTemplate.name}... 📖`, { duration: 3000, position: 'bottom-center' });
          navigate(`/template/${nextTemplate.id}`);
          window.scrollTo(0, 0);
        }, 3000);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentPage, displayPages.length, template, isMobile, nextTemplate, navigate]);

  const nextButtonClick = () => {
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      const curr = pageFlip.getCurrentPageIndex();
      const total = pageFlip.getPageCount();
      const isLast = isMobile ? (curr === total - 1) : (curr >= total - 2);
      
      if (isLast && nextTemplate && nextTemplate.id !== template.id) {
        toast.success(`Loading next: ${nextTemplate.name}... 📖`, { duration: 2500, position: 'bottom-center' });
        navigate(`/template/${nextTemplate.id}`);
        window.scrollTo(0, 0);
      } else {
        pageFlip.flipNext();
      }
    }
  };

  const prevButtonClick = () => {
    if(bookRef.current) bookRef.current.pageFlip().flipPrev();
  };



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
      setCheckingStock(true);
      supabase
        .from('orders')
        .select('id')
        .eq('template_id', template.id)
        .eq('payment_status', 'paid')
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) setIsSoldOut(true);
          setCheckingStock(false);
        })
        .catch(() => setCheckingStock(false));
    }
  }, [template]);

  const handleAddHotWheelsToCart = () => {
    if (!currentUser) {
      toast.error('Please login to purchase.');
      navigate('/login');
      return;
    }
    if (isSoldOut) {
      toast.error('Sorry, this item is sold out!');
      return;
    }
    const alreadyInCart = cartItems.some(item => item.templateId === template.id);
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
    navigate('/checkout');
  };

  // Dynamically configure book dimensions & aspect ratios to eliminate margins
  let bookWidth = isMobile ? 370 : 280;
  let bookHeight = isMobile ? 500 : 380;
  let wrapperAspectRatio = isMobile ? '0.73' : '1.47';
  let wrapperMaxWidth = isMobile ? '100%' : '800px';

  if (template.category === 'Calendar' || template.category === 'Standing Magazine') {
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



  return (
    <div className="section-padding">
      <div className="container">
        <button 
          onClick={() => navigate(`/?category=${encodeURIComponent(groupName)}`)} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            marginTop: isMobile ? '-1.5rem' : '-4rem',
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
          <ArrowLeft size={18} /> Back to {groupName}
        </button>
        <div className="detail-flex">
          {/* Interactive HTMLFlipBook Animation */}
          <div style={{ 
            flex: template.category === 'Calendar' ? '2 1 600px' : '1.3 1 450px',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '1rem 0',
            minHeight: 'auto',
            width: '100%'
          }}>
            {/* Removed Elegant Tab Selector for Hampers & Combos */}

            {/* RENDER INTERACTIVE FLIPBOOK PREVIEW */}
            {template.pages && template.pages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '800px' }}>
                <div style={{ 
                  width: '100%', 
                  maxWidth: wrapperMaxWidth, 
                  aspectRatio: wrapperAspectRatio,
                  boxShadow: isMobile ? 'none' : '0 10px 30px rgba(0,0,0,0.15)', 
                  borderRadius: isMobile ? '0' : '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'visible',
                  transform: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'rotate(-90deg)' : 'none',
                  margin: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '4rem 0' : '0',
                  position: 'relative'
                }}>
                  {displayLabels && displayLabels[currentPage] && (
                    <div style={{
                      position: 'absolute',
                      top: isMobile ? '-35px' : '-50px',
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
                    drawShadow={!(template.category === 'Calendar' || template.category === 'Standing Magazine')}
                    maxShadowOpacity={(template.category === 'Calendar' || template.category === 'Standing Magazine') ? 0 : 0.5}
                    showCover={!isMobile}
                    usePortrait={isMobile || template.category === 'Calendar' || template.category === 'Standing Magazine'}
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
                      <div style={{ position: 'absolute', inset: 0, background: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'transparent' : 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.2) 3%, transparent 10%)', zIndex: 10, pointerEvents: 'none' }}></div>
                      {displayPages[0] && displayPages[0] !== 'BLANK' && (
                        <img 
                          src={displayPages[0]} 
                          alt="Cover" 
                          style={{ 
                            width: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '150%' : '100%', 
                            height: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '66.666%' : '100%', 
                            objectFit: template.imageFit || 'cover',
                            transform: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                            position: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'absolute' : 'relative',
                            top: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                            left: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto'
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
                        <div style={{ position: 'absolute', inset: 0, background: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'transparent' : (idx % 2 !== 0 ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%)' : 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 10%)'), zIndex: 10, pointerEvents: 'none' }}></div>
                        {pageImg && pageImg !== 'BLANK' && (
                          <img 
                            src={pageImg} 
                            alt={`Page ${idx + 2}`} 
                            loading="lazy" 
                            style={{ 
                              width: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '150%' : '100%', 
                              height: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '66.666%' : '100%', 
                              objectFit: template.imageFit || 'cover',
                              transform: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                              position: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'absolute' : 'relative',
                              top: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                              left: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto'
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
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{(template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'Flip Up to view pages' : 'Drag or Click to Flip'}</span>
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
                        mobileScrollSupport={true}
                        className="flipbook-wrapper"
                        ref={miniBookRef}
                        onFlip={(e) => setMiniBookPage(e.data)}
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
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); miniBookRef.current?.pageFlip()?.flipPrev(); }}
                        style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 15, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                        aria-label="Previous Magazine Page"
                      >
                        <ChevronLeft size={20} color="#fff" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          if (miniBookRef.current) {
                            const pageFlip = miniBookRef.current.pageFlip();
                            const currentPage = pageFlip.getCurrentPageIndex();
                            const totalPages = pageFlip.getPageCount();
                            const isLast = isMobile ? (currentPage === totalPages - 1) : (currentPage >= totalPages - 2);
                            
                            if (isLast) {
                              if (sliderImages.length > 1) {
                                setCurrentSlide(1);
                                toast.success('Magazine completed! Loading other parts of hamper... ✨', { duration: 2500, position: 'bottom-center' });
                              }
                            } else {
                              pageFlip.flipNext();
                            }
                          }
                        }}
                        style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 15, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
                        aria-label="Next Magazine Page"
                      >
                        <ChevronRight size={20} color="#fff" />
                      </button>
                    </div>
                  ) : (
                    <img 
                      src={sliderImages[currentSlide]} 
                      alt={`${template.name} view ${currentSlide + 1}`} 
                      loading="lazy"
                      onClick={() => setSelectedImage(sliderImages[currentSlide])}
                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: template.imageFit || 'cover', cursor: 'zoom-in' }} 
                    />
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
          <div style={{ flex: '0.9 1 350px', textAlign: 'center' }} className="details-stack">
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>{template.category}</span>
            <h1 className="responsive-title" style={{ margin: '1rem 0', fontSize: '2.5rem' }}>{template.name}</h1>
            
            <div style={{ marginBottom: '2rem' }}>
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
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
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

            <div className="mobile-sticky-bottom">
              {template.isHotWheels ? (
                <button
                  onClick={handleProceed}
                  disabled={isSoldOut || checkingStock}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.1rem',
                    boxShadow: isSoldOut ? 'none' : 'var(--gold-glow)',
                    opacity: isSoldOut ? 0.5 : 1,
                    cursor: isSoldOut ? 'not-allowed' : 'pointer',
                    background: isSoldOut ? '#888' : undefined,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {checkingStock ? 'Checking stock...' : isSoldOut ? (
                    <><AlertTriangle size={20} /> SOLD OUT</>
                  ) : (
                    <>Order Now <ArrowRight size={20} /></>
                  )}
                </button>
              ) : (
                <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', boxShadow: 'var(--gold-glow)' }}>
                  Order Now <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Detailed Product Information */}
        {template.details && (
          <div style={{ marginTop: '4rem', textAlign: 'left', background: 'var(--bg-offset)', padding: isMobile ? '1.5rem' : '3rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1.5rem', gap: '0.5rem' }}>
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
        <div style={{ marginTop: '6rem', textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
          <h3 className="no-clamp" style={{ fontSize: '2.8rem', marginBottom: '2.5rem', fontFamily: 'var(--font-display)', textAlign: 'center' }}>You may also like</h3>
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

    </div>
  );
};

export default TemplateDetail;
