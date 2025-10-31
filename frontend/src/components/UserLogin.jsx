import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

// --- STYLES OBJECT (CONSISTENT WITH DASHBOARD REDESIGN) ---
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
  dangerText: '#991B1B',      // Red-800
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: 'linear-gradient(to bottom right, #EFF6FF, #ECFDF5)',
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
    display: 'flex',
    alignItems: 'flex-start',
    backgroundColor: colors.dangerLight,
    border: `1px solid ${colors.danger}`,
    color: colors.dangerText,
    padding: '1rem',
    borderRadius: '0.375rem',
    marginBottom: '1.5rem',
  },
  notificationIcon: {
    flexShrink: 0,
    width: 20,
    height: 20,
    marginRight: '0.75rem',
  },
  notificationContent: {
    flex: 1,
    fontWeight: '500',
  },
  notificationClose: {
    marginLeft: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.dangerText,
    opacity: 0.7,
  }
};
// --- END OF STYLES ---

// --- Helper Function: Notification ---
const getNotification = (notification, setNotification) => {
  if (!notification.message) return null;
  
  return (
    <div style={styles.notification}>
      <AlertCircle style={styles.notificationIcon} />
      <div style={styles.notificationContent}>
        <p>{notification.message}</p>
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

export default function UserLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signInUser, isUser } = useAuth();
  const navigate = useNavigate();
  
  const [hover, setHover] = useState({ type: null, id: null });

  // This useEffect watches the `isUser` state.
  // When it becomes `true` after login, it navigates.
  useEffect(() => {
    if (isUser) {
      navigate('/user/home', { replace: true });
    }
  }, [isUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' }); // Clear notification
    setLoading(true);

    try {
      await signInUser(phoneNumber, password);
      // The `useEffect` hook above will now handle the redirect
      // once the `isUser` state is true.
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Invalid phone number or password' });
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
      <div style={styles.card}>
        
        <div style={styles.header}>
          <div style={styles.headerIconContainer}>
            <LogIn style={styles.headerIcon} />
          </div>
          <h2 style={styles.title}>Citizen Login</h2>
          <p style={styles.subtitle}>Government Scheme Portal</p>
        </div>

        {getNotification(notification, setNotification)}

        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="Enter your 10-digit mobile number"
            />
          </div>

          <div style={styles.passwordContainer}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label> {/* <--- THIS IS THE FIX (was </small>) */}
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
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

          <button
            type="submit"
            disabled={loading}
            style={getButtonStyle()}
            onMouseEnter={() => setHover({ type: 'button', id: 'submit' })}
            onMouseLeave={() => setHover({ type: null, id: null })}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footerText}>
          <p>
            Don't have an account?{' '}
            <Link 
              to="/user/signup" 
              style={getLinkStyle('register')}
              onMouseEnter={() => setHover({ type: 'link', id: 'register' })}
              onMouseLeave={() => setHover({ type: null, id: null })}
            >
              Register here
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