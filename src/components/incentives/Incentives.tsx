import { useState } from 'react';
import { commissions, sales, getProductById } from '../../data/mockData';
import { formatINR } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './Incentives.css';

const monthlyData = [
  { month: 'Oct', value: 2100 },
  { month: 'Nov', value: 2850 },
  { month: 'Dec', value: 2450 },
  { month: 'Jan', value: 3200 },
  { month: 'Feb', value: 2950 },
  { month: 'Mar', value: 3450 },
];

type WithdrawStep = 'idle' | 'amount' | 'confirm' | 'processing' | 'done';

export default function Incentives() {
  const earned = commissions.filter((c) => c.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const pending = commissions.filter((c) => c.status !== 'paid').reduce((a, b) => a + b.amount, 0);
  const totalWithdrawn = 18900;

  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>('idle');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const maxChart = Math.max(...monthlyData.map((m) => m.value));

  const handleWithdrawStart = () => {
    setWithdrawStep('amount');
    setWithdrawAmount('');
    setWithdrawError(null);
  };

  const handleWithdrawNext = () => {
    const amt = parseInt(withdrawAmount, 10);
    if (!amt || amt <= 0) {
      setWithdrawError('Enter a valid amount');
      return;
    }
    if (amt > earned) {
      setWithdrawError('Amount exceeds available balance');
      return;
    }
    if (amt > 50000) {
      setWithdrawError('Withdrawals above ₹50,000 require manager approval');
      return;
    }
    setWithdrawError(null);
    setWithdrawStep('confirm');
  };

  const handleWithdrawConfirm = () => {
    setWithdrawStep('processing');
    setTimeout(() => setWithdrawStep('done'), 1500);
  };

  const closeModal = () => {
    setWithdrawStep('idle');
    setWithdrawAmount('');
    setWithdrawError(null);
  };

  return (
    <div className="incentives-page">
      <header className="incentives-header">
        <div>
          <h1 className="page-title">Incentives & Commissions</h1>
          <p className="text-secondary">Track your earnings and withdraw when you’re ready</p>
        </div>
      </header>

      <div className="incentives-stats">
        <div className="incentive-card card">
          <div className="incentive-label">Earned this month</div>
          <div className="incentive-value success">{formatINR(earned)}</div>
          <div className="incentive-delta success">&#9650; 16% vs last month</div>
        </div>
        <div className="incentive-card card">
          <div className="incentive-label">Pending payout</div>
          <div className="incentive-value">{formatINR(pending)}</div>
          <div className="incentive-sub">Settles on 1st Apr</div>
        </div>
        <div className="incentive-card card">
          <div className="incentive-label">Total withdrawn</div>
          <div className="incentive-value">{formatINR(totalWithdrawn)}</div>
          <div className="incentive-sub">YTD</div>
        </div>
        <div className="incentive-card card accent">
          <div className="incentive-label">Available balance</div>
          <div className="incentive-value">{formatINR(earned)}</div>
          <button className="btn-primary incentive-withdraw-btn" onClick={handleWithdrawStart}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="incentive-ai-insight card">
        <AIBadge label="AI Insight" shimmer />
        <div>
          <strong>You’re on track to earn {formatINR(4200)} this month — {formatINR(750)} more than last month.</strong>
          <span className="text-secondary">
            Selling 3 more laptop plans this week would push you to the Platinum tier and unlock a 20% bonus.
          </span>
        </div>
      </div>

      <div className="incentive-row">
        <div className="card incentive-chart">
          <div className="card-title">Monthly earnings trend</div>
          <div className="chart-area">
            {monthlyData.map((d) => (
              <div key={d.month} className="chart-col">
                <div className="chart-bar-wrap">
                  <div
                    className="chart-bar"
                    style={{ height: `${(d.value / maxChart) * 100}%` }}
                    title={formatINR(d.value)}
                  >
                    <span className="chart-bar-value">{formatINR(d.value)}</span>
                  </div>
                </div>
                <div className="chart-label">{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card incentive-earnings">
          <div className="card-title">Recent earnings</div>
          <div className="earnings-list">
            {sales.slice(0, 6).map((s) => {
              const p = getProductById(s.productId);
              return (
                <div key={s.id} className="earning-row">
                  <div className="earning-info">
                    <div className="earning-device">{p?.name ?? 'Unknown'}</div>
                    <div className="earning-date">{s.date}</div>
                  </div>
                  <div className="earning-right">
                    <div className="earning-amt">{formatINR(s.commission)}</div>
                    <span className={`badge ${s.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{s.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card incentive-guardrails">
        <h3 className="card-title">Security guardrails</h3>
        <ul>
          <li>Max single withdrawal: {formatINR(50000)}. Higher amounts need manager approval.</li>
          <li>If bank account was changed in the last 7 days, withdrawals are blocked (cooling period).</li>
          <li>Nominee settlement requires 2-factor confirmation (OTP + manager PIN).</li>
        </ul>
      </div>

      {withdrawStep !== 'idle' && (
        <div className="withdraw-modal-backdrop" onClick={closeModal}>
          <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
            {withdrawStep === 'amount' && (
              <>
                <h3>Withdraw funds</h3>
                <p className="text-secondary">Available balance: <strong>{formatINR(earned)}</strong></p>
                <label className="withdraw-label">Enter amount</label>
                <input
                  className="input-field withdraw-input"
                  type="number"
                  placeholder="0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                {withdrawError && <div className="withdraw-error">{withdrawError}</div>}
                <div className="withdraw-actions">
                  <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                  <button className="btn-primary" onClick={handleWithdrawNext}>Next</button>
                </div>
              </>
            )}
            {withdrawStep === 'confirm' && (
              <>
                <h3>Confirm withdrawal</h3>
                <div className="withdraw-summary">
                  <div><span>Amount</span><strong>{formatINR(parseInt(withdrawAmount, 10))}</strong></div>
                  <div><span>Bank</span><strong>HDFC Bank</strong></div>
                  <div><span>Account</span><strong>XXXX 1234</strong></div>
                  <div><span>Fee</span><strong>Free</strong></div>
                  <div><span>Expected credit</span><strong>Within 2 business days</strong></div>
                </div>
                <div className="withdraw-actions">
                  <button className="btn-ghost" onClick={() => setWithdrawStep('amount')}>Back</button>
                  <button className="btn-primary" onClick={handleWithdrawConfirm}>Confirm withdrawal</button>
                </div>
              </>
            )}
            {withdrawStep === 'processing' && (
              <div className="withdraw-processing">
                <div className="kyc-spinner" />
                <h3>Processing…</h3>
                <p className="text-secondary">Securing your withdrawal request</p>
              </div>
            )}
            {withdrawStep === 'done' && (
              <div className="withdraw-done">
                <div className="withdraw-success-icon">&#10003;</div>
                <h3>Withdrawal initiated</h3>
                <p className="text-secondary">
                  {formatINR(parseInt(withdrawAmount, 10))} will be credited to HDFC XXXX1234 within 2 business days.
                </p>
                <button className="btn-primary" onClick={closeModal}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
