import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import AIBadge from '../shared/AIBadge';
import './KycFlow.css';

type KycType = 'dealer' | 'promoter';
type StepStatus = 'pending' | 'active' | 'complete';

interface Step {
  id: string;
  title: string;
  description: string;
}

const dealerSteps: Step[] = [
  { id: 'gst', title: 'GST Verification', description: 'We’ll auto-fetch your business details' },
  { id: 'pan', title: 'PAN Verification', description: 'Auto-filled from GST data' },
  { id: 'bank', title: 'Bank Account', description: 'Penny drop verification' },
  { id: 'docs', title: 'Document Upload', description: 'GST certificate & cancelled cheque' },
  { id: 'review', title: 'Review & Submit', description: 'Confirm all details' },
];

const promoterSteps: Step[] = [
  { id: 'pan', title: 'PAN Verification', description: 'Enter your PAN number' },
  { id: 'aadhaar', title: 'Aadhaar Verification', description: 'OTP-based' },
  { id: 'bank', title: 'Bank Account', description: 'Penny drop verification' },
  { id: 'liveness', title: 'Selfie Liveness Check', description: 'Quick selfie with AI liveness' },
  { id: 'review', title: 'Review & Submit', description: 'Confirm all details' },
];

export default function KycFlow() {
  const navigate = useNavigate();
  const { activeRole, setKycComplete, setKycProgress } = useAppStore();
  const kycType: KycType = activeRole === 'dealer' ? 'dealer' : 'promoter';
  const steps = kycType === 'dealer' ? dealerSteps : promoterSteps;

  const [currentStep, setCurrentStep] = useState(0);
  const [gstin, setGstin] = useState('');
  const [gstFetched, setGstFetched] = useState(false);
  const [fetchingGst, setFetchingGst] = useState(false);
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [ifscFetched, setIfscFetched] = useState(false);
  const [pennyDropStatus, setPennyDropStatus] = useState<'idle' | 'sending' | 'waiting' | 'verified'>('idle');
  const [pennyAmount, setPennyAmount] = useState('');
  const [docsUploaded, setDocsUploaded] = useState<Record<string, boolean>>({});
  const [livenessStep, setLivenessStep] = useState<'idle' | 'detecting' | 'done'>('idle');

  const handleGstFetch = () => {
    if (gstin.length !== 15) return;
    setFetchingGst(true);
    setTimeout(() => {
      setFetchingGst(false);
      setGstFetched(true);
      setPan('AABCX1234E'); // Auto-filled from GST
    }, 1200);
  };

  const handleIfscFetch = (v: string) => {
    setIfsc(v);
    if (v.length === 11) {
      setTimeout(() => setIfscFetched(true), 500);
    }
  };

  const startPennyDrop = () => {
    setPennyDropStatus('sending');
    setTimeout(() => setPennyDropStatus('waiting'), 1500);
  };

  const verifyPennyDrop = () => {
    if (pennyAmount) {
      setPennyDropStatus('verified');
    }
  };

  const startLiveness = () => {
    setLivenessStep('detecting');
    setTimeout(() => setLivenessStep('done'), 2000);
  };

  const handleDocUpload = (docType: string) => {
    setDocsUploaded({ ...docsUploaded, [docType]: true });
  };

  const goToStep = (idx: number) => {
    if (idx <= currentStep) {
      setCurrentStep(idx);
    }
  };

  const canAdvance = () => {
    const stepId = steps[currentStep].id;
    if (stepId === 'gst') return gstFetched;
    if (stepId === 'pan') return pan.length === 10;
    if (stepId === 'aadhaar') return aadhaarOtpSent && aadhaarOtp.length === 6;
    if (stepId === 'bank') return pennyDropStatus === 'verified';
    if (stepId === 'docs') return Object.keys(docsUploaded).length >= 2;
    if (stepId === 'liveness') return livenessStep === 'done';
    if (stepId === 'review') return true;
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setKycProgress(Math.round(((next) / steps.length) * 100));
    } else {
      setKycComplete(true);
      setKycProgress(100);
      navigate('/home');
    }
  };

  const getStepStatus = (idx: number): StepStatus => {
    if (idx < currentStep) return 'complete';
    if (idx === currentStep) return 'active';
    return 'pending';
  };

  const renderStepContent = () => {
    const stepId = steps[currentStep].id;

    if (stepId === 'gst') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-field">
            <label>GSTIN</label>
            <div className="kyc-input-row">
              <input
                className="input-field"
                placeholder="29AABCX1234E1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                maxLength={15}
              />
              <button
                className="btn-primary"
                onClick={handleGstFetch}
                disabled={gstin.length !== 15 || fetchingGst}
              >
                {fetchingGst ? 'Fetching…' : 'Fetch'}
              </button>
            </div>
            <div className="kyc-help">
              <AIBadge shimmer={fetchingGst} />
              <span>We’ll auto-fetch business name, address, PAN & entity type</span>
            </div>
          </div>

          {gstFetched && (
            <div className="kyc-result-card">
              <div className="kyc-result-header">
                <AIBadge label="AI verified" />
                <span className="badge badge-success">&#10003; Found</span>
              </div>
              <div className="kyc-result-grid">
                <div><span className="kyc-result-label">Business name</span><span className="kyc-result-value">Sharma Electronics Pvt Ltd</span></div>
                <div><span className="kyc-result-label">Entity type</span><span className="kyc-result-value">Private Limited</span></div>
                <div><span className="kyc-result-label">PAN</span><span className="kyc-result-value">AABCX1234E</span></div>
                <div><span className="kyc-result-label">Registration date</span><span className="kyc-result-value">12 Aug 2018</span></div>
                <div className="kyc-result-full"><span className="kyc-result-label">Registered address</span><span className="kyc-result-value">#42, Koramangala 5th Block, Bengaluru 560095</span></div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (stepId === 'pan') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-field">
            <label>PAN number</label>
            <input
              className="input-field"
              placeholder="AABCX1234E"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              maxLength={10}
            />
            {pan.length === 10 && (
              <div className="kyc-result-card">
                <div className="kyc-result-header">
                  <AIBadge label="AI verified" />
                  <span className="badge badge-success">&#10003; Verified</span>
                </div>
                <div>
                  <span className="kyc-result-label">Name as per PAN</span>
                  <span className="kyc-result-value">{kycType === 'dealer' ? 'SHARMA ELECTRONICS PRIVATE LIMITED' : 'RAHUL SHARMA'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (stepId === 'aadhaar') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-field">
            <label>Aadhaar number</label>
            <input
              className="input-field"
              placeholder="XXXX XXXX XXXX"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
            />
            {aadhaar.length === 12 && !aadhaarOtpSent && (
              <button className="btn-primary" onClick={() => setAadhaarOtpSent(true)}>
                Send OTP to registered mobile
              </button>
            )}
            {aadhaarOtpSent && (
              <>
                <label>Enter Aadhaar OTP</label>
                <input
                  className="input-field"
                  placeholder="6-digit OTP"
                  value={aadhaarOtp}
                  onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
                {aadhaarOtp.length === 6 && (
                  <div className="kyc-result-card">
                    <div className="kyc-result-header">
                      <AIBadge label="AI matched" />
                      <span className="badge badge-success">&#10003; Verified</span>
                    </div>
                    <div className="kyc-result-grid">
                      <div><span className="kyc-result-label">Name</span><span className="kyc-result-value">R**** S*****</span></div>
                      <div><span className="kyc-result-label">DOB</span><span className="kyc-result-value">**/**/19**</span></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    if (stepId === 'bank') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-field">
            <label>Account number</label>
            <input
              className="input-field"
              placeholder="Account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="kyc-field">
            <label>IFSC code</label>
            <input
              className="input-field"
              placeholder="SBIN0001234"
              value={ifsc}
              onChange={(e) => handleIfscFetch(e.target.value.toUpperCase())}
              maxLength={11}
            />
            {ifscFetched && (
              <div className="kyc-help">
                <AIBadge label="AI" />
                <span>State Bank of India &middot; Koramangala Branch, Bengaluru</span>
              </div>
            )}
          </div>
          {accountNumber && ifscFetched && pennyDropStatus === 'idle' && (
            <button className="btn-primary" onClick={startPennyDrop}>
              Verify via penny drop
            </button>
          )}
          {pennyDropStatus === 'sending' && (
            <div className="kyc-status-card">
              <div className="kyc-spinner" />
              <span>Sending ₹1 to your account…</span>
            </div>
          )}
          {pennyDropStatus === 'waiting' && (
            <div className="kyc-field">
              <div className="kyc-status-card success">
                <span>&#10003; ₹1 sent. Check your account.</span>
              </div>
              <label>Enter amount received (in paise)</label>
              <input
                className="input-field"
                placeholder="e.g. 1"
                value={pennyAmount}
                onChange={(e) => setPennyAmount(e.target.value)}
              />
              <button className="btn-primary" onClick={verifyPennyDrop} disabled={!pennyAmount}>
                Verify amount
              </button>
            </div>
          )}
          {pennyDropStatus === 'verified' && (
            <div className="kyc-result-card">
              <div className="kyc-result-header">
                <span className="badge badge-success">&#10003; Bank verified</span>
              </div>
              <span className="kyc-result-value">Account {'••••'}{accountNumber.slice(-4)}</span>
            </div>
          )}
        </div>
      );
    }

    if (stepId === 'docs') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-doc-upload">
            <div className={`kyc-doc-card ${docsUploaded.gst ? 'uploaded' : ''}`} onClick={() => handleDocUpload('gst')}>
              <div className="kyc-doc-icon">&#128196;</div>
              <div className="kyc-doc-body">
                <div className="kyc-doc-title">GST Certificate</div>
                <div className="kyc-doc-sub">{docsUploaded.gst ? 'Uploaded – GST-cert.pdf' : 'Tap to upload or drag & drop'}</div>
              </div>
              {docsUploaded.gst && (
                <div className="kyc-doc-status">
                  <AIBadge label="AI reading" />
                  <span className="badge badge-success">&#10003; GSTIN matches</span>
                </div>
              )}
            </div>
            <div className={`kyc-doc-card ${docsUploaded.cheque ? 'uploaded' : ''}`} onClick={() => handleDocUpload('cheque')}>
              <div className="kyc-doc-icon">&#128196;</div>
              <div className="kyc-doc-body">
                <div className="kyc-doc-title">Cancelled Cheque</div>
                <div className="kyc-doc-sub">{docsUploaded.cheque ? 'Uploaded – cheque.jpg' : 'Tap to upload or drag & drop'}</div>
              </div>
              {docsUploaded.cheque && <span className="badge badge-success">&#10003;</span>}
            </div>
          </div>
        </div>
      );
    }

    if (stepId === 'liveness') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-liveness">
            <div className="kyc-camera-frame">
              {livenessStep === 'idle' && <div className="kyc-camera-icon">&#128247;</div>}
              {livenessStep === 'detecting' && <div className="kyc-camera-pulse">Detecting… Blink twice</div>}
              {livenessStep === 'done' && <div className="kyc-camera-success">&#10003;</div>}
            </div>
            {livenessStep === 'idle' && (
              <button className="btn-primary" onClick={startLiveness}>Start liveness check</button>
            )}
            {livenessStep === 'detecting' && (
              <div className="kyc-help">
                <AIBadge shimmer label="AI analysing" />
                <span>Please look at the camera and blink twice</span>
              </div>
            )}
            {livenessStep === 'done' && (
              <div className="kyc-result-card">
                <div className="kyc-result-header">
                  <AIBadge label="AI verified" />
                  <span className="badge badge-success">&#10003; Liveness verified</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (stepId === 'review') {
      return (
        <div className="kyc-step-content">
          <div className="kyc-review">
            <h3>Review your details</h3>
            {kycType === 'dealer' ? (
              <ul className="kyc-review-list">
                <li><span>Business name</span><strong>Sharma Electronics Pvt Ltd</strong></li>
                <li><span>GSTIN</span><strong>{gstin || '29AABCX1234E1Z5'}</strong></li>
                <li><span>PAN</span><strong>{pan || 'AABCX1234E'}</strong></li>
                <li><span>Bank account</span><strong>SBI &bull; ••••{accountNumber.slice(-4) || '1234'}</strong></li>
                <li><span>Documents</span><strong>2 uploaded</strong></li>
              </ul>
            ) : (
              <ul className="kyc-review-list">
                <li><span>Name</span><strong>Rahul Sharma</strong></li>
                <li><span>PAN</span><strong>{pan || 'ABCDE1234F'}</strong></li>
                <li><span>Aadhaar</span><strong>{'•••• •••• '}{aadhaar.slice(-4) || '1234'}</strong></li>
                <li><span>Bank account</span><strong>HDFC &bull; ••••{accountNumber.slice(-4) || '4521'}</strong></li>
                <li><span>Liveness</span><strong>Verified</strong></li>
              </ul>
            )}
            <div className="kyc-ai-insight">
              <AIBadge label="AI Insight" />
              <div>
                <strong>All checks look good.</strong> Expected verification TAT: 2 hours.
                You’ll be notified via SMS & WhatsApp on approval.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="kyc-page">
      <header className="kyc-header">
        <h1 className="page-title">KYC Verification</h1>
        <p className="text-secondary">
          {kycType === 'dealer' ? 'Business KYC for dealers' : 'Individual KYC for promoters'} &middot; Step {currentStep + 1} of {steps.length}
        </p>
      </header>

      <div className="kyc-layout">
        <aside className="kyc-sidebar">
          {steps.map((step, idx) => {
            const status = getStepStatus(idx);
            return (
              <button
                key={step.id}
                className={`kyc-step ${status}`}
                onClick={() => goToStep(idx)}
                disabled={idx > currentStep}
              >
                <div className="kyc-step-num">
                  {status === 'complete' ? <span>&#10003;</span> : idx + 1}
                </div>
                <div className="kyc-step-info">
                  <div className="kyc-step-title">{step.title}</div>
                  <div className="kyc-step-desc">{step.description}</div>
                </div>
              </button>
            );
          })}
        </aside>

        <main className="kyc-main">
          <div className="kyc-main-card card">
            <div className="kyc-main-title">{steps[currentStep].title}</div>
            {renderStepContent()}
            <div className="kyc-main-footer">
              <button className="btn-ghost" onClick={() => navigate(-1)}>Save & exit</button>
              <button className="btn-primary" onClick={handleNext} disabled={!canAdvance()}>
                {currentStep === steps.length - 1 ? 'Submit KYC' : 'Continue'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
