import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../../utils/data';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TemplateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const template = TEMPLATES.find(t => t.id === id);
  const [selectedOption, setSelectedOption] = useState('10'); // '10' or '12'

  if (!template) return <div>Template not found</div>;

  const currentPrice = selectedOption === '10' ? template.price10 : template.price12;

  const handleProceed = () => {
    navigate(`/customize/${id}/${selectedOption}`);
  };

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          {/* Image Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <img src={template.image} alt={template.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, aspectRatio: '1', background: '#eee', borderRadius: '4px' }}></div>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <div>
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>{template.category}</span>
            <h1 style={{ fontSize: '3rem', margin: '1rem 0' }}>{template.name}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {template.description}
            </p>

            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold' }}>Choose Page Count</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div 
                  onClick={() => setSelectedOption('10')}
                  className={`card ${selectedOption === '10' ? 'selected' : ''}`}
                  style={{ 
                    flex: 1, 
                    padding: '1.5rem', 
                    cursor: 'pointer',
                    border: selectedOption === '10' ? '2px solid var(--accent)' : '1px solid var(--border)',
                    position: 'relative'
                  }}
                >
                  {selectedOption === '10' && <Check size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--accent)' }} />}
                  <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>10 Pages</span>
                  <span style={{ color: 'var(--text-muted)' }}>₹{template.price10}</span>
                </div>
                <div 
                  onClick={() => setSelectedOption('12')}
                  className={`card ${selectedOption === '12' ? 'selected' : ''}`}
                  style={{ 
                    flex: 1, 
                    padding: '1.5rem', 
                    cursor: 'pointer',
                    border: selectedOption === '12' ? '2px solid var(--accent)' : '1px solid var(--border)',
                    position: 'relative'
                  }}
                >
                  {selectedOption === '12' && <Check size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--accent)' }} />}
                  <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem' }}>12 Pages</span>
                  <span style={{ color: 'var(--text-muted)' }}>₹{template.price12}</span>
                </div>
              </div>
            </div>

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

            <button onClick={handleProceed} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
              Customize Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;
