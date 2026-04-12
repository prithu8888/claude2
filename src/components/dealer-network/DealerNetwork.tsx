import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  networkUsers as seed,
  getParentName,
  deriveRole,
  getChildren,
  canMove,
  type NetworkUser,
  type NetworkGroup,
} from './mockUsers';
import { ToastProvider } from '../shared/Toast';
import { useToast } from '../shared/toastContext';
import AddUserModal from './AddUserModal';
import DeactivateModal from './DeactivateModal';
import MoveUserModal from './MoveUserModal';
import DealerBulkUpload from './DealerBulkUpload';
import './DealerNetwork.css';

type Tab = 'users' | 'bulk';

interface Banner {
  id: string;
  tone: 'warning' | 'error';
  message: string;
}

function DealerNetworkInner() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [users, setUsers] = useState<NetworkUser[]>(seed);
  const [tab, setTab] = useState<Tab>('users');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<NetworkGroup | 'all'>('all');

  const [addOpen, setAddOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<NetworkUser | null>(null);
  const [moveUser, setMoveUser] = useState<NetworkUser | null>(null);
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
  const [banners, setBanners] = useState<Banner[]>([]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const role = deriveRole(users, u);
      if (roleFilter !== 'all' && role !== roleFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        getParentName(users, u.parentId).toLowerCase().includes(q)
      );
    });
  }, [users, search, roleFilter]);

  const counts = useMemo(() => {
    const roles = users.map((u) => deriveRole(users, u));
    return {
      total: users.length,
      dealers: roles.filter((r) => r === 'Dealer').length,
      subDealers: roles.filter((r) => r === 'Sub-dealer').length,
      promoters: roles.filter((r) => r === 'Promoter').length,
      inactive: users.filter((u) => u.status === 'Inactive').length,
    };
  }, [users]);

  const addBanner = (b: Banner) => setBanners((prev) => [...prev.filter((x) => x.id !== b.id), b]);
  const dismissBanner = (id: string) => setBanners((prev) => prev.filter((b) => b.id !== id));

  const handleUserAdded = (u: NetworkUser) => {
    setUsers([...users, u]);
    setAddOpen(false);
    const role = deriveRole([...users, u], u);
    const parent = getParentName([...users, u], u.parentId);
    show('success', `${u.name} added as ${role} under ${parent}`);
    setNewRowIds(new Set([...newRowIds, u.id]));
    setTimeout(() => {
      setNewRowIds((s) => {
        const next = new Set(s);
        next.delete(u.id);
        return next;
      });
    }, 2000);
  };

  const handleDeactivated = (
    userId: string,
    option: 'auto' | 'manual' | 'none',
    reassignments: { childId: string; newParentId: string | null }[],
    reassignmentTargetName?: string,
  ) => {
    setUsers((prev) => {
      let next = prev.map((u) => (u.id === userId ? { ...u, status: 'Inactive' as const } : u));
      for (const r of reassignments) {
        next = next.map((u) => (u.id === r.childId ? { ...u, parentId: r.newParentId } : u));
      }
      return next;
    });
    const u = users.find((x) => x.id === userId);
    const directReports = getChildren(users, userId);

    if (option === 'auto' && reassignmentTargetName) {
      show('success', `${u?.name ?? 'User'} deactivated. ${directReports.map((r) => r.name).join(' and ')} moved to ${reassignmentTargetName}.`);
    } else if (option === 'manual' && directReports.length > 0) {
      show('success', `${u?.name ?? 'User'} deactivated.`);
      addBanner({
        id: `orphan-${userId}`,
        tone: 'warning',
        message: `${directReports.length} user${directReports.length !== 1 ? 's' : ''} need a new manager.`,
      });
    } else if (option === 'none' && directReports.length > 0) {
      show('success', `${u?.name ?? 'User'} deactivated.`);
      addBanner({
        id: `orphan-${userId}`,
        tone: 'error',
        message: `${directReports.length} user${directReports.length !== 1 ? 's' : ''} have no manager and cannot sell.`,
      });
    } else {
      show('success', `${u?.name ?? 'User'} deactivated.`);
    }
    setDeactivateUser(null);
  };

  const handleMoved = (userId: string, newParentId: string | null, oldParentName: string, newParentName: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, parentId: newParentId } : u)));
    const u = users.find((x) => x.id === userId);
    show('success', `${u?.name ?? 'User'} moved to ${newParentName}`);
    const kids = getChildren(users, userId);
    if (kids.length > 0) {
      addBanner({
        id: `kids-${userId}`,
        tone: 'warning',
        message: `${kids.map((k) => k.name).join(' and ')} still report to ${oldParentName}. Move them separately if needed.`,
      });
    }
    setMoveUser(null);
  };

  const roleBadgeClass = (role: NetworkGroup) => {
    switch (role) {
      case 'Partner Admin': return 'role-admin';
      case 'Dealer': return 'role-dealer';
      case 'Sub-dealer': return 'role-subdealer';
      case 'Promoter': return 'role-promoter';
    }
  };

  return (
    <div className="dn-page">
      <aside className="dn-sidebar">
        <div className="dn-sidebar-header">
          <div className="dn-brand-avatar">O</div>
          <div>
            <div className="dn-brand-name">Oppo India</div>
            <div className="dn-brand-sub">Partner Admin</div>
          </div>
        </div>
        <nav className="dn-sidebar-nav">
          <button className={`dn-nav-item ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <span className="dn-nav-icon">☰</span>
            <span>Overview</span>
          </button>
          <button className={`dn-nav-item ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <span className="dn-nav-icon">👥</span>
            <span>Users</span>
            <span className="dn-nav-count">{counts.total}</span>
          </button>
          <button className="dn-nav-item" onClick={() => setAddOpen(true)}>
            <span className="dn-nav-icon">+</span>
            <span>Add User</span>
          </button>
          <button className={`dn-nav-item ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>
            <span className="dn-nav-icon">📤</span>
            <span>Bulk Upload</span>
          </button>
          <button className="dn-nav-item dn-nav-disabled" disabled>
            <span className="dn-nav-icon">⚙</span>
            <span>Settings</span>
          </button>
        </nav>
        <div className="dn-sidebar-footer">
          <button className="dn-help" title="Help">?</button>
        </div>
      </aside>

      <main className="dn-main">
        {tab === 'users' && (
          <>
            <header className="dn-header">
              <div>
                <h1 className="dn-title">Dealer network</h1>
                <p className="dn-subtitle">
                  {counts.total} users &middot; {counts.dealers} dealers, {counts.subDealers} sub-dealers, {counts.promoters} promoters
                  {counts.inactive > 0 && <> &middot; {counts.inactive} inactive</>}
                </p>
              </div>
              <div className="dn-header-actions">
                <button className="dn-btn-secondary" onClick={() => setTab('bulk')}>
                  Bulk upload
                </button>
                <button className="dn-btn-primary" onClick={() => setAddOpen(true)}>
                  + Add user
                </button>
              </div>
            </header>

            <div className="dn-wizard-banner">
              <div className="dn-wizard-banner-icon">✨</div>
              <div className="dn-wizard-banner-body">
                <div className="dn-wizard-banner-title">First-time setup wizard</div>
                <div className="dn-wizard-banner-sub">
                  Onboard your entire team at once &mdash; 5-step guided flow that derives the hierarchy from manager phones.
                </div>
              </div>
              <button className="dn-btn-primary" onClick={() => navigate('/setup-wizard')}>
                Launch wizard →
              </button>
            </div>

            {/* Dismissable banners */}
            {banners.map((b) => (
              <div key={b.id} className={`dn-banner dn-banner-${b.tone}`}>
                <span className="dn-banner-icon">{b.tone === 'error' ? '⚠' : '!'}</span>
                <span className="dn-banner-msg">{b.message}</span>
                <button className="dn-banner-cta">Fix now →</button>
                <button className="dn-banner-dismiss" onClick={() => dismissBanner(b.id)}>✕</button>
              </div>
            ))}

            <div className="dn-filters">
              <div className="dn-search-wrap">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="dn-search"
                  placeholder="Search by name, phone, or parent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="dn-chip-group">
                {(['all', 'Dealer', 'Sub-dealer', 'Promoter'] as const).map((g) => (
                  <button
                    key={g}
                    className={`dn-chip ${roleFilter === g ? 'active' : ''}`}
                    onClick={() => setRoleFilter(g as NetworkGroup | 'all')}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            <div className="dn-table-wrap">
              <table className="dn-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Reports to</th>
                    <th>Status</th>
                    <th className="dn-col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="dn-empty-row">No users match your filters.</td>
                    </tr>
                  ) : (
                    filtered.map((u) => {
                      const role = deriveRole(users, u);
                      const isAdmin = role === 'Partner Admin';
                      const moveStatus = canMove(users, u);
                      const isNew = newRowIds.has(u.id);
                      return (
                        <tr key={u.id} className={`${u.status === 'Inactive' ? 'inactive-row' : ''} ${isNew ? 'new-row' : ''}`}>
                          <td>
                            <div className="dn-user-cell">
                              <div className="dn-user-avatar">
                                {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="dn-user-name">{u.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="dn-mono">{u.phone}</td>
                          <td>
                            <span className={`dn-role-pill ${roleBadgeClass(role)}`}>{role}</span>
                          </td>
                          <td>{isAdmin ? <span className="dn-text-muted">—</span> : getParentName(users, u.parentId)}</td>
                          <td>
                            <span className={`dn-status-pill ${u.status === 'Active' ? 'active' : 'inactive'}`}>
                              <span className="dn-status-dot" /> {u.status}
                            </span>
                          </td>
                          <td className="dn-col-actions">
                            {!isAdmin && (
                              <div className="dn-action-wrap">
                                <button
                                  className="dn-action-menu-btn"
                                  onClick={() => setActionMenuId(actionMenuId === u.id ? null : u.id)}
                                >
                                  ⋯
                                </button>
                                {actionMenuId === u.id && (
                                  <div className="dn-action-menu" onMouseLeave={() => setActionMenuId(null)}>
                                    <button onClick={() => { setActionMenuId(null); show('info', 'Edit coming soon'); }}>
                                      Edit profile
                                    </button>
                                    <button
                                      disabled={!moveStatus.allowed}
                                      title={moveStatus.reason ?? ''}
                                      onClick={() => { setActionMenuId(null); if (moveStatus.allowed) setMoveUser(u); }}
                                    >
                                      Move
                                    </button>
                                    {u.status === 'Active' ? (
                                      <button className="danger" onClick={() => { setActionMenuId(null); setDeactivateUser(u); }}>
                                        Deactivate
                                      </button>
                                    ) : (
                                      <button disabled title="Reactivation coming soon">
                                        Reactivate
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'bulk' && (
          <DealerBulkUpload
            onBack={() => setTab('users')}
            onImported={(newUsers) => {
              setUsers((prev) => [...prev, ...newUsers]);
              setTab('users');
              show('success', `${newUsers.length} users added successfully`);
            }}
          />
        )}
      </main>

      {addOpen && (
        <AddUserModal
          users={users}
          onClose={() => setAddOpen(false)}
          onSubmit={handleUserAdded}
        />
      )}

      {deactivateUser && (
        <DeactivateModal
          users={users}
          target={deactivateUser}
          onClose={() => setDeactivateUser(null)}
          onConfirm={handleDeactivated}
        />
      )}

      {moveUser && (
        <MoveUserModal
          users={users}
          target={moveUser}
          onClose={() => setMoveUser(null)}
          onConfirm={handleMoved}
        />
      )}
    </div>
  );
}

export default function DealerNetwork() {
  return (
    <ToastProvider>
      <DealerNetworkInner />
    </ToastProvider>
  );
}
