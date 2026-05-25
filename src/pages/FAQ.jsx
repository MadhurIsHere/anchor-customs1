import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'How long does delivery take?', a: 'Orders are generally delivered within 8-10 working days across India.' },
    { q: 'Is my privacy protected?', a: 'Absolutely! We value your trust. Your photos will never be posted publicly without your explicit permission.' },
    { q: 'Do you offer free shipping?', a: 'Yes! We proudly offer 100% free shipping across India on all our products.' },
    { q: 'Refund Policy', a: 'NO REFUND POLICY. Returns are only accepted when the product is delivered damaged. Important: Please make a continuous, unedited video while opening the parcel showing the seal from the outer packaging.' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <section className="section-padding" style={{ backgroundColor: 'var(--bg)', flexGrow: 1, paddingTop: '100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Got questions? We've got answers.</p>
          </div>
          
          <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqs.map((faq, i) => (
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
    </div>
  );
};

export default FAQ;
