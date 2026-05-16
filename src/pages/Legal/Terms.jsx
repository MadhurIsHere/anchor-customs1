import React from 'react';

const Terms = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Terms & Conditions</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>All products are fully customized based on the content (photos, text, details) provided by the customer. Please ensure everything shared is accurate and final.</li>
          <li>We provide limited revisions during the design process. Any major changes after final approval may not be possible or may require extra charges.</li>
          <li>Advance payment is required to confirm your order. Work will begin only after payment is received.</li>
          <li>Since all products are personalized, no cancellations, returns, or refunds will be accepted once the order is placed or the design process has started.</li>
          <li>We aim to complete and dispatch orders within the promised timeline (10-12 days). However, timelines may vary slightly depending on workload and customization requirements.</li>
          <li>Once your order is shipped on time from our end, any delays caused by the courier company are not our responsibility.</li>
          <li>Customers are responsible for providing clear images and correct information. We are not liable for errors due to incorrect or incomplete details shared.</li>
          <li>Slight variations in color, layout, or print quality may occur due to screen and printing differences.</li>
          <li>All personal data, photos, and content shared with us are kept private and used only for your order. We do not post or share your content without your permission.</li>
          <li>We reserve the right to refuse or cancel any order if necessary, with proper communication.</li>
          <li>By placing an order, you confirm that you have read and agreed to all the above terms and conditions.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Terms;
