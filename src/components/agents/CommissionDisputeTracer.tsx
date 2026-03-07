import { useState } from 'react';
import './Agents.css';

interface TraceResult {
  expectedRate: string;
  appliedRate: string;
  productTier: string;
  slabMatch: boolean;
  calculation: string;
  verdict: 'correct' | 'underpaid' | 'overpaid';
  difference: number;
  explanation: string;
}

export default function CommissionDisputeTracer({
  commissionAmount,
  premiumAmount,
  productName,
}: {
  commissionAmount: number;
  premiumAmount: number;
  productName: string;
}) {
  const [tracing, setTracing] = useState(false);
  const [result, setResult] = useState<TraceResult | null>(null);

  const handleTrace = () => {
    setTracing(true);
    setTimeout(() => {
      // Deterministic: 20% commission rate, check if amount matches
      const expectedRate = '20%';
      const expectedAmount = Math.round(premiumAmount * 0.2);
      const diff = commissionAmount - expectedAmount;
      const verdict = diff === 0 ? 'correct' : diff < 0 ? 'underpaid' : 'overpaid';

      setResult({
        expectedRate,
        appliedRate: `${((commissionAmount / premiumAmount) * 100).toFixed(1)}%`,
        productTier: 'Tier 1 - Premium',
        slabMatch: Math.abs(diff) < 50,
        calculation: `${premiumAmount} x 20% = ${expectedAmount}`,
        verdict,
        difference: Math.abs(diff),
        explanation:
          verdict === 'correct'
            ? `Commission of \u20B9${commissionAmount} matches the expected 20% rate for ${productName}.`
            : verdict === 'underpaid'
            ? `Commission shortfall of \u20B9${Math.abs(diff)} detected. Expected \u20B9${expectedAmount} based on 20% Tier 1 rate.`
            : `Overpayment of \u20B9${Math.abs(diff)} detected. Expected \u20B9${expectedAmount} based on 20% Tier 1 rate.`,
      });
      setTracing(false);
    }, 2000);
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">Commission Dispute Tracer</span>
      </div>

      {!result && !tracing && (
        <div className="agent-body">
          <p className="agent-desc">
            Trace the commission calculation to verify the correct amount was applied.
          </p>
          <button className="btn-primary agent-action-btn" onClick={handleTrace}>
            Trace Commission
          </button>
        </div>
      )}

      {tracing && (
        <div className="agent-processing">
          <div className="agent-spinner" />
          <span>Tracing commission calculation...</span>
        </div>
      )}

      {result && (
        <div className="agent-body">
          <div
            className={`agent-status-banner ${result.verdict === 'correct' ? 'success' : result.verdict === 'underpaid' ? 'error' : 'warning'}`}
          >
            <span className="agent-status-text">
              {result.verdict === 'correct'
                ? 'Commission Correct'
                : result.verdict === 'underpaid'
                ? `Underpaid by \u20B9${result.difference}`
                : `Overpaid by \u20B9${result.difference}`}
            </span>
          </div>

          <div className="agent-trace-grid">
            <div className="agent-trace-item">
              <span className="agent-trace-label">Expected Rate</span>
              <span className="agent-trace-value">{result.expectedRate}</span>
            </div>
            <div className="agent-trace-item">
              <span className="agent-trace-label">Applied Rate</span>
              <span className="agent-trace-value">{result.appliedRate}</span>
            </div>
            <div className="agent-trace-item">
              <span className="agent-trace-label">Product Tier</span>
              <span className="agent-trace-value">{result.productTier}</span>
            </div>
            <div className="agent-trace-item">
              <span className="agent-trace-label">Calculation</span>
              <span className="agent-trace-value">{result.calculation}</span>
            </div>
          </div>

          <p className="agent-reason">{result.explanation}</p>

          {result.verdict !== 'correct' && (
            <button className="btn-secondary agent-action-btn" onClick={() => setResult(null)}>
              Escalate to Admin
            </button>
          )}
        </div>
      )}
    </div>
  );
}
