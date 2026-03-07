import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './MorePage.css';

export default function MorePage() {
  const navigate = useNavigate();
  const { activeRole, setAuthenticated } = useAppStore();

  const menuItems = [
    { label: 'Profile', icon: '\u263A', path: '/more/profile' },
    { label: 'Tax & Invoices', icon: '\u2637', path: '/gst' },
    { label: 'Reports', icon: '\u2637', path: '/reports' },
    { label: 'Training', icon: '\u2606', path: '/more/training' },
    { label: 'Support', icon: '\u2709', path: '/more/support' },
    { label: 'Settings', icon: '\u2699', path: '/more/settings' },
  ];

  return (
    <div className="more-page">
      <h2 className="more-title">More</h2>

      <div className="more-profile card">
        <div className="more-avatar">
          {activeRole === 'dealer' ? 'RE' : 'AS'}
        </div>
        <div className="more-profile-info">
          <span className="more-name">
            {activeRole === 'dealer' ? 'Rajesh Electronics' : 'Amit Sharma'}
          </span>
          <span className="more-role">{activeRole}</span>
        </div>
      </div>

      <div className="more-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="more-menu-item"
            onClick={() => navigate(item.path)}
          >
            <span className="more-menu-icon">{item.icon}</span>
            <span className="more-menu-label">{item.label}</span>
            <span className="more-menu-arrow">&rsaquo;</span>
          </button>
        ))}
      </div>

      <button
        className="more-logout"
        onClick={() => {
          setAuthenticated(false);
          navigate('/onboarding');
        }}
      >
        Log Out
      </button>

      <p className="more-version">mPOS v2.0.0 (Prototype)</p>
    </div>
  );
}
