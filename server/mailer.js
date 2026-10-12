import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

// Initialize nodemailer transport
export function initMailer() {
  try {
    const user = process.env.EMAIL_USER;
    const rawPass = process.env.EMAIL_PASS || '';
    // Strip whitespace from app password if present (e.g., 'xxxx xxxx xxxx xxxx' -> 'xxxxxxxxxxxxxxxx')
    const pass = rawPass.replace(/\s+/g, '');

    if (user && (user.includes('@gmail.com') || process.env.EMAIL_SERVICE === 'gmail')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: user,
          pass: pass
        }
      });
      console.log(`📧 Nodemailer configured with Gmail App Password for: ${user}`);
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: user || 'support@1ticket.com',
          pass: pass || 'secret'
        }
      });
      console.log('📧 Nodemailer service initialized for 1ticket notifications');
    }
  } catch (err) {
    console.warn('⚠️ Nodemailer initialization fallback mode:', err.message);
  }
}

// Send coupon confirmation email to customer with complete coupon details & QR code
export async function sendCouponConfirmationEmail({
  customerEmail,
  customerName,
  customerPhone,
  couponTitle,
  ticketCode,
  price,
  seatCount = 1,
  attendees = [],
  venue = 'Authorized Partner Location',
  eventDate = '2026-11-30'
}) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketCode)}&color=f6c042&bgcolor=11141f`;

  const attendeesHtml = (attendees && attendees.length > 0)
    ? `
      <div style="margin-top: 20px; border-top: 1px dashed rgba(212, 175, 55, 0.3); padding-top: 14px;">
        <p style="margin: 0 0 10px; color: #f6c042; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
          👥 Registered Pass Holders (${attendees.length})
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e5e7eb;">
          <thead>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: #9ca3af; text-align: left;">
              <th style="padding: 6px 0;">#</th>
              <th style="padding: 6px 0;">Guest Name</th>
              <th style="padding: 6px 0;">Mobile Number</th>
            </tr>
          </thead>
          <tbody>
            ${attendees.map((att, idx) => `
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 8px 0; color: #f6c042; font-weight: bold;">Pass ${idx + 1}</td>
                <td style="padding: 8px 0;">${att.name || customerName}</td>
                <td style="padding: 8px 0; font-family: monospace;">${att.phone || customerPhone || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : '';

  const mailOptions = {
    from: `"1ticket Official" <${process.env.EMAIL_USER || 'no-reply@1ticket.com'}>`,
    to: customerEmail,
    subject: `🎟️ Your 1ticket Exclusive Coupon Confirmed: ${couponTitle} [${ticketCode}]`,
    html: `
      <div style="background-color: #060709; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 620px; margin: 0 auto; background-color: #0d1017; border: 1px solid rgba(212, 175, 55, 0.45); border-radius: 14px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          {/* Header Banner */}
          <div style="background: linear-gradient(135deg, #f6c042 0%, #eab308 50%, #ca8a04 100%); padding: 24px; text-align: center; color: #000000;">
            <div style="font-size: 11px; letter-spacing: 0.15em; font-weight: 800; text-transform: uppercase; margin-bottom: 4px;">OFFICIAL 1TICKET VERIFIED VOUCHER</div>
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em;">BOOKING CONFIRMED</h1>
            <p style="margin: 6px 0 0; font-weight: 600; font-size: 13px; opacity: 0.9;">Durgashtami Festive Special • Exclusive Pass</p>
          </div>

          <div style="padding: 28px;">
            <p style="font-size: 16px; color: #ffffff; margin-top: 0;">Dear <strong>${customerName}</strong>,</p>
            <p style="color: #9ca3af; line-height: 1.6; font-size: 14px;">
              Your payment has been successfully verified! Below is your official digital coupon pass and QR code for entry and benefit redemption.
            </p>
            
            {/* Coupon Card Container */}
            <div style="background: #11141f; border: 2px dashed #f6c042; border-radius: 12px; padding: 22px; margin: 24px 0; text-align: center;">
              
              <div style="display: inline-block; background: #060709; padding: 12px; border-radius: 10px; border: 1px solid rgba(212, 175, 55, 0.35); margin-bottom: 16px;">
                <img src="${qrUrl}" alt="Coupon QR Code" style="width: 160px; height: 160px; display: block; margin: 0 auto;" />
                <span style="display: block; color: #9ca3af; font-size: 10px; margin-top: 6px; letter-spacing: 0.05em;">SCAN TO VERIFY AT VENUE</span>
              </div>

              <div style="margin-bottom: 14px;">
                <span style="color: #9ca3af; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; display: block;">VOUCHER SERIAL CODE</span>
                <span style="color: #f6c042; font-family: monospace; font-size: 22px; font-weight: 800; letter-spacing: 0.08em;">${ticketCode}</span>
              </div>

              <h2 style="margin: 0 0 14px; color: #ffffff; font-size: 18px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px;">
                ${couponTitle}
              </h2>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left; background: rgba(0,0,0,0.4); padding: 12px; border-radius: 8px;">
                <div>
                  <span style="color: #9ca3af; font-size: 11px; display: block;">PASS QUANTITY</span>
                  <strong style="color: #ffffff; font-size: 14px;">${seatCount} Pass${seatCount > 1 ? 'es' : ''}</strong>
                </div>
                <div>
                  <span style="color: #9ca3af; font-size: 11px; display: block;">TOTAL PAID</span>
                  <strong style="color: #34d399; font-size: 15px;">₹${Number(price).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span style="color: #9ca3af; font-size: 11px; display: block;">PRIMARY MOBILE</span>
                  <strong style="color: #ffffff; font-size: 13px; font-family: monospace;">${customerPhone || '—'}</strong>
                </div>
                <div>
                  <span style="color: #9ca3af; font-size: 11px; display: block;">LOCATION / VENUE</span>
                  <strong style="color: #ffffff; font-size: 13px;">${venue}</strong>
                </div>
              </div>

              ${attendeesHtml}
            </div>

            <div style="background: rgba(246, 192, 66, 0.08); border-left: 3px solid #f6c042; padding: 12px 14px; border-radius: 0 6px 6px 0; margin-bottom: 20px;">
              <p style="margin: 0; color: #fef08a; font-size: 12.5px; line-height: 1.5;">
                ⚡ <strong>Redemption Instructions:</strong> Present this email or QR pass to the authorized coordinator at the check-in desk. Our scanner will verify and stamp your voucher instantly.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">
              You can also view, save, and download your passes anytime at <strong style="color: #ffffff;">http://localhost:5174/#my-coupons</strong> using your email (<strong>${customerEmail}</strong>) and phone (<strong>${customerPhone}</strong>).
            </p>
          </div>

          <div style="background-color: #080a0f; padding: 16px; text-align: center; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: #6b7280;">
            © 2026 1ticket Platforms • Verified by Neon PostgreSQL & Express
          </div>
        </div>
      </div>
    `
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Email dispatched to ${customerEmail}:`, info.messageId || 'OK');
      return { success: true, messageId: info.messageId };
    }
    console.log(`ℹ️ [Email Simulation] Voucher sent to ${customerEmail} (Code: ${ticketCode})`);
    return { success: true, simulated: true };
  } catch (err) {
    console.warn(`⚠️ Error sending confirmation email to ${customerEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

// Send coordinator invitation email
export async function sendCoordinatorWelcomeEmail({ email, name, role, defaultPassword }) {
  const mailOptions = {
    from: `"1ticket Staff Portal" <${process.env.EMAIL_USER || 'no-reply@1ticket.com'}>`,
    to: email,
    subject: `🔐 1ticket Staff Access: Your ${role} Account Credentials`,
    html: `
      <div style="background-color: #0c0e14; padding: 30px; font-family: Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #121622; border: 1px solid #d4af37; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f6c042, #ca8a04); padding: 20px; text-align: center; color: #000000;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800;">1ticket Staff Portal Access</h1>
            <p style="margin: 4px 0 0; font-weight: 600; font-size: 13px;">OFFICIAL INVITATION</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>
            <p style="color: #9ca3af; line-height: 1.6;">You have been granted <strong>${role}</strong> access on the 1ticket platform. Here are your sign-in details:</p>
            <div style="background-color: #181d2c; border: 1px dashed #f6c042; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 6px; color: #9ca3af; font-size: 13px;">PORTAL URL: <strong style="color: #ffffff;">http://localhost:5174 (Staff Portal)</strong></p>
              <p style="margin: 0 0 6px; color: #9ca3af; font-size: 13px;">EMAIL: <strong style="color: #ffffff;">${email}</strong></p>
              <p style="margin: 0 0 6px; color: #9ca3af; font-size: 13px;">TEMPORARY PASSWORD: <strong style="color: #f6c042; font-family: monospace; font-size: 16px;">${defaultPassword}</strong></p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">ROLE: <strong style="color: #34d399;">${role.toUpperCase()}</strong></p>
            </div>
            <p style="color: #9ca3af; font-size: 13px;">Please log in using these credentials to manage tickets, bookings, and live camera verifications.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ [Coordinator Invitation Dispatched] Credentials sent to ${email}:`, info.messageId || 'OK');
      return { success: true, messageId: info.messageId };
    }
  } catch (err) {
    console.warn(`⚠️ Error sending coordinator email to ${email}:`, err.message);
  }
  return { success: true };
}
