import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../lib/api'; // Ensure this path is correct

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Default to true

  // This function is called on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      setToken(token); // Set token for all future API requests
      setLoading(true); // Explicitly set loading to true
      if (role === 'user') {
        fetchUserProfile(); // Try to fetch the user
      } else if (role === 'admin') {
        fetchAdminProfile(); // Try to fetch the admin
      } else {
        // Unknown role, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setLoading(false);
      }
    } else {
      setLoading(false); // No token, stop loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true); 
    try {
      const data = await api.get('/api/me/profile'); // Correct path
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile on load', err);
      setUserProfile(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/admin/profile'); // Correct path
      setAdminProfile(data);
    } catch (err) {
      console.error('Failed to fetch admin profile on load', err);
      setAdminProfile(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // --- USER AUTH ---
  const signUpUser = async (username, phoneNumber, password) => {
    try {
      return await api.post('/api/auth/user/signup', {
        username,
        phoneNumber,
        password,
      });
    } catch (err) {
      console.error('Sign-up error:', err);
      throw err; // Let the signup page handle the error
    }
  };

  const signInUser = async (phoneNumber, password) => {
    try {
      const { token } = await api.post('/api/auth/user/login', {
        phoneNumber,
        password,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      setToken(token);
      
      const data = await api.get('/api/me/profile'); // Correct path
      setUserProfile(data); // This sets the state

    } catch (err) {
      console.error('Sign-in process failed:', err);
      throw new Error(err.message || 'Failed to sign in');
    }
  };

  // --- ADMIN AUTH ---
  const signUpAdmin = async (username, phoneNumber, password, secretKey) => {
    try {
      const { token } = await api.post('/api/auth/admin/signup', {
        username,
        phoneNumber,
        password,
        secretKey,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      setToken(token);
      
      const data = await api.get('/api/admin/profile'); // Correct path
      setAdminProfile(data);
    } catch (err) {
      console.error('Admin signup error:', err);
      throw new Error(err.message || 'Failed to create admin account');
    }
  };

  const signInAdmin = async (phoneNumber, password) => {
    try {
      const { token } = await api.post('/api/auth/admin/login', {
        phoneNumber,
        password,
      });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      setToken(token);
      
      const data = await api.get('/api/admin/profile'); // Correct path
      setAdminProfile(data);
    } catch (err) {
      console.error('Admin sign-in error:', err);
      throw new Error(err.message || 'Failed to sign in as admin');
    }
  };

  // --- GENERAL ---
  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserProfile(null);
    setAdminProfile(null);
    window.location.href = '/'; // Redirect to home
  };

  const value = {
    userProfile,
    adminProfile,
    loading,
    isAuthenticated: !!userProfile || !!adminProfile,
    isUser: !!userProfile,
    isAdmin: !!adminProfile,
    signUpUser,
    signInUser,
    signInAdmin,
    signUpAdmin,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* --- THIS IS THE FIX ---
        We ALWAYS render the children.
        The <ProtectedRoute> component is responsible 
        for showing a loading screen by checking the `loading` state.
        This stops the app from unmounting and re-mounting.
      */}
      {children}
    </AuthContext.Provider>
  );
}