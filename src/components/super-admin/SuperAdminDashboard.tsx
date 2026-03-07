import { useState } from 'react';
import './SuperAdmin.css';

interface BrandPerformance {
  brand: string;
  vertical: string;
  dealers: number;
  policies: number;
  gwp: string;
  claimsRatio: number;
}

const platformMetrics = [
  { label: 'Total Brands', value: '6', sub: 'Across 4 verticals' },
  { label: 'Total Dealers', value: '890', sub: '+23 this month' },
  { label: 'Total Policies', value: '78,234', sub: '+4,312 this month' },
  { label: 'GWP', value: '\u20B932.5Cr', sub: 'FY 2025-26' },
  { label: 'Claims Ratio', value: '11.2%', sub: 'Within target' },
];

const brandPerformance: BrandPerformance[] = [
  { brand: 'Samsung', vertical: 'Electronics Retail', dealers: 234, policies: 24512, gwp: '\u20B910.2Cr', claimsRatio: 9.8 },
  { brand: 'Xiaomi', vertical: 'Electronics Retail', dealers: 189, policies: 18234, gwp: '\u20B97.1Cr', claimsRatio: 10.5 },
  { brand: 'Ather', vertical: 'EV 2-Wheeler', dealers: 145, policies: 12890, gwp: '\u20B96.8Cr', claimsRatio: 12.1 },
  { brand: 'Ola', vertical: 'EV 2-Wheeler', dealers: 132, policies: 10234, gwp: '\u20B94.5Cr', claimsRatio: 13.4 },
  { brand: 'Bajaj', vertical: 'EV 2-Wheeler', dealers: 112, policies: 8123, gwp: '\u20B92.8Cr', claimsRatio: 11.0 },
  { brand: 'TVS', vertical: 'EV 2-Wheeler', dealers: 78, policies: 4241, gwp: '\u20B91.1Cr', claimsRatio: 10.2 },
];

const recentActivity = [
  { text: 'Samsung onboarded 12 new dealers in Maharashtra', time: '2 hours ago', dot: 'dot-success' },
  { text: 'Ather claims ratio crossed 12% threshold', time: '4 hours ago', dot: 'dot-warning' },
  { text: 'Ola EV monthly GWP target achieved (102%)', time: '6 hours ago', dot: 'dot-success' },
  { text: 'Xiaomi dealer KYC pending review: 8 dealers', time: '8 hours ago', dot: 'dot-info' },
  { text: 'Bajaj Chetak plan pricing updated by brand admin', time: '12 hours ago', dot: 'dot-info' },
  { text: 'TVS integration API error rate spike (3.2%)', time: '1 day ago', dot: 'dot-error' },
  { text: 'System settlement batch processed: 1,234 payouts', time: '1 day ago', dot: 'dot-success' },
  { text: 'Samsung extended warranty plan template updated', time: '2 days ago', dot: 'dot-info' },
];

export default function SuperAdminDashboard() {
  const [sortField, setSortField] = useState<keyof BrandPerformance>('gwp');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof BrandPerformance) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sorted = [...brandPerformance].sort((a, b) => {
    const av = a[sortField];
    const bv = b[sortField];
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortAsc ? av - bv : bv - av;
    }
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Platform Dashboard</h1>
          <p>Cross-brand overview of mPOS performance</p>
        </div>
        <button className="btn-secondary">Export Report</button>
      </div>

      <div className="sa-metrics-grid">
        {platformMetrics.map((m) => (
          <div key={m.label} className="card sa-metric-card">
            <span className="metric-label">{m.label}</span>
            <span className="metric-value">{m.value}</span>
            <span className="metric-sub">{m.sub}</span>
          </div>
        ))}
      </div>

      <div className="sa-two-col">
        <div className="sa-section">
          <h2 className="sa-section-title">Brand Performance</h2>
          <div className="card sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('brand')} style={{ cursor: 'pointer' }}>Brand</th>
                  <th onClick={() => handleSort('vertical')} style={{ cursor: 'pointer' }}>Vertical</th>
                  <th onClick={() => handleSort('dealers')} style={{ cursor: 'pointer' }}>Dealers</th>
                  <th onClick={() => handleSort('policies')} style={{ cursor: 'pointer' }}>Policies</th>
                  <th onClick={() => handleSort('gwp')} style={{ cursor: 'pointer' }}>GWP</th>
                  <th onClick={() => handleSort('claimsRatio')} style={{ cursor: 'pointer' }}>Claims Ratio</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((b) => (
                  <tr key={b.brand}>
                    <td className="td-bold">{b.brand}</td>
                    <td>{b.vertical}</td>
                    <td>{b.dealers.toLocaleString()}</td>
                    <td>{b.policies.toLocaleString()}</td>
                    <td className="td-bold">{b.gwp}</td>
                    <td>
                      <span className={`badge ${b.claimsRatio > 12 ? 'badge-warning' : 'badge-success'}`}>
                        {b.claimsRatio}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sa-section">
          <h2 className="sa-section-title">Recent Activity</h2>
          <div className="card">
            <div className="sa-activity-feed">
              {recentActivity.map((a, i) => (
                <div key={i} className="sa-activity-item">
                  <div className={`sa-activity-dot ${a.dot}`} />
                  <div className="sa-activity-content">
                    <div className="sa-activity-text">{a.text}</div>
                    <div className="sa-activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
