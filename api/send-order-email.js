import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, customerName, orderIds, items, totalPrice } = req.body;

  if (!email || !orderIds || !items) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const itemsList = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} (${item.pages} pages)</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #1a2238;">Order Confirmation</h2>
      <p>Hello ${customerName || 'Customer'},</p>
      <p>Thank you for your order! We have received your order and are preparing it now.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Summary</h3>
        <p><strong>Order ID(s):</strong> ${orderIds}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">₹${totalPrice}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <p>You will receive another email when your order status updates.</p>
      <p>Best regards,<br>Anchor Customs Team</p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Anchor Customs" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: `Order Confirmation - Anchor Customs`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
}
