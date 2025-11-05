import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
// MODIFIED: Added LayoutDashboard for the sidebar
import { 
  BookOpen, 
  CheckCircle, 
  Phone, 
  User, 
  LogOut, 
  LayoutDashboard,
  ClipboardList 
} from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT REDESIGN, USER-THEME) ---
const colors = {
  // NEW: User-facing theme is Blue
  primary: '#2563EB',        // Blue-600 (Brand)
  primaryDark: '#1D4ED8',     // Blue-700 (Brand Hover)
  primaryLight: '#EFF6FF',    // Blue-50 (Brand Light BG)
  
  textPrimary: '#1F2937',     // Gray-800 (Titles)
  textSecondary: '#4B5563',   // Gray-600 (Body)
  textMuted: '#6B7280',       // Gray-500 (Subtitles)
  
  background: '#F9FAFB',      // Gray-50 (Page BG)
  card: '#FFFFFF',          // White (Card BG)
  border: '#E5E7EB',        // Gray-200 (Borders)
  
  success: '#059669',        // Green-700
  successLight: '#ECFDF5',    // Green-50

  purple: '#7C3AED',         // Purple-600
  purpleLight: '#F5F3FF',     // Purple-50
  
  danger: '#DC2626',         // Red-700
  dangerLight: '#FEF2F2',     // Red-50
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
  },
  sidebarUserIcon: {
    width: 24,
    height: 24,
    color: colors.textMuted,
  },
  sidebarUserName: {
    color: colors.textSecondary,
    fontWeight: '500',
    // Truncate if too long
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
    marginBottom: '2.5rem',
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
  
  // --- 3-Column Action Grid ---
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  actionCard: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
  },
  actionCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  actionCardIcon: {
    width: 24,
    height: 24,
  },
  actionCardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
  },
  actionCardText: {
    color: colors.textSecondary,
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  actionCardLink: {
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'gap 0.15s',
  },
  
  // --- "How It Works" CTA Banner ---
  ctaBanner: {
    marginTop: '2.5rem',
    backgroundColor: colors.primary,
    color: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  ctaTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  ctaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
  },
  ctaStep: {
    textAlign: 'center',
  },
  ctaStepNumber: {
    backgroundColor: 'white',
    color: colors.primary,
    width: 48,
    height: 48,
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.75rem',
    fontWeight: '700',
    fontSize: '1.25rem',
  },
  ctaStepTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  ctaStepText: {
    fontSize: '0.875rem',
    color: colors.primaryLight,
    opacity: 0.9,
    lineHeight: 1.5,
  },

  // --- Category Card ---
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
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.5rem',
    padding: '1.5rem',
  },
  categoryBox: {
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    padding: '1.5rem',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  categoryBoxHover: {
    borderColor: colors.primary,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  categoryTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
  },
  categoryText: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
};
// --- END OF STYLES ---

// --- Data for Cards ---
const actionCards = [
  {
    title: 'Browse Schemes',
    text: 'Explore 10+ government welfare schemes including health, education, agriculture, and social security.',
    link: '/user/schemes',
    linkText: 'View All Schemes',
    color: colors.primary,
    bgColor: colors.primaryLight,
    icon: BookOpen
  },
  {
    title: 'Check Eligibility',
    text: 'Answer simple questions to check if you qualify for various government schemes instantly.',
    link: '/user/eligibility',
    linkText: 'Check Now',
    color: colors.success,
    bgColor: colors.successLight,
    icon: CheckCircle
  },
  {
    title: 'Get Support',
    text: 'Need help? Contact our state helpline for assistance with applications or any other queries.',
    link: '/user/contact',
    linkText: 'Contact Us',
    color: colors.purple,
    bgColor: colors.purpleLight,
    icon: Phone
  }
];

const categories = [
  { title: 'Healthcare', text: 'Free health insurance and medical support' },
  { title: 'Education', text: 'Fee reimbursement and scholarships' },
  { title: 'Agriculture', text: 'Farmer support and crop insurance' },
  { title: 'Social Welfare', text: 'Pensions and financial assistance' },
  { title: 'Housing', text: 'Home construction assistance' },
  { title: 'Women Welfare', text: 'Empowerment and support programs' },
  { title: 'Business Support', text: 'Interest-free loans for small traders' },
  { title: 'More Schemes', text: 'Browse all available programs' },
];

const howItWorksSteps = [
  { title: 'Browse Schemes', text: 'Explore available government welfare programs' },
  { title: 'Check Eligibility', text: 'Verify if you qualify for the scheme' },
  { title: 'Apply Online', text: 'Fill the form and submit documents' },
  { title: 'Track Status', text: 'Monitor your application progress' },
];

export default function UserHome() {
  const { userProfile, signOut } = useAuth();
  // State for hover effects
  const [hover, setHover] = useState({ type: null, id: null });

  const handleLogout = async () => {
    await signOut();
  };
  
  // --- Dynamic Styles for Hover ---
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === 'Home' && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== 'Home' && { backgroundColor: colors.background })
  });

  const getLogoutStyle = () => ({
    ...styles.logoutButton,
    ...(hover.type === 'button' && hover.id === 'logout' && styles.logoutButtonHover)
  });
  
  const getActionLinkStyle = (color) => ({
    ...styles.actionCardLink,
    color: color,
    ...(hover.type === 'actionLink' && hover.id === color && { gap: '0.5rem' }) // Move arrow on hover
  });
  
  const getCategoryBoxStyle = (id) => ({
    ...styles.categoryBox,
    ...(hover.type === 'category' && hover.id === id && styles.categoryBoxHover)
  });

  return (
    <div style={styles.layout}>
      {/* --- Sidebar --- */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <svg style={styles.sidebarLogoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m6-4h1m-1 4h1m-1-8h1m-1 4h1m-1 4h1m-1-8h1" />
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
          <a 
            href="/user/applied-schemes" 
            style={getSidebarLinkStyle('AppliedSchemes')}
            onMouseEnter={() => setHover({ type: 'link', id: 'AppliedSchemes' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            <ClipboardList style={styles.sidebarLinkIcon} />
            <span>Applied Schemes</span>
          </a>
        </nav>
        
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarUser}>
            <User style={styles.sidebarUserIcon} />
            <span style={styles.sidebarUserName}>{userProfile?.username}</span>
          </div>
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
      
      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>
            Welcome, {userProfile?.username}!
          </h2>
          <p style={styles.headerSubtitle}>
            Access welfare schemes, check eligibility, and apply online
          </p>
        </header>

        {/* --- 3-Column Action Grid --- */}
        <div style={styles.actionGrid}>
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} style={styles.actionCard}>
                <div style={{ ...styles.actionCardIconContainer, backgroundColor: card.bgColor }}>
                  <Icon style={{ ...styles.actionCardIcon, color: card.color }} />
                </div>
                <h3 style={styles.actionCardTitle}>{card.title}</h3>
                <p style={styles.actionCardText}>{card.text}</p>
                <a
                  href={card.link}
                  style={getActionLinkStyle(card.color)}
                  onMouseEnter={() => setHover({ type: 'actionLink', id: card.color })}
                  onMouseLeave={() => setHover({ type: null, id: null })}
                >
                  {card.linkText} <span>→</span>
                </a>
              </div>
            );
          })}
        </div>

        {/* --- Category Card --- */}
        <div style={styles.card}>
           <h3 style={styles.cardTitle}>Available Scheme Categories</h3>
           <div style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <div 
                key={index} 
                style={getCategoryBoxStyle(index)}
                onMouseEnter={() => setHover({ type: 'category', id: index })}
                onMouseLeave={() => setHover({ type: null, id: null })}
              >
                <h4 style={styles.categoryTitle}>{category.title}</h4>
                <p style={styles.categoryText}>{category.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- "How It Works" CTA Banner --- */}
        <div style={styles.ctaBanner}>
          <h3 style={styles.ctaTitle}>How It Works</h3>
          <div style={styles.ctaGrid}>
            {howItWorksSteps.map((step, index) => (
              <div key={index} style={styles.ctaStep}>
                <div style={styles.ctaStepNumber}>
                  {index + 1}
                </div>
                <h4 style={styles.ctaStepTitle}>{step.title}</h4>
                <p style={styles.ctaStepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}