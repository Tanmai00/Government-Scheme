import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Added .jsx
import { ProtectedRouteUser, ProtectedRouteAdmin } from './components/ProtectedRoute.jsx'; // Added .jsx

// All components are in './components/'
import Landing from './components/Landing.jsx';
import UserSignup from './components/UserSignup.jsx';
import UserLogin from './components/UserLogin.jsx';
import AdminSignup from './components/AdminSignup.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import UserHome from './components/UserHome.jsx';
import Schemes from './components/Schemes.jsx';
import Eligibility from './components/Eligibility.jsx';
import Contact from './components/Contact.jsx';
import Profile from './components/Profile.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminSchemes from './components/AdminSchemes.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* Citizen Protected Routes */}
          <Route element={<ProtectedRouteUser />}>
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/schemes" element={<Schemes />} />
            <Route path="/user/eligibility" element={<Eligibility />} />
            <Route path="/user/contact" element={<Contact />} />
            <Route path="/user/profile" element={<Profile />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRouteAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/schemes" element={<AdminSchemes />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;