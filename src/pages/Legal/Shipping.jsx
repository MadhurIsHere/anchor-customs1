import React from 'react';

const Shipping = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Shipping Policy</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <h3>Delivery Timeline</h3>
        <p>Our production time takes approximately 10-12 days.</p>
        <p>Overall delivery timeline is 1-2 weeks from the date of placing the order.</p>
        
        <h3>Shipping Charges</h3>
        <p>Magazines & Other Products: <strong>FREE SHIPPING</strong></p>
        <p>Frames, Caps, and Hot Wheels: ₹80 shipping charge</p>
        
        <h3>Delivery Locations</h3>
        <p>We deliver all over India. We currently do not offer international shipping.</p>
        
        <h3>Tracking</h3>
        <p>The customer will get a tracking information when their parcel is shipped. You will receive an instant update. Our delivery partner is DTDC.</p>
      </div>
    </div>
  </div>
);

export default Shipping;
