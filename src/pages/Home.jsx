import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Heart, Truck, CheckCircle, ArrowDown, Star, User, ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';
import { TEMPLATES } from '../utils/data';

const ProductCardContent = ({ template }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div className="template-img-container" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', width: '100%' }}>
      {template.popular && (
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(255, 255, 255, 0.9)', color: 'var(--navy)', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.6rem', fontWeight: 'bold', zIndex: 10, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Star size={10} fill="var(--accent)" color="var(--accent)" /> Popular
        </div>
      )}
      
      <motion.img 
        src={template.image} 
        alt={template.name} 
        loading="lazy"
        whileHover={{ scale: 1.05 }}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          display: 'block'
        }}
      />
    </div>

    <div style={{ padding: '0.5rem 0.4rem', background: 'var(--bg)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
      <h3 style={{ fontSize: '0.85rem', margin: 0, padding: 0, fontFamily: 'var(--font-serif)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
        {template.name}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent)' }}>
          ₹{template.price10}
        </span>
        {template.originalPrice && (
          <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
            ₹{template.originalPrice}
          </span>
        )}
        {template.originalPrice && (
          <span style={{ 
            background: 'rgba(212, 175, 55, 0.1)', 
            color: 'var(--accent)', 
            padding: '0.1rem 0.4rem', 
            borderRadius: '10px', 
            fontSize: '0.65rem', 
            fontWeight: 'bold',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            Save ₹{template.originalPrice - template.price10}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Home = () => {
  const collectionRef = useRef(null);
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [openFaq, setOpenFaq] = React.useState(null);

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

  const features = [
    { icon: <User size={24} />, title: '1. Login/Sign up', desc: 'Create an account or login to start your personalized gift journey.' },
    { icon: <Camera size={24} />, title: '2. Choose Product', desc: 'To avail freebie gift click on a banner, then choose your product.' },
    { icon: <Heart size={24} />, title: '3. Upload Photos', desc: 'Share your memories and add any short 5-7 one-liners.' },
    { icon: <Truck size={24} />, title: '4. Enter Details', desc: 'Provide your shipping address and contact information.' },
    { icon: <CheckCircle size={24} />, title: '5. Payment & Delivery', desc: 'Make payment securely. Get delivery across India in 1-2 weeks.' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
        <section className="starred-bg" style={{ 
          minHeight: isMobile ? '50vh' : '80vh',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg)',
          overflow: 'hidden',
          position: 'relative',
          padding: isMobile ? '4rem 0 2rem' : '8rem 0 4rem'
        }}>
        <div className="container hero-grid" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Gen-Z Background Scribbles & Elements */}
          <div className="scribble-text" style={{ top: '-8%', left: '5%', transform: 'rotate(-15deg)' }}>no cap 🧢</div>
          <div className="scribble-text" style={{ top: '2%', right: '5%', transform: 'rotate(10deg)' }}>Main Character Energy ✨</div>
          <div className="scribble-text" style={{ top: '25%', left: '-8%', transform: 'rotate(-5deg)', fontSize: '2rem' }}>rent free 🧠</div>
          <div className="scribble-text" style={{ bottom: '20%', right: '-5%', transform: 'rotate(20deg)' }}>delulu is the solulu 🎀</div>
          <div className="scribble-text" style={{ top: '65%', left: '-15%', transform: 'rotate(5deg)', fontSize: '1.8rem' }}>*screaming crying throwing up*</div>
          
          <div className="scribble-text" style={{ bottom: '5%', left: '15%', transform: 'rotate(-10deg)', fontSize: '2.2rem' }}>it's giving... premium 💅</div>
          <div className="scribble-text" style={{ top: '40%', right: '-12%', transform: 'rotate(-8deg)', fontSize: '2rem' }}>slay ✨</div>
          <div className="scribble-text" style={{ top: '-15%', right: '25%', transform: 'rotate(12deg)', fontSize: '1.9rem' }}>obsessed 😍</div>
          <div className="scribble-text" style={{ bottom: '-10%', right: '15%', transform: 'rotate(-15deg)', fontSize: '2.1rem' }}>pookie 🧸</div>

          <Star className="scribble-text" size={32} style={{ top: '15%', right: '15%', transform: 'rotate(15deg)' }} />
          <Heart className="scribble-text" size={24} style={{ bottom: '15%', left: '5%', transform: 'rotate(-20deg)' }} />
          <Star className="scribble-text" size={20} style={{ top: '55%', left: '12%', transform: 'rotate(45deg)' }} />
          <Heart className="scribble-text" size={28} style={{ top: '5%', left: '25%', transform: 'rotate(10deg)' }} />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h1 className="hero-title">You're not basic. <br /> Your gifts shouldn't be <span className="hero-subtitle">either.</span></h1>
            <p className="hero-desc">
              You might cry <span className="hero-desc-accent">(in a cute way)</span>. Turning your memories into something you can <span className="hero-desc-accent">hold forever</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button onClick={scrollToCollection} className="btn btn-primary hero-btn">
                View Collection <ArrowDown size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section ref={collectionRef} className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Explore the Collection</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handcrafted pieces for your most cherished moments.</p>
          </div>

          {/* Category Selection Grid (Only shown when no category is selected) */}
          {!selectedCategory && (
            <div className="product-grid">
              {Object.entries({
                'Magazines': TEMPLATES.filter(t => t.category === 'Magazine' || t.category === 'Standing Magazine'),
                'Premium Gifts': TEMPLATES.filter(t => ['Hamper', 'Scrapbook', 'Calendar'].includes(t.category)),
                'Combos': TEMPLATES.filter(t => t.category === 'Combo'),
                'Frames & Decor': TEMPLATES.filter(t => t.category === 'Frames' || t.category === 'Frame' || t.category === 'Aesthetic'),
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
                    <div className="card gift-border" style={{ height: '100%' }}>
                      <div className="card-content" style={{ textAlign: 'center', padding: '0.6rem 0.8rem 0.4rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.1rem', fontFamily: 'var(--font-serif)', color: 'var(--navy)' }}>{title}</h3>
                        <span style={{ fontSize: '0.55rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>{items.length} Products</span>
                      </div>
                      <div className="template-img-container" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1', maxHeight: '250px' }}>
                        <img 
                          src={coverTemplate.image} 
                          alt={title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(175, 145, 112, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }} className="hover-overlay">
                          <span style={{ background: 'var(--accent)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold' }}>View All</span>
                        </div>
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
                    <Link to={`/template/${template.id}`} className="card gift-border" style={{ 
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

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Got questions? We've got answers.</p>
          </div>
          
          <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { q: 'How long does delivery take?', a: 'Orders are generally delivered within 5-7 working days across India.' },
              { q: 'Is my privacy protected?', a: 'Absolutely! We value your trust. Your photos will never be posted publicly without your explicit permission.' },
              { q: 'Do you offer free shipping?', a: 'Yes! We proudly offer 100% free shipping across India on all our products.' },
              { q: 'Refund Policy', a: 'NO REFUND POLICY. Returns are only accepted when the product is delivered damaged. Important: Please make a continuous, unedited video while opening the parcel showing the seal from the outer packaging.' }
            ].map((faq, i) => (
              <div 
                key={i} 
                style={{ 
                  borderBottom: '1px solid var(--border)',
                  ...(i === 0 ? { borderTop: '1px solid var(--border)' } : {})
                }}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '1.3rem 0.5rem',
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    gap: '1rem'
                  }}
                >
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: openFaq === i ? 'var(--accent)' : 'var(--navy)',
                    transition: 'color 0.2s ease'
                  }}>{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      color: 'var(--accent)', 
                      flexShrink: 0,
                      transition: 'transform 0.3s ease',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>
                <div style={{ 
                  maxHeight: openFaq === i ? '200px' : '0', 
                  overflow: 'hidden', 
                  transition: 'max-height 0.35s ease, padding 0.35s ease',
                  padding: openFaq === i ? '0 0.5rem 1.3rem' : '0 0.5rem 0'
                }}>
                  <p style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.9rem', 
                    lineHeight: '1.7', 
                    margin: 0 
                  }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '6rem' }}>
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <span>Simple steps to create your personalized gift.</span>
              {isMobile && (
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.3rem', 
                  color: 'var(--accent)', 
                  fontSize: '0.85rem', 
                  fontWeight: 'bold',
                  marginTop: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Swipe left to view <span style={{ display: 'inline-flex', animation: 'swipePulse 1.5s infinite' }}><ArrowRight size={14} style={{ marginLeft: '2px' }} /></span>
                </span>
              )}
            </p>
          </div>

          <div className="how-it-works-grid" style={{ 
            display: 'grid', 
            gap: '1.5rem' 
          }}>
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '1.2rem 1rem', 
                  backgroundColor: 'var(--glass)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  height: '100%'
                }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '1.2rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
