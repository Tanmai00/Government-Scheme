import { useState } from 'react';
import { UserPlus } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function UserSignup() {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // --- INLINE STYLE HELPER OBJECTS ---

  const inputBaseStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    border: '1px solid #D1D5DB', // border-gray-300
    borderRadius: '0.5rem',
    outline: 'none',
  };

  const formContainerStyle = {
    minHeight: '100vh', 
    background: 'linear-gradient(to bottom right, #EFF6FF, #ECFDF5)', // from-blue-50 to-green-50 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '1rem' 
  };
  
  const cardStyle = { 
    backgroundColor: 'white', 
    borderRadius: '0.5rem', 
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
    padding: '2rem', 
    width: '100%', 
    maxWidth: 448 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        username: username.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      };

      const res = await fetch(`${API_BASE}/api/auth/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let body = null;
      try { 
        body = text ? JSON.parse(text) : null; 
      } catch { 
        body = text; 
      }

      if (!res.ok) {
        const serverMessage = (body && body.error) ? body.error : (typeof body === 'string' ? body : `Request failed with status ${res.status}`);
        throw new Error(serverMessage);
      }

      setSuccess('Account created successfully! Please log in.');
      setUsername('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={formContainerStyle}>
      <div style={cardStyle}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#2563EB', padding: '0.75rem', borderRadius: '9999px' }}>
            <UserPlus style={{ width: 32, height: 32, color: 'white' }} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', color: '#1F2937', marginBottom: '0.5rem' }}>Citizen Registration</h2>
        <p style={{ textAlign: 'center', color: '#4B5563', marginBottom: '1.5rem' }}>Government Scheme Portal</p>

        {success && (
          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem 1rem', borderRadius: '0.25rem', marginBottom: '1rem' }} role="alert">
            {success}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: '0.25rem', marginBottom: '1rem' }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Full Name</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputBaseStyle}
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Phone Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={inputBaseStyle}
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputBaseStyle}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Confirm Password</label>
            <input
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputBaseStyle}
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              backgroundColor: '#2563EB', 
              color: 'white', 
              padding: '0.5rem 0', 
              borderRadius: '0.5rem', 
              fontWeight: '500', 
              transition: 'background-color 0.15s ease-in-out',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#4B5563' }}>
            Already have an account?{' '}
            <a href="/user/login" style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: '500' }}>Login here</a>
          </p>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a href="/" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.875rem' }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}