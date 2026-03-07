import { useState, useEffect } from 'react';
import './Agents.css';

interface KYCVerificationResult {
  panMatch: 'pass' | 'fail' | 'pending';
  aadhaarMatch: 'pass' | 'fail' | 'pending';
  faceMatch: 'pass' | 'fail' | 'pending';
  bankVerification: 'pass' | 'fail' | 'pending';
  overallStatus: 'auto-approved' | 'needs-review' | 'rejected' | 'processing';
  confidence: number;
  reason: string;
}

export default function KYCAutoVerification({ userName }: { userName: string }) {
  const [result, setResult] = useState<KYCVerificationResult | null>(null);
  const processing = result === null;

  useEffect(() => {
    const timer = setTimeout(() => {
      const isClean = userName.length > 3;
      setResult({
        panMatch: 'pass',
        aadhaarMatch: 'pass',
        faceMatch: isClean ? 'pass' : 'fail',
        bankVerification: 'pass',
        overallStatus: isClean ? 'auto-approved' : 'needs-review',
        confidence: isClean ? 96 : 62,
        reason: isClean
          ? 'All documents verified successfully. Name and face match confirmed.'
          : 'Face match confidence below threshold. Manual review recommended.',
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [userName]);

  const statusIcon = (s: 'pass' | 'fail' | 'pending') => {
    if (s === 'pass') return <span className="agent-check">&#10003;</span>;
    if (s === 'fail') return <span className="agent-cross">&#10007;</span>;
    return <span className="agent-pending">&#8987;</span>;
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">KYC Auto-Verification</span>
      </div>

      {processing ? (
        <div className="agent-processing">
          <div className="agent-spinner" />
          <span>Verifying documents...</span>
        </div>
      ) : result ? (
        <div className="agent-body">
          <div className={`agent-status-banner ${result.overallStatus === 'auto-approved' ? 'success' : 'warning'}`}>
            <span className="agent-status-text">
              {result.overallStatus === 'auto-approved' ? 'Auto-Approved' : 'Needs Manual Review'}
            </span>
            <span className="agent-confidence">{result.confidence}% confidence</span>
          </div>

          <div className="agent-checks">
            <div className="agent-check-row">
              {statusIcon(result.panMatch)}
              <span>PAN Card Verification</span>
            </div>
            <div className="agent-check-row">
              {statusIcon(result.aadhaarMatch)}
              <span>Aadhaar Verification</span>
            </div>
            <div className="agent-check-row">
              {statusIcon(result.faceMatch)}
              <span>Face Match</span>
            </div>
            <div className="agent-check-row">
              {statusIcon(result.bankVerification)}
              <span>Bank Account Verification</span>
            </div>
          </div>

          <p className="agent-reason">{result.reason}</p>
        </div>
      ) : null}
    </div>
  );
}
