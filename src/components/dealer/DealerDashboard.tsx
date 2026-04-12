import { useNavigate } from 'react-router-dom';
import { dealerMetrics, sales, promoters, claims, getProductById } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import InactivityAgent from '../agents/InactivityAgent';
import './DealerDashboard.css';

const metricCards = [
  { icon: '\u{1F4CA}', label: 'Total Sales', value: dealerMetrics.totalSales.toLocaleString('en-IN') },
  { icon: '\u{1F4C5}', label: 'This Month', value: dealerMetrics.monthSales.toLocaleString('en-IN') },
  { icon: '\u{1F465}', label: 'Active Promoters', value: dealerMetrics.activePromoters.toLocaleString('en-IN') },
  { icon: '\u{1F4B0}', label: 'Commission Earned', value: `₹${dealerMetrics.totalCommission.toLocaleString('en-IN')}` },
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
    case 'completed':
    case 'active':
    case 'approved':
    case 'settled':
      return 'badge-success';
    case 'pending':
    case 'submitted':
    case 'under-review':
      return 'badge-warning';
    case 'cancelled':
    case 'inactive':
    case 'rejected':
      return 'badge-error';
    default:
      return 'badge-info';
  }
}

export default function DealerDashboard() {
  const navigate = useNavigate();
  const { activeRole } = useAppStore();

  const pendingClaims = claims.filter(c => c.status === 'submitted' || c.status === 'under-review');

  return (
    <div className="dealer-dashboard">
      {/* Greeting Bar */}
      <div className="dealer-greeting">
        <h1 className="greeting-text">{getGreeting()}, Rajesh Electronics</h1>
        <p className="greeting-subtext">Role: {activeRole} | Here's your dashboard overview</p>
      </div>

      {/* Metric Cards */}
      <div className="dealer-metrics-row">
        {metricCards.map((metric) => (
          <div className="dealer-metric-card card" key={metric.label}>
            <span className="metric-icon">{metric.icon}</span>
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dealer-quick-actions">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-row">
          <button className="btn-primary" onClick={() => navigate('/sale/new')}>
            New Sale
          </button>
          <button className="btn-secondary" onClick={() => navigate('/claims/new')}>
            File Claim
          </button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            View Reports
          </button>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="dealer-section card">
        <h2 className="section-title">Recent Sales</h2>
        <div className="dealer-list">
          {sales.map((sale) => {
            const product = getProductById(sale.productId);
            return (
              <div className="dealer-list-item" key={sale.id}>
                <div className="list-item-main">
                  <span className="list-item-name">{product?.name ?? 'Unknown Product'}</span>
                  <span className="list-item-date">{formatDate(sale.date)}</span>
                </div>
                <div className="list-item-meta">
                  <span className="list-item-commission">{`₹${sale.commission.toLocaleString('en-IN')}`}</span>
                  <span className={`badge ${getStatusClass(sale.status)}`}>{sale.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Promoter Performance */}
      <div className="dealer-section card">
        <h2 className="section-title">Promoter Performance</h2>
        {/* Desktop table */}
        <table className="dealer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sales</th>
              <th>Last Sale</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {promoters.map((promoter) => (
              <tr key={promoter.id}>
                <td>{promoter.name}</td>
                <td>{promoter.sales}</td>
                <td>{formatDate(promoter.lastSale)}</td>
                <td>
                  <span className={`badge ${getStatusClass(promoter.status)}`}>{promoter.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile list */}
        <div className="dealer-list mobile-only">
          {promoters.map((promoter) => (
            <div className="dealer-list-item" key={promoter.id}>
              <div className="list-item-main">
                <span className="list-item-name">{promoter.name}</span>
                <span className={`badge ${getStatusClass(promoter.status)}`}>{promoter.status}</span>
              </div>
              <div className="list-item-meta">
                <span className="list-item-date">{promoter.sales} sales</span>
                <span className="list-item-date">Last: {formatDate(promoter.lastSale)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Claims */}
      <div className="dealer-section card">
        <h2 className="section-title">Pending Claims</h2>
        {pendingClaims.length === 0 ? (
          <p className="empty-state">No pending claims</p>
        ) : (
          <div className="dealer-claims-grid">
            {pendingClaims.map((claim) => (
              <div className="claim-card card" key={claim.id}>
                <div className="claim-card-header">
                  <span className="claim-type">{claim.type}</span>
                  <span className={`badge ${getStatusClass(claim.status)}`}>{claim.status}</span>
                </div>
                <p className="claim-description">{claim.description}</p>
                <div className="claim-card-footer">
                  <span className="claim-amount">{claim.amount ? `₹${claim.amount.toLocaleString('en-IN')}` : '--'}</span>
                  <span className="claim-date">{formatDate(claim.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactivity Agent */}
      <InactivityAgent />
    </div>
  );
}
