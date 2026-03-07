import { useNavigate } from 'react-router-dom';
import { dealers } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import './DistributorDashboard.css';

const distributorMetrics = [
  { icon: '\u{1F3EA}', label: 'Total Dealers', value: '8' },
  { icon: '\u2705', label: 'Active Dealers', value: '6' },
  { icon: '\u{1F4B8}', label: 'Total GWP', value: '\u20B942.5L' },
  { icon: '\u{1F4CA}', label: 'Claims Ratio', value: '12.4%' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'inactive':
      return 'badge-error';
    default:
      return 'badge-info';
  }
}

export default function DistributorDashboard() {
  const navigate = useNavigate();
  const { activeRole } = useAppStore();

  const activeDealerCount = dealers.filter(d => d.status === 'active').length;
  const totalSales = dealers.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="distributor-dashboard">
      {/* Greeting Bar */}
      <div className="distributor-greeting">
        <h1 className="greeting-text">{getGreeting()}, Distributor</h1>
        <p className="greeting-subtext">Role: {activeRole} | {activeDealerCount} of {dealers.length} dealers active | {totalSales} total sales</p>
      </div>

      {/* Metric Cards */}
      <div className="distributor-metrics-row">
        {distributorMetrics.map((metric) => (
          <div className="distributor-metric-card card" key={metric.label}>
            <span className="dist-metric-icon">{metric.icon}</span>
            <span className="dist-metric-value">{metric.value}</span>
            <span className="dist-metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="distributor-quick-actions">
        <h2 className="dist-section-title">Quick Actions</h2>
        <div className="dist-actions-row">
          <button className="btn-primary" onClick={() => navigate('/dealers/add')}>
            Add Dealer
          </button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            View Reports
          </button>
          <button className="btn-secondary" onClick={() => navigate('/settlements')}>
            Settlements
          </button>
        </div>
      </div>

      {/* Dealer Performance */}
      <div className="distributor-section card">
        <h2 className="dist-section-title">Dealer Performance</h2>

        {/* Desktop table */}
        <table className="distributor-table">
          <thead>
            <tr>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Sales</th>
              <th>Status</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id}>
                <td className="dealer-name-cell">{dealer.name}</td>
                <td>{dealer.city}</td>
                <td>{dealer.sales}</td>
                <td>
                  <span className={`badge ${getStatusClass(dealer.status)}`}>{dealer.status}</span>
                </td>
                <td>{formatDate(dealer.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile list */}
        <div className="distributor-list dist-mobile-only">
          {dealers.map((dealer) => (
            <div className="distributor-list-item" key={dealer.id}>
              <div className="dist-list-main">
                <div className="dist-list-header">
                  <span className="dist-list-name">{dealer.name}</span>
                  <span className={`badge ${getStatusClass(dealer.status)}`}>{dealer.status}</span>
                </div>
                <div className="dist-list-details">
                  <span className="dist-list-city">{dealer.city}</span>
                  <span className="dist-list-separator">|</span>
                  <span className="dist-list-sales">{dealer.sales} sales</span>
                </div>
              </div>
              <div className="dist-list-meta">
                <span className="dist-list-date">Last: {formatDate(dealer.lastActive)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Breakdown */}
      <div className="distributor-section card">
        <h2 className="dist-section-title">Regional Breakdown</h2>
        <div className="regional-chart-placeholder">
          <div className="region-bars">
            {[
              { region: 'Mumbai', value: 89, pct: 79 },
              { region: 'Delhi', value: 67, pct: 60 },
              { region: 'Bengaluru', value: 112, pct: 100 },
              { region: 'Chennai', value: 45, pct: 40 },
              { region: 'Pune', value: 23, pct: 21 },
              { region: 'Hyderabad', value: 78, pct: 70 },
              { region: 'Kolkata', value: 12, pct: 11 },
              { region: 'Ahmedabad', value: 56, pct: 50 },
            ].map((r) => (
              <div className="region-bar-row" key={r.region}>
                <span className="region-label">{r.region}</span>
                <div className="region-bar-track">
                  <div
                    className="region-bar-fill"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <span className="region-value">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
