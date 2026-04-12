import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { networkUsers as seed, getParentName, type NetworkUser, type NetworkGroup } from './mockUsers';
import { ToastProvider } from '../shared/Toast';
import { useToast } from '../shared/toastContext';
import AddUserModal from './AddUserModal';
import DeactivateModal from './DeactivateModal';
import MoveUserModal from './MoveUserModal';
import DealerBulkUpload from './DealerBulkUpload';
import './DealerNetwork.css';

type Tab = 'users' | 'add' | 'bulk' | 'movement';

function DealerNetworkInner() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [users, setUsers] = useState<NetworkUser[]>(seed);
  const [tab, setTab] = useState<Tab>('users');
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState<NetworkGroup | 'all'>('all');

  const [addOpen, setAddOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deactivateUser, setDeactivateUser] = useState<NetworkUser | null>(null);
  const [moveUser, setMoveUser] = useState<NetworkUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (groupFilter !== 'all' && u.group !== groupFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.partnerId ?? '').toLowerCase().includes(q) ||
        getParentName(users, u.parentId).toLowerCase().includes(q)
      );
    });
  }, [users, search, groupFilter]);

  const counts = useMemo(() => {
    return {
      total: users.length,
      dealers: users.filter((u) => u.group === 'Dealer').length,
      subDealers: users.filter((u) => u.group === 'Sub-dealer').length,
      promoters: users.filter((u) => u.group === 'Promoter').length,
      inactive: users.filter((u) => u.status === 'Inactive').length,
    };
  }, [users]);

  const handleUserAdded = (u: NetworkUser) => {
    setUsers([u, ...users]);
    setAddOpen(false);
    show('success', `${u.name} added as ${u.group}`);
  };

  const handleDeactivated = (userId: string, reassignments: { childId: string; newParentId: string | null }[]) => {
    setUsers((prev) => {
      let next = prev.map((u) => (u.id === userId ? { ...u, status: 'Inactive' as const } : u));
      for (const r of reassignments) {
        next = next.map((u) => (u.id === r.childId ? { ...u, parentId: r.newParentId } : u));
      }
      return next;
    });
    const u = users.find((x) => x.id === userId);
    show('success', `${u?.name ?? 'User'} deactivated${reassignments.length ? ` \u2014 ${reassignments.length} user(s) reassigned` : ''}`);
    setDeactivateUser(null);
  };

  const handleMoved = (userId: string, newParentId: string | null, oldParentName: string, newParentName: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, parentId: newParentId } : u)));
    const u = users.find((x) => x.id === userId);
    show('success', `${u?.name ?? 'User'} moved from ${oldParentName} to ${newParentName}`);
    setMoveUser(null);
  };

  return (
    <div className="dn-page">
      <aside className="dn-sidebar">
        <div className="dn-sidebar-header">
          <div className="dn-brand-avatar">X</div>
          <div>
            <div className="dn-brand-name">Xiaomi India</div>
            <div className="dn-brand-sub">Partner Admin</div>
          </div>
        </div>
        <nav className="dn-sidebar-nav">
          <button className={`dn-nav-item ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
            <span className="dn-nav-icon">&#128101;</span>
            <span>Users</span>
            <span className="dn-nav-count">{counts.total}</span>
          </button>
          <button className={`dn-nav-item ${tab === 'add' ? 'active' : ''}`} onClick={() => { setTab('add'); setAddOpen(true); }}>
            <span className="dn-nav-icon">&#10133;</span>
            <span>Add User</span>
          </button>
          <button className={`dn-nav-item ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>
            <span className="dn-nav-icon">&#128228;</span>
            <span>Bulk Upload</span>
          </button>
          <button className={`dn-nav-item ${tab === 'movement' ? 'active' : ''}`} onClick={() => setTab('movement')}>
            <span className="dn-nav-icon">&#8646;</span>
            <span>User Movement</span>
          </button>
        </nav>
        <div className="dn-sidebar-footer">
          <button className="dn-help" title="Help">
            <span>?</span>
          </button>
        </div>
      </aside>

      <main className="dn-main">
        {tab === 'users' && (
          <>
            <header className="dn-header">
              <div>
                <h1 className="dn-title">Dealer network</h1>
                <p className="dn-subtitle">
                  {counts.total} users \u00b7 {counts.dealers} dealers, {counts.subDealers} sub-dealers, {counts.promoters} promoters
                  {counts.inactive > 0 && <> \u00b7 {counts.inactive} inactive</>}
                </p>
              </div>
              <div className="dn-header-actions">
                <button className="dn-btn-secondary" onClick={() => setTab('bulk')}>
                  Bulk Upload
                </button>
                <button className="dn-btn-primary" onClick={() => setAddOpen(true)}>
                  + Add User
                </button>
              </div>
            </header>

            <div className="dn-wizard-banner">
              <div className="dn-wizard-banner-icon">\u{2728}</div>
              <div className="dn-wizard-banner-body">
                <div className="dn-wizard-banner-title">First-time setup wizard</div>
                <div className="dn-wizard-banner-sub">
                  Onboard your entire team at once \u2014 guided 6-step flow from upload to preview. Takes about 10 minutes.
                </div>
              </div>
              <button className="dn-btn-primary" onClick={() => navigate('/setup-wizard')}>
                Launch wizard \u2192
              </button>
            </div>

            <div className="dn-filters">
              <div className="dn-search-wrap">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="dn-search"
                  placeholder="Search by name, phone, partner ID, parent..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="dn-chip-group">
                {(['all', 'Dealer', 'Sub-dealer', 'Promoter'] as const).map((g) => (
                  <button
                    key={g}
                    className={`dn-chip ${groupFilter === g ? 'active' : ''}`}
                    onClick={() => setGroupFilter(g as NetworkGroup | 'all')}
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
                    <th>Group</th>
                    <th>Parent</th>
                    <th>Status</th>
                    <th className="dn-col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="dn-empty-row">
                        No users match your filters.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="dn-user-cell">
                            <div className="dn-user-avatar">
                              {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="dn-user-name">{u.name}</div>
                              {u.partnerId && <div className="dn-user-sub">{u.partnerId}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="dn-mono">{u.phone}</td>
                        <td>
                          <span className={`dn-group-pill dn-group-${u.group.toLowerCase().replace('-', '')}`}>{u.group}</span>
                        </td>
                        <td>{getParentName(users, u.parentId)}</td>
                        <td>
                          <span className={`dn-status-pill ${u.status === 'Active' ? 'active' : 'inactive'}`}>
                            <span className="dn-status-dot" /> {u.status}
                          </span>
                        </td>
                        <td className="dn-col-actions">
                          <div className="dn-action-wrap">
                            <button
                              className="dn-action-menu-btn"
                              onClick={() => setActionMenuId(actionMenuId === u.id ? null : u.id)}
                            >
                              \u22EF
                            </button>
                            {actionMenuId === u.id && (
                              <div className="dn-action-menu" onMouseLeave={() => setActionMenuId(null)}>
                                <button onClick={() => { setActionMenuId(null); show('info', 'Edit form coming soon'); }}>
                                  &#9998; Edit
                                </button>
                                <button onClick={() => { setActionMenuId(null); setMoveUser(u); }}>
                                  &#8646; Move user
                                </button>
                                {u.status === 'Active' && (
                                  <button className="danger" onClick={() => { setActionMenuId(null); setDeactivateUser(u); }}>
                                    &#8416; Deactivate
                                  </button>
                                )}
                                {u.status === 'Inactive' && (
                                  <button onClick={() => {
                                    setActionMenuId(null);
                                    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: 'Active' } : x)));
                                    show('success', `${u.name} reactivated`);
                                  }}>
                                    &#8635; Reactivate
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
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
              setUsers((prev) => [...newUsers, ...prev]);
              setTab('users');
              show('success', `${newUsers.length} users imported successfully`);
            }}
          />
        )}

        {tab === 'movement' && (
          <div className="dn-movement-landing">
            <header className="dn-header">
              <div>
                <h1 className="dn-title">User movement</h1>
                <p className="dn-subtitle">Move any user to a different parent in the hierarchy.</p>
              </div>
              <button className="dn-btn-ghost" onClick={() => setTab('users')}>\u2190 Back to users</button>
            </header>
            <div className="dn-movement-grid">
              {users.filter((u) => u.parentId).slice(0, 9).map((u) => (
                <button key={u.id} className="dn-movement-card" onClick={() => setMoveUser(u)}>
                  <div className="dn-user-cell">
                    <div className="dn-user-avatar">
                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="dn-user-name">{u.name}</div>
                      <div className="dn-user-sub">
                        {u.group} \u00b7 reports to {getParentName(users, u.parentId)}
                      </div>
                    </div>
                  </div>
                  <span className="dn-movement-arrow">\u8646</span>
                </button>
              ))}
            </div>
          </div>
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
