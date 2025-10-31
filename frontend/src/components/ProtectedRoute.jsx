import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Correct file extension

// This is a simple loading screen
const LoadingScreen = () => (
  <div style={{ minHeight: '100vh', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '3rem', width: '3rem', borderBottom: '2px solid #2563EB', margin: '0 auto', marginBottom: '1rem' }}></div>
      <p style={{ color: '#4B5563' }}>Loading...</p>
    </div>
  </div>
);

// Define the spin animation outside of the component for Vite/React to process it correctly
// Note: This is simplified; in a real app, the keyframes would be in index.css or a global file.
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-spin { animation: spin 1s linear infinite; }
  `;
  document.head.appendChild(style);
}

// This component protects routes for *only* logged-in CITIZENS
export function ProtectedRouteUser() {
  const { isUser, isAuthenticated, loading } = useAuth();

  // 1. Wait until the AuthContext is finished loading (This fixes the redirect loop)
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. If loaded and the user is an authenticated citizen, show the content
  if (isAuthenticated && isUser) {
    return <Outlet />; // This renders the child page (e.g., <UserHome />)
  }

  // 3. Otherwise, redirect them to the login page
  return <Navigate to="/user/login" replace />;
}

// This component protects routes for *only* logged-in ADMINS
export function ProtectedRouteAdmin() {
  const { isAdmin, isAuthenticated, loading } = useAuth();

  // 1. Wait until the AuthContext is finished loading (This fixes the redirect loop)
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. If loaded and the user is an authenticated admin, show the page
  if (isAuthenticated && isAdmin) {
    return <Outlet />; // This renders the child page (e.g., <AdminDashboard />)
  }

  // 3. Otherwise, redirect them to the login page
  return <Navigate to="/admin/login" replace />;
}