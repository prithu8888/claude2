import { useState } from 'react';
import { agents, meMethods, ME } from './data';

export default function AgentWithdraw({ goto, onToast }: { goto: (t: string) => void; onToast: (m: string) => void }) {
  const me = agents.find((a) => a.id === ME)!;
  const [amount, setAmount] = useState('');
  const [methodId, setMethodId] = useState<string>(meMethods[0].id);
  const [stage, setStage] = useState<'form' | 'processing' | 'done'>('form');
  const amt = parseInt(amount, 10) || 0;
  const tooLow = amount !== '' && amt < 500;
  const tooHigh = amt > me.balance;
  const valid = amt >= 500 && !tooHigh && !!methodId;

  if (me.kyc !== 'verified') {
    return (
      <div>
        <div className="ii-banner amber">⚠ Complete KYC to withdraw your earnings.</div>
        <p className="ii-muted" style={{ fontSize: 13 }}>Your KYC must be verified before you can withdraw.</p>
        <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12, marginTop: 12 }} onClick={() => goto('more')}>
          Go to KYC →
        </button>
      </div>
    );
  }

  if (stage === 'processing') {
    return (
      <div className="ii-center">
        <span className="ii-spin" />
        <p>Submitting request…</p>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="ii-center">
        <div className="ii-check-anim">✓</div>
        <h2 className="ii-h2" style={{ textAlign: 'center' }}>Request submitted</h2>
        <p className="ii-muted" style={{ fontSize: 13, textAlign: 'center', padding: '0 20px' }}>
          Finance will review and process within 4 hours. You'll get an SMS once done.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          <button className="ii-btn ii-btn-primary" onClick={() => goto('more')}>Track request →</button>
          <button className="ii-btn ii-btn-ghost" onClick={() => { setStage('form'); setAmount(''); goto('home'); }}>Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="ii-h2">Withdraw balance</h2>
      <div className="ii-cardm">Available: <strong>Rs.{me.balance}</strong> · Min withdrawal: Rs.500</div>

      <label className="ii-lbl">How much do you want to withdraw?</label>
      <input
        className="ii-input-lg"
        placeholder="Enter amount"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
      />
      {tooLow && <div className="ii-err-msg">Minimum withdrawal is Rs.500</div>}
      {tooHigh && <div className="ii-err-msg">You only have Rs.{me.balance} available</div>}
      {valid && <div className="ii-ok-msg">Rs.{amt} will be transferred</div>}

      <div className="ii-banner amber" style={{ marginTop: 12 }}>
        Withdrawals are reviewed by the finance team. Most requests are processed within 4 hours.
      </div>

      <label className="ii-lbl">Transfer to</label>
      {meMethods.map((m) => (
        <label key={m.id} className={`ii-method ${methodId === m.id ? 'selected' : ''}`}>
          <input type="radio" checked={methodId === m.id} onChange={() => setMethodId(m.id)} />
          <div>
            <div className="ii-method-title">{m.label}</div>
            <div className="ii-method-sub">{m.details}</div>
          </div>
          <span className="ii-verified">✓ Verified</span>
        </label>
      ))}
      <button className="ii-link" style={{ margin: '8px 0' }} onClick={() => onToast('Add-account form coming soon')}>
        + Add new account
      </button>

      <button
        className="ii-btn ii-btn-primary"
        style={{ width: '100%', padding: 12, marginTop: 12 }}
        disabled={!valid}
        onClick={() => { setStage('processing'); setTimeout(() => setStage('done'), 1000); }}
      >
        Request withdrawal{valid ? ` of Rs.${amt}` : ''}
      </button>
    </div>
  );
}
