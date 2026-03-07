import { brandMetrics } from '../../data/mockData';
import BrandInsights from '../agents/BrandInsights';
import './BrandAdmin.css';

const recentActivity = [
  { id: 1, text: 'New dealer "SpeedEV Dealers" registered from Ahmedabad', time: '2 hours ago', color: 'green' as const },
  { id: 2, text: 'Policy #POL-12847 issued for Samsung Galaxy S24 - Extended Warranty', time: '3 hours ago', color: 'blue' as const },
  { id: 3, text: 'Claim #CL-0892 filed for Ola S1 Pro - Theft reported', time: '5 hours ago', color: 'orange' as const },
  { id: 4, text: 'Dealer "Kumar Mobile Hub" crossed 50 monthly sales milestone', time: '8 hours ago', color: 'purple' as const },
  { id: 5, text: 'Commission payout of Rs.45,200 processed for 12 dealers', time: '1 day ago', color: 'green' as const },
];

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `Rs.${(amount / 100000).toFixed(1)}L`;
  }
  return `Rs.${amount.toLocaleString('en-IN')}`;
}

export default function BrandAdminDashboard() {
  const metrics = [
    { label: 'Total Dealers', value: brandMetrics.totalDealers.toString(), sub: 'Across all cities' },
    { label: 'Active Dealers', value: brandMetrics.activeDealers.toString(), sub: `${((brandMetrics.activeDealers / brandMetrics.totalDealers) * 100).toFixed(0)}% activation rate` },
    { label: 'Total Policies', value: brandMetrics.totalPolicies.toLocaleString('en-IN'), sub: 'All time' },
    { label: 'Month Policies', value: brandMetrics.monthPolicies.toLocaleString('en-IN'), sub: 'March 2026' },
    { label: 'GWP', value: formatCurrency(brandMetrics.gwp), sub: 'Gross Written Premium' },
    { label: 'Claims Ratio', value: `${brandMetrics.claimsRatio}%`, sub: 'Below industry average' },
  ];

  return (
    <div className="ba-page">
      <div className="ba-page-header">
        <h1>Brand Admin Dashboard</h1>
        <div className="ba-page-header-actions">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">+ Add Dealer</button>
        </div>
      </div>

      <div className="ba-metrics-grid">
        {metrics.map((m) => (
          <div key={m.label} className="ba-metric-card">
            <div className="ba-metric-label">{m.label}</div>
            <div className="ba-metric-value">{m.value}</div>
            <div className="ba-metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <BrandInsights />

      <div className="ba-dashboard-grid">
        <div className="ba-activity-feed">
          <h3>Recent Activity</h3>
          {recentActivity.map((item) => (
            <div key={item.id} className="ba-activity-item">
              <div className={`ba-activity-dot ${item.color}`} />
              <div>
                <div className="ba-activity-text">{item.text}</div>
                <div className="ba-activity-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ba-quick-actions">
          <h3>Quick Actions</h3>
          <div className="ba-quick-actions-list">
            <button className="btn-primary">Add Dealer</button>
            <button className="btn-secondary">View Reports</button>
            <button className="btn-secondary">Manage Products</button>
          </div>
        </div>
      </div>
    </div>
  );
}
