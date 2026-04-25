import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TEMPLATES } from '../utils/data';

const Gallery = () => {
  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Magazines that tell your story</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Each design is a bespoke canvas for your most cherished moments.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {TEMPLATES.map((template, index) => (
            <motion.div 
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/template/${template.id}`} className="card gift-border" style={{ 
                display: 'block',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit'
              }}>
                <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                  {/* Nostalgic Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(197, 160, 89, 0.05)',
                    mixBlendMode: 'sepia',
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}></div>
                  
                  <img 
                    src={template.image} 
                    alt={template.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      filter: 'contrast(1.05) brightness(0.95)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '2rem' }}>
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
      
      {/* Editorial Footer Quote */}
      <div className="container" style={{ marginTop: '10rem', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--accent)', margin: '0 auto 3rem' }}></div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          "Every memory is a gift. Anchor Customs helps you wrap it in the elegance it deserves."
        </p>
      </div>
    </div>
  );
};

export default Gallery;
