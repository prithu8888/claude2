import { useNavigate } from 'react-router-dom';
import { useAppStore, type Language, type TenantId } from '../../store/useAppStore';
import type { Role, Brand } from '../../types/mpos';
import { languageLabels } from '../../i18n/strings';
import './AppShell.css';

const roleLabels: Record<Role, string> = {
  'promoter': 'Sales Agent',
  'dealer': 'Dealer Admin',
  'distributor': 'Distributor',
  'brand-admin': 'Brand Admin',
  'acko-super-admin': 'Super Admin',
};

const tenantLabels: Record<TenantId, { name: string; initial: string; brands: Brand[] }> = {
  xiaomi: { name: 'Xiaomi India', initial: 'X', brands: ['Xiaomi', 'Samsung'] },
  ather: { name: 'Ather Energy', initial: 'A', brands: ['Ather', 'Ola', 'Bajaj', 'TVS'] },
};

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const {
    activeRole,
    activeTenant,
    setActiveRole,
    setActiveTenant,
    setActiveBrand,
    language,
    setLanguage,
    authUser,
    logout,
  } = useAppStore();

  const isDesktop = activeRole === 'brand-admin' || activeRole === 'acko-super-admin' || activeRole === 'dealer';

  const handleTenantChange = (tenant: TenantId) => {
    setActiveTenant(tenant);
    // Also flip the active brand to the first brand of the tenant
    setActiveBrand(tenantLabels[tenant].brands[0]);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (authUser?.name ?? 'You')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`app-shell ${isDesktop ? 'desktop' : 'mobile'}`}>
      <header className="shell-header">
        <div className="shell-header-left">
          <div className="shell-logo" onClick={() => navigate('/home')}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1E1B4B" />
              <path d="M9 16L13.5 20.5L23 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="shell-logo-text">ACKO MPOS</span>
          </div>
        </div>

        <div className="shell-header-center">
          {/* Super admin gets tenant switcher, others see their tenant badge */}
          {activeRole === 'acko-super-admin' ? (
            <div className="tenant-switcher">
              <span className="tenant-switcher-label">Tenant</span>
              <select
                className="tenant-select"
                value={activeTenant}
                onChange={(e) => handleTenantChange(e.target.value as TenantId)}
              >
                <option value="xiaomi">Xiaomi India</option>
                <option value="ather">Ather Energy</option>
              </select>
            </div>
          ) : (
            <div className="tenant-badge">
              <div className="tenant-badge-avatar">{tenantLabels[activeTenant].initial}</div>
              <span>{tenantLabels[activeTenant].name}</span>
            </div>
          )}
        </div>

        <div className="shell-header-right">
          <select
            className="shell-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Language"
          >
            {Object.entries(languageLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            className="shell-role"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as Role)}
          >
            {Object.entries(roleLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button className="shell-avatar" onClick={handleLogout} title="Sign out">
            {initials}
          </button>
        </div>
      </header>
      <div className="shell-body">{children}</div>
    </div>
  );
}
