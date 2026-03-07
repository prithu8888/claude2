import { useState, useEffect } from 'react';
import './Agents.css';

interface FraudResult {
  flag: 'clear' | 'suspicious' | 'flagged';
  factors: { label: string; status: 'ok' | 'warning' | 'alert' }[];
  explanation: string;
  recommendation: string;
}

export default function FraudGate({ claimAmount, claimType }: { claimAmount: number; claimType: string }) {
  const [result, setResult] = useState<FraudResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const isHighValue = claimAmount > 50000;
      const isTheft = claimType === 'theft';
      const flag = isTheft && isHighValue ? 'flagged' : isHighValue ? 'suspicious' : 'clear';

      setResult({
        flag,
        factors: [
          { label: 'Claim frequency (30 days)', status: flag === 'flagged' ? 'alert' : 'ok' },
          { label: 'Claim-to-premium ratio', status: isHighValue ? 'warning' : 'ok' },
          { label: 'Policy age check', status: 'ok' },
          { label: 'Location consistency', status: flag === 'flagged' ? 'warning' : 'ok' },
          { label: 'Device verification', status: 'ok' },
        ],
        explanation: flag === 'flagged'
          ? 'High-value theft claim on recently purchased policy. Multiple risk factors detected.'
          : flag === 'suspicious'
          ? 'Claim amount exceeds typical range for this product category. Recommend additional verification.'
          : 'No anomalies detected. Claim parameters are within normal range.',
        recommendation: flag === 'flagged'
          ? 'Route to manual investigation team'
          : flag === 'suspicious'
          ? 'Proceed with additional documentation request'
          : 'Auto-approve eligible',
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [claimAmount, claimType]);

  const flagColor = (flag: string) => {
    if (flag === 'clear') return 'success';
    if (flag === 'suspicious') return 'warning';
    return 'error';
  };

  const factorIcon = (status: string) => {
    if (status === 'ok') return <span className="agent-check">&#10003;</span>;
    if (status === 'warning') return <span className="agent-warning-icon">&#9888;</span>;
    return <span className="agent-cross">&#10007;</span>;
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">Fraud Gate</span>
      </div>

      {!result ? (
        <div className="agent-processing">
          <div className="agent-spinner" />
          <span>Analyzing claim patterns...</span>
        </div>
      ) : result ? (
        <div className="agent-body">
          <div className={`agent-status-banner ${flagColor(result.flag)}`}>
            <span className="agent-status-text">
              {result.flag === 'clear' ? 'Clear' : result.flag === 'suspicious' ? 'Suspicious' : 'Flagged'}
            </span>
          </div>

          <div className="agent-checks">
            {result.factors.map((f, i) => (
              <div key={i} className="agent-check-row">
                {factorIcon(f.status)}
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="agent-explanation">
            <strong>Analysis:</strong> {result.explanation}
          </div>
          <div className="agent-recommendation">
            <strong>Recommendation:</strong> {result.recommendation}
          </div>
        </div>
      ) : null}
    </div>
  );
}
