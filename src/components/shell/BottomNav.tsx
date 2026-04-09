import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { t } from '../../i18n/strings';
import './BottomNav.css';

const icons = {
  home: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  sales: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  incentives: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  more: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  ),
};

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, language } = useAppStore();

  // Only promoters / agents see the bottom nav
  if (activeRole !== 'promoter' && activeRole !== 'distributor') return null;

  const isActive = (path: string) =>
    path === '/home' ? location.pathname === '/home' : location.pathname.startsWith(path);

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${isActive('/home') ? 'active' : ''}`}
        onClick={() => navigate('/home')}
      >
        {icons.home}
        <span>{t('nav.home', language)}</span>
      </button>
      <button
        className={`bottom-nav-item ${isActive('/transactions') ? 'active' : ''}`}
        onClick={() => navigate('/transactions')}
      >
        {icons.sales}
        <span>{t('nav.mySales', language)}</span>
      </button>
      <button
        className="bottom-nav-cta"
        onClick={() => navigate('/sell')}
        aria-label="New sale"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        className={`bottom-nav-item ${isActive('/incentives') ? 'active' : ''}`}
        onClick={() => navigate('/incentives')}
      >
        {icons.incentives}
        <span>{t('nav.incentives', language)}</span>
      </button>
      <button
        className={`bottom-nav-item ${isActive('/more') ? 'active' : ''}`}
        onClick={() => navigate('/more')}
      >
        {icons.more}
        <span>{t('nav.more', language)}</span>
      </button>
    </nav>
  );
}
