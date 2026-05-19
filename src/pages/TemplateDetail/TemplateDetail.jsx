import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TEMPLATES } from '../../utils/data';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';

const TemplateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find(t => t.id === id);
  const [selectedOption, setSelectedOption] = useState('10'); // '10' or '12'
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const bookRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const isComboOrHamper = template && (template.category === 'Hamper' || template.category === 'Combo' || template.category === 'Combos');
  const [activeTab, setActiveTab] = useState(isComboOrHamper ? 'gallery' : 'book');

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
      'Apparel & Accessories': ['Apparel', 'Cap', 'Keychain']
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
            {/* Elegant Tab Selector for Hampers & Combos */}
            {template.pages && template.pages.length > 0 && template.gallery && template.gallery.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                background: 'rgba(0,0,0,0.03)', 
                padding: '4px', 
                borderRadius: '30px', 
                width: '100%',
                maxWidth: '340px', 
                marginBottom: '1.5rem',
                border: '1px solid rgba(0,0,0,0.05)',
              }}>
                <button 
                  type="button"
                  onClick={() => setActiveTab('gallery')} 
                  style={{
                    flex: 1,
                    border: 'none',
                    background: activeTab === 'gallery' ? 'var(--navy)' : 'transparent',
                    color: activeTab === 'gallery' ? '#fff' : 'var(--text)',
                    padding: '0.6rem 1rem',
                    borderRadius: '25px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {template.id === 'combo_mag_chaos' ? '🖼️ Chaos Collage Frame' :
                   template.id === 'combo_mag_wheels' ? '🖼️ Hot Wheels' :
                   template.id === 'combo_mag_grid' ? '🖼️ Pop Grid Frame' :
                   template.id === 'hamper' ? '🖼️ Hot Wheels & Frames' :
                   '🖼️ Mockups'}
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('book')} 
                  style={{
                    flex: 1,
                    border: 'none',
                    background: activeTab === 'book' ? 'var(--navy)' : 'transparent',
                    color: activeTab === 'book' ? '#fff' : 'var(--text)',
                    padding: '0.6rem 1rem',
                    borderRadius: '25px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  📖 Slide to Book
                </button>
              </div>
            )}

            {/* RENDER INTERACTIVE FLIPBOOK PREVIEW */}
            {activeTab === 'book' && template.pages && template.pages.length > 0 && (
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
                  margin: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '4rem 0' : '0'
                }}>
                  <HTMLFlipBook 
                    ref={bookRef}
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
                      <img 
                        src={template.pages[0]} 
                        alt="Cover" 
                        style={{ 
                          width: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '420px' : '100%', 
                          height: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '280px' : '100%', 
                          objectFit: template.imageFit || 'cover',
                          transform: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                          position: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'absolute' : 'relative',
                          top: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                          left: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                          minWidth: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '420px' : 'none',
                          minHeight: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '280px' : 'none'
                        }} 
                      />
                    </div>

                    {/* Inside Pages */}
                    {template.pages.slice(1).map((pageImg, idx) => (
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
                        <img 
                          src={pageImg} 
                          alt={`Page ${idx + 1}`} 
                          loading="lazy" 
                          style={{ 
                            width: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '420px' : '100%', 
                            height: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '280px' : '100%', 
                            objectFit: template.imageFit || 'cover',
                            transform: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'translate(-50%, -50%) rotate(90deg)' : 'none',
                            position: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? 'absolute' : 'relative',
                            top: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                            left: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '50%' : 'auto',
                            minWidth: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '420px' : 'none',
                            minHeight: (template.category === 'Calendar' || template.category === 'Standing Magazine') ? '280px' : 'none'
                          }} 
                        />
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
            {(activeTab === 'gallery' || !template.pages || template.pages.length === 0) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px' }}>
                <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#fff' }}>
                  {sliderImages[currentSlide]?.endsWith('.mp4') ? (
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
                      <button 
                        onClick={prevSlide}
                        style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <ChevronLeft size={24} color="var(--navy)" />
                      </button>
                      <button 
                        onClick={nextSlide}
                        style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                      >
                        <ChevronRight size={24} color="var(--navy)" />
                      </button>
                      <div style={{ position: 'absolute', bottom: '1.5rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        {sliderImages.map((_, i) => (
                          <div 
                            key={i} 
                            style={{ width: i === currentSlide ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === currentSlide ? 'var(--accent)' : 'rgba(200,200,200,0.8)', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                            onClick={() => setCurrentSlide(i)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Direct link button below slider to transition into the book page-flip */}
                {template.pages && template.pages.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setActiveTab('book')}
                    className="btn btn-outline" 
                    style={{ 
                      marginTop: '1.5rem', 
                      padding: '0.6rem 1.2rem', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      borderColor: 'var(--accent)',
                      color: 'var(--navy)',
                      cursor: 'pointer'
                    }}
                  >
                    <span>📖 Slide to view inside book pages</span>
                    <ArrowRight size={14} />
                  </button>
                )}
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
                )}
              </div>
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
              {template.description}
            </p>

            {/* Page Count selector removed per user request */}


            <div className="mobile-sticky-bottom">
              <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', boxShadow: 'var(--gold-glow)' }}>
                Order Now <ArrowRight size={20} />
              </button>
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

              {template.details.required && (
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

            {template.details.privacy && (
              <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', borderLeft: '5px solid var(--accent)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--navy)' }}>Privacy Policy</h4>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>{template.details.privacy}</p>
              </div>
            )}
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
                    <div style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
