import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // This path should be correct
import { useNavigate, Link } from 'react-router-dom';
// MODIFIED: Added all icons for form
import { Shield, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT REDESIGN, ADMIN-THEME) ---
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
  
  danger: '#DC2626',         // Red-700
  dangerLight: '#FEF2F2',     // Red-50
  dangerText: '#991B1B',      // Red-800
  
  success: '#059669',        // Green-700
  successLight: '#ECFDF5',    // Green-50
  successText: '#065F46',     // Green-800
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(to bottom right, #FFF7ED, #FFF7ED)', // Simplified Admin BG
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '28rem', // 448px
    borderTop: `4px solid ${colors.primary}`,
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  headerIconContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '4rem', // w-16
    width: '4rem', // h-16
    backgroundColor: colors.primaryLight,
    borderRadius: '9999px',
  },
  headerIcon: {
    width: 32,
    height: 32,
    color: colors.primary,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: colors.textMuted,
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: '0.25rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1px solid ${colors.border}`,
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'box-shadow 0.15s, border-color 0.15s',
    boxSizing: 'border-box',
    fontSize: '0.875rem',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggleButton: {
    position: 'absolute',
    top: '2.1rem', // Aligns with input
    right: '0',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '0.75rem',
    color: colors.textMuted,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  passwordToggleIcon: {
    height: '1.25rem',
    width: '1.25rem',
  },
  button: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: colors.primary,
    color: 'white',
    padding: '0.75rem 0',
    borderRadius: '0.375rem',
    fontWeight: '600',
    transition: 'background-color 0.15s ease-in-out',
    opacity: 1,
    cursor: 'pointer',
    border: 'none',
    fontSize: '0.875rem',
  },
  buttonHover: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  footerText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: '0.875rem',
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
  },
  linkHover: {
    textDecoration: 'underline',
  },
  backLink: {
    color: colors.textMuted,
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
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

export default function AdminLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  // MODIFIED: Renamed 'error' to 'notification'
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hover, setHover] = useState({ type: null, id: null });

  const { signInAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  // This useEffect is PERFECT. It will run AFTER
  // signInAdmin succeeds and the `isAdmin` state changes.
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);
  
  // Effect to clear notifications
  useEffect(() => {
    if(notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '' });
      }, 3000); // Clear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' }); // Clear notification
    setLoading(true);

    try {
      // 1. Attempt to sign in
      await signInAdmin(phoneNumber, password);
      
      // 2. The useEffect above will handle the navigation.
      
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Invalid credentials. Please try again.' });
    } finally {
      // 3. This ensures the button stops loading on success OR error.
      setLoading(false);
    }
  };

  // --- Dynamic Styles for Hover ---
  const getButtonStyle = () => {
    let style = { ...styles.button };
    if (hover.type === 'button' && hover.id === 'submit') style = { ...style, ...styles.buttonHover };
    if (loading) style = { ...style, ...styles.buttonDisabled };
    return style;
  };
  
  const getLinkStyle = (id) => {
    let style = { ...styles.link };
    if (hover.type === 'link' && hover.id === id) style = { ...style, ...styles.linkHover };
    return style;
  };
  
  const getBackLinkStyle = () => {
    let style = { ...styles.backLink };
    if (hover.type === 'link' && hover.id === 'back') style = { ...style, ...styles.linkHover };
    return style;
  };

  return (
    <div style={styles.container}>
      {/* --- Notification Toast --- */}
      {getNotification(notification, setNotification)}

      <div style={styles.card}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIconContainer}>
            <Shield style={{ ...styles.headerIcon, color: colors.primary }} />
          </div>
          <h1 style={styles.title}>
            Admin Portal
          </h1>
          <p style={styles.subtitle}>Secure sign-in for administrators</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label
              htmlFor="phoneNumber"
              style={styles.label}
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
              placeholder="10-digit mobile number"
            />
          </div>

          <div style={styles.passwordContainer}>
            <label
              htmlFor="password"
              style={styles.label}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggleButton}
            >
              {showPassword 
                ? <EyeOff style={styles.passwordToggleIcon} /> 
                : <Eye style={styles.passwordToggleIcon} />
              }
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={getButtonStyle()}
              onMouseEnter={() => setHover({ type: 'button', id: 'submit' })}
              onMouseLeave={() => setHover({ type: null, id: null })}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <p style={styles.footerText}>
          Don't have an admin account?{' '}
          <Link 
            to="/admin/signup" 
            style={getLinkStyle('register')}
            onMouseEnter={() => setHover({ type: 'link', id: 'register' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            Register here
          </Link>
        </p>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link 
            to="/" 
            style={getBackLinkStyle()}
            onMouseEnter={() => setHover({ type: 'link', id: 'back' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}