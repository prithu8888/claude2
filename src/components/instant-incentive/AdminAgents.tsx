import { useState } from 'react';
import { agents, cfgById, meTxns, meWithdrawals, type Agent } from './data';

export default function AdminAgents() {
  const [open, setOpen] = useState<Agent | null>(null);
  return (
    <div>
      <h1 className="ii-h1">Agents</h1>
      <div className="ii-card">
        <table className="ii-tbl">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Region</th><th>Dealer</th><th>Policies</th><th>Earned</th><th>Balance</th><th>Active config</th><th>KYC</th><th></th></tr>
          </thead>
          <tbody>
            {agents.map((a) => {
              const c = cfgById(a.activeConfigId);
              return (
                <tr key={a.id}>
                  <td>{a.name}{a.fraudFlag && <span className="ii-flag" title={a.fraudReason}>⚠</span>}</td>
                  <td>{a.phone}</td>
                  <td>{a.region}</td>
                  <td>{a.dealerName}</td>
                  <td>{a.monthPolicies}</td>
                  <td>Rs.{a.monthEarned}</td>
                  <td>Rs.{a.balance}</td>
                  <td>{c?.name} <span className={`ii-pill ${c?.level}`}>{c?.level}</span></td>
                  <td><span className={`ii-kyc ${a.kyc}`}>{a.kyc === 'not_done' ? 'Not done' : a.kyc}</span></td>
                  <td><button className="ii-link" onClick={() => setOpen(a)}>View</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {open && <AgentDrawer agent={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function AgentDrawer({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const c = cfgById(agent.activeConfigId);
  return (
    <div className="ii-back" onClick={onClose}>
      <div className="ii-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ii-drawer-head">
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--navy)' }}>{agent.name}</h2>
            <div className="ii-muted">{agent.phone} · {agent.region} · Dealer: {agent.dealerName}</div>
          </div>
          <button className="ii-close" onClick={onClose}>✕</button>
        </div>
        <div className="ii-drawer-body">
          <div style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--navy)' }}>KYC</strong>
            <div style={{ marginTop: 4 }}><span className={`ii-kyc ${agent.kyc}`}>{agent.kyc === 'not_done' ? 'Not done' : agent.kyc}</span></div>
            {agent.kycExpiresAt && <div className="ii-muted" style={{ marginTop: 4 }}>Expires {agent.kycExpiresAt}</div>}
            <button className="ii-btn ii-btn-secondary" style={{ marginTop: 8 }}>Trigger KYC reminder</button>
          </div>
          <div style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--navy)' }}>Active config</strong>
            <div style={{ marginTop: 4 }}>{c?.name} <span className={`ii-pill ${c?.level}`}>{c?.level}</span></div>
            <div className="ii-muted">Effective from {c?.effectiveFrom}</div>
            <button className="ii-btn ii-btn-secondary" style={{ marginTop: 8 }}>Override config</button>
          </div>
          <div style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--navy)' }}>Balance</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 6, fontSize: 12 }}>
              <div><div className="ii-muted">Available</div><strong>Rs.{agent.balance}</strong></div>
              <div><div className="ii-muted">This month</div><strong>Rs.{agent.monthEarned}</strong></div>
              <div><div className="ii-muted">Total withdrawn</div><strong>Rs.{agent.totalWithdrawn}</strong></div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <strong style={{ color: 'var(--navy)' }}>Last transactions</strong>
            {meTxns.slice(0, 5).map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, borderBottom: '0.5px solid #eee' }}>
                <span>{t.kind === 'earning' ? `Policy #${t.policyId}` : `Withdrawal ${t.method}`}</span>
                <span style={{ color: t.kind === 'earning' ? 'var(--green)' : 'var(--red)' }}>{t.kind === 'earning' ? '+' : '-'}Rs.{t.amount}</span>
              </div>
            ))}
          </div>
          <div>
            <strong style={{ color: 'var(--navy)' }}>Last withdrawals</strong>
            {meWithdrawals.slice(0, 3).map((w) => (
              <div key={w.id} style={{ padding: '6px 0', fontSize: 12, borderBottom: '0.5px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rs.{w.amount} · {w.methodLabel}</span>
                  <span className={`ii-status ${w.status}`}>{w.status.replace('_', ' ')}</span>
                </div>
                <div className="ii-muted">{w.requestedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
