import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './BottomNav.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const promoterNav: NavItem[] = [
  { path: '/home', label: 'Home', icon: '\u2302' },
  { path: '/sell', label: 'Sell', icon: '\u271A' },
  { path: '/wallet', label: 'Wallet', icon: '\u25B0' },
  { path: '/claims', label: 'Claims', icon: '\u2691' },
  { path: '/more', label: 'More', icon: '\u2026' },
];

const dealerNav: NavItem[] = [
  { path: '/dealer', label: 'Dashboard', icon: '\u2302' },
  { path: '/sell', label: 'Sell', icon: '\u271A' },
  { path: '/wallet', label: 'Wallet', icon: '\u25B0' },
  { path: '/claims', label: 'Claims', icon: '\u2691' },
  { path: '/more', label: 'More', icon: '\u2026' },
];

const distributorNav: NavItem[] = [
  { path: '/distributor', label: 'Dashboard', icon: '\u2302' },
  { path: '/wallet', label: 'Wallet', icon: '\u25B0' },
  { path: '/reports', label: 'Reports', icon: '\u2637' },
  { path: '/more', label: 'More', icon: '\u2026' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole } = useAppStore();

  if (activeRole === 'brand-admin' || activeRole === 'acko-super-admin') return null;

  const navItems = activeRole === 'distributor' ? distributorNav : activeRole === 'dealer' ? dealerNav : promoterNav;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`bottom-nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
