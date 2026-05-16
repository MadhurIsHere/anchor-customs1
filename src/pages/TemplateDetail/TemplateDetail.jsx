import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../../utils/data';
import { Check, ArrowRight, Heart, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import HTMLFlipBook from 'react-pageflip';

const TemplateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find(t => t.id === id);
  const [selectedOption, setSelectedOption] = useState('10'); // '10' or '12'
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const bookRef = useRef();

  const nextButtonClick = () => {
    if(bookRef.current) bookRef.current.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    if(bookRef.current) bookRef.current.pageFlip().flipPrev();
  };

  if (!template) return <div>Template not found</div>;
  const sliderImages = template.gallery || [template.image];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  if (!template) return <div>Template not found</div>;

  const currentPrice = selectedOption === '10' ? template.price10 : template.price12;

  const handleProceed = () => {
    navigate(`/customize/${id}/${selectedOption}`);
  };

  return (
    <div className="section-padding">
      <div className="container">
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
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
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'flex-start' }}>
          {/* Interactive HTMLFlipBook Animation */}
          <div style={{ 
            flex: '1.3 1 450px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start', 
            padding: '2rem 0',
            minHeight: '600px'
          }}>
            {template.pages && template.pages.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '800px' }}>
                <div style={{ width: '100%', aspectRatio: '1.47', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', borderRadius: '4px' }}>
                  <HTMLFlipBook 
                    ref={bookRef}
                    width={280} 
                    height={380} 
                    size="stretch"
                    minWidth={150}
                    maxWidth={600}
                    minHeight={200}
                    maxHeight={800}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    usePortrait={false}
                    mobileScrollSupport={true}
                    className="magazine-flipbook"
                  >
                    {/* Front Cover */}
                    <div className="page page-cover" style={{ backgroundColor: template.pageBg || '#fff', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.2) 3%, transparent 10%)', zIndex: 10, pointerEvents: 'none' }}></div>
                      <img src={template.pages[0]} alt="Cover" style={{ width: '100%', height: '100%', objectFit: template.imageFit || 'cover' }} />
                    </div>

                    {/* Inside Pages */}
                    {template.pages.slice(1).map((pageImg, idx) => (
                      <div key={idx} className="page" style={{ backgroundColor: template.pageBg || '#fff', overflow: 'hidden', borderLeft: idx % 2 !== 0 ? '1px solid #eee' : 'none', borderRight: idx % 2 === 0 ? '1px solid #eee' : 'none' }}>
                        <div style={{ position: 'absolute', inset: 0, background: idx % 2 !== 0 ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 10%)' : 'linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 10%)', zIndex: 10, pointerEvents: 'none' }}></div>
                        <img src={pageImg} alt={`Page ${idx + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: template.imageFit || 'cover' }} />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>
                
                {/* Navigation Controls */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={prevButtonClick} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }} aria-label="Previous Page">
                    <ChevronLeft size={20} />
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Drag or Click to Flip</span>
                  <button onClick={nextButtonClick} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }} aria-label="Next Page">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {(!template.pages || template.pages.length === 0) && (
              /* Slider for items WITHOUT multiple pages (like Caps) */
              <div style={{ position: 'relative', width: '100%', maxWidth: '500px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#fff' }}>
                <img 
                  src={sliderImages[currentSlide]} 
                  alt={`${template.name} view ${currentSlide + 1}`} 
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: template.imageFit || 'cover' }} 
                />
                
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
            )}
          </div>

          {/* Details */}
          <div style={{ flex: '0.9 1 350px', textAlign: 'center' }} className="details-stack">
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>{template.category}</span>
            <h1 className="responsive-title" style={{ margin: '1rem 0' }}>{template.name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              {template.description}
            </p>

            {/* Page Count selector removed per user request */}


            <div style={{ padding: '1.5rem', background: 'var(--bg-offset)', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 'bold' }}>₹{currentPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="mobile-sticky-bottom">
              <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', boxShadow: 'var(--gold-glow)' }}>
                {template.id === 'kaleshi_aurat' ? 'Buy Now' : 'Customize Now'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Slider placed BELOW the main content when Flipbook is also present */}
        {template.pages && template.pages.length > 0 && template.gallery && template.gallery.length > 0 && (
          <div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>More details</h3>
            <div style={{ position: 'relative', width: '100%', maxWidth: '450px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', background: '#fff' }}>
                <img 
                  src={sliderImages[currentSlide]} 
                  alt={`${template.name} view ${currentSlide + 1}`} 
                  loading="lazy"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: template.imageFit || 'cover' }} 
                />
                
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
          </div>
        )}

        {/* Detailed Product Information */}
        {template.details && (
          <div style={{ marginTop: '4rem', textAlign: 'left', background: 'var(--bg-offset)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', color: 'var(--navy)' }}>About This Product</h3>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2.5rem', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
              {template.details.intro}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
              {template.details.included && (
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>What's Included:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.included.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.required && (
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>Things Required:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.required.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.perfectFor && (
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>Perfect For:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.perfectFor.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        <span style={{ color: 'var(--accent)', marginTop: '4px' }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {template.details.importantInfo && (
                <div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)' }}>Important Information:</h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {template.details.importantInfo.map((item, i) => (
                      <li key={i} style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
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
      </div>
    </div>
  );
};

export default TemplateDetail;
