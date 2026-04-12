import { useNavigate } from 'react-router-dom';
import { brandMetrics } from '../../data/mockData';
import { formatINR } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './BrandAdmin.css';

interface AIAlert {
  type: 'trend' | 'alert' | 'recommendation' | 'anomaly';
  title: string;
  description: string;
  action?: string;
  metric?: string;
}

const aiAlerts: AIAlert[] = [
  {
    type: 'alert',
    title: 'Loss ratio trending up on Samsung A-series',
    description: 'Screen-damage claims have doubled over the last 30 days. Pattern matches a known defective batch from Q4 2025. Recommend tightening eligibility.',
    action: 'Review with actuary',
    metric: '+3.2pp MoM',
  },
  {
    type: 'anomaly',
    title: 'Croma Koramangala — 0 sales in 14 days',
    description: 'Normally ranks top 5. Last sale was 12 March. Dealer may need outreach.',
    action: 'Contact dealer',
  },
  {
    type: 'recommendation',
    title: 'Karnataka attach rate is 4pp below national average',
    description: 'A state-specific campaign here may have the highest ROI. Comparable brands saw 23% attach rate uplift at 12% discount.',
    action: 'Create campaign',
  },
  {
    type: 'trend',
    title: 'Fraud Gate prevented ₹4.2L exposure this week',
    description: 'Auto-flagged 17 suspicious claims. 9 were confirmed fraud. Model precision is 92%.',
    metric: '+₹4.2L saved',
  },
];

const topDealers = [
  { name: 'Croma Koramangala', sales: 234, revenue: 1240000 },
  { name: 'Reliance Digital Bengaluru', sales: 198, revenue: 1090000 },
  { name: 'Sangeetha Mobiles Chennai', sales: 176, revenue: 895000 },
  { name: 'Poorvika Mobiles', sales: 143, revenue: 762000 },
  { name: 'Vijay Sales Andheri', sales: 128, revenue: 681000 },
];

function formatCompact(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return formatINR(amount);
}

export default function BrandAdminDashboard() {
  const navigate = useNavigate();

  const alertTypeMeta = (type: AIAlert['type']) => {
    switch (type) {
      case 'alert': return { emoji: '⚠', color: 'warning' };
      case 'anomaly': return { emoji: '⚑', color: 'error' };
      case 'recommendation': return { emoji: '✨', color: 'info' };
      case 'trend': return { emoji: '↑', color: 'success' };
    }
  };

  return (
    <div className="ba-page">
      <header className="ba-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-secondary">What’s happening across Xiaomi India — March 2026</p>
        </div>
        <div className="ba-header-actions">
          <button className="btn-secondary" onClick={() => navigate('/invoices')}>Download MIS</button>
          <button className="btn-primary" onClick={() => navigate('/campaigns/new')}>+ New campaign</button>
        </div>
      </header>

      {/* KPI row */}
      <div className="ba-kpi-row">
        <div className="ba-kpi card">
          <div className="ba-kpi-label">GWP this month</div>
          <div className="ba-kpi-value">{formatCompact(brandMetrics.gwp)}</div>
          <div className="ba-kpi-delta success">&#9650; 12% vs Feb</div>
        </div>
        <div className="ba-kpi card">
          <div className="ba-kpi-label">Policies issued</div>
          <div className="ba-kpi-value">{brandMetrics.monthPolicies.toLocaleString('en-IN')}</div>
          <div className="ba-kpi-delta success">&#9650; 8% vs Feb</div>
        </div>
        <div className="ba-kpi card">
          <div className="ba-kpi-label">Active dealers</div>
          <div className="ba-kpi-value">{brandMetrics.activeDealers}</div>
          <div className="ba-kpi-delta text-secondary">of {brandMetrics.totalDealers} total</div>
        </div>
        <div className="ba-kpi card">
          <div className="ba-kpi-label">Attach rate</div>
          <div className="ba-kpi-value">8.4%</div>
          <div className="ba-kpi-delta error">&#9660; 0.3pp vs Feb</div>
        </div>
      </div>

      {/* AI Alerts — front and center */}
      <section className="ba-ai-section">
        <div className="ba-ai-header">
          <div className="ba-ai-title-group">
            <AIBadge label="AI Insights" shimmer />
            <h2>Needs your attention</h2>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/ask')}>
            Ask MPOS &rarr;
          </button>
        </div>
        <div className="ba-ai-grid">
          {aiAlerts.map((alert, i) => {
            const meta = alertTypeMeta(alert.type);
            return (
              <div key={i} className={`ba-ai-card ba-ai-card-${meta.color}`}>
                <div className="ba-ai-card-header">
                  <div className={`ba-ai-icon ba-ai-icon-${meta.color}`}>{meta.emoji}</div>
                  {alert.metric && <span className={`badge badge-${meta.color}`}>{alert.metric}</span>}
                </div>
                <div className="ba-ai-card-title">{alert.title}</div>
                <div className="ba-ai-card-desc">{alert.description}</div>
                {alert.action && (
                  <button className="ba-ai-card-action">
                    {alert.action} &rarr;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Onboarding quick actions */}
      <div className="ba-ai-onboarding">
        <button className="ba-ai-tile" onClick={() => navigate('/setup-wizard')}>
          <div className="ba-ai-tile-icon">&#10022;</div>
          <div>
            <div className="ba-ai-tile-title">First-time setup wizard</div>
            <div className="ba-ai-tile-sub">6-step guided flow to onboard your entire team — ~10 minutes</div>
          </div>
          <AIBadge label="AI" />
        </button>
        <button className="ba-ai-tile" onClick={() => navigate('/bulk-onboarding')}>
          <div className="ba-ai-tile-icon">&#128228;</div>
          <div>
            <div className="ba-ai-tile-title">Bulk onboard users</div>
            <div className="ba-ai-tile-sub">AI normalises any partner file format — 3 hours → 3 minutes</div>
          </div>
          <AIBadge label="AI" />
        </button>
        <button className="ba-ai-tile" onClick={() => navigate('/plan-config')}>
          <div className="ba-ai-tile-icon">&#128196;</div>
          <div>
            <div className="ba-ai-tile-title">Generate plan config</div>
            <div className="ba-ai-tile-sub">AI pre-fills 42 fields from a deal brief using reference partners</div>
          </div>
          <AIBadge label="AI" />
        </button>
        <button className="ba-ai-tile" onClick={() => navigate('/ask')}>
          <div className="ba-ai-tile-icon">&#10022;</div>
          <div>
            <div className="ba-ai-tile-title">Ask MPOS</div>
            <div className="ba-ai-tile-sub">Natural-language queries, insights, and one-tap actions</div>
          </div>
          <AIBadge label="AI" />
        </button>
      </div>

      <div className="ba-split">
        {/* Trend chart */}
        <div className="card ba-chart-card">
          <div className="ba-card-title">GWP & policies — last 6 months</div>
          <svg viewBox="0 0 600 220" className="ba-chart-svg">
            <defs>
              <linearGradient id="ba-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="40" y1={30 + i * 35} x2="580" y2={30 + i * 35} stroke="#E2E8F0" strokeDasharray="3 3" />
            ))}
            {/* Line + area */}
            <path
              d="M 60 150 L 150 130 L 240 115 L 330 95 L 420 80 L 510 55 L 510 170 L 60 170 Z"
              fill="url(#ba-area)"
            />
            <path
              d="M 60 150 L 150 130 L 240 115 L 330 95 L 420 80 L 510 55"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {[
              { x: 60, y: 150 },
              { x: 150, y: 130 },
              { x: 240, y: 115 },
              { x: 330, y: 95 },
              { x: 420, y: 80 },
              { x: 510, y: 55 },
            ].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="5" fill="white" stroke="#3B82F6" strokeWidth="3" />
            ))}
            {/* X labels */}
            {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((m, i) => (
              <text key={m} x={60 + i * 90} y="200" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="DM Sans" fontWeight="500">
                {m}
              </text>
            ))}
          </svg>
        </div>

        {/* Top dealers */}
        <div className="card ba-leaderboard-card">
          <div className="ba-card-title">Top dealers this month</div>
          <div className="ba-dealer-list">
            {topDealers.map((d, i) => (
              <div key={d.name} className="ba-dealer-row">
                <div className={`ba-dealer-rank rank-${i + 1}`}>{i + 1}</div>
                <div className="ba-dealer-info">
                  <div className="ba-dealer-name">{d.name}</div>
                  <div className="ba-dealer-sub">{d.sales} policies</div>
                </div>
                <div className="ba-dealer-revenue">{formatCompact(d.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending approvals */}
      <div className="card ba-approvals-card">
        <div className="ba-card-title">Pending approvals</div>
        <div className="ba-approval-list">
          <div className="ba-approval-row">
            <span className="badge badge-warning">KYC</span>
            <span>2 dealer KYC reviews awaiting verification</span>
            <button className="btn-ghost">Review &rarr;</button>
          </div>
          <div className="ba-approval-row">
            <span className="badge badge-info">Withdrawal</span>
            <span>₹68,400 withdrawal request from Croma Koramangala</span>
            <button className="btn-ghost">Review &rarr;</button>
          </div>
          <div className="ba-approval-row">
            <span className="badge badge-purple">Role change</span>
            <span>3 agent role-change requests pending</span>
            <button className="btn-ghost">Review &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
