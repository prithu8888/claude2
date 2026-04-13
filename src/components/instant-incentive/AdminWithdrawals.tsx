import { useState } from 'react';
import { pendingReqs as seedPending, meWithdrawals, type WReq } from './data';

export default function AdminWithdrawals({ onToast }: { onToast: (msg: string) => void }) {
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const [pending, setPending] = useState(seedPending);
  const [modal, setModal] = useState<{ req: WReq; kind: 'approve' | 'reject' } | null>(null);
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('Insufficient KYC');

  const confirm = () => {
    if (!modal) return;
    setPending((p) => p.filter((x) => x.id !== modal.req.id));
    onToast(`${modal.req.agentName}'s withdrawal ${modal.kind === 'approve' ? 'approved' : 'rejected'}`);
    setModal(null);
    setNote('');
  };

  return (
    <div>
      <h1 className="ii-h1">Withdrawals</h1>
      <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 3, borderRadius: 6, width: 'fit-content', marginBottom: 16 }}>
        <button className={`ii-seg-btn ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>Pending approval ({pending.length})</button>
        <button className={`ii-seg-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>

      {tab === 'pending' && (
        <div>
          {pending.length === 0 && <div className="ii-card"><p className="ii-muted">No pending requests.</p></div>}
          {pending.map((r) => {
            const blocked = r.kyc !== 'verified';
            return (
              <div key={r.id} className={`ii-wcard ${blocked ? 'blocked' : ''}`}>
                <div className="ii-wtop">
                  <div>
                    <div className="ii-strong">{r.agentName}</div>
                    <div className="ii-muted">{r.agentPhone} · {r.region}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="ii-amount">Rs.{r.amount}</div>
                    <div className="ii-muted">{r.methodLabel}</div>
                  </div>
                </div>
                <div className="ii-wmeta">
                  <span>Requested {r.requestedAt}</span>
                  <span className={`ii-kyc ${r.kyc}`}>{r.kyc === 'not_done' ? 'KYC not done' : `KYC ${r.kyc}`}</span>
                  <span>Balance after: Rs.{r.balanceAfter}</span>
                </div>
                {blocked && <div className="ii-block-banner">⚠ KYC not completed. This withdrawal should be blocked. Agent has been notified.</div>}
                <div className="ii-wactions">
                  {blocked ? (
                    <button className="ii-btn ii-btn-danger" onClick={() => setModal({ req: r, kind: 'reject' })}>Block & notify</button>
                  ) : (
                    <>
                      <button className="ii-btn ii-btn-secondary" onClick={() => setModal({ req: r, kind: 'reject' })}>Reject</button>
                      <button className="ii-btn ii-btn-success" onClick={() => setModal({ req: r, kind: 'approve' })}>Approve</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'history' && (
        <div className="ii-card">
          <table className="ii-tbl">
            <thead><tr><th>Agent</th><th>Amount</th><th>Method</th><th>Requested</th><th>Approved by</th><th>Processed</th><th>Status</th></tr></thead>
            <tbody>
              {meWithdrawals.map((w) => (
                <tr key={w.id}>
                  <td>{w.agentName}</td>
                  <td>Rs.{w.amount}</td>
                  <td>{w.methodLabel}</td>
                  <td>{w.requestedAt}</td>
                  <td>{w.approvedBy ?? '—'}</td>
                  <td>{w.processedAt ?? '—'}</td>
                  <td><span className={`ii-status ${w.status}`}>{w.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="ii-back" onClick={() => setModal(null)}>
          <div className="ii-drawer" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="ii-drawer-head">
              <h2 style={{ margin: 0, fontSize: 17, color: 'var(--navy)' }}>
                {modal.kind === 'approve' ? 'Approve' : 'Reject'} withdrawal
              </h2>
              <button className="ii-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="ii-drawer-body">
              <p className="ii-muted" style={{ marginBottom: 14 }}>
                {modal.req.agentName} — Rs.{modal.req.amount} → {modal.req.methodLabel}
              </p>
              {modal.kind === 'reject' && (
                <div className="ii-fld" style={{ marginBottom: 12 }}>
                  <label>Reason for rejection</label>
                  <select className="ii-select" value={reason} onChange={(e) => setReason(e.target.value)}>
                    <option>Insufficient KYC</option><option>Suspicious activity</option><option>Incorrect bank details</option><option>Other</option>
                  </select>
                </div>
              )}
              <div className="ii-fld">
                <label>{modal.kind === 'approve' ? 'Note for finance (optional)' : 'Additional note (optional)'}</label>
                <textarea className="ii-input" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
              </div>
              <div className="ii-form-actions">
                <button className="ii-btn ii-btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button className={`ii-btn ${modal.kind === 'approve' ? 'ii-btn-success' : 'ii-btn-danger'}`} onClick={confirm}>
                  Confirm {modal.kind}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
