import { useAppStore } from '../../store/useAppStore';
import type { Role, Vertical, Brand } from '../../types/mpos';
import './AppShell.css';

const roleLabels: Record<Role, string> = {
  'promoter': 'Promoter',
  'dealer': 'Dealer',
  'distributor': 'Distributor',
  'brand-admin': 'Brand Admin',
  'acko-super-admin': 'Acko Super Admin',
};

const verticalLabels: Record<Vertical, string> = {
  'electronics-retail': 'Electronics Retail',
  'electronics-asc': 'Electronics ASC',
  'ev-2w': 'EV 2-Wheeler',
  'ev-4w': 'EV 4-Wheeler',
};

const brands: Brand[] = ['Samsung', 'Xiaomi', 'Ather', 'Ola', 'Bajaj', 'TVS'];

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { activeRole, activeVertical, activeBrand, setActiveRole, setActiveVertical, setActiveBrand } = useAppStore();
  const isDesktop = activeRole === 'brand-admin' || activeRole === 'acko-super-admin';

  return (
    <div className={`app-shell ${isDesktop ? 'desktop' : 'mobile'}`}>
      <header className="shell-header">
        <div className="shell-header-left">
          <div className="shell-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="var(--acko-purple)" />
              <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="shell-logo-text">mPOS</span>
          </div>
        </div>
        <div className="shell-switcher">
          <select
            className="switcher-select"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as Role)}
          >
            {Object.entries(roleLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            className="switcher-select"
            value={activeVertical}
            onChange={(e) => setActiveVertical(e.target.value as Vertical)}
          >
            {Object.entries(verticalLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            className="switcher-select"
            value={activeBrand}
            onChange={(e) => setActiveBrand(e.target.value as Brand)}
          >
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="shell-header-right">
          <div className="shell-avatar">
            {activeRole === 'acko-super-admin' ? 'SA' : activeRole === 'brand-admin' ? 'BA' : 'U'}
          </div>
        </div>
      </header>
      <div className="shell-body">
        {children}
      </div>
    </div>
  );
}
