import { useState } from 'react';
import { meTxns } from './data';

export default function AgentHistory() {
  const [filter, setFilter] = useState<'all' | 'earning' | 'withdrawal'>('all');
  const filtered = meTxns.filter((t) => filter === 'all' || t.kind === filter);
  const earned = meTxns.filter((t) => t.kind === 'earning').reduce((a, b) => a + b.amount, 0);
  const withdrawn = meTxns.filter((t) => t.kind === 'withdrawal').reduce((a, b) => a + b.amount, 0);

  return (
    <div>
      <h2 className="ii-h2">All transactions</h2>
      <div className="ii-pills">
        {(['all', 'earning', 'withdrawal'] as const).map((f) => (
          <button key={f} className={`ii-pill-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'earning' ? 'Earnings' : 'Withdrawals'}
          </button>
        ))}
      </div>
      <div className="ii-strip">April: +Rs.{earned} earned · -Rs.{withdrawn} withdrawn</div>
      <div className="ii-month-sep">April 2026</div>
      {filtered.map((t) => (
        <div key={t.id} className="ii-act-row">
          <div className={`ii-act-dot ${t.kind === 'earning' ? 'pos' : 'neg'}`}>
            {t.kind === 'earning' ? '↑' : '↓'}
          </div>
          <div style={{ flex: 1 }}>
            <div className="ii-act-label">
              {t.kind === 'earning' ? `Policy #${t.policyId}` : `Withdrawal — ${t.method}`}
            </div>
            <div className="ii-act-date">
              {t.date}{t.configRate ? ` · at Rs.${t.configRate}/policy` : ''}
            </div>
          </div>
          <div className={`ii-act-amt ${t.kind === 'earning' ? 'pos' : 'neg'}`}>
            {t.kind === 'earning' ? '+' : '-'}Rs.{t.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
