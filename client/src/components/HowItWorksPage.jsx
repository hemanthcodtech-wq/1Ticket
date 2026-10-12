import React from 'react';
import { motion } from 'framer-motion';
import TypewriterHeader from './TypewriterHeader';
import {
  Compass,
  CheckCircle,
  LogIn,
  CreditCard,
  QrCode,
  Gift,
  Headphones,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  FileCheck,
  Check,
  Ticket,
  ChevronRight,
  Home
} from 'lucide-react';

export default function HowItWorksPage({ onExploreCoupons }) {
  const steps = [
    {
      number: '01',
      title: 'Step 1: Explore Exclusive Offers',
      icon: <Compass size={24} color="#f6c042" />,
      tag: 'Discovery',
      desc: 'Browse our collection of available coupons and promotional campaigns, including:',
      items: [
        'Lucky Dip Villa Coupon',
        'Villa Booking Benefits',
        'Baleno Car Gift Offers',
        'House Construction Offers',
        'Tanjore Painting Course and Training Kit',
        'Special Festival Promotions'
      ],
      footerNote: 'Every offer has its own price, benefits, eligibility requirements, and terms. Read the details carefully before proceeding.'
    },
    {
      number: '02',
      title: 'Step 2: Select Your Coupon',
      icon: <Ticket size={24} color="#f6c042" />,
      tag: 'Evaluation',
      desc: 'Choose the offer that interests you and open its details page.',
      body: 'Review the coupon price, applicable benefits, validity period, eligibility, redemption process, exclusions, and any additional conditions.',
      footerNote: 'Please confirm that you understand the offer before purchasing.'
    },
    {
      number: '03',
      title: 'Step 3: Register or Sign In',
      icon: <LogIn size={24} color="#f6c042" />,
      tag: 'Authentication',
      desc: 'Create an account or sign in using the available registration options.',
      body: 'Provide accurate contact information so that we can communicate important information about your order, coupon status, and any applicable campaign updates.'
    },
    {
      number: '04',
      title: 'Step 4: Complete Your Purchase',
      icon: <CreditCard size={24} color="#f6c042" />,
      tag: 'Checkout & Payment',
      desc: 'If the selected coupon is available for purchase, follow the checkout instructions and complete the payment using the payment methods displayed on the website.',
      body: 'Your order will be processed after the payment status has been verified. A payment receipt or order confirmation will be provided according to the available checkout functionality.'
    },
    {
      number: '05',
      title: 'Step 5: Access Your Coupon',
      icon: <QrCode size={24} color="#f6c042" />,
      tag: 'Instant Pass',
      desc: 'After successful confirmation, visit the My Coupons section of your account to view your coupon details.',
      body: 'Depending on the offer, the coupon may include a unique coupon ID, QR code, validity period, redemption instructions, or other identifying information.',
      warning: 'Keep your coupon details secure and do not share private redemption information with unauthorized persons.'
    },
    {
      number: '06',
      title: 'Step 6: Redeem or Participate According to the Offer',
      icon: <Gift size={24} color="#f6c042" />,
      tag: 'Redemption & Draws',
      desc: 'Each coupon may follow a different process.',
      body: 'Some offers may require direct redemption, a qualifying villa booking, a construction agreement, course registration, or participation in a separately defined promotional campaign. Follow the instructions and eligibility conditions published for your specific coupon.',
      footerNote: 'A coupon purchase does not automatically guarantee a prize, property allocation, vehicle gift, cash benefit, or discount unless the published offer explicitly confirms that entitlement.'
    },
    {
      number: '07',
      title: 'Step 7: Get Assistance When Needed',
      icon: <Headphones size={24} color="#f6c042" />,
      tag: '24/7 Support',
      desc: 'If you have questions about an offer, payment, coupon status, or redemption, contact our support team through the contact details published on this website.',
      footerNote: 'Please include your order ID or coupon ID when contacting us, where applicable.'
    }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '30px 24px 60px' }}>
      {/* Hero Header Section */}
      <section style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        marginBottom: '48px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Background Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src="/coupons/how_it_works_banner.jpg"
            alt="How 1ticket Works"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(6, 7, 9, 0.96) 0%, rgba(6, 7, 9, 0.88) 50%, rgba(6, 7, 9, 0.6) 100%)'
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 48px',
          maxWidth: '820px'
        }}>
          {/* Breadcrumb / Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(246, 192, 66, 0.1)',
            border: '1px solid rgba(246, 192, 66, 0.3)',
            padding: '5px 14px',
            borderRadius: '20px',
            color: '#f6c042',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '18px'
          }}>
            <Sparkles size={14} />
            <span>How 1ticket Works • Official Guide</span>
          </div>

          <TypewriterHeader
            as="h1"
            segments={[
              { text: 'Discover Offers. ' },
              { text: 'Unlock Benefits. ', className: 'gold-gradient-text' },
              { text: 'Make Every Purchase Count.' }
            ]}
            speed={38}
            delay={180}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
              lineHeight: 1.2,
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '18px'
            }}
          />

          <p style={{
            color: '#e5e7eb',
            fontSize: '1.02rem',
            lineHeight: 1.6,
            marginBottom: '14px'
          }}>
            Welcome to 1ticket, your destination for discovering exclusive promotional coupons, property-related offers, lifestyle benefits, and special campaigns.
          </p>

          <p style={{
            color: '#9ca3af',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            marginBottom: '28px'
          }}>
            Our goal is to make it easy for you to explore available offers, understand their terms, purchase eligible coupons where applicable, and manage your coupon details in one convenient place.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onExploreCoupons}
              className="btn-gold"
              style={{ padding: '11px 26px', fontSize: '0.92rem' }}
            >
              <span>Explore Available Coupons</span>
              <ArrowRight size={16} />
            </button>
            <a
              href="#steps-timeline"
              className="btn-gold-outline"
              style={{ textDecoration: 'none', padding: '11px 22px' }}
            >
              <span>View Step-by-Step Guide</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7 Interactive Steps Timeline */}
      <section id="steps-timeline" style={{ marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.1rem',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            Seven Simple Steps to <span className="gold-gradient-text">Your Rewards</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Follow our verified transparent journey from coupon discovery to final reward redemption.
          </p>
        </div>

        {/* Animated Connecting Gold Line (Desktop) */}
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto 36px', height: '2px', background: 'rgba(212, 175, 55, 0.15)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #f6c042, transparent)',
              boxShadow: '0 0 12px #f6c042'
            }}
          />
        </div>

        {/* Steps Grid with Staggered Scroll-Triggered Entrance */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '24px'
        }}>
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, borderColor: 'rgba(246, 192, 66, 0.7)' }}
              className="coupon-card"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                background: '#0d1017',
                borderRadius: '14px',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease'
              }}
            >
              <div>
                {/* Top Badge & Number */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(246, 192, 66, 0.12)',
                      border: '1px solid rgba(246, 192, 66, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {step.icon}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#f6c042',
                      background: 'rgba(246, 192, 66, 0.08)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}>
                      {step.tag}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: 'rgba(212, 175, 55, 0.4)'
                  }}>
                    {step.number}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '12px',
                  lineHeight: 1.3
                }}>
                  {step.title}
                </h3>

                {/* Main description */}
                <p style={{
                  color: '#d1d5db',
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  marginBottom: '12px'
                }}>
                  {step.desc}
                </p>

                {/* Items bullet points if available */}
                {step.items && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '14px'
                  }}>
                    {step.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        color: '#f3f4f6',
                        padding: '4px 0'
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f6c042' }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Secondary body text */}
                {step.body && (
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    marginBottom: '14px'
                  }}>
                    {step.body}
                  </p>
                )}

                {/* Warning callout */}
                {step.warning && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    marginBottom: '12px'
                  }}>
                    {step.warning}
                  </div>
                )}
              </div>

              {/* Footer Note */}
              {step.footerNote && (
                <div style={{
                  borderTop: '1px dashed rgba(212, 175, 55, 0.25)',
                  paddingTop: '12px',
                  marginTop: '12px',
                  fontSize: '0.76rem',
                  color: '#d4af37',
                  fontStyle: 'italic',
                  lineHeight: 1.45
                }}>
                  {step.footerNote}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust & Transparency Feature Card matching Content */}
      <section className="how-it-works-trust-banner" style={{
        background: 'linear-gradient(135deg, #10131d 0%, #0a0c12 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '16px',
        padding: 'clamp(20px, 4vw, 40px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '32px',
        alignItems: 'center',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f6c042',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}>
            <ShieldCheck size={18} />
            <span>Transparency & Verification</span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: '#ffffff',
            marginBottom: '14px'
          }}>
            Your Trust <span className="gold-gradient-text">Matters</span>
          </h2>

          <p style={{
            color: '#d1d5db',
            fontSize: '0.98rem',
            lineHeight: 1.6,
            marginBottom: '16px'
          }}>
            At 1ticket, we aim to provide clear offer information, transparent pricing, secure payment processing, and accessible customer support.
          </p>

          <p style={{
            color: '#9ca3af',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            Always review the applicable offer terms before purchasing a coupon.
          </p>

          {/* Highlight Quote */}
          <div style={{
            background: 'rgba(246, 192, 66, 0.08)',
            borderLeft: '4px solid #f6c042',
            borderRadius: '0 8px 8px 0',
            padding: '16px 20px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.01em'
            }}>
              Explore an offer. Understand the terms. Make an informed decision.
            </p>
          </div>

          <button
            onClick={onExploreCoupons}
            className="btn-gold"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <span>Start Exploring Coupons Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 3D Trust Shield Illustration */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(246, 192, 66, 0.2)'
          }}>
            <img
              src="/coupons/trust_guarantee.jpg"
              alt="1ticket Trust & Security"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <p style={{
            margin: '10px 0 0',
            fontSize: '0.74rem',
            color: '#9ca3af',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            VERIFIED & AUTHENTIC OFFERS
          </p>
        </div>
      </section>
    </div>
  );
}
