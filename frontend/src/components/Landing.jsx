import { Building2, Users, Shield } from 'lucide-react';

export default function Landing() {
  // --- INLINE STYLE HELPER OBJECTS ---
  const styles = {
    // Layout and Background
    mainContainer: { minHeight: '100vh', background: 'linear-gradient(to bottom right, #DBEAFE, #ECFDF5, #DBEAFE)' },
    contentWrapper: { maxWidth: 1280, margin: '0 auto', padding: '3rem 1rem' },
    
    // Cards
    cardBase: { backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', padding: '2rem', transition: 'box-shadow 0.15s' },
    
    // Colors
    blue: '#2563EB',
    blueLight: '#DBEAFE',
    orange: '#F97316',
    orangeLight: '#FFF7ED',
    red: '#DC2626',
    grayDark: '#1F2937',
    grayMedium: '#4B5563',
    
    // Text and Typography
    h1: { fontSize: '3rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' },
    pSmall: { fontSize: '0.875rem', color: '#6B7280' },
    
    // Buttons
    buttonBlue: { display: 'block', width: '100%', backgroundColor: '#2563EB', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '500', textAlign: 'center', transition: 'background-color 0.15s' },
    buttonOrange: { display: 'block', width: '100%', backgroundColor: '#F97316', color: 'white', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '500', textAlign: 'center', transition: 'background-color 0.15s' },
    buttonGhostBlue: { display: 'block', width: '100%', backgroundColor: '#DBEAFE', color: '#2563EB', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '500', textAlign: 'center', transition: 'background-color 0.15s' },
    buttonGhostOrange: { display: 'block', width: '100%', backgroundColor: '#FFF7ED', color: '#F97316', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '500', textAlign: 'center', transition: 'background-color 0.15s' },
  };

  const sectionStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem',
    maxWidth: 768,
    margin: '0 auto',
  };

  const featureListStyle = {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E5E7EB',
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.contentWrapper}>
        
        {/* --- Header Section --- */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Building2 size={64} color={styles.blue} />
          </div>
          <h1 style={styles.h1}>
            Government Scheme Portal
          </h1>
          <p style={{ fontSize: '1.5rem', color: styles.grayMedium, marginBottom: '0.5rem' }}>
            Andhra Pradesh State Government
          </p>
          <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
            Empowering Citizens Through Digital Welfare Services
          </p>
        </div>

        {/* --- Login/Registration Cards --- */}
        <div style={sectionStyle}>
          
          {/* --- Citizen Portal Card --- */}
          <div style={{ ...styles.cardBase, borderTop: '4px solid #2563EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: styles.blueLight, padding: '1rem', borderRadius: '9999px' }}>
                <Users size={48} color={styles.blue} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: styles.grayDark, marginBottom: '1rem', textAlign: 'center' }}>
              Citizen Portal
            </h2>

            <p style={{ color: styles.grayMedium, marginBottom: '1.5rem', textAlign: 'center' }}>
              Access government welfare schemes, check eligibility, and apply online for various benefits.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/user/login" style={styles.buttonBlue}>
                Login
              </a>
              <a href="/user/signup" style={styles.buttonGhostBlue}>
                Create New Account
              </a>
            </div>

            <div style={featureListStyle}>
              <h3 style={{ fontWeight: '700', color: styles.grayDark, marginBottom: '0.75rem' }}>Features:</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: styles.grayMedium }}>
                <li>✓ Browse 10+ welfare schemes</li>
                <li>✓ Check eligibility instantly</li>
                <li>✓ Apply online with ease</li>
                <li>✓ Track application status</li>
              </ul>
            </div>
          </div>

          {/* --- Admin Portal Card --- */}
          <div style={{ ...styles.cardBase, borderTop: '4px solid #F97316' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: styles.orangeLight, padding: '1rem', borderRadius: '9999px' }}>
                <Shield size={48} color={styles.orange} />
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: styles.grayDark, marginBottom: '1rem', textAlign: 'center' }}>
              Admin Portal
            </h2>

            <p style={{ color: styles.grayMedium, marginBottom: '1.5rem', textAlign: 'center' }}>
              Administration dashboard for reviewing and managing citizen applications.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href="/admin/login" style={styles.buttonOrange}>
                Admin Login
              </a>
              <a href="/admin/signup" style={styles.buttonGhostOrange}>
                Register as Admin
              </a>
            </div>

            <div style={featureListStyle}>
              <h3 style={{ fontWeight: '700', color: styles.grayDark, marginBottom: '0.75rem' }}>Features:</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: styles.grayMedium }}>
                <li>✓ Centralized application management</li>
                <li>✓ Review & approve applications</li>
                <li>✓ View scheme statistics</li>
                <li>✓ Secure registration system</li>
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem', backgroundColor: '#FFF7ED', borderLeft: '4px solid #F97316', padding: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#9A3412' }}>
                <strong style={{ fontWeight: '700' }}>Note:</strong> Admin access requires a
                secure <strong style={{ fontWeight: '700' }}>Admin Secret Key</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* --- About This Portal --- */}
        <div style={{ marginTop: '3rem', ...styles.cardBase, maxWidth: 768, margin: '3rem auto 0' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: styles.grayDark, marginBottom: '1.5rem', textAlign: 'center' }}>
            About This Portal
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
            <div style={{ gridColumnStart: 1 }}>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: styles.blue, marginBottom: '0.5rem' }}>10+</div>
              <p style={{ color: styles.grayMedium }}>Welfare Schemes</p>
            </div>
            <div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#059669', marginBottom: '0.5rem' }}>100%</div>
              <p style={{ color: styles.grayMedium }}>Digital</p>
            </div>
            <div>
              <div style={{ fontSize: '1.875rem', fontWeight: '700', color: '#8B5CF6', marginBottom: '0.5rem' }}>24/7</div>
              <p style={{ color: styles.grayMedium }}>Online Access</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: styles.grayMedium, marginBottom: '1rem' }}>
              This portal provides seamless access to government welfare schemes including healthcare,
              education, agriculture, housing, and social security benefits.
            </p>
            <p style={styles.pSmall}>
              Government of Andhra Pradesh | Department of Welfare
            </p>
          </div>
        </div>

        {/* --- Footer --- */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#6B7280' }}>
          <p>© 2025 Government of Andhra Pradesh. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>
            For technical support, call toll-free: <strong style={{ fontWeight: '700' }}>1800-425-2627</strong>
          </p>
        </div>
      </div>
    </div>
  );
}