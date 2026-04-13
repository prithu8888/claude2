import { useState } from 'react';
import { aiSuggestions, aiHistory, type Cfg } from './data';

export default function AdminSuggestions({ onApply, onToast }: { onApply: (prefill: Partial<Cfg>) => void; onToast: (msg: string) => void }) {
  const [sugs, setSugs] = useState(aiSuggestions.map((s) => ({ ...s, open: true })));

  const prefills: Record<string, Partial<Cfg>> = {
    s1: { name: 'Diwali Boost 2026', level: 'state', scope: 'Karnataka', type: 'slab', slabs: [{ from: 1, to: 10, rate: 50 }, { from: 11, to: 25, rate: 80 }, { from: 26, to: 35, rate: 100 }, { from: 36, to: null, rate: 120 }], effectiveFrom: '2026-10-20', effectiveTo: '2026-10-27', status: 'draft' },
    s2: { name: 'Tamil Nadu Slab Parity', level: 'state', scope: 'Tamil Nadu', type: 'slab', slabs: [{ from: 1, to: 10, rate: 40 }, { from: 11, to: 25, rate: 60 }, { from: 26, to: null, rate: 80 }], effectiveFrom: '2026-05-01', effectiveTo: null, status: 'draft' },
  };

  return (
    <div>
      <h1 className="ii-h1">AI-powered incentive recommendations</h1>
      <p className="ii-muted" style={{ marginBottom: 18, fontSize: 13 }}>
        Based on sales patterns, seasonality, and regional data. Review and apply — nothing is automatic.
      </p>

      {sugs.filter((s) => s.open).length === 0 && (
        <div className="ii-card"><p className="ii-muted">No open suggestions — all caught up.</p></div>
      )}

      {sugs.filter((s) => s.open).map((s) => (
        <div key={s.id} className="ii-ai-card">
          <span className="ii-ai-badge">✦ {s.badge}</span>
          <h3>{s.headline}</h3>
          <p>{s.body}</p>
          <div className="ii-ai-impact">
            <strong>Impact estimate</strong>
            <ul>
              {s.impact.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
          <div className="ii-form-actions">
            <button className="ii-btn ii-btn-ghost" onClick={() => {
              setSugs((p) => p.map((x) => x.id === s.id ? { ...x, open: false } : x));
              onToast('Suggestion dismissed');
            }}>Dismiss</button>
            <button className="ii-btn ii-btn-primary" onClick={() => {
              onApply(prefills[s.id]);
              setSugs((p) => p.map((x) => x.id === s.id ? { ...x, open: false } : x));
              onToast('Config form pre-filled');
            }}>Create this config →</button>
          </div>
        </div>
      ))}

      <div className="ii-card" style={{ marginTop: 20 }}>
        <h3>Suggestion history</h3>
        {aiHistory.map((h) => (
          <div key={h.id} className="ii-list-row">
            <div>
              <div className="ii-strong">{h.headline}</div>
              <div className="ii-muted">{h.appliedDate}</div>
            </div>
            <div className="ii-muted" style={{ maxWidth: 420, textAlign: 'right' }}>{h.outcome}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
