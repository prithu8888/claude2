import { useState } from 'react';
import './SuperAdmin.css';

interface BrandEntry {
  id: string;
  name: string;
  vertical: string;
  dealers: number;
  policies: number;
  gwp: string;
  status: 'active' | 'onboarding' | 'suspended';
  logo: string;
}

const brandsData: BrandEntry[] = [
  { id: 'b1', name: 'Samsung', vertical: 'Electronics Retail', dealers: 234, policies: 24512, gwp: '₹10.2Cr', status: 'active', logo: 'S' },
  { id: 'b2', name: 'Xiaomi', vertical: 'Electronics Retail', dealers: 189, policies: 18234, gwp: '₹7.1Cr', status: 'active', logo: 'X' },
  { id: 'b3', name: 'Ather', vertical: 'EV 2-Wheeler', dealers: 145, policies: 12890, gwp: '₹6.8Cr', status: 'active', logo: 'A' },
  { id: 'b4', name: 'Ola', vertical: 'EV 2-Wheeler', dealers: 132, policies: 10234, gwp: '₹4.5Cr', status: 'active', logo: 'O' },
  { id: 'b5', name: 'Bajaj', vertical: 'EV 2-Wheeler', dealers: 112, policies: 8123, gwp: '₹2.8Cr', status: 'onboarding', logo: 'B' },
  { id: 'b6', name: 'TVS', vertical: 'EV 2-Wheeler', dealers: 78, policies: 4241, gwp: '₹1.1Cr', status: 'active', logo: 'T' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-success',
  onboarding: 'badge-warning',
  suspended: 'badge-error',
};

export default function SuperAdminBrands() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVertical, setFilterVertical] = useState('all');

  const filtered = brandsData.filter((b) => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (filterVertical !== 'all' && b.vertical !== filterVertical) return false;
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Brand Management</h1>
          <p>Manage partner brands and their configurations</p>
        </div>
        <button className="btn-primary">+ Add Brand</button>
      </div>

      <div className="sa-filter-bar">
        <select
          className="select-field"
          value={filterVertical}
          onChange={(e) => setFilterVertical(e.target.value)}
        >
          <option value="all">All Verticals</option>
          <option value="Electronics Retail">Electronics Retail</option>
          <option value="EV 2-Wheeler">EV 2-Wheeler</option>
          <option value="EV 4-Wheeler">EV 4-Wheeler</option>
        </select>
        <select
          className="select-field"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="onboarding">Onboarding</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="card sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Vertical</th>
              <th>Dealers</th>
              <th>Policies</th>
              <th>GWP</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--acko-purple-bg)',
                        color: 'var(--acko-purple)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      {b.logo}
                    </div>
                    <span className="td-bold">{b.name}</span>
                  </div>
                </td>
                <td>{b.vertical}</td>
                <td>{b.dealers.toLocaleString()}</td>
                <td>{b.policies.toLocaleString()}</td>
                <td className="td-bold">{b.gwp}</td>
                <td>
                  <span className={`badge ${statusBadge[b.status]}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="sa-actions">
                    <button className="sa-btn-icon" title="View Details">&#x1F441;</button>
                    <button className="sa-btn-icon" title="Edit">&#x270F;</button>
                    <button className="sa-btn-icon" title="Settings">&#x2699;</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
