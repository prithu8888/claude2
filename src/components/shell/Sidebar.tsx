import { type ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { t } from '../../i18n/strings';
import './Sidebar.css';

interface SidebarItem {
  path: string;
  labelKey: Parameters<typeof t>[0];
  icon: ReactElement;
}

// SVG icons inline to avoid extra deps
const icons = {
  home: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  transactions: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="14" x2="12" y2="14" />
    </svg>
  ),
  dealers: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  campaigns: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="13 2 13 9 20 9" />
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </svg>
  ),
  claims: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  invoices: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  ask: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15 8.5L22 9.5L17 14.5L18.5 22L12 18.5L5.5 22L7 14.5L2 9.5L9 8.5Z" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  kyc: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
};

const adminNav: SidebarItem[] = [
  { path: '/home', labelKey: 'nav.dashboard', icon: icons.home },
  { path: '/transactions', labelKey: 'nav.transactions', icon: icons.transactions },
  { path: '/dealers', labelKey: 'nav.dealers', icon: icons.dealers },
  { path: '/bulk-onboarding', labelKey: 'nav.bulkOnboarding', icon: icons.kyc },
  { path: '/plan-config', labelKey: 'nav.planConfig', icon: icons.settings },
  { path: '/campaigns', labelKey: 'nav.campaigns', icon: icons.campaigns },
  { path: '/claims', labelKey: 'nav.claims', icon: icons.claims },
  { path: '/invoices', labelKey: 'nav.invoices', icon: icons.invoices },
  { path: '/ask', labelKey: 'nav.askMpos', icon: icons.ask },
  { path: '/training', labelKey: 'nav.training', icon: icons.training },
  { path: '/whatsapp', labelKey: 'nav.whatsapp', icon: icons.whatsapp },
  { path: '/settings', labelKey: 'nav.settings', icon: icons.settings },
];

const dealerNav: SidebarItem[] = [
  { path: '/home', labelKey: 'nav.home', icon: icons.home },
  { path: '/transactions', labelKey: 'nav.transactions', icon: icons.transactions },
  { path: '/dealers', labelKey: 'nav.agents', icon: icons.dealers },
  { path: '/incentives', labelKey: 'nav.incentives', icon: icons.wallet },
  { path: '/claims', labelKey: 'nav.claims', icon: icons.claims },
  { path: '/invoices', labelKey: 'nav.invoices', icon: icons.invoices },
  { path: '/wallet', labelKey: 'nav.wallet', icon: icons.wallet },
  { path: '/training', labelKey: 'nav.training', icon: icons.training },
  { path: '/settings', labelKey: 'nav.settings', icon: icons.settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, language } = useAppStore();

  if (activeRole !== 'brand-admin' && activeRole !== 'acko-super-admin' && activeRole !== 'dealer') {
    return null;
  }

  const navItems = activeRole === 'dealer' ? dealerNav : adminNav;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.path === '/home'
              ? location.pathname === '/home'
              : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{t(item.labelKey, language)}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user-card">
          <div className="sidebar-user-title">Need help?</div>
          <div className="sidebar-user-sub">Chat with our support team</div>
          <button className="btn-primary sidebar-user-btn">Open chat</button>
        </div>
      </div>
    </aside>
  );
}
