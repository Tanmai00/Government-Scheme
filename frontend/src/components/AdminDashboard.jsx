import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
import { 
  Shield, 
  LogOut, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  LayoutDashboard,
  AlertCircle,
  X // For closing notification
} from 'lucide-react';

// --- STYLES OBJECT (COMPLETE VISUAL REDESIGN) ---
const colors = {
  primary: '#F97316',
  primaryDark: '#EA580C',
  primaryLight: '#FFF7ED',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  success: '#059669',
  successLight: '#ECFDF5',
  successText: '#065F46',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  dangerText: '#991B1B',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  warningText: '#B45309',
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
    boxSizing: 'border-box', // Ensures padding doesn't add to width
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
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    padding: '1.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardIcon: {
    width: 32,
    height: 32,
    opacity: 0.8,
  },
  statCardLabel: {
    color: colors.textMuted,
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  statCardValue: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  
  // --- Table ---
  tableCard: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden', // To contain table border radius
  },
  tableFilters: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
  },
  tableFiltersTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tableFiltersControls: {
    display: 'flex',
    gap: '1rem',
  },
  selectInput: {
    padding: '0.5rem 1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    backgroundColor: colors.card,
    color: colors.textSecondary,
    cursor: 'pointer',
  },
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
  tdApplicant: {
    fontWeight: '500',
    color: colors.textPrimary,
  },
  tdApplicantPhone: {
    color: colors.textMuted,
    fontSize: '0.75rem',
  },
  reviewButton: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.15s',
  },
  reviewButtonHover: {
    backgroundColor: colors.primaryDark,
  },
  noApplications: {
    textAlign: 'center',
    padding: '3rem',
  },
  noApplicationsIcon: {
    width: 56,
    height: 56,
    color: colors.border,
    margin: '0 auto 1rem',
  },
  noApplicationsText: {
    color: colors.textMuted,
    fontSize: '1rem',
  },
  
  // --- Status Badge ---
  badgeBase: {
    display: 'inline-flex', // Use inline-flex
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
  
  // --- Modal ---
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '1rem',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2rem',
    maxWidth: '42rem',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '1.5rem',
  },
  modalSection: {
    marginBottom: '1.5rem',
  },
  modalSectionTitle: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '0.75rem',
    fontSize: '1rem',
  },
  modalDataBox: {
    backgroundColor: colors.background,
    padding: '1rem',
    borderRadius: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: '0.875rem',
    border: `1px solid ${colors.border}`
  },
  modalDataRow: {
    display: 'flex',
  },
  modalDataLabel: {
    fontWeight: '500',
    color: colors.textMuted,
    textTransform: 'capitalize',
    width: '33.333333%',
  },
  modalDataValue: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: '0.5rem',
  },
  modalTextarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  modalButton: {
    flex: 1,
    padding: '0.75rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.15s, opacity 0.15s',
  },
  modalButtonIcon: {
    width: 20,
    height: 20,
  },
  modalButtonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  // --- Notification ---
  notification: {
    position: 'fixed',
    top: '1.5rem',
    right: '1.5rem',
    zIndex: 100,
    maxWidth: '400px',
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    padding: '1rem',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    flexShrink: 0,
    width: 24,
    height: 24,
    marginRight: '0.75rem',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  notificationMessage: {
    marginTop: '0.25rem',
    color: colors.textSecondary,
    fontSize: '0.875rem',
  },
  notificationClose: {
    marginLeft: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.textMuted,
  }
};
// --- END OF STYLES ---

// --- Helper Functions for Styles ---
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

const getStatCardIcon = (type) => {
  switch (type) {
    case 'total':
      return <FileText style={{ ...styles.statCardIcon, color: '#2563EB' }} />;
    case 'pending':
      return <Clock style={{ ...styles.statCardIcon, color: colors.warning }} />;
    case 'approved':
      return <CheckCircle style={{ ...styles.statCardIcon, color: colors.success }} />;
    case 'rejected':
      return <XCircle style={{ ...styles.statCardIcon, color: colors.danger }} />;
    default:
      return null;
  }
};

const getNotification = (notification, setNotification) => {
  if (!notification || !notification.message) return null;

  const isError = notification.type === 'error';
  const style = {
    ...styles.notification,
    borderLeft: `4px solid ${isError ? colors.danger : colors.success}`
  };
  
  return (
    <div style={style} role="status" aria-live="polite">
      {isError ? (
        <AlertCircle style={{ ...styles.notificationIcon, color: colors.danger }} />
      ) : (
        <CheckCircle style={{ ...styles.notificationIcon, color: colors.success }} />
      )}
      <div style={styles.notificationContent}>
        <p style={styles.notificationTitle}>{isError ? 'Error' : 'Success'}</p>
        <p style={styles.notificationMessage}>{notification.message}</p>
      </div>
      <button 
        style={styles.notificationClose}
        onClick={() => setNotification({ type: '', message: '' })}
        aria-label="Close notification"
      >
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
};

// --- COMPONENT CODE ---

export default function AdminDashboard() {
  const { adminProfile, signOut } = useAuth();
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState({ type: null, id: null });
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadSchemes();
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminProfile]);

  useEffect(() => {
    if(notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadSchemes = async () => {
    try {
      const data = await api.get('/api/schemes');
      setSchemes(data || []);
    } catch (_) {
      setSchemes([]);
      setNotification({ type: 'error', message: 'Failed to load schemes.' });
    }
  };

  const loadApplications = async () => {
    if (!adminProfile) return;
    try {
      const data = await api.get('/api/admin/applications');
      setApplications(data || []);
    } catch (_) {
      setApplications([]);
      setNotification({ type: 'error', message: 'Failed to load applications.' });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleReview = (application) => {
    setSelectedApplication(application);
    setAdminNotes(application.admin_notes || '');
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    setLoading(true);
    try {
      await api.post(`/api/admin/applications/${selectedApplication._id}/approve`, { admin_notes: adminNotes });
      setShowModal(false);
      loadApplications();
      setNotification({ type: 'success', message: 'Application approved successfully.' });
    } catch (err) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update application.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    if (!adminNotes.trim()) {
      setNotification({ type: 'error', message: 'Please provide a reason for rejection in the notes.' });
      return;
    }
    setLoading(true);
    try {
      await api.post(`/api/admin/applications/${selectedApplication._id}/reject`, { admin_notes: adminNotes });
      setShowModal(false);
      loadApplications();
      setNotification({ type: 'success', message: 'Application rejected.' });
    } catch (err) {
      setNotification({ type: 'error', message: err?.message || 'Failed to update application.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (selectedScheme !== 'all' && app.schemes?._id !== selectedScheme) return false;
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  // --- Dynamic Styles for Hover ---
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === 'Dashboard' && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== 'Dashboard' && { backgroundColor: colors.background })
  });

  const getLogoutStyle = () => ({
    ...styles.logoutButton,
    ...(hover.type === 'button' && hover.id === 'logout' && styles.logoutButtonHover)
  });
  
  const getReviewBtnStyle = (id) => ({
    ...styles.reviewButton,
    ...(hover.type === 'button' && hover.id === `review-${id}` && styles.reviewButtonHover)
  });

  const getModalBtnStyle = (type) => {
    let base, hoverStyle;
    switch(type) {
      case 'approve': 
        base = { backgroundColor: colors.success, color: 'white', border: 'none' };
        hoverStyle = { backgroundColor: '#047857' };
        break;
      case 'reject':
        base = { backgroundColor: colors.danger, color: 'white', border: 'none' };
        hoverStyle = { backgroundColor: '#B91C1C' };
        break;
      case 'cancel':
      default:
        base = { backgroundColor: colors.border, color: colors.textSecondary, border: 'none' };
        hoverStyle = { backgroundColor: '#D1D5DB' };
    }
    let style = { ...styles.modalButton, ...base };
    if (hover.type === 'button' && hover.id === type) style = { ...style, ...hoverStyle };
    if (loading) style = { ...style, ...styles.modalButtonDisabled };
    return style;
  };

  return (
    <div style={styles.layout}>
      {/* --- Notification Toast --- */}
      {getNotification(notification, setNotification)}

      {/* --- Sidebar --- */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <Shield style={styles.sidebarLogoIcon} />
          <h1 style={styles.sidebarLogoText}>Admin Portal</h1>
        </div>
        <nav style={styles.sidebarNav}>
          <a 
            href="/admin/dashboard" 
            style={getSidebarLinkStyle('Dashboard')}
            onMouseEnter={() => setHover({ type: 'link', id: 'Dashboard' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            <LayoutDashboard style={styles.sidebarLinkIcon} />
            <span>Dashboard</span>
          </a>
          <a 
            href="/admin/schemes" 
            style={getSidebarLinkStyle('Schemes')}
            onMouseEnter={() => setHover({ type: 'link', id: 'Schemes' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            <FileText style={styles.sidebarLinkIcon} />
            <span>Schemes</span>
          </a>
        </nav>
        
        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarUser}>
            <User style={styles.sidebarUserIcon} />
            <span style={styles.sidebarUserName}>{adminProfile?.username ?? 'Admin'}</span>
          </div>
          <button
            onClick={handleLogout}
            style={getLogoutStyle()}
            onMouseEnter={() => setHover({ type: 'button', id: 'logout' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
            aria-label="Logout"
          >
            <LogOut style={{ width: 16, height: 16 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>Application Management</h2>
          <p style={styles.headerSubtitle}>Manage and review citizen scheme applications</p>
        </header>

        {/* --- Stat Cards --- */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statCardLabel}>Total Applications</p>
              <p style={styles.statCardValue}>{stats.total}</p>
            </div>
            {getStatCardIcon('total')}
          </div>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statCardLabel}>Pending Review</p>
              <p style={styles.statCardValue}>{stats.pending}</p>
            </div>
            {getStatCardIcon('pending')}
          </div>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statCardLabel}>Approved</p>
              <p style={styles.statCardValue}>{stats.approved}</p>
            </div>
            {getStatCardIcon('approved')}
          </div>
          <div style={styles.statCard}>
            <div>
              <p style={styles.statCardLabel}>Rejected</p>
              <p style={styles.statCardValue}>{stats.rejected}</p>
            </div>
            {getStatCardIcon('rejected')}
          </div>
        </div>

        {/* --- Applications Table --- */}
        <div style={styles.tableCard}>
          <div style={styles.tableFilters}>
            <h3 style={styles.tableFiltersTitle}>All Applications</h3>
            <div style={styles.tableFiltersControls}>
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Schemes</option>
                {schemes.map((scheme) => (
                  <option key={scheme._id} value={scheme._id}>
                    {scheme.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={styles.selectInput}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div style={styles.noApplications}>
              <FileText style={styles.noApplicationsIcon} />
              <p style={styles.noApplicationsText}>No applications found for these filters</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Applicant</th>
                  <th style={styles.th}>Scheme</th>
                  <th style={styles.th}>Applied On</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr 
                    key={application._id}
                    style={{
                      ...styles.tr,
                      ...(hover.type === 'row' && hover.id === application._id ? styles.trHover : {})
                    }}
                    onMouseEnter={() => setHover({ type: 'row', id: application._id })}
                    onMouseLeave={() => setHover({ type: null, id: null })}
                  >
                    <td style={styles.td}>
                      <div style={styles.tdApplicant}>{application.user_profiles?.username ?? 'Unknown'}</div>
                      <div style={styles.tdApplicantPhone}>{application.user_profiles?.phone_number ?? 'N/A'}</div>
                    </td>
                    <td style={styles.td}>
                      <div>{application.schemes?.name ?? 'Unknown Scheme'}</div>
                      <div style={{ fontSize: '0.75rem', color: colors.textMuted }}>{application.schemes?.category ?? 'N/A'}</div>
                    </td>
                    <td style={styles.td}>
                      {application.applied_at ? new Date(application.applied_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={styles.td}>
                      {getStatusBadge(application.status)}
                    </td>
                    <td style={styles.td}>
                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleReview(application)}
                          style={getReviewBtnStyle(application._id)}
                          onMouseEnter={() => setHover({ type: 'button', id: `review-${application._id}` })}
                          onMouseLeave={() => setHover({ type: null, id: null })}
                          aria-label="Review application"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- Review Modal --- */}
      {showModal && selectedApplication && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Review Application</h3>

            <div style={styles.modalSection}>
              <h4 style={styles.modalSectionTitle}>Scheme & Applicant</h4>
              <div style={{ display: 'flex', gap: '2rem', color: colors.textSecondary, flexWrap: 'wrap' }}>
                <p><strong>Scheme:</strong> {selectedApplication.schemes?.name ?? 'Unknown'}</p>
                <p><strong>Applicant:</strong> {selectedApplication.user_profiles?.username ?? 'Unknown'}</p>
                <p><strong>Phone:</strong> {selectedApplication.user_profiles?.phone_number ?? 'N/A'}</p>
              </div>
            </div>

            <div style={styles.modalSection}>
              <h4 style={styles.modalSectionTitle}>Application Data</h4>
              <div style={styles.modalDataBox}>
                {Object.entries(selectedApplication.application_data ?? {}).map(([key, value]) => (
                  <div key={key} style={styles.modalDataRow}>
                    <span style={styles.modalDataLabel}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span style={styles.modalDataValue}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.modalSection}>
              <label style={styles.modalLabel}>
                Admin Notes {selectedApplication.status === 'rejected' && <span style={{ color: colors.danger }}>*</span>}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows="4"
                style={styles.modalTextarea}
                placeholder="Add notes about this application..."
              />
            </div>

            <div style={styles.modalActions}>
              <button
                onClick={handleApprove}
                disabled={loading}
                style={getModalBtnStyle('approve')}
                onMouseEnter={() => setHover({ type: 'button', id: 'approve' })}
                onMouseLeave={() => setHover({ type: null, id: null })}
              >
                <CheckCircle style={styles.modalButtonIcon} />
                <span>{loading ? 'Approving...' : 'Approve'}</span>
              </button>

              <button
                onClick={handleReject}
                disabled={loading}
                style={getModalBtnStyle('reject')}
                onMouseEnter={() => setHover({ type: 'button', id: 'reject' })}
                onMouseLeave={() => setHover({ type: null, id: null })}
              >
                <XCircle style={styles.modalButtonIcon} />
                <span>{loading ? 'Rejecting...' : 'Reject'}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                style={getModalBtnStyle('cancel')}
                onMouseEnter={() => setHover({ type: 'button', id: 'cancel' })}
                onMouseLeave={() => setHover({ type: null, id: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}