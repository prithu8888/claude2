import { useEffect, useState } from 'react';
import { agents, cfgById, meTxns, slabIdx, ME } from './data';

export default function AgentHome({ goto }: { goto: (t: string) => void }) {
  const me = agents.find((a) => a.id === ME)!;
  const cfg = cfgById(me.activeConfigId)!;
  const idx = slabIdx(me.monthPolicies, cfg);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    let start = 0;
    let raf = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 500, 1);
      setBalance(Math.round(me.balance * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [me.balance]);

  const nextSlab = cfg.type === 'slab' && cfg.slabs && idx >= 0 && idx < cfg.slabs.length - 1 ? cfg.slabs[idx + 1] : null;

  return (
    <div>
      <div className="ii-bal-card">
        <div className="ii-bal-label">Available balance</div>
        <div className="ii-bal-amt">Rs.{balance.toLocaleString('en-IN')}</div>
        <div className="ii-bal-row">
          <span>Total earned: Rs.{me.totalEarned?.toLocaleString('en-IN')}</span>
          <span>Withdrawn: Rs.{me.totalWithdrawn?.toLocaleString('en-IN')}</span>
        </div>
        <button className="ii-bal-btn" onClick={() => goto('withdraw')}>Withdraw</button>
      </div>

      <div className="ii-cardm">
        <div className="ii-cardm-title">Your current incentive</div>
        <div className="ii-cardm-main">
          {cfg.type === 'slab' && cfg.slabs && `Slab — Rs.${cfg.slabs.map((s) => s.rate).join('/')} per policy`}
          {cfg.type === 'flat' && `Flat — Rs.${cfg.flatRate} per policy`}
          {cfg.type === 'percentage' && `${cfg.percentRate}% of premium`}
        </div>
        <div className="ii-cardm-sub">Active since {cfg.effectiveFrom} · Set by ACKO admin</div>
      </div>

      <div className="ii-cardm">
        <div className="ii-cardm-title">{me.monthPolicies} policies sold · April 2026</div>
        {cfg.type === 'slab' && cfg.slabs && (
          <>
            <div className="ii-slab-bar">
              {cfg.slabs.map((s, i) => {
                const done = i < idx;
                const width = i === idx && s.to ? ((me.monthPolicies - s.from + 1) / (s.to - s.from + 1)) * 100 : i < idx ? 100 : 0;
                return (
                  <div key={i} className={`ii-slab-seg ${done ? 'done' : ''}`}>
                    {!done && <div className="ii-slab-fill" style={{ width: `${Math.min(100, Math.max(0, width))}%` }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--grey)', margin: '4px 0 8px' }}>
              {cfg.slabs.map((s, i) => <span key={i}>{s.from}–{s.to ?? '+'}</span>)}
            </div>
            {nextSlab && <div className="ii-slab-hint">Sell {nextSlab.from - me.monthPolicies} more to reach Rs.{nextSlab.rate}/policy</div>}
          </>
        )}
      </div>

      <div className="ii-sect">Recent activity</div>
      {meTxns.slice(0, 3).map((t) => (
        <div key={t.id} className="ii-act-row">
          <div>
            <div className="ii-act-label">{t.kind === 'earning' ? `Policy #${t.policyId}` : 'Withdrawal'}</div>
            <div className="ii-act-date">{t.date}</div>
          </div>
          <div className={`ii-act-amt ${t.kind === 'earning' ? 'pos' : 'neg'}`}>
            {t.kind === 'earning' ? '+' : '-'}Rs.{t.amount}
          </div>
        </div>
      ))}

      <div className="ii-quick">
        <button className="ii-quick-btn" onClick={() => goto('withdraw')}>↗ Withdraw</button>
        <button className="ii-quick-btn" onClick={() => goto('history')}>☰ History</button>
        <button className="ii-quick-btn" onClick={() => goto('more')}>⚙ Simulator</button>
        <button className="ii-quick-btn" onClick={() => goto('leaderboard')}>🏆 Leaderboard</button>
      </div>
    </div>
  );
}
