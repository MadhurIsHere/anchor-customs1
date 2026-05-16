import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Heart, Truck, CheckCircle, ArrowDown, Star, User } from 'lucide-react';
import { TEMPLATES } from '../utils/data';

const Home = () => {
  const collectionRef = useRef(null);

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
        height: 'calc(100dvh - 70px)', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden',
        position: 'relative',
        padding: '0'
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
              You might cry (in a cute way). Turning your memories into something you can hold forever.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '7rem' }}>
              <button onClick={scrollToCollection} className="btn btn-primary hero-btn">
                View Collection <ArrowDown size={18} />
              </button>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Trust / Features Banner */}
      <section style={{ padding: '3rem 0', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-offset)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)', boxShadow: 'var(--shadow)' }}>
                <CheckCircle size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Premium Quality</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Handcrafted with high-quality materials to last a lifetime.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-offset)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)', boxShadow: 'var(--shadow)' }}>
                <Heart size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>100% Personalized</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Designed exclusively with your favorite memories and text.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-offset)', padding: '1rem', borderRadius: '50%', color: 'var(--accent)', boxShadow: 'var(--shadow)' }}>
                <Truck size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)' }}>Free Shipping</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Enjoy free delivery across India on all your orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section ref={collectionRef} className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Explore the Collection</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handcrafted pieces for your most cherished moments.</p>
          </div>

          {Object.entries({
            'Magazines': TEMPLATES.filter(t => t.category === 'Magazine' || t.category === 'Standing Magazine'),
            'Premium Gifts': TEMPLATES.filter(t => ['Hamper', 'Scrapbook', 'Calendar'].includes(t.category)),
            'Combos': TEMPLATES.filter(t => t.category === 'Combo'),
            'Frames & Polaroids': TEMPLATES.filter(t => t.category === 'Frames' || t.category === 'Frame' || t.category === 'Polaroids'),
            'Apparel & Accessories': TEMPLATES.filter(t => ['Apparel', 'Cap', 'Keychain'].includes(t.category)),
            'Other': TEMPLATES.filter(t => !['Magazine', 'Standing Magazine', 'Frames', 'Frame', 'Polaroids', 'Hamper', 'Scrapbook', 'Calendar', 'Apparel', 'Cap', 'Keychain', 'Combo'].includes(t.category))
          }).map(([title, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={title} style={{ marginBottom: '6rem' }}>
                <h3 style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '3rem', 
                  fontFamily: 'var(--font-serif)', 
                  color: 'var(--navy)', 
                  borderBottom: '1px solid var(--border)', 
                  paddingBottom: '1rem',
                  textAlign: 'center' // Centered title
                }}>{title}</h3>
                <div className="product-grid">
                  {items.map((template, index) => (
                    <motion.div 
                      key={template.id}
                      className="product-card-wrapper"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/template/${template.id}`} className="card gift-border" style={{ 
                        display: 'block',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        color: 'inherit',
                        height: '100%'
                      }}>
                        <div className="template-img-container" style={{ position: 'relative', overflow: 'hidden' }}>
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(197, 160, 89, 0.05)',
                            mixBlendMode: 'sepia',
                            zIndex: 1,
                            pointerEvents: 'none'
                          }}></div>
                          
                          {template.popular && (
                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255, 255, 255, 0.95)', color: 'var(--navy)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.3rem', backdropFilter: 'blur(4px)' }}>
                              <Star size={12} fill="var(--accent)" color="var(--accent)" /> Bestseller
                            </div>
                          )}
                          
                          <img 
                            src={template.image} 
                            alt={template.name} 
                            loading="lazy"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover', 
                              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                            className="template-img"
                          />
                        </div>
                        <div className="card-content">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>{template.category}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.8 }}>₹{template.price10}</span>
                          </div>
                          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{template.name}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0' }}>
                            {template.description}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Got questions? We've got answers.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>How long does delivery take?</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Orders are generally delivered within 5-7 working days across India.</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Is my privacy protected?</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Absolutely! We value your trust. Your photos will never be posted publicly without your explicit permission.</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Do you offer free shipping?</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Yes! We proudly offer 100% free shipping across India on all our products.</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', color: 'var(--accent)' }}>Can I add more photos?</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Yes! If you have more memories to share, we can increase the number of pages in your magazine or scrapbook accordingly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Simple steps to create your personalized gift.</p>
          </div>

          <div className="how-it-works-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(5, 1fr)', 
            gap: '1.5rem' 
          }}>
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '2rem 1.2rem', 
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
