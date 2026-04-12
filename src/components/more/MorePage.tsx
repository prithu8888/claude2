import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './MorePage.css';

export default function MorePage() {
  const navigate = useNavigate();
  const { activeRole, authUser, logout } = useAppStore();

  const menuItems = [
    { label: 'Profile & settings', icon: '☺', path: '/settings' },
    { label: 'Tax & Invoices', icon: '☷', path: '/invoices' },
    { label: 'Training', icon: '☆', path: '/training' },
    { label: 'Wallet', icon: '▰', path: '/wallet' },
    { label: 'Claims', icon: '⚑', path: '/claims' },
    { label: 'KYC', icon: '✍', path: '/kyc' },
  ];

  return (
    <div className="more-page">
      <h2 className="more-title">More</h2>

      <div className="more-profile card">
        <div className="more-avatar">
          {(authUser?.name ?? (activeRole === 'dealer' ? 'Rajesh Electronics' : 'Amit Sharma'))
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </div>
        <div className="more-profile-info">
          <span className="more-name">
            {authUser?.name ?? (activeRole === 'dealer' ? 'Rajesh Electronics' : 'Amit Sharma')}
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
          logout();
          navigate('/');
        }}
      >
        Log Out
      </button>

      <p className="more-version">ACKO MPOS v2.0.0 (Prototype)</p>
    </div>
  );
}
