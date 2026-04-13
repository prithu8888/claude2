import { useState } from 'react';
import { agents, cfgById, calc, slabIdx, meWithdrawals, ME, type Kyc } from './data';

export default function AgentMore() {
  const me = agents.find((a) => a.id === ME)!;
  const cfg = cfgById(me.activeConfigId)!;
  const [section, setSection] = useState<'kyc' | 'sim' | 'track' | 'profile'>('kyc');

  return (
    <div>
      <div className="ii-seg">
        {(['kyc', 'sim', 'track', 'profile'] as const).map((s) => (
          <button key={s} className={`ii-seg-btn ${section === s ? 'active' : ''}`} onClick={() => setSection(s)}>
            {s === 'kyc' ? 'KYC' : s === 'sim' ? 'Simulator' : s === 'track' ? 'Tracker' : 'Profile'}
          </button>
        ))}
      </div>
      {section === 'kyc' && <KycSection initial={me.kyc} />}
      {section === 'sim' && <Simulator />}
      {section === 'track' && <Tracker />}
      {section === 'profile' && (
        <div>
          <h3>Profile</h3>
          <div className="ii-cardm">
            <div style={{ marginBottom: 8 }}><strong>Name:</strong> {me.name}</div>
            <div style={{ marginBottom: 8 }}><strong>Phone:</strong> {me.phone}</div>
            <div style={{ marginBottom: 8 }}><strong>Region:</strong> {me.region}</div>
            <div style={{ marginBottom: 8 }}><strong>Dealer:</strong> {me.dealerName}</div>
            <div><strong>Active config:</strong> {cfg.name} <span className={`ii-pill ${cfg.level}`}>{cfg.level}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

function KycSection({ initial }: { initial: Kyc }) {
  const [kyc, setKyc] = useState<Kyc>(initial);
  const [step, setStep] = useState<'prompt' | 'pan' | 'selfie' | 'submitting'>('prompt');
  const [pan, setPan] = useState('');
  const [panFetched, setPanFetched] = useState(false);
  const [selfieDone, setSelfieDone] = useState(false);

  if (kyc === 'verified') {
    return (
      <div>
        <div className="ii-banner green">✓ KYC Verified</div>
        <div className="ii-cardm">
          <div>Name: Rajesh Kumar</div>
          <div>PAN: ABCDE****F</div>
          <div>Verified on: 01 Mar 2026</div>
        </div>
        <button className="ii-link" onClick={() => setKyc('not_done')}>Demo: reset to not-done</button>
      </div>
    );
  }

  if (step === 'prompt') {
    return (
      <div>
        <div className="ii-banner amber">
          {kyc === 'expired' ? '⚠ Your KYC expired. Re-verify to continue withdrawals.' : '⚠ Complete KYC to withdraw earnings'}
        </div>
        <div className="ii-cardm">
          <strong style={{ color: 'var(--navy)' }}>Why KYC?</strong>
          <p style={{ fontSize: 13, margin: '6px 0' }}>
            As per RBI guidelines, we verify your identity before processing payouts.
          </p>
          <div style={{ fontSize: 12, color: 'var(--grey)' }}>What you need: PAN card + a selfie</div>
        </div>
        <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12 }} onClick={() => setStep('pan')}>
          Start KYC
        </button>
      </div>
    );
  }

  if (step === 'pan') {
    return (
      <div>
        <h3>Step 1 — Enter PAN</h3>
        <input className="ii-input-lg" placeholder="ABCDE1234F" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))} />
        {!panFetched && pan.length === 10 && (
          <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12, marginTop: 12 }}
            onClick={() => setTimeout(() => setPanFetched(true), 1500)}>
            Fetch details
          </button>
        )}
        {panFetched && (
          <>
            <div className="ii-ok-msg">Name: RAJESH KUMAR · DOB: 15 Jan 1990</div>
            <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12, marginTop: 12 }} onClick={() => setStep('selfie')}>
              Confirm, continue →
            </button>
          </>
        )}
      </div>
    );
  }

  if (step === 'selfie') {
    return (
      <div>
        <h3>Step 2 — Take a selfie</h3>
        <div className="ii-camera">📷</div>
        {!selfieDone ? (
          <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12 }} onClick={() => setTimeout(() => setSelfieDone(true), 1500)}>
            Take selfie
          </button>
        ) : (
          <>
            <div className="ii-ok-msg">✓ Selfie captured · Liveness check passed</div>
            <button className="ii-btn ii-btn-primary" style={{ width: '100%', padding: 12, marginTop: 12 }}
              onClick={() => { setStep('submitting'); setTimeout(() => setKyc('verified'), 1500); }}>
              Submit KYC
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="ii-center">
      <span className="ii-spin" />
      <p>Submitting KYC…</p>
    </div>
  );
}

function Simulator() {
  const me = agents.find((a) => a.id === ME)!;
  const cfg = cfgById(me.activeConfigId)!;
  const [n, setN] = useState(20);
  const result = calc(n, cfg);
  const curIdx = slabIdx(me.monthPolicies, cfg);

  return (
    <div>
      <h3>How much will I earn?</h3>
      <label className="ii-lbl">How many policies?</label>
      <div className="ii-stepper">
        <button onClick={() => setN(Math.max(0, n - 1))}>−</button>
        <input type="number" value={n} onChange={(e) => setN(parseInt(e.target.value, 10) || 0)} />
        <button onClick={() => setN(n + 1)}>+</button>
      </div>
      <div className="ii-cardm">
        {result.rows.map((r, i) => (
          <div key={i} className={`ii-sim-row ${r.active ? 'active' : ''}`}>{r.label}</div>
        ))}
        <div className="ii-sim-total">Total: Rs.{result.total}</div>
      </div>
      <p className="ii-muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 8 }}>
        You've already sold {me.monthPolicies} this month.
      </p>
      {cfg.type === 'slab' && cfg.slabs && (
        <div className="ii-cardm">
          <strong style={{ color: 'var(--navy)', fontSize: 12 }}>Your slabs:</strong>
          {cfg.slabs.map((s, i) => (
            <div key={i} className={`ii-sim-row ${i === curIdx ? 'active' : ''}`}>
              Slab {s.from}–{s.to ?? '+'} → Rs.{s.rate}/policy{i === curIdx && ' ← YOU ARE HERE'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tracker() {
  return (
    <div>
      <h3>Withdrawal history</h3>
      {meWithdrawals.map((w) => (
        <div key={w.id} className="ii-cardm">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <strong style={{ color: 'var(--navy)' }}>Rs.{w.amount}</strong>
            <span className={`ii-status ${w.status}`}>{w.status.replace('_', ' ')}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--grey)' }}>{w.methodLabel}</div>
          <div style={{ fontSize: 12, color: 'var(--grey)' }}>{w.requestedAt}</div>
          {w.rejectionReason && (
            <>
              <div className="ii-err-msg">{w.rejectionReason}</div>
              <button className="ii-link">Retry</button>
            </>
          )}
          {w.status === 'completed' && w.id === 'mw1' && (
            <div className="ii-tl">
              <div>✓ Request received · 09 Apr 2:14 PM</div>
              <div>✓ Processing · 09 Apr 2:15 PM</div>
              <div>✓ Transferred to bank · 09 Apr 3:52 PM</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
