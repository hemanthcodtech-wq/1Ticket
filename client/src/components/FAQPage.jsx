import React, { useState } from 'react';
import TypewriterHeader from './TypewriterHeader';
import {
  HelpCircle,
  ChevronDown,
  Sparkles,
  Search,
  Tag,
  Gift,
  CreditCard,
  UserCheck,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ 0: true }); // first open by default
  const [activeCategory, setActiveCategory] = useState('All');

  const faqData = [
    {
      category: 'About 1ticket',
      icon: <HelpCircle size={18} color="#f6c042" />,
      questions: [
        {
          id: 1,
          q: '1. What is 1ticket?',
          a: '1ticket is an online platform for discovering and purchasing eligible promotional coupons and offers, subject to the terms published for each campaign.'
        },
        {
          id: 2,
          q: '2. What types of offers are available?',
          a: 'Offers may include villa-related promotions, property booking benefits, construction offers, vehicle gift promotions, painting courses, training kits, and seasonal campaigns.'
        },
        {
          id: 3,
          q: '3. Are all offers available throughout the year?',
          a: 'No. Some offers may be available only during a specific campaign period or while the stated allocation lasts. Please check the individual offer page.'
        }
      ]
    },
    {
      category: 'Coupons and Purchases',
      icon: <Tag size={18} color="#f6c042" />,
      questions: [
        {
          id: 4,
          q: '4. How can I purchase a coupon?',
          a: 'Select an available offer, review its details, sign in or register if required, and follow the checkout process.'
        },
        {
          id: 5,
          q: '5. How much does a coupon cost?',
          a: 'The price depends on the selected offer. The applicable price should be displayed on the offer page and confirmed at checkout before payment.'
        },
        {
          id: 6,
          q: '6. Will I receive my coupon immediately?',
          a: 'Coupons are made available after the order and payment have been verified, subject to the relevant offer\'s processing requirements.'
        },
        {
          id: 7,
          q: '7. Where can I find my coupon?',
          a: 'Sign in to your account and visit My Coupons or your order history, where supported.'
        },
        {
          id: 8,
          q: '8. Can I buy more than one coupon?',
          a: 'That depends on the offer. Purchase limits, duplicate purchases, and per-customer restrictions will be specified in the applicable campaign terms.'
        },
        {
          id: 9,
          q: '9. Can I transfer my coupon to another person?',
          a: 'Coupons are transferable only if the specific offer terms permit transfer. Contact support before attempting a transfer.'
        },
        {
          id: 10,
          q: '10. Can I use a coupon after its expiry date?',
          a: 'Expired coupons cannot ordinarily be redeemed unless the offer terms or applicable law provide otherwise.'
        }
      ]
    },
    {
      category: 'Lucky Dip and Promotional Offers',
      icon: <Gift size={18} color="#f6c042" />,
      questions: [
        {
          id: 11,
          q: '11. Does buying a Lucky Dip Villa Coupon guarantee that I will win a villa?',
          a: 'No, not unless the specific offer explicitly states that the purchase itself entitles you to the villa. For a draw-based campaign, participation and any prize entitlement depend on the published rules, eligibility, valid entry requirements, and applicable law.'
        },
        {
          id: 12,
          q: '12. How does the Lucky Dip work?',
          a: 'The procedure, entry criteria, campaign dates, winner-selection process, prize details, notification method, and claim deadline must be stated in the official rules for the particular campaign.'
        },
        {
          id: 13,
          q: '13. How will winners be announced?',
          a: 'If the campaign includes a prize draw, the official rules will explain how and where verified results are announced and how selected participants are contacted.'
        },
        {
          id: 14,
          q: '14. Is the Baleno car gift guaranteed?',
          a: 'Only if the applicable offer explicitly promises a car to every qualifying customer and the stated conditions are met. If it is a prize or draw-based offer, the published campaign rules apply.'
        },
        {
          id: 15,
          q: '15. What is the Villa Booking Benefit?',
          a: 'It is a promotional offer associated with eligible villa bookings. The exact benefits, including any advertised plot exchange or discount, depend on the approved offer terms, property availability, eligibility, and applicable agreements.'
        },
        {
          id: 16,
          q: '16. Is the advertised construction rate applicable to every project?',
          a: 'Not necessarily. The rate may depend on project specifications, materials, location, scope of work, and other conditions. Confirm the written quotation and inclusions with the responsible provider.'
        },
        {
          id: 17,
          q: '17. Does the Tanjore Painting Course include a free kit?',
          a: 'The course and kit inclusions will be stated on the relevant offer page. Any eligibility, delivery, course schedule, or other conditions must be checked before purchase.'
        }
      ]
    },
    {
      category: 'Payments and Refunds',
      icon: <CreditCard size={18} color="#f6c042" />,
      questions: [
        {
          id: 18,
          q: '18. Which payment methods are accepted?',
          a: 'Available payment methods are displayed at checkout and may depend on the payment provider.'
        },
        {
          id: 19,
          q: '19. What should I do if money is deducted but my order is not confirmed?',
          a: 'Keep your payment reference and order details and contact support. We will check the transaction status with the relevant payment provider.'
        },
        {
          id: 20,
          q: '20. Are coupon purchases refundable?',
          a: 'Refund eligibility depends on the specific offer, the published refund policy, the transaction status, and applicable law. No policy excludes rights that cannot legally be waived.'
        },
        {
          id: 21,
          q: '21. How long does a refund take?',
          a: 'Approved refunds are processed through the applicable payment channel. The time taken for the funds to appear depends on the payment provider and the customer\'s bank.'
        }
      ]
    },
    {
      category: 'Accounts and Support',
      icon: <UserCheck size={18} color="#f6c042" />,
      questions: [
        {
          id: 22,
          q: '22. What if I forget my password?',
          a: 'Use the password recovery option, if available, or contact support for assistance.'
        },
        {
          id: 23,
          q: '23. Can I change my registered contact details?',
          a: 'You may update supported profile details through your account or request assistance from support. Verification may be required.'
        },
        {
          id: 24,
          q: '24. How can I contact 1ticket?',
          a: 'Use the contact information and support channels published on this website.'
        },
        {
          id: 25,
          q: '25. What should I do if I notice incorrect offer information?',
          a: 'Contact support and provide the offer name, relevant screenshots, and any order or coupon reference. We will review the information.'
        },
        {
          id: 26,
          q: '26. Where can I read the rules for a specific offer?',
          a: 'Open the offer details page and review its terms, eligibility requirements, validity, redemption instructions, and any linked official campaign rules.'
        },
        {
          id: 27,
          q: '27. Can 1ticket change or withdraw an offer?',
          a: 'Offers may be updated, suspended, or withdrawn in accordance with their published terms and applicable law. Existing confirmed purchases will be handled according to the applicable terms and legal obligations.'
        },
        {
          id: 28,
          q: '28. How can I stay informed about new offers?',
          a: 'Visit the website regularly or opt in to promotional communications where that option is available.'
        }
      ]
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter questions
  const filteredData = faqData.map(group => {
    const matchedQuestions = group.questions.filter(item => {
      const matchSearch = searchQuery.trim() === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'All' || group.category === activeCategory;
      return matchSearch && matchCategory;
    });
    return { ...group, questions: matchedQuestions };
  }).filter(group => group.questions.length > 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 24px 60px' }}>
      {/* FAQ Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(246, 192, 66, 0.1)',
          border: '1px solid rgba(246, 192, 66, 0.3)',
          padding: '6px 16px',
          borderRadius: '20px',
          color: '#f6c042',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} />
          <span>Help & Clarity Center</span>
        </div>

        <TypewriterHeader
          as="h1"
          segments={[
            { text: 'Frequently Asked ' },
            { text: 'Questions', className: 'gold-gradient-text' }
          ]}
          speed={45}
          delay={180}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '14px'
          }}
        />

        <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
          Find detailed answers to questions regarding coupons, promotional draws, booking benefits, payments, and account support on 1ticket.
        </p>

        {/* Search input */}
        <div style={{
          background: '#0d1017',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '40px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '560px',
          margin: '0 auto',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)'
        }}>
          <Search size={18} color="#f6c042" />
          <input
            type="text"
            placeholder="Search questions or keywords (e.g. Baleno, Villa, Refund, Expiry)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '36px'
      }}>
        {['All', 'About 1ticket', 'Coupons and Purchases', 'Lucky Dip and Promotional Offers', 'Payments and Refunds', 'Accounts and Support'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: activeCategory === cat ? '#f6c042' : 'rgba(255, 255, 255, 0.04)',
              color: activeCategory === cat ? '#000000' : '#d1d5db',
              border: activeCategory === cat ? '1px solid #f6c042' : '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {filteredData.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            background: '#0d1017',
            borderRadius: '12px',
            border: '1px dashed rgba(212, 175, 55, 0.3)'
          }}>
            <p style={{ color: '#9ca3af', margin: '0 0 12px' }}>No questions match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="btn-gold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          filteredData.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
              }}>
                <div style={{
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'rgba(246, 192, 66, 0.1)'
                }}>
                  {group.icon}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: '#f6c042',
                  margin: 0
                }}>
                  {group.category}
                </h2>
                <span style={{
                  fontSize: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  color: '#9ca3af'
                }}>
                  {group.questions.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.questions.map((item) => {
                  const isOpen = !!openItems[item.id];
                  return (
                    <div
                      key={item.id}
                      style={{
                        background: isOpen ? '#10141f' : '#0d1017',
                        border: isOpen ? '1px solid rgba(246, 192, 66, 0.45)' : '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        boxShadow: isOpen ? '0 8px 24px rgba(0, 0, 0, 0.4)' : 'none'
                      }}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          background: 'transparent',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{
                          fontSize: '0.98rem',
                          fontWeight: 700,
                          color: isOpen ? '#f6c042' : '#ffffff',
                          lineHeight: 1.4
                        }}>
                          {item.q}
                        </span>
                        <div style={{
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          color: isOpen ? '#f6c042' : '#9ca3af',
                          flexShrink: 0
                        }}>
                          <ChevronDown size={18} />
                        </div>
                      </button>

                      {isOpen && (
                        <div style={{
                          padding: '0 20px 18px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          paddingTop: '14px',
                          color: '#d1d5db',
                          fontSize: '0.9rem',
                          lineHeight: 1.6
                        }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Support callout at bottom */}
      <div style={{
        marginTop: '50px',
        padding: '24px 30px',
        background: 'rgba(246, 192, 66, 0.05)',
        border: '1px solid rgba(246, 192, 66, 0.25)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(246, 192, 66, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6c042'
          }}>
            <PhoneCall size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#ffffff', margin: '0 0 2px' }}>
              Still have questions about an offer?
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af' }}>
              Our dedicated customer support team is available 24/7 to assist with coupon queries.
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Support Contact: support@1ticket.com | Toll-Free: 1800-1TICKET')}
          className="btn-gold"
          style={{ padding: '9px 20px', fontSize: '0.86rem' }}
        >
          Contact 1ticket Support
        </button>
      </div>
    </div>
  );
}
