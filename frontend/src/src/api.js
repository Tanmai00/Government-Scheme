import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../lib/api.js'; // Corrected path

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      setToken(token);
      if (role === 'user') fetchUserProfile();
      else if (role === 'admin') fetchAdminProfile();
      else {
        signOut();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const data = await api.get('/api/me/profile'); 
      setUserProfile(data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      signOut();
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const data = await api.get('/api/admin/profile'); 
      setAdminProfile(data);
    } catch (err) {
      console.error('Failed to fetch admin profile', err);
      signOut();
    } finally {
      setLoading(false);
    }
  };

  const signInUser = async (phoneNumber, password) => {
    try {
      const { token } = await api.post('/api/auth/user/login', { phoneNumber, password });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'user');
      setToken(token);
      await fetchUserProfile();
    } catch (err) {
      console.error('Sign-in error:', err);
      throw new Error(err.message || 'Failed to sign in');
    }
  };

  const signUpAdmin = async (username, phoneNumber, password, secretKey) => {
    try {
      const { token } = await api.post('/api/auth/admin/signup', { username, phoneNumber, password, secretKey });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      setToken(token);
      await fetchAdminProfile();
    } catch (err) {
      console.error('Admin signup error:', err);
      throw new Error(err.message || 'Failed to create admin account');
    }
  };

  const signInAdmin = async (phoneNumber, password) => {
    try {
      const { token } = await api.post('/api/auth/admin/login', { phoneNumber, password });
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'admin');
      setToken(token);
      await fetchAdminProfile();
    } catch (err) {
      console.error('Admin sign-in error:', err);
      throw new Error(err.message || 'Failed to sign in as admin');
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUserProfile(null);
    setAdminProfile(null);
    window.location.href = '/'; 
  };

  const value = {
    userProfile,
    adminProfile,
    loading,
    isAuthenticated: !!userProfile || !!adminProfile,
    isUser: !!userProfile,
    isAdmin: !!adminProfile,
    signInUser,
    signInAdmin,
    signUpAdmin,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}