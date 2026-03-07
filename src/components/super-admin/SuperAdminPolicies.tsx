import { useState } from 'react';
import './SuperAdmin.css';

interface PolicyRow {
  id: string;
  policyNumber: string;
  brand: string;
  vertical: string;
  product: string;
  plan: string;
  customer: string;
  premium: number;
  date: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
}

const policiesData: PolicyRow[] = [
  { id: 'pol1', policyNumber: 'POL-2026-00341', brand: 'Samsung', vertical: 'Electronics Retail', product: 'Galaxy S24', plan: 'Extended Warranty 2Y', customer: 'Rajesh M.', premium: 3499, date: '2026-03-06', status: 'active' },
  { id: 'pol2', policyNumber: 'POL-2026-00340', brand: 'Ather', vertical: 'EV 2-Wheeler', product: 'Ather 450X', plan: 'Comprehensive 1Y', customer: 'Deepa S.', premium: 5999, date: '2026-03-05', status: 'active' },
  { id: 'pol3', policyNumber: 'POL-2026-00339', brand: 'Xiaomi', vertical: 'Electronics Retail', product: 'Xiaomi 14 Ultra', plan: 'Extended Warranty 1Y', customer: 'Arun K.', premium: 2199, date: '2026-03-04', status: 'pending' },
  { id: 'pol4', policyNumber: 'POL-2026-00338', brand: 'Ola', vertical: 'EV 2-Wheeler', product: 'Ola S1 Pro', plan: 'Comprehensive 1Y', customer: 'Meera P.', premium: 4999, date: '2026-03-03', status: 'active' },
  { id: 'pol5', policyNumber: 'POL-2026-00337', brand: 'Samsung', vertical: 'Electronics Retail', product: 'Galaxy Tab S9', plan: 'ALD 1Y', customer: 'Suresh R.', premium: 2299, date: '2026-03-02', status: 'active' },
  { id: 'pol6', policyNumber: 'POL-2026-00336', brand: 'Bajaj', vertical: 'EV 2-Wheeler', product: 'Bajaj Chetak', plan: 'Comprehensive 1Y', customer: 'Vikram T.', premium: 5499, date: '2026-03-01', status: 'expired' },
  { id: 'pol7', policyNumber: 'POL-2026-00335', brand: 'Samsung', vertical: 'Electronics ASC', product: 'Washing Machine', plan: 'Extended Warranty 2Y', customer: 'Priya D.', premium: 2999, date: '2026-02-28', status: 'active' },
  { id: 'pol8', policyNumber: 'POL-2026-00334', brand: 'TVS', vertical: 'EV 2-Wheeler', product: 'TVS iQube', plan: 'Third Party 1Y', customer: 'Karthik N.', premium: 1899, date: '2026-02-27', status: 'cancelled' },
  { id: 'pol9', policyNumber: 'POL-2026-00333', brand: 'Ather', vertical: 'EV 2-Wheeler', product: 'Ather 450X', plan: 'Personal Accident', customer: 'Anita G.', premium: 999, date: '2026-02-26', status: 'active' },
  { id: 'pol10', policyNumber: 'POL-2026-00332', brand: 'Xiaomi', vertical: 'Electronics Retail', product: 'Xiaomi 14 Ultra', plan: 'Extended Warranty 2Y', customer: 'Ramesh B.', premium: 3999, date: '2026-02-25', status: 'pending' },
];

const statusBadge: Record<string, string> = {
  active: 'badge-success',
  pending: 'badge-warning',
  expired: 'badge-error',
  cancelled: 'badge-error',
};

export default function SuperAdminPolicies() {
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterVertical, setFilterVertical] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  const filtered = policiesData.filter((p) => {
    if (filterBrand !== 'all' && p.brand !== filterBrand) return false;
    if (filterVertical !== 'all' && p.vertical !== filterVertical) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterDate && p.date < filterDate) return false;
    return true;
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Policy Oversight</h1>
          <p>Cross-brand policy monitoring and management</p>
        </div>
        <button className="btn-secondary">Export CSV</button>
      </div>

      <div className="sa-filter-bar">
        <select className="select-field" value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="all">All Brands</option>
          <option value="Samsung">Samsung</option>
          <option value="Xiaomi">Xiaomi</option>
          <option value="Ather">Ather</option>
          <option value="Ola">Ola</option>
          <option value="Bajaj">Bajaj</option>
          <option value="TVS">TVS</option>
        </select>
        <select className="select-field" value={filterVertical} onChange={(e) => setFilterVertical(e.target.value)}>
          <option value="all">All Verticals</option>
          <option value="Electronics Retail">Electronics Retail</option>
          <option value="Electronics ASC">Electronics ASC</option>
          <option value="EV 2-Wheeler">EV 2-Wheeler</option>
          <option value="EV 4-Wheeler">EV 4-Wheeler</option>
        </select>
        <select className="select-field" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="input-field"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ minWidth: 160 }}
        />
      </div>

      <div className="card sa-table-container">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Policy #</th>
              <th>Brand</th>
              <th>Vertical</th>
              <th>Product</th>
              <th>Plan</th>
              <th>Customer</th>
              <th>Premium</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="td-mono">{p.policyNumber}</td>
                <td className="td-bold">{p.brand}</td>
                <td>{p.vertical}</td>
                <td>{p.product}</td>
                <td>{p.plan}</td>
                <td>{p.customer}</td>
                <td>{'\u20B9'}{p.premium.toLocaleString()}</td>
                <td>{p.date}</td>
                <td>
                  <span className={`badge ${statusBadge[p.status]}`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No policies match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
