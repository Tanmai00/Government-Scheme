import { useState, useEffect } from 'react';
// MODIFIED: Corrected import paths
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
// MODIFIED: Added LayoutDashboard and icons for form
import { 
  Shield, 
  LogOut, 
  FileText, 
  User, 
  LayoutDashboard,
  Plus, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle,
  X 
} from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT WITH DASHBOARD REDESIGN) ---
const colors = {
  primary: '#F97316',        // Orange-600 (Brand)
  primaryDark: '#EA580C',     // Orange-700 (Brand Hover)
  primaryLight: '#FFF7ED',    // Orange-50 (Brand Light BG)
  
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
  
  blue: '#2563EB',           // Blue-600
  blueLight: '#EFF6FF',       // Blue-50
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
  },
  mainContent: {
    flex: 1,
    padding: '2.5rem',
    maxHeight: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  
  // --- Sidebar (Copied from Dashboard) ---
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
  card: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardContent: {
    padding: '1.5rem',
  },
  
  // --- Form ---
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  formFieldFull: {
    gridColumn: 'span 2',
  },
  formLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.textSecondary,
  },
  formInput: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.375rem',
    backgroundColor: colors.card,
    color: colors.textSecondary,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },
  formTextarea: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.375rem',
    backgroundColor: colors.card,
    color: colors.textSecondary,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    minHeight: '60px',
  },
  formNote: {
    fontSize: '0.75rem',
    color: colors.textMuted,
    marginTop: '0.25rem',
  },
  formCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  formCheckboxInput: {
    height: 16,
    width: 16,
    color: colors.primary,
    borderRadius: '0.25rem',
    borderColor: colors.border,
  },
  formActions: {
    gridColumn: 'span 2',
    borderTop: `1px solid ${colors.border}`,
    paddingTop: '1.5rem',
    marginTop: '0.5rem',
  },

  // --- Scheme List ---
  schemeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  schemeCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  schemeCardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: '0.25rem',
  },
  schemeCardBadge: {
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    fontSize: '0.75rem',
    fontWeight: '500',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    display: 'inline-block',
  },
  schemeCardStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  schemeStatBox: {
    padding: '1rem',
    borderRadius: '0.375rem',
  },
  schemeStatLabel: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
  },
  schemeStatValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  schemeCardSection: {
    paddingTop: '1rem',
    borderTop: `1px solid ${colors.border}`,
  },
  schemeCardSectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
  },
  schemeCardText: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  
  // --- Buttons ---
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s, opacity 0.15s',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: 'white',
  },
  buttonPrimaryHover: {
    backgroundColor: colors.primaryDark,
  },
  buttonSecondary: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  buttonSecondaryHover: {
    backgroundColor: '#F3F4F6', // Gray-100
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // --- Notification (Copied from Dashboard) ---
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

// --- Helper Function: Notification ---
const getNotification = (notification, setNotification) => {
  if (!notification.message) return null;

  const isError = notification.type === 'error';
  const style = {
    ...styles.notification,
    borderLeft: `4px solid ${isError ? colors.danger : colors.success}`
  };
  
  return (
    <div style={style}>
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
      >
        <X style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
};

// --- Helper Function: Form Fields ---
const formFields = [
  { label: 'Name', key: 'name', type: 'text', required: true, placeholder: 'Scheme name' },
  { label: 'Category', key: 'category', type: 'text', required: true, placeholder: 'e.g. Agriculture, Education' },
  { label: 'Description', key: 'description', type: 'textarea', required: true, span: 2, placeholder: 'Short description' },
  { label: 'Benefits', key: 'benefits', type: 'textarea', required: true, span: 2, placeholder: 'Benefit details' },
  { label: 'Required Documents (comma-separated)', key: 'required_documents', type: 'text', span: 2, placeholder: 'Aadhaar Card, Ration Card, ...' },
  { label: 'Important Notes', key: 'important_notes', type: 'textarea', span: 2, placeholder: 'Any important notes (optional)' },
  { label: 'Application Fields (comma-separated keys)', key: 'application_fields', type: 'text', span: 2, placeholder: 'aadharNumber, bankAccount, ...', note: "Keys to build the form. 'aadharNumber' becomes 'Aadhaar Number'." },
];

// --- COMPONENT CODE ---
export default function AdminSchemes() {
  const { adminProfile, signOut } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [applicationsByScheme, setApplicationsByScheme] = useState({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  // MODIFIED: Replaced createError with notification state
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [newScheme, setNewScheme] = useState({
    name: '', category: '', description: '', benefits: '',
    required_documents: '', important_notes: '', application_fields: '', 
    eligibility_criteria: '', is_active: true,
  });
  
  // State for hover effects
  const [hover, setHover] = useState({ type: null, id: null });

  useEffect(() => {
    loadSchemes();
    loadApplicationStats();
  }, [adminProfile]);

  // Effect to clear notifications
  useEffect(() => {
    if(notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000); // Clear after 3 seconds
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

  const loadApplicationStats = async () => {
    if (!adminProfile) return;
    try {
      const data = await api.get('/api/admin/applications');
      const stats = {};
      data?.forEach(app => {
        const key = app.schemes?._id; 
        if (!key) return;

        if (!stats[key]) {
          stats[key] = { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
        stats[key].total++;
        stats[key][app.status] = (stats[key][app.status] || 0) + 1;
      });
      setApplicationsByScheme(stats);
    } catch (_) {
      setApplicationsByScheme({});
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' }); // Clear old errors
    setCreateLoading(true);
    try {
      const eligibilityQuestions = newScheme.eligibility_criteria
        .split(';')
        .map(q => q.trim())
        .filter(Boolean)
        .map(question => ({ question }));

      const payload = {
        name: newScheme.name.trim(),
        category: newScheme.category.trim(),
        description: newScheme.description.trim(),
        benefits: newScheme.benefits.trim(),
        required_documents: newScheme.required_documents
          ? newScheme.required_documents.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        important_notes: newScheme.important_notes.trim() || '',
        application_fields: newScheme.application_fields
          ? newScheme.application_fields.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        eligibility_criteria: eligibilityQuestions,
        is_active: !!newScheme.is_active,
      };

      if (!payload.name || !payload.category || !payload.description || !payload.benefits) {
        throw new Error('Name, Category, Description, and Benefits are required.');
      }
      if (payload.eligibility_criteria.length === 0) {
        throw new Error('At least one eligibility question is required (semicolon-separated).');
      }

      await api.post('/api/schemes', payload);
      setCreateOpen(false);
      setNewScheme({
        name: '', category: '', description: '', benefits: '',
        required_documents: '', important_notes: '', application_fields: '', 
        eligibility_criteria: '', is_active: true,
      });
      await loadSchemes();
      // MODIFIED: Success notification
      setNotification({ type: 'success', message: 'Scheme created successfully!' });
    } catch (err) {
      // MODIFIED: Error notification
      setNotification({ type: 'error', message: err?.message || 'Failed to create scheme' });
    } finally {
      setCreateLoading(false);
    }
  };
  
  // --- Dynamic Styles for Hover ---
  const getSidebarLinkStyle = (linkName) => ({
    ...styles.sidebarLink,
    ...(linkName === 'Schemes' && styles.sidebarLinkActive),
    ...(hover.type === 'link' && hover.id === linkName && linkName !== 'Schemes' && { backgroundColor: colors.background })
  });

  const getLogoutStyle = () => ({
    ...styles.logoutButton,
    ...(hover.type === 'button' && hover.id === 'logout' && styles.logoutButtonHover)
  });
  
  const getButtonStyle = (id, type = 'primary') => {
    const baseStyle = type === 'primary' ? styles.buttonPrimary : styles.buttonSecondary;
    const hoverStyle = type === 'primary' ? styles.buttonPrimaryHover : styles.buttonSecondaryHover;
    
    let style = { ...styles.button, ...baseStyle };
    if (hover.type === 'button' && hover.id === id) style = { ...style, ...hoverStyle };
    if (createLoading) style = { ...style, ...styles.buttonDisabled };
    return style;
  };
  
  const getStatBoxStyle = (status) => {
    let style = styles.schemeStatBox;
    if(status === 'total') return { ...style, backgroundColor: colors.blueLight, color: colors.blue };
    if(status === 'pending') return { ...style, backgroundColor: colors.warningLight, color: colors.warningText };
    if(status === 'approved') return { ...style, backgroundColor: colors.successLight, color: colors.successText };
    if(status === 'rejected') return { ...style, backgroundColor: colors.dangerLight, color: colors.dangerText };
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
            <span style={styles.sidebarUserName}>{adminProfile?.username}</span>
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
          <h2 style={styles.headerTitle}>Scheme Management</h2>
          <p style={styles.headerSubtitle}>View scheme-wise application statistics and create new schemes</p>
        </header>

        {/* --- Create New Scheme Section --- */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Create New Scheme</h3>
            <button
              onClick={() => setCreateOpen(!createOpen)}
              style={getButtonStyle('toggleCreate', createOpen ? 'secondary' : 'primary')}
              onMouseEnter={() => setHover({ type: 'button', id: 'toggleCreate' })}
              onMouseLeave={() => setHover({ type: null, id: null })}
            >
              {createOpen ? <ChevronUp style={{ width: 20, height: 20 }} /> : <Plus style={{ width: 20, height: 20 }} />}
              <span>{createOpen ? 'Close Form' : 'Add New Scheme'}</span>
            </button>
          </div>

          {createOpen && (
            <form onSubmit={handleCreateSubmit} style={styles.cardContent}>
              <div style={styles.formGrid}>
                
                {formFields.map((field) => (
                  <div key={field.key} style={{ ...styles.formField, ...(field.span === 2 && styles.formFieldFull) }}>
                    <label htmlFor={field.key} style={styles.formLabel}>{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.key}
                        required={field.required}
                        value={newScheme[field.key]}
                        onChange={(e) => setNewScheme(s => ({ ...s, [field.key]: e.target.value }))}
                        style={styles.formTextarea}
                        placeholder={field.placeholder}
                        rows={field.key === 'description' || field.key === 'benefits' ? 3 : 2}
                      />
                    ) : (
                      <input
                        id={field.key}
                        type={field.type}
                        required={field.required}
                        value={newScheme[field.key]}
                        onChange={(e) => setNewScheme(s => ({ ...s, [field.key]: e.target.value }))}
                        style={styles.formInput}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.note && <p style={styles.formNote}>{field.note}</p>}
                  </div>
                ))}
                
                {/* Eligibility Criteria */}
                <div style={{ ...styles.formField, ...styles.formFieldFull }}>
                  <label htmlFor="eligibility_criteria" style={styles.formLabel}>Eligibility Questions (semicolon-separated)</label>
                  <textarea
                    id="eligibility_criteria"
                    required
                    value={newScheme.eligibility_criteria}
                    onChange={(e) => setNewScheme(s => ({ ...s, eligibility_criteria: e.target.value }))}
                    style={styles.formTextarea}
                    placeholder="Are you a resident?; Do you own land?"
                    rows={2}
                  />
                  <p style={styles.formNote}>Separate each question with a semicolon ( ; ).</p>
                </div>

                {/* Checkbox and Submit */}
                <div style={{ ...styles.formField, ...styles.formFieldFull }}>
                  <div style={styles.formCheckbox}>
                    <input
                      id="is_active"
                      type="checkbox"
                      checked={newScheme.is_active}
                      onChange={(e) => setNewScheme(s => ({ ...s, is_active: e.target.checked }))}
                      style={styles.formCheckboxInput}
                    />
                    <label htmlFor="is_active" style={styles.formLabel}>Set as Active</label>
                  </div>
                </div>
                
                <div style={styles.formActions}>
                  <button
                    type="submit"
                    disabled={createLoading}
                    style={getButtonStyle('createSubmit', 'primary')}
                    onMouseEnter={() => setHover({ type: 'button', id: 'createSubmit' })}
                    onMouseLeave={() => setHover({ type: null, id: null })}
                  >
                    {createLoading ? 'Creating...' : 'Create Scheme'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* --- Scheme Statistics --- */}
        <div style={styles.schemeGrid}>
          {schemes.map((scheme) => {
            const stats = applicationsByScheme[scheme._id] || { total: 0, pending: 0, approved: 0, rejected: 0 };
            const statusType = (status) => status.charAt(0).toUpperCase() + status.slice(1);

            return (
              <div key={scheme._id} style={styles.card}>
                <div style={styles.cardContent}>
                  <div style={styles.schemeCardHeader}>
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.schemeCardTitle}>{scheme.name}</h3>
                      <span style={styles.schemeCardBadge}>{scheme.category}</span>
                    </div>
                    <FileText style={{ width: 32, height: 32, color: colors.primary, flexShrink: 0, marginLeft: '1rem' }} />
                  </div>

                  <div style={styles.schemeCardStats}>
                    {['total', 'pending', 'approved', 'rejected'].map(status => (
                      <div key={status} style={getStatBoxStyle(status)}>
                        <p style={styles.schemeStatLabel}>{statusType(status)}</p>
                        <p style={{...styles.schemeStatValue, color: 'inherit' }}>{stats[status]}</p>
                      </div>
                    ))}
                  </div>

                  <p style={{...styles.schemeCardText, marginBottom: '1rem'}}>{scheme.description}</p>

                  <div style={styles.schemeCardSection}>
                    <h4 style={styles.schemeCardSectionTitle}>Benefits:</h4>
                    <p style={styles.schemeCardText}>{scheme.benefits}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {schemes.length === 0 && !createOpen && (
          <div style={{ ...styles.card, ...styles.cardContent, marginTop: '2rem', textAlign: 'center' }}>
            <FileText style={{ width: 64, height: 64, color: colors.border, margin: '0 auto 1rem' }} />
            <p style={styles.headerSubtitle}>No active schemes found. You can add one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}