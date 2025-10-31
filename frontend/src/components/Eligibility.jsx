import { useState, useEffect } from 'react';
// MODIFIED: Corrected import paths
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
// MODIFIED: Added all icons for sidebar, cards, and results
import { 
  User, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  BookOpen, 
  Phone,
  AlertCircle,
  X,
  ArrowRight,
  ArrowLeft
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
  
  // --- Main Card ---
  card: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    maxWidth: '48rem', // 768px
    margin: '0 auto',
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardContent: {
    padding: '1.5rem',
  },
  
  // --- Scheme List ---
  schemeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  schemeButton: {
    width: '100%',
    textAlign: 'left',
    padding: '1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.5rem',
    cursor: 'pointer',
    background: colors.card,
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  schemeButtonHover: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 1px ${colors.primary}`,
  },
  schemeButtonContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  schemeName: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  schemeCategory: {
    fontSize: '0.875rem',
    color: colors.textSecondary,
    marginTop: '0.25rem',
  },
  
  // --- Question List ---
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderLeft: `4px solid ${colors.primary}`,
    padding: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    color: colors.primaryDark,
  },
  questionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  questionBox: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '1.5rem',
  },
  questionText: {
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: '1rem',
    fontSize: '1rem',
  },
  answerButtons: {
    display: 'flex',
    gap: '1rem',
  },

  // --- Buttons ---
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s, opacity 0.15s, border-color 0.15s',
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: 'white',
  },
  buttonPrimaryHover: {
    backgroundColor: colors.primaryDark,
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  buttonSecondaryHover: {
    backgroundColor: '#F3F4F6', // Gray-100
  },
  buttonGreen: {
    backgroundColor: colors.success,
    color: 'white',
  },
  buttonGreenHover: {
    backgroundColor: colors.successText,
  },
  buttonRed: {
    backgroundColor: colors.danger,
    color: 'white',
  },
  buttonRedHover: {
    backgroundColor: colors.dangerText,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  // --- Result Card ---
  resultBox: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '0.5rem',
  },
  resultIcon: {
    width: 64,
    height: 64,
    margin: '0 auto 1rem',
  },
  resultTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  resultText: {
    marginBottom: '1.5rem',
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
export default function Eligibility() {
  const { userProfile, signOut } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); // null, true, or false
  const [hover, setHover] = useState({ type: null, id: null });
  // MODIFIED: Replaced alert() with notification
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadSchemes();
  }, []);
  
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
      // MODIFIED: Corrected API path to match server.js
      const data = await api.get('/api/schemes');
      setSchemes(data || []);
    } catch (_) {
      setSchemes([]);
      setNotification({ type: 'error', message: 'Failed to load schemes.' });
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleSchemeSelect = (scheme) => {
    setSelectedScheme(scheme);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({ ...prev, [index]: value === 'yes' }));
  };

  const checkEligibility = () => {
    const criteria = selectedScheme.eligibility_criteria;
    if (!criteria || criteria.length === 0) {
      setResult(true); // Auto-eligible if no criteria
      return;
    }
    
    const allAnswered = Object.keys(answers).length === criteria.length;

    if (!allAnswered) {
      // MODIFIED: Replaced alert()
      setNotification({ type: 'error', message: 'Please answer all questions.' });
      return;
    }

    const allYes = Object.values(answers).every(answer => answer === true);
    setResult(allYes);
  };

  // --- Dynamic Styles for Hover ---
  const getSchemeBoxStyle = (id) => ({
    ...styles.schemeButton,
    ...(hover.type === 'scheme' && hover.id === id && styles.schemeButtonHover)
  });
  
  const getAnswerButtonStyle = (isYes, isSelected, questionIndex) => {
    let baseStyle;
    let hoverStyle;
    
    if (isSelected) {
      baseStyle = isYes ? styles.buttonGreen : styles.buttonRed;
      hoverStyle = isYes ? styles.buttonGreenHover : styles.buttonRedHover;
    } else {
      baseStyle = styles.buttonSecondary;
      hoverStyle = styles.buttonSecondaryHover;
    }
    
    let style = { ...styles.button, ...baseStyle, padding: '0.5rem 1.5rem' };
    
    const hoverId = isYes ? `yes-${questionIndex}` : `no-${questionIndex}`;
    if (hover.type === 'answer' && hover.id === hoverId) {
      style = { ...style, ...hoverStyle };
    }
    
    return style;
  };

  const getButtonStyle = (id, type = 'primary') => {
    const baseStyle = type === 'primary' ? styles.buttonPrimary : 
                      type === 'green' ? styles.buttonGreen :
                      type === 'red' ? styles.buttonRed : 
                      styles.buttonSecondary;
                      
    const hoverStyle = type === 'primary' ? styles.buttonPrimaryHover :
                       type === 'green' ? styles.buttonGreenHover :
                       type === 'red' ? styles.buttonRedHover : 
                       styles.buttonSecondaryHover;
    
    let style = { ...styles.button, ...baseStyle };
    if (hover.type === 'button' && hover.id === id) style = { ...style, ...hoverStyle };
    return style;
  };
  
  const handleBack = () => {
    setSelectedScheme(null);
    setResult(null);
  };

  return (
    <div style={styles.layout}>
      {/* --- Notification Toast --- */}
      {getNotification(notification, setNotification)}

      {/* --- Sidebar --- */}
      <Sidebar 
        userProfile={userProfile}
        handleLogout={handleLogout}
        activeLink="Eligibility"
        hover={hover}
        setHover={setHover}
      />
      
      {/* --- Main Content --- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h2 style={styles.headerTitle}>Check Your Eligibility</h2>
          <p style={styles.headerSubtitle}>
            Select a scheme and answer a few questions to check if you qualify
          </p>
        </header>

        <div style={styles.card}>
          {!selectedScheme ? (
            // --- STEP 1: SELECT SCHEME ---
            <>
              <h3 style={styles.cardTitle}>Step 1: Select a Scheme</h3>
              <div style={styles.cardContent}>
                <div style={styles.schemeList}>
                  {schemes.map((scheme) => (
                    <button
                      key={scheme._id}
                      onClick={() => handleSchemeSelect(scheme)}
                      style={getSchemeBoxStyle(scheme._id)}
                      onMouseEnter={() => setHover({ type: 'scheme', id: scheme._id })}
                      onMouseLeave={() => setHover({ type: null, id: null })}
                    >
                      <div style={styles.schemeButtonContent}>
                        <div>
                          <h4 style={styles.schemeName}>{scheme.name}</h4>
                          <p style={styles.schemeCategory}>{scheme.category}</p>
                        </div>
                        <ArrowRight style={{ color: colors.primary, width: 20, height: 20 }} />
                      </div>
                    </button>
                  ))}
                  {schemes.length === 0 && (
                    <p style={styles.textMuted}>No schemes are available for eligibility check at this time.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            // --- STEP 2: ANSWER QUESTIONS OR SEE RESULT ---
            <>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{selectedScheme.name}</h3>
                <button
                  onClick={handleBack}
                  style={{ ...getButtonStyle('back', 'secondary'), padding: '0.5rem 1rem' }}
                  onMouseEnter={() => setHover({ type: 'button', id: 'back' })}
                  onMouseLeave={() => setHover({ type: null, id: null })}
                >
                  <ArrowLeft style={{ width: 16, height: 16 }} />
                  <span>Back to Schemes</span>
                </button>
              </div>
              
              <div style={styles.cardContent}>
                {!result && result !== false ? (
                  // --- Question Form ---
                  <div>
                    <div style={styles.infoBox}>
                      <p>
                        Please answer the following questions honestly. All questions must be answered with "Yes" to be eligible.
                      </p>
                    </div>
                    <div style={styles.questionList}>
                      {selectedScheme.eligibility_criteria.map((criterion, index) => (
                        <div key={index} style={styles.questionBox}>
                          <p style={styles.questionText}>
                            {index + 1}. {criterion.question}
                          </p>
                          <div style={styles.answerButtons}>
                            <button
                              onClick={() => handleAnswerChange(index, 'yes')}
                              style={getAnswerButtonStyle(true, answers[index] === true, index)}
                              onMouseEnter={() => setHover({ type: 'answer', id: `yes-${index}` })}
                              onMouseLeave={() => setHover({ type: null, id: null })}
                            >
                              <CheckCircle style={{ width: 16, height: 16 }} />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => handleAnswerChange(index, 'no')}
                              style={getAnswerButtonStyle(false, answers[index] === false, index)}
                              onMouseEnter={() => setHover({ type: 'answer', id: `no-${index}` })}
                              onMouseLeave={() => setHover({ type: null, id: null })}
                            >
                              <XCircle style={{ width: 16, height: 16 }} />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={checkEligibility}
                        style={{ ...getButtonStyle('check', 'primary'), width: '100%' }}
                        onMouseEnter={() => setHover({ type: 'button', id: 'check' })}
                        onMouseLeave={() => setHover({ type: null, id: null })}
                      >
                        Check Eligibility
                      </button>
                    </div>
                  </div>
                ) : (
                  // --- Result Display ---
                  <div>
                    {result ? (
                      // --- Eligible Result ---
                      <div style={{ ...styles.resultBox, backgroundColor: colors.successLight }}>
                        <CheckCircle style={{ ...styles.resultIcon, color: colors.success }} />
                        <h4 style={{ ...styles.resultTitle, color: colors.success }}>
                          Congratulations! You are Eligible
                        </h4>
                        <p style={{ ...styles.resultText, color: colors.successText }}>
                          You meet all the eligibility criteria for this scheme. You can now proceed to apply.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                          <button
                            onClick={handleBack}
                            style={getButtonStyle('checkOther1', 'secondary')}
                            onMouseEnter={() => setHover({ type: 'button', id: 'checkOther1' })}
                            onMouseLeave={() => setHover({ type: null, id: null })}
                          >
                            Check Another Scheme
                          </button>
                          <a
                            href="/user/schemes"
                            style={getButtonStyle('apply', 'green')}
                            onMouseEnter={() => setHover({ type: 'button', id: 'apply' })}
                            onMouseLeave={() => setHover({ type: null, id: null })}
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    ) : (
                      // --- Not Eligible Result ---
                      <div style={{ ...styles.resultBox, backgroundColor: colors.dangerLight }}>
                        <XCircle style={{ ...styles.resultIcon, color: colors.danger }} />
                        <h4 style={{ ...styles.resultTitle, color: colors.danger }}>
                          Sorry, You are Not Eligible
                        </h4>
                        <p style={{ ...styles.resultText, color: colors.dangerText }}>
                          You do not meet all the eligibility criteria for this scheme at this time.
                        </p>
                        <button
                          onClick={handleBack}
                          style={getButtonStyle('checkOther2', 'red')}
                          onMouseEnter={() => setHover({ type: 'button', id: 'checkOther2' })}
                          onMouseLeave={() => setHover({ type: null, id: null })}
                        >
                          Check Another Scheme
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}