import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import './Sidebar.css';

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

const brandAdminNav: SidebarItem[] = [
  { path: '/brand-admin', label: 'Dashboard', icon: '\u2302' },
  { path: '/brand-admin/dealers', label: 'Dealers', icon: '\u2630' },
  { path: '/brand-admin/products', label: 'Products & Plans', icon: '\u2610' },
  { path: '/brand-admin/sales', label: 'Sales & Policies', icon: '\u2637' },
  { path: '/brand-admin/claims', label: 'Claims', icon: '\u2691' },
  { path: '/brand-admin/users', label: 'Users & RBAC', icon: '\u263A' },
  { path: '/brand-admin/settings', label: 'Settings', icon: '\u2699' },
];

const superAdminNav: SidebarItem[] = [
  { path: '/super-admin', label: 'Dashboard', icon: '\u2302' },
  { path: '/super-admin/brands', label: 'Brands', icon: '\u2605' },
  { path: '/super-admin/dealers', label: 'Dealers', icon: '\u2630' },
  { path: '/super-admin/policies', label: 'Policies', icon: '\u2610' },
  { path: '/super-admin/claims', label: 'Claims', icon: '\u2691' },
  { path: '/super-admin/finance', label: 'Financial Ops', icon: '\u25B0' },
  { path: '/super-admin/users', label: 'User Mgmt', icon: '\u263A' },
  { path: '/super-admin/config', label: 'Config', icon: '\u2699' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeRole, sidebarOpen } = useAppStore();

  if (activeRole !== 'brand-admin' && activeRole !== 'acko-super-admin') return null;

  const navItems = activeRole === 'acko-super-admin' ? superAdminNav : brandAdminNav;

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = item.path === '/brand-admin' || item.path === '/super-admin'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
