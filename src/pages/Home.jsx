import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Camera, Heart, Truck, CheckCircle, Star, User, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { TEMPLATES } from '../utils/data';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCardContent = ({ template }) => {
  const isMob = window.innerWidth <= 768;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      padding: '0 0.5rem'
    }}>
      {/* Pill Background container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.25)',
        borderRadius: isMob ? '80px 80px 30px 30px' : '160px 160px 50px 50px',
        padding: isMob ? '1.5rem 0.8rem 0.8rem 0.8rem' : '3rem 2rem 2rem 2rem',
        width: '100%',
        aspectRatio: '0.85',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: isMob ? '0.8rem' : '1.5rem',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.4)'
      }}>

        {template.popular && (
          <div style={{ 
            position: 'absolute', 
            top: isMob ? '0.8rem' : '2rem', 
            right: '0', 
            transform: 'translateX(20%)',
            background: 'var(--accent)', 
            color: 'white',
            padding: isMob ? '0.2rem 0.6rem' : '0.3rem 0.8rem', 
            borderRadius: '20px', 
            fontSize: isMob ? '0.5rem' : '0.65rem', 
            fontWeight: 800,
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            POPULAR
          </div>
        )}

        {template.image?.endsWith('.mp4') ? (
          <video 
            src={template.image} 
            autoPlay loop muted playsInline
            style={{ 
              width: '90%', 
              aspectRatio: '1/1',
              objectFit: 'cover', 
              mixBlendMode: 'multiply',
              borderRadius: isMob ? '12px' : '20px',
              filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
            }} 
          />
        ) : (
          <motion.img 
            src={template.image} 
            alt={template.name} 
            whileHover={{ scale: 1.05 }}
            style={{ 
              width: '90%', 
              aspectRatio: '1/1',
              objectFit: 'cover', 
              mixBlendMode: 'multiply',
              borderRadius: isMob ? '12px' : '20px',
              filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
            }} 
          />
        )}
      </div>
      
      {/* Product Name & Button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 0.5rem', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
        <span style={{ fontSize: isMob ? '0.9rem' : '1.2rem', fontWeight: 800, marginBottom: '0.3rem', lineHeight: '1.2' }}>{template.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <span style={{ fontSize: isMob ? '0.8rem' : '1rem', opacity: 0.9, fontWeight: 500 }}>Price - ₹{template.price10}</span>
          {template.originalPrice && (
            <span style={{ fontSize: isMob ? '0.7rem' : '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
              ₹{template.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const collectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart, cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);


  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
      // Wait for render then scroll
      setTimeout(() => {
        collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRibbonClick = () => {
    if (!currentUser) {
      localStorage.setItem('claimFreeGift', 'true');
      toast('Redirecting to login to claim your free gift! 🎁', { icon: '🔑' });
      navigate('/login');
    } else {
      const hasGift = cartItems.some(item => item.id === 'free_gift_hotwheels' || item.templateId === 'free_gift_hotwheels');
      if (hasGift) {
        toast.error('Free Hot Wheels Gift is already in your cart! 🎁');
      } else {
        const freeGift = {
          id: 'free_gift_hotwheels',
          templateId: 'free_gift_hotwheels',
          templateName: 'Free Hot Wheels Gift',
          pages: 'Special Collectible',
          price: 0,
          images: ['/products/free_hot_wheels.png'],
          coverImage: '/products/free_hot_wheels.png',
          coverPhoto: '/products/free_hot_wheels.png',
          status: 'free_gift',
          customerDetails: {
            fullName: currentUser.user_metadata?.full_name || '',
            whatsapp: '',
            email: currentUser.email || '',
            address: '',
            specialNotes: 'Free Gift claimed via promo ribbon'
          }
        };
        addToCart(freeGift);
        toast.success('Free Hot Wheels Gift added to your cart! 🎁');
      }
    }
  };

  const ribbonText = Array(12).fill(currentUser ? "CLAIM YOUR FREE GIFT  ★" : "LOGIN FOR A FREE GIFT  ★").join("  ");

  return (
    <div className="home-page">
      {/* Editorial Hero Section */}
      <section style={{ 
        minHeight: isMobile ? '68vh' : '85vh',
        backgroundColor: 'var(--primary-light)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingTop: isMobile ? '1rem' : '4rem'
      }}>
        {/* Massive Background Typography */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '33%' : '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          textAlign: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: isMobile ? '16vw' : '16vw',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            opacity: 0.25,
            margin: 0,
            lineHeight: 1,
            textShadow: isMobile 
              ? '3px 3px 0px rgba(175, 145, 112, 0.4)' 
              : '6px 6px 0px rgba(175, 145, 112, 0.4)'
          }}>ANCHOR</div>
        </div>

        {/* 3D Product Centered */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: isMobile ? '33%' : '35%',
            left: '0',
            right: '0',
            margin: '0 auto',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.2))'
          }}
        >
          <Link to="/template/mag_chaar_kadam" style={{ display: 'block', textDecoration: 'none' }}>
            <div className="book-container-3d">
              <div className="book-3d">
                <div className="book-cover-front">
                  <img 
                    src="/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE.jpg" 
                    alt="Chaar Kadam Magazine" 
                    loading="eager"
                  />
                </div>
                <div className="book-spine">
                  <span className="book-spine-text">CHAAR KADAM</span>
                </div>
                <div className="book-pages"></div>
                <div className="book-cover-back"></div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Bottom Text and Button */}
        <div className="container" style={{
          marginTop: 'auto',
          marginBottom: isMobile ? '1.5rem' : '4rem',
          zIndex: 3,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'flex-end',
          alignItems: isMobile ? 'center' : 'flex-end',
          gap: '2rem'
        }}>

          
          <div style={{ maxWidth: '400px', textAlign: isMobile ? 'center' : 'right', margin: isMobile ? '0 auto' : '0' }}>
            <p style={{ 
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: isMobile ? '1.1rem' : '1.3rem', 
              fontWeight: 500, 
              color: 'var(--accent)',
              marginBottom: '0.5rem',
              lineHeight: 1.4,
              letterSpacing: '0.5px'
            }}>
              "you are not basic, your gifts shouldn't be either"
            </p>
            <p style={{ 
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: isMobile ? '0.95rem' : '1.1rem', 
              fontWeight: 400, 
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
              lineHeight: 1.4,
              letterSpacing: '0.3px'
            }}>
              You might cry (in a cute way). Turning your memories into something you can hold forever.
            </p>
            <button onClick={scrollToCollection} style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--shadow)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Explore Products <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Wavy Free Gift Banner Ribbon */}
      <div 
        onClick={handleRibbonClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.transition = 'transform 0.3s ease';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.transition = 'transform 0.3s ease';
        }}
        style={{
          width: '100%',
          overflow: 'hidden',
          cursor: 'pointer',
          padding: '2rem 0',
          position: 'relative',
          background: 'transparent',
          zIndex: 10,
          userSelect: 'none',
          marginTop: isMobile ? '-2rem' : '-4rem',
          marginBottom: isMobile ? '-2rem' : '-4rem'
        }}
      >
        <svg 
          viewBox="0 0 1440 280" 
          width="100%" 
          height="100%" 
          style={{ display: 'block', overflow: 'visible' }}
        >
          {/* Shadow Ribbon underlay */}
          <path 
            d="M -100,140 C 150,40 350,240 600,140 C 850,40 1050,240 1300,140 C 1550,40 1750,240 2000,140" 
            fill="none" 
            stroke="rgba(0,0,0,0.06)" 
            strokeWidth="90" 
            strokeLinecap="round" 
          />
          {/* Main Beige/Brown Ribbon background */}
          <path 
            id="ribbonPath"
            d="M -100,140 C 150,40 350,240 600,140 C 850,40 1050,240 1300,140 C 1550,40 1750,240 2000,140" 
            fill="none" 
            stroke="var(--accent)" 
            strokeWidth="80" 
            strokeLinecap="round" 
          />
          {/* Text path */}
          <text 
            fill="white" 
            fontSize={isMobile ? "20" : "18"} 
            fontWeight="900" 
            letterSpacing="3"
            style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}
          >
            <textPath href="#ribbonPath" startOffset="0%">
              {ribbonText}
              <animate 
                attributeName="startOffset" 
                from="0%" 
                to="-60%" 
                dur="20s" 
                repeatCount="indefinite" 
              />
            </textPath>
          </text>
        </svg>
      </div>

      {/* New Arrivals Section */}
      <section style={{ 
        backgroundColor: 'var(--accent)',
        padding: isMobile ? '2.5rem 0 1.5rem 0' : '5rem 0',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: isMobile ? '1.5rem' : '4rem',
            fontFamily: 'var(--font-sans)'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '2.2rem' : '4.5rem', 
              fontWeight: 800, 
              margin: 0, 
              letterSpacing: '1px',
              fontFamily: 'var(--font-sans)',
              width: '100%',
              textAlign: 'center',
              textTransform: 'uppercase'
            }}>BEST SELLING</h2>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            gap: isMobile ? '0.6rem' : '2.5rem', 
            justifyContent: 'center',
            paddingBottom: isMobile ? '0.5rem' : '2rem'
          }}>
            {[
              {
                title: 'Magazines',
                categoryStr: 'Magazines',
                coverImage: TEMPLATES.find(t => t.category === 'Magazine' || t.category === 'Standing Magazine')?.image
              },
              {
                title: 'Frames & Decor',
                categoryStr: 'Frames & Decor',
                coverImage: TEMPLATES.find(t => t.category === 'Frames' || t.category === 'Frame' || t.category === 'Aesthetic')?.image
              },
              {
                title: 'Combos',
                categoryStr: 'Combos',
                coverImage: TEMPLATES.find(t => t.category === 'Combo')?.image
              }
            ].map((cat, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -10 }} 
                onClick={() => {
                  setSelectedCategory(cat.categoryStr);
                  collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  flex: isMobile ? '1 1 0px' : '0 0 auto',
                  width: isMobile ? 'auto' : '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  borderRadius: isMobile ? '50px 50px 20px 20px' : '160px 160px 50px 50px',
                  padding: isMobile ? '1.2rem 0.5rem 0.5rem 0.5rem' : '3rem 2rem 2rem 2rem',
                  width: '100%',
                  aspectRatio: '0.85',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: isMobile ? '0.4rem' : '1.5rem',
                  position: 'relative',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.4)'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: isMobile ? '0.4rem' : '2rem', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.6)', 
                    color: 'var(--accent)',
                    padding: isMobile ? '0.1rem 0.4rem' : '0.4rem 1.2rem', 
                    borderRadius: '30px', 
                    fontSize: isMobile ? '0.45rem' : '0.85rem', 
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    whiteSpace: 'nowrap'
                  }}>
                    <Star size={isMobile ? 8 : 14} fill="var(--accent)" /> CATEGORY
                  </div>
                  {cat.coverImage?.endsWith('.mp4') ? (
                    <video 
                      src={cat.coverImage} 
                      autoPlay loop muted playsInline
                      style={{ 
                        width: '90%', 
                        aspectRatio: '1/1',
                        objectFit: 'cover', 
                        mixBlendMode: 'multiply',
                        borderRadius: isMobile ? '8px' : '20px',
                        filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
                      }} 
                    />
                  ) : (
                    <img src={cat.coverImage} alt={cat.title} style={{ 
                      width: '90%', 
                      aspectRatio: '1/1',
                      objectFit: 'cover', 
                      mixBlendMode: 'multiply',
                      borderRadius: isMobile ? '8px' : '20px',
                      filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
                    }} />
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0 0.2rem', fontFamily: 'var(--font-sans)' }}>
                  <span style={{ fontSize: isMobile ? '0.75rem' : '1.4rem', fontWeight: 800, textAlign: 'center', lineHeight: '1.2' }}>{cat.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Product Collection Section */}
      <section ref={collectionRef} className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>More Products</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handcrafted pieces for your most cherished moments.</p>
          </div>

          {/* Category Selection Grid (Only shown when no category is selected) */}
          {!selectedCategory && (
            <div className="product-grid">
              {Object.entries({
                'Premium Gifts': TEMPLATES.filter(t => ['Hamper', 'Scrapbook', 'Calendar'].includes(t.category)),
                'Apparel & Accessories': TEMPLATES.filter(t => ['Apparel', 'Cap', 'Keychain'].includes(t.category)),
                'Other': TEMPLATES.filter(t => !['Magazine', 'Standing Magazine', 'Frames', 'Frame', 'Aesthetic', 'Hamper', 'Scrapbook', 'Calendar', 'Apparel', 'Cap', 'Keychain', 'Combo'].includes(t.category))
              }).map(([title, items], index) => {
                if (items.length === 0) return null;
                const coverTemplate = items[0];
                
                return (
                  <motion.div 
                    key={title}
                    className="product-card-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedCategory(title);
                      collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        borderRadius: isMobile ? '80px 80px 30px 30px' : '160px 160px 50px 50px',
                        padding: isMobile ? '1.5rem 0.8rem 0.8rem 0.8rem' : '3rem 2rem 2rem 2rem',
                        width: '100%',
                        aspectRatio: '0.85',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        marginBottom: isMobile ? '0.8rem' : '1.5rem',
                        position: 'relative',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.4)'
                      }}>
                        <div style={{ 
                          position: 'absolute', 
                          top: isMobile ? '0.8rem' : '2rem', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          background: 'rgba(255,255,255,0.6)', 
                          color: 'var(--accent)',
                          padding: isMobile ? '0.2rem 0.6rem' : '0.4rem 1.2rem', 
                          borderRadius: '30px', 
                          fontSize: isMobile ? '0.55rem' : '0.85rem', 
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          whiteSpace: 'nowrap'
                        }}>
                          <Star size={isMobile ? 10 : 14} fill="var(--accent)" /> {items.length} PRODUCTS
                        </div>
                        {coverTemplate.image?.endsWith('.mp4') ? (
                          <video 
                            src={coverTemplate.image} 
                            autoPlay loop muted playsInline
                            style={{ 
                              width: '90%', 
                              aspectRatio: '1/1',
                              objectFit: 'cover', 
                              mixBlendMode: 'multiply',
                              borderRadius: isMobile ? '12px' : '20px',
                              filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
                            }} 
                          />
                        ) : (
                          <img src={coverTemplate.image} alt={title} style={{ 
                            width: '90%', 
                            aspectRatio: '1/1',
                            objectFit: 'cover', 
                            mixBlendMode: 'multiply',
                            borderRadius: isMobile ? '12px' : '20px',
                            filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
                          }} />
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '0 1rem', fontFamily: 'var(--font-sans)' }}>
                        <span style={{ fontSize: isMobile ? '0.95rem' : '1.3rem', fontWeight: 800, textAlign: 'center' }}>{title}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Filtered Category View (Only shown when a category IS selected) */}
          {selectedCategory && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '1rem', 
                  fontFamily: 'var(--font-serif)', 
                  color: 'var(--navy)'
                }}>{selectedCategory}</h3>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '30px',
                    background: 'transparent',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  <ArrowLeft size={16} /> All Categories
                </button>
              </div>

              <div className="product-grid">
                {TEMPLATES.filter(t => {
                  const groups = {
                    'Magazines': ['Magazine', 'Standing Magazine'],
                    'Premium Gifts': ['Hamper', 'Scrapbook', 'Calendar'],
                    'Combos': ['Combo'],
                    'Frames & Decor': ['Frames', 'Frame', 'Aesthetic'],
                    'Apparel & Accessories': ['Apparel', 'Cap', 'Keychain']
                  };
                  if (groups[selectedCategory]) return groups[selectedCategory].includes(t.category);
                  return !Object.values(groups).flat().includes(t.category);
                }).map((template, index) => (
                  <motion.div 
                    key={template.id}
                    className="product-card-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/template/${template.id}`} style={{ 
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%'
                    }}>
                      <ProductCardContent template={template} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Editorial Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg)', position: 'relative', overflow: 'hidden', padding: isMobile ? '2rem 0 0.5rem 0' : '5rem 0' }}>
        <div className="container" style={{ position: 'relative', minHeight: isMobile ? 'auto' : '600px', display: 'flex', flexDirection: 'column' }}>
          
          {isMobile ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              width: '100%', 
              gap: '1rem', 
              marginTop: '1rem' 
            }}>
              
              {/* Left Column (Text) */}
              <div style={{ width: '48%', zIndex: 2, position: 'relative' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.6rem',
                  color: 'var(--text)',
                  fontWeight: 900,
                  marginBottom: '0.8rem',
                  lineHeight: 1.2
                }}>About Us</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 0, lineHeight: 1.6 }}>
                  Our team is passionate about emotional connections. We love experimenting with memories to create products that not only meet your needs but inspire new possibilities. Together we explore the future of emotional gifting, creating pieces that become your faithful companions.
                </p>
              </div>

              {/* Right Column (Relative Collage container for mockups) */}
              <div style={{ position: 'relative', width: '48%', height: '280px', zIndex: 3 }}>
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{ position: 'absolute', top: '2%', left: '0%', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
                >
                  <img src="/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE.jpg" alt="mockup 1" style={{ width: '60px', borderRadius: '12px', border: '2px solid white' }} />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  style={{ position: 'absolute', top: '10%', right: '0%', zIndex: 3, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }}
                >
                  <video 
                    src="/products/vac.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    style={{ width: '90px', borderRadius: '12px', border: '3px solid white', display: 'block' }} 
                  />
                </motion.div>

                <motion.div 
                  animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                  transition={{ duration: 7, repeat: Infinity }}
                  style={{ position: 'absolute', top: '68%', left: '15%', zIndex: 2, filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.1))' }}
                >
                  <img src="/products/KALESHI AURAT/686f6b42-274f-4201-b05d-1f74e5f995df.jpg" alt="Apparels" style={{ width: '75px', borderRadius: '12px', border: '2.5px solid white' }} />
                </motion.div>
              </div>

            </div>
          ) : (
            <>
              {/* Desktop Text Block */}
              <div style={{ maxWidth: '400px', zIndex: 2, position: 'relative', marginTop: '4rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.5rem',
                  color: 'var(--text)',
                  fontWeight: 900,
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>About Us</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, marginBottom: 0, lineHeight: 1.6 }}>
                  Our team is passionate about emotional connections. We love experimenting with memories to create products that not only meet your needs but inspire new possibilities. Together we explore the future of emotional gifting, creating pieces that become your faithful companions.
                </p>
              </div>

              {/* Desktop Mockups absolute positioned in the main container */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                style={{ position: 'absolute', top: '5%', right: '40%', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}
              >
                <img src="/products/MAGAZINE TEMPLATES/CHAAR KADAM-WEBSITE.jpg" alt="mockup 1" style={{ width: '150px', borderRadius: '12px', border: '4px solid white' }} />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{ position: 'absolute', top: '15%', right: '5%', zIndex: 3, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }}
              >
                <video 
                  src="/products/vac.mp4" 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  style={{ width: '250px', borderRadius: '12px', border: '6px solid white', display: 'block' }} 
                />
              </motion.div>

              <motion.div 
                animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity }}
                style={{ position: 'absolute', top: '40%', right: '25%', zIndex: 2, filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.1))' }}
              >
                <img src="/products/KALESHI AURAT/686f6b42-274f-4201-b05d-1f74e5f995df.jpg" alt="Apparels" style={{ width: '180px', borderRadius: '12px', border: '5px solid white' }} />
              </motion.div>
            </>
          )}

          <h2 style={{
            display: isMobile ? 'none' : 'block',
            fontFamily: 'var(--font-sans)',
            fontSize: isMobile ? '15vw' : '12vw',
            fontWeight: 900,
            color: 'var(--accent)',
            opacity: 0.9,
            margin: isMobile ? '3rem 0 1rem 0' : 'auto 0 2rem 0',
            letterSpacing: '-2px',
            lineHeight: 1,
            zIndex: 1,
            position: 'relative'
          }}>ANCHOR</h2>

        </div>
      </section>



    </div>
  );
};

export default Home;
