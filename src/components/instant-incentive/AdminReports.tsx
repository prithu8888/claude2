import { agents, cfgById, monthlyReport } from './data';

export default function AdminReports() {
  return (
    <div>
      <h1 className="ii-h1">Reports</h1>

      <div className="ii-card">
        <h3>Monthly incentive summary</h3>
        <table className="ii-tbl">
          <thead>
            <tr><th>Month</th><th>Policies</th><th>Earned</th><th>Withdrawn</th><th>Pending</th><th>Net liability</th></tr>
          </thead>
          <tbody>
            {monthlyReport.map((m) => (
              <tr key={m.month}>
                <td>{m.month}</td>
                <td>{m.policies}</td>
                <td>Rs.{m.earned.toLocaleString('en-IN')}</td>
                <td>Rs.{m.withdrawn.toLocaleString('en-IN')}</td>
                <td>Rs.{m.pending.toLocaleString('en-IN')}</td>
                <td><strong>Rs.{m.liability.toLocaleString('en-IN')}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ii-card">
        <div className="ii-card-head">
          <h3>Agent-level breakdown</h3>
          <button className="ii-btn ii-btn-secondary">Export CSV</button>
        </div>
        <table className="ii-tbl">
          <thead>
            <tr><th>Agent</th><th>Region</th><th>Policies</th><th>Earned</th><th>Withdrawn</th><th>Balance</th><th>Config</th></tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.region}</td>
                <td>{a.monthPolicies}</td>
                <td>Rs.{a.monthEarned}</td>
                <td>Rs.{a.totalWithdrawn}</td>
                <td>Rs.{a.balance}</td>
                <td>{cfgById(a.activeConfigId)?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ii-card">
        <h3>Config effectiveness</h3>
        <table className="ii-tbl">
          <thead>
            <tr><th>Config</th><th>Period</th><th>Agents</th><th>Avg policies/agent</th><th>Total payout</th></tr>
          </thead>
          <tbody>
            <tr><td>Karnataka Slab</td><td>Mar 2026 → ongoing</td><td>3</td><td>18.7</td><td>Rs.3,140</td></tr>
            <tr><td>Rajesh Kumar Override</td><td>Apr 2026 → ongoing</td><td>1</td><td>14</td><td>Rs.840</td></tr>
            <tr><td>Tamil Nadu Flat</td><td>Feb 2026 → ongoing</td><td>2</td><td>18.5</td><td>Rs.1,850</td></tr>
            <tr><td>Diwali Boost 2025</td><td>20–27 Oct 2025</td><td>14</td><td>34</td><td>Rs.32,600</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
