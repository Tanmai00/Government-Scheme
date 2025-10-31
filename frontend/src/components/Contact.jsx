import { useState, useEffect } from 'react';
// MODIFIED: Corrected import path
import { useAuth } from '../contexts/AuthContext.jsx';
// MODIFIED: Added all icons for sidebar and contact info
import { 
  User, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  AlertCircle // For the notice
} from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT REDESIGN, USER-THEME) ---
const colors = {
  primary: '#2563EB',        // Blue-600 (Brand)
  primaryDark: '#1D4ED8',     // Blue-700 (Brand Hover)
  primaryLight: '#EFF6FF',    // Blue-50 (Brand Light BG)
  
  textPrimary: '#1F2937',     // Gray-800 (Titles)
  textSecondary: '#4B5563',   // Gray-600 (Body)
  textMuted: '#6B7280',       // Gray-500 (Subtitles)
  
  background: '#F9FAFB',      // Gray-50 (Page BG)
  card: '#FFFFFF',          // White (Card BG)
  border: '#E5E7EB',        // Gray-200 (Borders)
  
  danger: '#DC2626',         // Red-700
  dangerLight: '#FEF2F2',     // Red-50
  
  warning: '#D97706',        // Yellow-700
  warningLight: '#FFFBEB',    // Yellow-50
  warningText: '#B45309',     // Yellow-800
};

const styles = {
  // --- Layout ---
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: colors.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  sidebar: {
    width: '240px',
    backgroundColor: colors.card,
    borderRight: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    boxSizing: 'border-box',
    flexShrink: 0,
  },
  mainContent: {
    flex: 1,
    padding: '2.5rem',
    maxHeight: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  
  // --- Sidebar ---
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  sidebarLogoIcon: {
    width: 28,
    height: 28,
    color: colors.primary,
  },
  sidebarLogoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.primary,
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    color: colors.textSecondary,
    fontWeight: '500',
    transition: 'background-color 0.15s, color 0.15s',
  },
  sidebarLinkIcon: {
    width: 20,
    height: 20,
  },
  sidebarLinkActive: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  sidebarFooter: {
    marginTop: 'auto',
    borderTop: `1px solid ${colors.border}`,
    paddingTop: '1.5rem',
  },
  sidebarUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
  },
  sidebarUserIcon: {
    width: 24,
    height: 24,
    color: colors.textMuted,
  },
  sidebarUserName: {
    color: colors.textSecondary,
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    color: colors.danger,
    background: 'none',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  logoutButtonHover: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  
  // --- Main Content ---
  header: {
    marginBottom: '2rem',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '1.5rem',
  },
  headerTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: '1rem',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  cardContent: {
    padding: '1.5rem',
  },
  
  // --- Contact List ---
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  contactIcon: {
    width: 20,
    height: 20,
    color: colors.primary,
    marginTop: 4,
    flexShrink: 0,
  },
  contactLabel: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '0.25rem',
  },
  contactText: {
    color: colors.textSecondary,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  contactSubtext: {
    color: colors.textMuted,
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  
  // --- FAQ Section ---
  faqBanner: {
    marginTop: '2rem',
    backgroundColor: colors.primary,
    color: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  faqTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  faqItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  faqQuestion: {
    fontWeight: '600',
  },
  faqAnswer: {
    color: colors.primaryLight,
    fontSize: '0.875rem',
    opacity: 0.9,
    lineHeight: 1.5,
  },

  // --- Notice Box ---
  noticeBox: {
    marginTop: '2rem',
    backgroundColor: colors.warningLight,
    borderLeft: `4px solid ${colors.warning}`,
    padding: '1.5rem',
    display: 'flex',
    gap: '0.75rem',
  },
  noticeIcon: {
    width: 20,
    height: 20,
    color: colors.warningText,
    flexShrink: 0,
  },
  noticeTitle: {
    fontWeight: '600',
    color: colors.warningText,
    marginBottom: '0.5rem',
  },
  noticeText: {
    color: colors.textSecondary,
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
};
// --- END OF STYLES ---

// --- Data for Contact Page ---
const contactMethods = [
  {
    icon: Phone,
    label: 'Toll-Free Number',
    text: '1800-425-2627',
    subtext: 'Available 24/7 for all queries.'
  },
  {
    icon: Mail,
    label: 'Email Support',
    text: 'support@apschemes.gov.in',
    subtext: 'Response within 24 business hours.'
  },
  {
    icon: Clock,
    label: 'Office Hours',
    text: 'Monday - Friday: 10:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM',
    subtext: 'Closed on Sundays and public holidays.'
  },
  {
    icon: MapPin,
    label: 'Head Office',
    text: 'Department of Welfare\nGovernment of Andhra Pradesh\nAmaravati, AP - 522503',
    subtext: null
  },
];

const faqItems = [
  { q: 'How do I apply for a scheme?', a: 'Browse the schemes section, check eligibility, and fill the online application form with required documents.' },
  { q: 'How long does approval take?', a: 'Most applications are reviewed within 15-30 working days. You can track status in your profile.' },
  { q: 'What documents do I need?', a: 'Required documents vary by scheme. Check the scheme details page for specific requirements.' },
  { q: 'Can I apply for multiple schemes?', a: 'Yes, you can apply for any scheme you are eligible for. Each application is reviewed independently.' },
];

// --- Sidebar Component ---
const Sidebar = ({ userProfile, handleLogout, activeLink, hover, setHover }) => {
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === activeLink && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== activeLink && { backgroundColor: colors.background })
  });

  const getUserLinkStyle = () => ({
    ...styles.sidebarUser,
    ...(activeLink === 'Profile' && { backgroundColor: colors.primaryLight }),
    ...(hover.type === 'link' && hover.id === 'Profile' && activeLink !== 'Profile' && { backgroundColor: colors.background })
  });

  const getLogoutStyle = () => ({
    ...styles.logoutButton,
    ...(hover.type === 'button' && hover.id === 'logout' && styles.logoutButtonHover)
  });

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarLogo}>
        <svg style={styles.sidebarLogoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m6-4h1m-1 4h1m-1-8h1m-1 4h1m-1 4h1" />
        </svg>
        <h1 style={{ ...styles.sidebarLogoText, color: colors.primary }}>AP Scheme Portal</h1>
      </div>
      <nav style={styles.sidebarNav}>
        <a 
          href="/user/home" 
          style={getSidebarLinkStyle('Home')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Home' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <LayoutDashboard style={styles.sidebarLinkIcon} />
          <span>Home</span>
        </a>
        <a 
          href="/user/schemes" 
          style={getSidebarLinkStyle('Schemes')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Schemes' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <BookOpen style={styles.sidebarLinkIcon} />
          <span>Schemes</span>
        </a>
        <a 
          href="/user/eligibility" 
          style={getSidebarLinkStyle('Eligibility')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Eligibility' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <CheckCircle style={styles.sidebarLinkIcon} />
          <span>Check Eligibility</span>
        </a>
        <a 
          href="/user/contact" 
          style={getSidebarLinkStyle('Contact')}
          onMouseEnter={() => setHover({ type: 'link', id: 'Contact' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <Phone style={styles.sidebarLinkIcon} />
          <span>Contact</span>
        </a>
      </nav>
      
      <div style={styles.sidebarFooter}>
        <a 
          href="/user/profile"
          style={getUserLinkStyle()}
          onMouseEnter={() => setHover({ type: 'link', id: 'Profile' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <User style={{...styles.sidebarUserIcon, ...(activeLink === 'Profile' && { color: colors.primary })}} />
          <span style={{...styles.sidebarUserName, ...(activeLink === 'Profile' && { color: colors.primary })}}>
            {userProfile?.username}
          </span>
        </a>
        <button
          onClick={handleLogout}
          style={getLogoutStyle()}
          onMouseEnter={() => setHover({ type: 'button', id: 'logout' })}
          onMouseLeave={() => setHover({ type: null, id: null })}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};


// --- Main Component ---
export default function Contact() {
  const { userProfile, signOut } = useAuth();
  const [hover, setHover] = useState({ type: null, id: null });

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div style={styles.layout}>
      {/* --- Sidebar --- */}
      <Sidebar 
        userProfile={userProfile}
        handleLogout={handleLogout}
        activeLink="Contact"
        hover={hover}
        setHover={setHover}
      />
      
      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>Contact Us</h2>
          <p style={styles.headerSubtitle}>
            Need help? Reach out to our state helpline for any questions or support.
          </p>
        </header>

        {/* --- Contact Info Card --- */}
        <div style={{ ...styles.card, marginBottom: '2rem' }}>
          <h3 style={styles.cardTitle}>State Helpline Information</h3>
          <div style={styles.cardContent}>
            <div style={styles.contactList}>
              {contactMethods.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={styles.contactItem}>
                    <Icon style={styles.contactIcon} />
                    <div>
                      <h4 style={styles.contactLabel}>{item.label}</h4>
                      <p style={{...styles.contactText, whiteSpace: 'pre-line'}}>{item.text}</p>
                      {item.subtext && <p style={styles.contactSubtext}>{item.subtext}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* --- FAQ Section --- */}
        <div style={styles.faqBanner}>
          <h3 style={styles.faqTitle}>Frequently Asked Questions</h3>
          <div style={styles.faqGrid}>
            {faqItems.map((item, index) => (
              <div key={index} style={styles.faqItem}>
                <h4 style={styles.faqQuestion}>{item.q}</h4>
                <p style={styles.faqAnswer}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* --- Important Notice --- */}
        <div style={styles.noticeBox}>
          <AlertCircle style={styles.noticeIcon} />
          <div>
            <h4 style={styles.noticeTitle}>Important Notice</h4>
            <p style={styles.noticeText}>
              This is an official government portal. Beware of fraudulent websites and agents asking for money.
              All services on this portal are completely free. Never share your password or OTP with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}