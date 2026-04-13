import { agents, pendingReqs, meWithdrawals, cfgById } from './data';

export default function Dashboard({ onOpenTab }: { onOpenTab: (t: string) => void }) {
  const pendingTotal = pendingReqs.reduce((a, b) => a + b.amount, 0);
  const kycIssues = agents.filter((a) => a.kyc !== 'verified').length;
  return (
    <div>
      <h1 className="ii-h1">Dashboard</h1>
      <div className="ii-stats">
        <Stat label="Liability this month" value="Rs.8,030" />
        <Stat label="Pending withdrawals" value={`${pendingReqs.length}`} sub={`Rs.${pendingTotal} total`} />
        <Stat label="KYC issues" value={`${kycIssues}`} sub="1 not done, 1 expired" tone="amber" />
        <Stat label="AI suggestions" value="2" sub="Waiting for review" tone="accent" />
      </div>
      <div className="ii-two">
        <div className="ii-card">
          <h3>Top agents this month</h3>
          <table className="ii-tbl">
            <thead><tr><th>Name</th><th>Region</th><th>Policies</th><th>Earned</th><th>Config</th><th>KYC</th></tr></thead>
            <tbody>
              {[...agents].sort((a, b) => b.monthPolicies - a.monthPolicies).map((a) => {
                const c = cfgById(a.activeConfigId);
                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.region}</td>
                    <td>{a.monthPolicies}</td>
                    <td>Rs.{a.monthEarned}</td>
                    <td><span className={`ii-pill ${c?.type}`}>{c?.type}</span></td>
                    <td><span className={`ii-kyc ${a.kyc}`}>{a.kyc === 'not_done' ? 'Not done' : a.kyc}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="ii-card">
          <div className="ii-card-head">
            <h3>Recent withdrawal requests</h3>
            <button className="ii-link" onClick={() => onOpenTab('withdrawals')}>View all →</button>
          </div>
          {[...pendingReqs, ...meWithdrawals.slice(0, 2)].slice(0, 5).map((w) => (
            <div key={w.id} className="ii-list-row">
              <div>
                <div className="ii-strong">{w.agentName}</div>
                <div className="ii-muted">{w.requestedAt}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="ii-strong">Rs.{w.amount}</div>
                <span className={`ii-status ${w.status}`}>{w.status.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: 'amber' | 'accent' }) {
  return (
    <div className={`ii-stat ${tone ?? ''}`}>
      <div className="ii-stat-label">{label}</div>
      <div className="ii-stat-value">{value}</div>
      {sub && <div className="ii-stat-sub">{sub}</div>}
    </div>
  );
}
