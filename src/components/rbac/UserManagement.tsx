import { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';
import type { User } from '../../types/mpos';
import KYCAutoVerification from '../agents/KYCAutoVerification';
import './UserManagement.css';

const kycBadge: Record<string, string> = {
  approved: 'badge-success',
  pending: 'badge-warning',
  submitted: 'badge-info',
  rejected: 'badge-error',
  'in-progress': 'badge-info',
};

const roleLabelMap: Record<string, string> = {
  promoter: 'Promoter',
  dealer: 'Dealer',
  distributor: 'Distributor',
  'brand-admin': 'Brand Admin',
  'acko-super-admin': 'Super Admin',
};

const verticalLabelMap: Record<string, string> = {
  'electronics-retail': 'Electronics Retail',
  'electronics-asc': 'Electronics ASC',
  'ev-2w': 'EV 2-Wheeler',
  'ev-4w': 'EV 4-Wheeler',
};

// Mock KYC docs for the drawer
const kycDocs = [
  { name: 'PAN Card', file: 'pan_card.pdf', status: 'verified' },
  { name: 'Aadhaar Card', file: 'aadhaar_front.pdf', status: 'verified' },
  { name: 'Bank Passbook / Cheque', file: 'bank_proof.pdf', status: 'pending' },
  { name: 'Shop Registration', file: 'shop_license.pdf', status: 'pending' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filterRole, setFilterRole] = useState('all');
  const [filterKyc, setFilterKyc] = useState('all');
  const [search, setSearch] = useState('');

  // Add User modal
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '', role: 'promoter', brand: 'Samsung', vertical: 'electronics-retail' });

  // Role edit modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');

  // KYC Drawer
  const [kycUser, setKycUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filterRole !== 'all' && u.role !== filterRole) return false;
      if (filterKyc !== 'all' && u.kycStatus !== filterKyc) return false;
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.phone.includes(search)) return false;
      return true;
    });
  }, [users, filterRole, filterKyc, search]);

  const handleToggleActive = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const handleAddUser = () => {
    const user: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role as User['role'],
      vertical: newUser.vertical as User['vertical'],
      brand: newUser.brand as User['brand'],
      kycStatus: 'pending',
      isActive: false,
    };
    setUsers((prev) => [user, ...prev]);
    setNewUser({ name: '', phone: '', role: 'promoter', brand: 'Samsung', vertical: 'electronics-retail' });
    setShowAddUser(false);
  };

  const handleSaveRole = () => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: editRole as User['role'] } : u))
    );
    setEditingUser(null);
  };

  const handleKycAction = (action: 'approve' | 'reject') => {
    if (!kycUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === kycUser.id
          ? { ...u, kycStatus: action === 'approve' ? 'approved' : 'rejected', isActive: action === 'approve' }
          : u
      )
    );
    setKycUser(null);
  };

  return (
    <div className="rbac-page">
      <div className="rbac-page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage users, roles, and KYC verification</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddUser(true)}>+ Add User</button>
      </div>

      <div className="rbac-filter-bar">
        <input
          className="input-field"
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <select className="select-field" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="promoter">Promoter</option>
          <option value="dealer">Dealer</option>
          <option value="distributor">Distributor</option>
          <option value="brand-admin">Brand Admin</option>
        </select>
        <select className="select-field" value={filterKyc} onChange={(e) => setFilterKyc(e.target.value)}>
          <option value="all">All KYC Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card rbac-table-container">
        <table className="rbac-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Vertical</th>
              <th>Brand</th>
              <th>KYC Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="td-bold">{u.name}</td>
                <td>{u.phone}</td>
                <td>
                  <span className="badge badge-purple">{roleLabelMap[u.role] || u.role}</span>
                </td>
                <td>{verticalLabelMap[u.vertical] || u.vertical}</td>
                <td>{u.brand}</td>
                <td>
                  <span className={`badge ${kycBadge[u.kycStatus]}`}>
                    {u.kycStatus.charAt(0).toUpperCase() + u.kycStatus.slice(1)}
                  </span>
                </td>
                <td>
                  <label className="rbac-toggle">
                    <input
                      type="checkbox"
                      checked={u.isActive}
                      onChange={() => handleToggleActive(u.id)}
                    />
                    <span className="rbac-toggle-slider" />
                  </label>
                </td>
                <td>
                  <div className="rbac-actions">
                    <button
                      className="rbac-btn-icon"
                      title="Review KYC"
                      onClick={() => setKycUser(u)}
                    >
                      &#x1F4CB;
                    </button>
                    <button
                      className="rbac-btn-icon"
                      title="Edit Role"
                      onClick={() => { setEditingUser(u); setEditRole(u.role); }}
                    >
                      &#x270F;
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No users match the selected filters.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="rbac-overlay" onClick={() => setShowAddUser(false)}>
          <div className="rbac-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <div className="rbac-modal-field">
              <label>Full Name</label>
              <input
                className="input-field"
                placeholder="Enter full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="rbac-modal-field">
              <label>Phone Number</label>
              <input
                className="input-field"
                placeholder="10-digit mobile number"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
            <div className="rbac-modal-field">
              <label>Role</label>
              <select
                className="select-field"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="promoter">Promoter</option>
                <option value="dealer">Dealer</option>
                <option value="distributor">Distributor</option>
                <option value="brand-admin">Brand Admin</option>
              </select>
            </div>
            <div className="rbac-modal-field">
              <label>Brand</label>
              <select
                className="select-field"
                value={newUser.brand}
                onChange={(e) => setNewUser({ ...newUser, brand: e.target.value })}
              >
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Ather">Ather</option>
                <option value="Ola">Ola</option>
                <option value="Bajaj">Bajaj</option>
                <option value="TVS">TVS</option>
              </select>
            </div>
            <div className="rbac-modal-field">
              <label>Vertical</label>
              <select
                className="select-field"
                value={newUser.vertical}
                onChange={(e) => setNewUser({ ...newUser, vertical: e.target.value })}
              >
                <option value="electronics-retail">Electronics Retail</option>
                <option value="electronics-asc">Electronics ASC</option>
                <option value="ev-2w">EV 2-Wheeler</option>
                <option value="ev-4w">EV 4-Wheeler</option>
              </select>
            </div>
            <div className="rbac-modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.phone}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="rbac-overlay" onClick={() => setEditingUser(null)}>
          <div className="rbac-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Role & Permissions</h2>
            <div className="rbac-modal-field">
              <label>User</label>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{editingUser.name}</div>
            </div>
            <div className="rbac-modal-field">
              <label>Current Role</label>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                {roleLabelMap[editingUser.role]}
              </div>
            </div>
            <div className="rbac-modal-field">
              <label>New Role</label>
              <select
                className="select-field"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="promoter">Promoter</option>
                <option value="dealer">Dealer</option>
                <option value="distributor">Distributor</option>
                <option value="brand-admin">Brand Admin</option>
              </select>
            </div>
            <div className="rbac-modal-actions">
              <button className="btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveRole}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Review Drawer */}
      {kycUser && (
        <>
          <div className="rbac-drawer-overlay" onClick={() => setKycUser(null)} />
          <div className="rbac-drawer">
            <div className="rbac-drawer-header">
              <h2>KYC Review</h2>
              <button className="rbac-drawer-close" onClick={() => setKycUser(null)}>&#x2715;</button>
            </div>
            <div className="rbac-drawer-body">
              <div className="rbac-kyc-section">
                <h3>User Details</h3>
                <div className="rbac-kyc-field">
                  <span className="rbac-kyc-field-label">Name</span>
                  <span className="rbac-kyc-field-value">{kycUser.name}</span>
                </div>
                <div className="rbac-kyc-field">
                  <span className="rbac-kyc-field-label">Phone</span>
                  <span className="rbac-kyc-field-value">{kycUser.phone}</span>
                </div>
                <div className="rbac-kyc-field">
                  <span className="rbac-kyc-field-label">Role</span>
                  <span className="rbac-kyc-field-value">{roleLabelMap[kycUser.role]}</span>
                </div>
                <div className="rbac-kyc-field">
                  <span className="rbac-kyc-field-label">Brand</span>
                  <span className="rbac-kyc-field-value">{kycUser.brand}</span>
                </div>
                <div className="rbac-kyc-field">
                  <span className="rbac-kyc-field-label">KYC Status</span>
                  <span className={`badge ${kycBadge[kycUser.kycStatus]}`}>
                    {kycUser.kycStatus.charAt(0).toUpperCase() + kycUser.kycStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="rbac-kyc-section">
                <h3>Documents</h3>
                {kycDocs.map((doc) => (
                  <div key={doc.name} className="rbac-kyc-doc">
                    <div>
                      <div className="rbac-kyc-doc-name">{doc.name}</div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{doc.file}</div>
                    </div>
                    <span className={`badge rbac-kyc-doc-status ${doc.status === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                      {doc.status === 'verified' ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              <KYCAutoVerification userName={kycUser.name} />
            </div>
            <div className="rbac-drawer-footer">
              <button
                className="btn-secondary"
                style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                onClick={() => handleKycAction('reject')}
              >
                Reject KYC
              </button>
              <button className="btn-primary" onClick={() => handleKycAction('approve')}>
                Approve KYC
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
