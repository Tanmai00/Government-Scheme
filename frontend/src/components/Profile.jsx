import { useState, useEffect } from 'react';
// MODIFIED: Corrected import paths
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
// MODIFIED: Added all icons for sidebar, cards, and badges
import { 
  User, 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  BookOpen, 
  Phone 
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
  
  success: '#059669',        // Green-700
  successLight: '#ECFDF5',    // Green-50
  successText: '#065F46',     // Green-800

  danger: '#DC2626',         // Red-700
  dangerLight: '#FEF2F2',     // Red-50
  dangerText: '#991B1B',      // Red-800

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
  sidebarUser: { // This is now a link
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden', // for table
  },
  cardContent: {
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  
  // --- Profile Card ---
  profileAvatar: {
    backgroundColor: colors.primaryLight,
    width: 80,
    height: 80,
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  profileAvatarIcon: {
    width: 40,
    height: 40,
    color: colors.primary,
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  profileStatList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  profileStatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '1rem',
    fontSize: '0.875rem',
  },
  profileStatLabel: {
    color: colors.textMuted,
  },
  profileStatValue: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  
  // --- Table ---
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.75rem 1.5rem',
    textAlign: 'left',
    color: colors.textMuted,
    borderBottom: `1px solid ${colors.border}`,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'background-color 0.15s',
  },
  trHover: {
    backgroundColor: colors.background, // Gray-50
  },
  td: {
    padding: '1rem 1.5rem',
    verticalAlign: 'middle',
    color: colors.textSecondary,
    fontSize: '0.875rem',
  },
  tdScheme: {
    fontWeight: '500',
    color: colors.textPrimary,
  },
  tdSchemeCategory: {
    color: colors.textMuted,
    fontSize: '0.75rem',
  },
  adminNotes: {
    fontStyle: 'italic',
    color: colors.textMuted,
  },
  
  // --- Status Badge ---
  badgeBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  badgeIcon: {
    width: 14,
    height: 14,
  },
  
  // --- Empty State ---
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyStateIcon: {
    width: 56,
    height: 56,
    color: colors.border,
    margin: '0 auto 1rem',
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: '1rem',
    marginBottom: '1.5rem',
  },
  emptyStateButton: {
    display: 'inline-block',
    backgroundColor: colors.primary,
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.375rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  }
};
// --- END OF STYLES ---

// --- Helper Function: Status Badge ---
const getStatusBadge = (status) => {
  let styleInfo = {};
  let Icon = Clock;

  switch (status) {
    case 'pending':
      styleInfo = { color: colors.warningText, backgroundColor: colors.warningLight };
      Icon = Clock;
      break;
    case 'approved':
      styleInfo = { color: colors.successText, backgroundColor: colors.successLight };
      Icon = CheckCircle;
      break;
    case 'rejected':
      styleInfo = { color: colors.dangerText, backgroundColor: colors.dangerLight };
      Icon = XCircle;
      break;
    default:
      styleInfo = { color: colors.textMuted, backgroundColor: colors.border };
  }

  return (
    <span style={{ ...styles.badgeBase, ...styleInfo }}>
      <Icon style={styles.badgeIcon} />
      <span>{status}</span>
    </span>
  );
};

// --- Sidebar Component (Modified for Profile) ---
const Sidebar = ({ userProfile, handleLogout, activeLink, hover, setHover }) => {
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === activeLink && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== activeLink && { backgroundColor: colors.background })
  });

  // NEW: Style for the user profile link in the footer
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
        {/* MODIFIED: This is now a link */}
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
export default function Profile() {
  const { userProfile, signOut } = useAuth();
  const [applications, setApplications] = useState([]);
  const [hover, setHover] = useState({ type: null, id: null });

  useEffect(() => {
    loadApplications();
  }, [userProfile]);

  const loadApplications = async () => {
    if (!userProfile) return;
    try {
      // This path is correct per your server.js
      const data = await api.get('/api/me/applications');
      setApplications(data || []);
    } catch (_) {
      setApplications([]);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };
  
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div style={styles.layout}>
      {/* --- Sidebar --- */}
      <Sidebar 
        userProfile={userProfile}
        handleLogout={handleLogout}
        activeLink="Profile" // This is the active page
        hover={hover}
        setHover={setHover}
      />
      
      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>My Profile</h2>
          <p style={styles.headerSubtitle}>View your account details and application history</p>
        </header>

        <div style={styles.contentGrid}>
          
          {/* --- Left Column: User Profile Card --- */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={styles.card}>
              <div style={styles.cardContent}>
                <div style={styles.profileAvatar}>
                  <User style={styles.profileAvatarIcon} />
                </div>

                <h3 style={styles.profileName}>
                  {userProfile?.username}
                </h3>

                <div style={styles.profileStatList}>
                  <div style={styles.profileStatItem}>
                    <span style={styles.profileStatLabel}>Phone Number</span>
                    <span style={styles.profileStatValue}>{userProfile?.phone_number}</span>
                  </div>
                  <div style={styles.profileStatItem}>
                    <span style={styles.profileStatLabel}>Total Applications</span>
                    <span style={styles.profileStatValue}>{stats.total}</span>
                  </div>
                  <div style={styles.profileStatItem}>
                    <span style={styles.profileStatLabel}>Approved</span>
                    <span style={{...styles.profileStatValue, color: colors.success }}>{stats.approved}</span>
                  </div>
                  <div style={styles.profileStatItem}>
                    <span style={styles.profileStatLabel}>Pending</span>
                    <span style={{...styles.profileStatValue, color: colors.warning }}>{stats.pending}</span>
                  </div>
                  <div style={{...styles.profileStatItem, borderBottom: 'none'}}>
                    <span style={styles.profileStatLabel}>Rejected</span>
                    <span style={{...styles.profileStatValue, color: colors.danger }}>{stats.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Application List --- */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>
                <FileText style={{ width: 24, height: 24, color: colors.primary }} />
                My Applications
              </h3>

              {applications.length === 0 ? (
                <div style={styles.emptyState}>
                  <FileText style={styles.emptyStateIcon} />
                  <p style={styles.emptyStateText}>You haven't applied for any schemes yet.</p>
                  <a
                    href="/user/schemes"
                    style={{
                      ...styles.emptyStateButton,
                      ...(hover.type === 'button' && hover.id === 'browse' && { backgroundColor: colors.primaryDark })
                    }}
                    onMouseEnter={() => setHover({ type: 'button', id: 'browse' })}
                    onMouseLeave={() => setHover({ type: null, id: null })}
                  >
                    Browse Schemes
                  </a>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Scheme</th>
                      <th style={styles.th}>Applied On</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Admin Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr 
                        key={application._id}
                        style={{
                          ...styles.tr,
                          ...(hover.type === 'row' && hover.id === application._id && styles.trHover)
                        }}
                        onMouseEnter={() => setHover({ type: 'row', id: application._id })}
                        onMouseLeave={() => setHover({ type: null, id: null })}
                      >
                        <td style={styles.td}>
                          <div style={styles.tdScheme}>{application.schemes?.name ?? 'Unknown'}</div>
                          <div style={styles.tdSchemeCategory}>{application.schemes?.category ?? 'N/A'}</div>
                        </td>
                        <td style={styles.td}>
                          {new Date(application.applied_at).toLocaleDateString('en-IN')}
                        </td>
                        <td style={styles.td}>
                          {getStatusBadge(application.status)}
                        </td>
                        <td style={styles.td}>
                          <span style={application.admin_notes ? {} : styles.adminNotes}>
                            {application.admin_notes || 'No notes'}
                          </span>
                          {/* M-colored boxes for status */}
                          {application.status === 'approved' && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: colors.successText, backgroundColor: colors.successLight, padding: '0.5rem', borderRadius: '0.25rem' }}>
                              Your application was approved!
                            </div>
                          )}
                          {application.status === 'rejected' && (
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: colors.dangerText, backgroundColor: colors.dangerLight, padding: '0.5rem', borderRadius: '0.25rem' }}>
                              Your application was rejected.
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}