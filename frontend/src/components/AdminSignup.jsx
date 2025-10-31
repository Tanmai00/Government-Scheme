import { useState, useEffect } from 'react';
// MODIFIED: Corrected import paths
import { useAuth } from '../contexts/AuthContext.jsx';
import { api } from '../lib/api.js';
// MODIFIED: Added all icons for form
import { ShieldCheck, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
// MODIFIED: Added useNavigate and Link
import { useNavigate, Link } from 'react-router-dom';

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
    marginBottom: '1.5rem',
  },
  headerIconContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '4rem', // w-16
    width: '4rem', // h-16
    backgroundColor: colors.primary,
    borderRadius: '9999px',
  },
  headerIcon: {
    width: 32,
    height: 32,
    color: 'white',
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
  // --- Notice Box ---
  noticeBox: {
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderLeft: `4px solid ${colors.primary}`,
    padding: '1rem',
    marginBottom: '1.5rem',
    borderRadius: '0.25rem',
  },
  noticeIcon: {
    flexShrink: 0,
    width: 20,
    height: 20,
    color: colors.primaryDark,
    marginRight: '0.75rem',
  },
  noticeTitle: {
    fontWeight: '600',
    color: colors.primaryDark,
  },
  noticeMessage: {
    marginTop: '0.25rem',
    color: colors.textSecondary,
    fontSize: '0.875rem',
    lineHeight: 1.5,
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

export default function AdminSignup() {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signUpAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [hover, setHover] = useState({ type: null, id: null });
  
  // --- THE FIX ---
  // This useEffect watches the `isAdmin` state.
  // When it becomes `true` after signup, it navigates.
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);
  // --- END OF FIX ---
  
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
    setNotification({ type: '', message: '' });

    if (password !== confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    if (!secretKey) {
      setNotification({ type: 'error', message: 'Admin secret key is required' });
      return;
    }

    setLoading(true);

    try {
      await signUpAdmin(username.trim(), phoneNumber.trim(), password, secretKey);
      
      // The `useEffect` hook above will now handle the redirect
      
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to create admin account' });
    } finally {
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
        
        <div style={styles.header}>
          <div style={styles.headerIconContainer}>
            <ShieldCheck style={styles.headerIcon} />
          </div>
          <h2 style={styles.title}>Admin Registration</h2>
          <p style={styles.subtitle}>Administration Setup</p>
        </div>

        <div style={styles.noticeBox}>
          <ShieldCheck style={styles.noticeIcon} />
          <div>
            <p style={styles.noticeTitle}>Authorized Personnel Only</p>
            <p style={styles.noticeMessage}>
              A valid Admin Secret Key is required for registration.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" style={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={styles.input}
              placeholder="10-digit mobile number"
            />
          </div>

          <div style={styles.passwordContainer}>
            <label htmlFor="secret" style={styles.label}>
              Admin Secret Key
            </label>
            <input
              id="secret"
              type="password" 
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              style={styles.input}
              placeholder="Enter the admin secret key"
            />
          </div>

          <div style={styles.passwordContainer}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Minimum 6 characters"
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

          <div style={styles.passwordContainer}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggleButton}
            >
              {showConfirmPassword 
                ? <EyeOff style={styles.passwordToggleIcon} /> 
                : <Eye style={styles.passwordToggleIcon} />
              }
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={getButtonStyle()}
            onMouseEnter={() => setHover({ type: 'button', id: 'submit' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </button>
        </form>

        <div style={styles.footerText}>
          <p>
            Already registered?{' '}
            <Link 
              to="/admin/login" 
              style={getLinkStyle('login')}
              onMouseEnter={() => setHover({ type: 'link', id: 'login' })}
              onMouseLeave={() => setHover({ type: null, id: null })}
            >
              Login here
            </Link>
          </p>
        </div>

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