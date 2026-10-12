import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Gift,
  Cookie,
  CalendarX,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LegalModal({ activeTab = 'terms', onClose }) {
  const [currentPolicy, setCurrentPolicy] = useState(activeTab);

  const policies = [
    { id: 'terms', name: 'Terms & Conditions', icon: <FileText size={16} /> },
    { id: 'privacy', name: 'Privacy Policy', icon: <ShieldCheck size={16} /> },
    { id: 'refund', name: 'Refund & Cancellation', icon: <RotateCcw size={16} /> },
    { id: 'disclaimer', name: 'Disclaimer', icon: <AlertTriangle size={16} /> },
    { id: 'coupon-policy', name: 'Coupon Redemption', icon: <Gift size={16} /> },
    { id: 'cookie', name: 'Cookie Policy', icon: <Cookie size={16} /> },
    { id: 'campaign-cancel', name: 'Campaign Cancellation', icon: <CalendarX size={16} /> },
    { id: 'shipping', name: 'Shipping & Delivery', icon: <Truck size={16} /> },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1000px',
          width: '95%',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(212, 175, 55, 0.05)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f6c042, #ca8a04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>
                1ticket Legal, Policies & Trust Center
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#9ca3af' }}>
                Comprehensive terms, user rights, data privacy and statutory disclosures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-gold-outline"
            style={{ padding: '5px 14px', fontSize: '0.8rem' }}
          >
            Close
          </button>
        </div>

        {/* Modal Layout: Sidebar & Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Tabs */}
          <div style={{
            width: '260px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#090b10',
            overflowY: 'auto',
            padding: '12px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {policies.map((p) => {
                const isActive = currentPolicy === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPolicy(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(246, 192, 66, 0.14)' : 'transparent',
                      color: isActive ? '#f6c042' : '#9ca3af',
                      border: isActive ? '1px solid rgba(246, 192, 66, 0.35)' : '1px solid transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {p.icon}
                    <span style={{ flex: 1 }}>{p.name}</span>
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Pane */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 36px',
            background: '#0d1017',
            fontSize: '0.9rem',
            lineHeight: 1.68,
            color: '#d1d5db'
          }}>
            {/* 1. Terms and Conditions */}
            {currentPolicy === 'terms' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Terms and Conditions
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <strong>Last Updated:</strong> October 2026
                </p>
                <p>
                  Welcome to 1ticket. These Terms and Conditions govern your access to and use of the 1ticket website, its coupon listings, promotional campaigns, and related services.
                </p>
                <p>
                  By accessing the website or purchasing an offer, you acknowledge that you have read these terms. Where required, your explicit acceptance will be obtained before purchase.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>1. About the Platform</h3>
                <p>
                  1ticket provides an online interface for discovering promotional coupons and offers. The role of 1ticket in each transaction, including whether it acts as a seller, intermediary, authorized agent, or campaign operator, will be disclosed where applicable.
                </p>
                <p>
                  The identity of the responsible seller, promoter, property developer, course provider, or other offer provider will be stated in the relevant offer documentation.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>2. Eligibility</h3>
                <p>
                  You must have the legal capacity required to enter into a binding agreement under applicable law to use paid services or purchase offers.
                </p>
                <p>
                  Certain campaigns may have additional age, residency, identity-verification, or other eligibility requirements. These will be described in the applicable campaign rules.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>3. Account Registration</h3>
                <p>You agree to:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Provide accurate and current registration details.</li>
                  <li>Keep your login credentials confidential.</li>
                  <li>Notify us if you suspect unauthorized access.</li>
                  <li>Avoid creating accounts for fraudulent or prohibited purposes.</li>
                  <li>Keep your profile and contact information updated.</li>
                </ul>
                <p>
                  You are responsible for activities carried out through your account, subject to applicable law and any security obligations that apply to us.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>4. Coupon Listings and Offer Information</h3>
                <p>Each coupon or offer may have separate terms covering:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Coupon price and availability.</li>
                  <li>Benefits and exclusions.</li>
                  <li>Validity and expiry.</li>
                  <li>Redemption procedure.</li>
                  <li>Eligibility requirements.</li>
                  <li>Transferability and purchase limits.</li>
                  <li>Prize conditions, where applicable.</li>
                  <li>Refunds, cancellations, and dispute handling.</li>
                </ul>
                <p>
                  The offer-specific terms should be read together with these general terms. If a specific offer term conflicts with a general term, the issue will be resolved in accordance with applicable law and the terms expressly applicable to that offer.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>5. Pricing and Payment</h3>
                <p>
                  The price payable will be displayed before you confirm your purchase. Applicable taxes, charges, and other mandatory fees will be disclosed where required. Payments may be processed through third-party payment service providers. Payment authorization, settlement, and refund processing may depend on the relevant provider.
                </p>
                <p>
                  An order is considered confirmed only when the platform or responsible seller has verified the transaction and issued the applicable confirmation.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>6. Coupon Issuance and Redemption</h3>
                <p>
                  A coupon may be issued digitally or through another method specified in the offer details. Coupons must be used in accordance with their validity, eligibility, and redemption conditions. Expired, duplicated, altered, fraudulent, or previously redeemed coupons may be rejected, subject to applicable law.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>7. Lucky Dip, Gifts, and Promotional Campaigns</h3>
                <p>
                  Campaigns involving prize draws, villas, vehicles, gifts, or other benefits will be governed by separate official rules. Those rules must explain the campaign structure, eligibility, entry mechanism, prize details, selection procedure, notification, claim requirements, and relevant dates.
                </p>
                <p>
                  Participation does not guarantee a prize unless the offer explicitly provides otherwise. 1ticket will not describe a prize as guaranteed where it is conditional on a draw, selection process, or other qualifying event. Campaigns will be offered only in accordance with applicable law. If a proposed campaign structure is not legally permissible, it must not be launched in that form.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>8. Property and Construction Offers</h3>
                <p>
                  Property-related offers may be subject to property availability, project approvals, separate agreements, payment schedules, applicable taxes, registration charges, and other disclosed conditions. A coupon does not itself constitute a property allotment, sale deed, title document, construction contract, or guarantee of appreciation unless the relevant signed documentation expressly provides otherwise.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>9. User Conduct</h3>
                <p>You must not:</p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Use the website for unlawful or fraudulent activities.</li>
                  <li>Manipulate coupon codes, redemption records, or promotional results.</li>
                  <li>Attempt unauthorized access to accounts or systems.</li>
                  <li>Submit false identity, payment, or eligibility information.</li>
                  <li>Interfere with the security or availability of the platform.</li>
                  <li>Misrepresent an offer or resell it in violation of its terms.</li>
                </ul>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>10. Governing Law & Jurisdiction</h3>
                <p>
                  These terms are subject to the laws of India, to the extent applicable. Jurisdiction and dispute-resolution provisions must be finalized based on the operating entity, its location, and applicable consumer-protection requirements.
                </p>
              </div>
            )}

            {/* 2. Privacy Policy */}
            {currentPolicy === 'privacy' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Privacy Policy
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <strong>Last Updated:</strong> October 2026
                </p>
                <p>
                  1ticket respects your privacy and aims to handle personal information responsibly. This Privacy Policy explains what information may be collected, how it may be used, when it may be shared, and the choices available to you.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>1. Information We Collect</h3>
                <p><strong>Account information:</strong> Name, Email address, Mobile number, Login preferences.</p>
                <p><strong>Order and coupon information:</strong> Order ID, Coupon ID, transaction status, redemption history, support correspondence.</p>
                <p><strong>Payment information:</strong> Payment reference, transaction status. Payment card or bank credentials are processed via designated secure payment gateways and not stored by 1ticket.</p>
                <p><strong>Technical information:</strong> IP address, device & browser metadata, security diagnostics, cookie preferences.</p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>2. How We Use Information</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Create and maintain user accounts.</li>
                  <li>Process orders, payments and deliver coupon vouchers.</li>
                  <li>Verify eligibility and prevent fraud.</li>
                  <li>Administer campaigns and communicate results.</li>
                  <li>Provide customer support and dispute resolution.</li>
                  <li>Maintain platform security and comply with statutory obligations.</li>
                </ul>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>3. Data Security & Rights</h3>
                <p>
                  We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access, loss, alteration, or disclosure. You have the right to request access, correction, or deletion of your personal data subject to applicable laws.
                </p>
              </div>
            )}

            {/* 3. Refund and Cancellation Policy */}
            {currentPolicy === 'refund' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Refund and Cancellation Policy
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <strong>Last Updated:</strong> October 2026
                </p>
                <p>
                  This policy explains how cancellations, failed payments, refund requests, and changes to 1ticket coupon purchases are handled.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>1. Failed or Incomplete Payments</h3>
                <p>
                  If your payment fails or money has been deducted without an order confirmation:
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Keep your payment reference or UPI / Bank transaction ID.</li>
                  <li>Contact support with your transaction details.</li>
                  <li>We verify with the payment provider and process any applicable refund for uncompleted orders.</li>
                </ul>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>2. Duplicate Payments</h3>
                <p>
                  If you have paid more than once for the same order, contact support with the transaction references. Verified duplicate payments will be refunded through the original payment channel.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>3. Prize-Based Campaigns</h3>
                <p>
                  Purchasing or participating in a campaign involving a lucky dip, villa, vehicle, or other prize does not by itself establish a right to a refund if the participant is not selected as a winner, unless the official campaign rules or applicable law provide otherwise.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>4. How to Request a Refund</h3>
                <p>
                  Submit your registered name, Order ID / Coupon ID, payment reference, and reason for request to our official support team. Approved refunds typically reflect in 5-7 business days depending on your bank.
                </p>
              </div>
            )}

            {/* 4. Disclaimer */}
            {currentPolicy === 'disclaimer' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Disclaimer
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <strong>Last Updated:</strong> October 2026
                </p>
                <p>
                  The information published on 1ticket is intended to help visitors understand available coupons, promotions, and related services. Please read the following information together with the terms for the specific offer you intend to purchase.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>1. Offer Information & Illustrations</h3>
                <p>
                  Coupon descriptions, promotional images, advertised prices, benefits, and illustrations are provided to explain the relevant offer. Images of villas, plots, cars, gifts, artwork, and other products may be illustrative. Actual specifications, availability, appearance, and inclusions may vary.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>2. Lucky Dip and Prize Offers</h3>
                <p>
                  A lucky-dip or prize-based promotion is subject to its official rules, eligibility requirements, valid entry conditions, and applicable law. Unless explicitly stated in a legally valid offer, buying a coupon does not guarantee a villa, car, cash reward, plot, or other prize.
                </p>

                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '24px', marginBottom: '8px' }}>3. No Investment Guarantee</h3>
                <p>
                  Nothing on this website should be interpreted as a guarantee of investment returns, property appreciation, resale value, or future financial gain.
                </p>
              </div>
            )}

            {/* 5. Coupon Purchase & Redemption Policy */}
            {currentPolicy === 'coupon-policy' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Coupon Purchase and Redemption Policy
                </h2>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>1. Coupon Purchase & Confirmation</h3>
                <p>
                  Coupons may be purchased through the website where an offer is available for sale. The applicable price, purchase limits, benefits, and eligibility requirements will be displayed before payment. A coupon becomes valid only when it has been officially issued with a unique coupon ID or QR code.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>2. Redemption Procedure</h3>
                <p>
                  To redeem a coupon, follow the instructions on its details page. This may require presenting the coupon, verifying registered contact details, booking an eligible service, or completing another specified step within the stated validity period.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>3. Transfer & Resale Restrictions</h3>
                <p>
                  A coupon may not be transferred or resold unless its specific terms permit it. Altered, duplicated, stolen, or fraudulently obtained coupons may be suspended or rejected.
                </p>
              </div>
            )}

            {/* 6. Cookie Policy */}
            {currentPolicy === 'cookie' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Cookie Policy
                </h2>
                <p>
                  1ticket may use cookies and similar technologies to operate the website, protect user accounts, remember preferences, and understand website performance.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>Types of Cookies Used:</h3>
                <p><strong>Essential cookies:</strong> Support security, authentication, session management, and core website functions.</p>
                <p><strong>Preference cookies:</strong> Remember settings such as language or user preferences.</p>
                <p><strong>Analytics cookies:</strong> Help us understand website usage and optimize page performance.</p>
                <p>You may manage cookies through your browser settings. Disabling essential cookies may affect some platform features.</p>
              </div>
            )}

            {/* 7. Campaign Cancellation */}
            {currentPolicy === 'campaign-cancel' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Campaign Cancellation and Postponement Policy
                </h2>
                <p>
                  1ticket and the responsible campaign operator aim to conduct promotional campaigns according to their published rules. A campaign may need to be postponed, modified, suspended, or cancelled because of legal requirements, operational issues, safety concerns, force majeure events, or other circumstances described in its official terms.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>Where a campaign is materially changed or cancelled:</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  <li>Relevant updates will be published through appropriate communication channels.</li>
                  <li>Customers with affected orders will be informed where reasonably possible.</li>
                  <li>The responsible operator will explain the available options under the campaign rules.</li>
                  <li>Refunds, replacement benefits, or other remedies will be provided where promised by the applicable terms or required by law.</li>
                  <li>Customer rights arising from confirmed purchases will be respected.</li>
                </ul>
              </div>
            )}

            {/* 8. Shipping & Delivery Policy */}
            {currentPolicy === 'shipping' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#f6c042', fontSize: '1.8rem', marginBottom: '8px' }}>
                  Shipping and Delivery Policy
                </h2>
                <p>
                  1ticket primarily provides digital coupon and promotional information through its website. Delivery arrangements depend on the offer purchased.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>Digital Coupons:</h3>
                <p>
                  Coupons are made available digitally in the customer's account under 'My Coupons' or sent to the registered email address immediately upon payment confirmation.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>Physical Products, Kits & Gifts:</h3>
                <p>
                  Offers including tangible items such as the Tanjore Painting Free Training Kit or promotional gift deliverables will specify delivery timelines, address verification methods, and carrier tracking on the offer voucher.
                </p>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: '20px', marginBottom: '8px' }}>Property and Construction Deliverables:</h3>
                <p>
                  Property documentation, site allotments, and construction agreements are conducted through direct developer consultations and registered legal instruments, not standard postal couriers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
