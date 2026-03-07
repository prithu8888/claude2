import { useState, useEffect, useCallback } from 'react';
import './Onboarding.css';

/* ───── Types ───── */
interface KycData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  address: string;
  panNumber: string;
  panName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  docType: string;
  docUploaded: boolean;
}

const INITIAL_KYC: KycData = {
  fullName: '',
  dateOfBirth: '',
  email: '',
  address: '',
  panNumber: '',
  panName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  accountHolderName: '',
  docType: 'aadhaar',
  docUploaded: false,
};

const CAROUSEL_SLIDES = [
  {
    icon: '\u26A1',
    title: 'Sell Insurance Instantly',
    description: 'Issue policies at the point of sale in under 2 minutes. No paperwork, no delays.',
  },
  {
    icon: '\uD83D\uDCCA',
    title: 'Track Your Earnings',
    description: 'Real-time dashboard shows your commissions, performance, and growth trajectory.',
  },
  {
    icon: '\uD83D\uDEE1\uFE0F',
    title: 'AI-Powered Assistance',
    description: 'Smart recommendations help you pitch the right product to every customer.',
  },
];

const KYC_STEPS = [
  'Personal Info',
  'PAN Verification',
  'Bank Details',
  'Document Upload',
  'Review & Submit',
];

const ROLES = [
  { id: 'promoter', label: 'Promoter', desc: 'Sell insurance at retail stores' },
  { id: 'dealer', label: 'Dealer', desc: 'Manage a team of promoters' },
  { id: 'distributor', label: 'Distributor', desc: 'Oversee dealers across a region' },
];

/* ───── Component ───── */
export default function Onboarding() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Phase 1 - Login
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);

  // Phase 2 - Role
  const [detectedRole, setDetectedRole] = useState('promoter');
  const [selectedRole, setSelectedRole] = useState('promoter');

  // Phase 4 - Application ID (generated once)
  const [applicationId] = useState(
    () => `MPOS-${Date.now().toString(36).toUpperCase().slice(-6)}`,
  );

  // Phase 3 - KYC
  const [kycStep, setKycStep] = useState(1);
  const [kycData, setKycData] = useState<KycData>(INITIAL_KYC);
  const [panVerified, setPanVerified] = useState(false);
  const [panVerifying, setPanVerifying] = useState(false);

  /* ── Carousel auto-advance ── */
  useEffect(() => {
    if (currentPhase !== 1 || otpSent) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentPhase, otpSent]);

  /* ── OTP countdown ── */
  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setTimeout(() => setOtpTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [otpTimer]);

  /* ── Handlers ── */
  const handleSendOtp = useCallback(() => {
    if (phone.length < 10) return;
    setOtpSent(true);
    setOtpTimer(30);
  }, [phone]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      // auto-focus next input
      if (value && index < 5) {
        const el = document.getElementById(`otp-${index + 1}`);
        el?.focus();
      }
    },
    [otp],
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        const el = document.getElementById(`otp-${index - 1}`);
        el?.focus();
      }
    },
    [otp],
  );

  const handleVerifyOtp = useCallback(() => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setDetectedRole('promoter');
      setSelectedRole('promoter');
      setCurrentPhase(2);
    }, 2000);
  }, []);

  const handleRoleContinue = useCallback(() => {
    setCurrentPhase(3);
    setKycStep(1);
  }, []);

  const handleKycFieldChange = useCallback(
    (field: keyof KycData, value: string | boolean) => {
      setKycData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleVerifyPan = useCallback(() => {
    setPanVerifying(true);
    setTimeout(() => {
      setPanVerifying(false);
      setPanVerified(true);
      setKycData((prev) => ({ ...prev, panName: prev.fullName || 'Rahul Sharma' }));
    }, 2000);
  }, []);

  const handleKycNext = useCallback(() => {
    if (kycStep < 5) setKycStep((s) => s + 1);
    else setCurrentPhase(4);
  }, [kycStep]);

  const handleKycBack = useCallback(() => {
    if (kycStep > 1) setKycStep((s) => s - 1);
  }, [kycStep]);

  const otpFilled = otp.every((d) => d !== '');

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */

  /* ── Phase 1: Carousel + Login ── */
  const renderPhase1 = () => (
    <div className="onb-phase onb-phase-login">
      {/* Carousel */}
      {!otpSent && (
        <div className="onb-carousel">
          <div className="onb-carousel-viewport">
            {CAROUSEL_SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`onb-slide ${i === carouselIndex ? 'active' : ''}`}
              >
                <div className="onb-slide-icon">{slide.icon}</div>
                <h2 className="onb-slide-title">{slide.title}</h2>
                <p className="onb-slide-desc">{slide.description}</p>
              </div>
            ))}
          </div>
          <div className="onb-dots">
            {CAROUSEL_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`onb-dot ${i === carouselIndex ? 'active' : ''}`}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Login form */}
      <div className="onb-login card">
        <h3 className="onb-login-title">
          {otpSent ? 'Verify OTP' : 'Get Started'}
        </h3>
        <p className="onb-login-subtitle">
          {otpSent
            ? `Enter the 6-digit code sent to +91 ${phone}`
            : 'Enter your mobile number to continue'}
        </p>

        {!otpSent ? (
          <>
            <div className="onb-phone-input">
              <span className="onb-phone-prefix">+91</span>
              <input
                type="tel"
                className="input-field onb-phone-field"
                placeholder="Enter mobile number"
                maxLength={10}
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                }
              />
            </div>
            <button
              className="btn-primary onb-full-btn"
              disabled={phone.length < 10}
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <div className="onb-otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel"
                  className={`onb-otp-box ${digit ? 'filled' : ''}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button
              className="btn-primary onb-full-btn"
              disabled={!otpFilled || verifying}
              onClick={handleVerifyOtp}
            >
              {verifying ? (
                <span className="onb-spinner" />
              ) : (
                'Verify & Continue'
              )}
            </button>

            <div className="onb-resend">
              {otpTimer > 0 ? (
                <span className="onb-resend-timer">
                  Resend OTP in <strong>{otpTimer}s</strong>
                </span>
              ) : (
                <button
                  className="onb-resend-btn"
                  onClick={() => {
                    setOtp(['', '', '', '', '', '']);
                    setOtpTimer(30);
                  }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ── Phase 2: Role Detection ── */
  const renderPhase2 = () => (
    <div className="onb-phase onb-phase-role">
      <div className="onb-role-header">
        <div className="onb-role-detected badge-success badge">
          Detected Role
        </div>
        <h2 className="onb-role-title">We identified you as a</h2>
        <div className="onb-role-highlight">
          {ROLES.find((r) => r.id === detectedRole)?.label}
        </div>
        <p className="onb-role-subtitle">
          Based on your phone number, we detected your role. You can change it
          below if needed.
        </p>
      </div>

      <div className="onb-role-cards">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={`onb-role-card card ${
              selectedRole === role.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedRole(role.id)}
          >
            <div className="onb-role-card-radio">
              <div
                className={`onb-radio ${
                  selectedRole === role.id ? 'checked' : ''
                }`}
              />
            </div>
            <div className="onb-role-card-body">
              <div className="onb-role-card-label">{role.label}</div>
              <div className="onb-role-card-desc">{role.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <button className="btn-primary onb-full-btn" onClick={handleRoleContinue}>
        Continue as {ROLES.find((r) => r.id === selectedRole)?.label}
      </button>
    </div>
  );

  /* ── Phase 3: KYC ── */
  const renderKycProgress = () => (
    <div className="onb-kyc-progress">
      {KYC_STEPS.map((label, i) => {
        const step = i + 1;
        const isComplete = step < kycStep;
        const isCurrent = step === kycStep;
        return (
          <div
            key={step}
            className={`onb-kyc-step-indicator ${
              isComplete ? 'complete' : isCurrent ? 'current' : 'upcoming'
            }`}
          >
            <div className="onb-kyc-step-circle">
              {isComplete ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
            <span className="onb-kyc-step-label">{label}</span>
          </div>
        );
      })}
      <div className="onb-kyc-progress-bar">
        <div
          className="onb-kyc-progress-fill"
          style={{ width: `${((kycStep - 1) / (KYC_STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderKycStep1 = () => (
    <div className="onb-kyc-form">
      <h3 className="onb-kyc-form-title">Personal Information</h3>
      <p className="onb-kyc-form-subtitle">Tell us about yourself</p>
      <div className="onb-form-group">
        <label className="onb-label">Full Name (as per PAN)</label>
        <input
          className="input-field"
          placeholder="Enter your full name"
          value={kycData.fullName}
          onChange={(e) => handleKycFieldChange('fullName', e.target.value)}
        />
      </div>
      <div className="onb-form-group">
        <label className="onb-label">Date of Birth</label>
        <input
          type="date"
          className="input-field"
          value={kycData.dateOfBirth}
          onChange={(e) => handleKycFieldChange('dateOfBirth', e.target.value)}
        />
      </div>
      <div className="onb-form-group">
        <label className="onb-label">Email Address</label>
        <input
          type="email"
          className="input-field"
          placeholder="you@example.com"
          value={kycData.email}
          onChange={(e) => handleKycFieldChange('email', e.target.value)}
        />
      </div>
      <div className="onb-form-group">
        <label className="onb-label">Address</label>
        <textarea
          className="input-field onb-textarea"
          placeholder="Enter your full address"
          rows={3}
          value={kycData.address}
          onChange={(e) => handleKycFieldChange('address', e.target.value)}
        />
      </div>
    </div>
  );

  const renderKycStep2 = () => (
    <div className="onb-kyc-form">
      <h3 className="onb-kyc-form-title">PAN Verification</h3>
      <p className="onb-kyc-form-subtitle">
        We need your PAN for regulatory compliance
      </p>
      <div className="onb-form-group">
        <label className="onb-label">PAN Number</label>
        <div className="onb-pan-row">
          <input
            className="input-field"
            placeholder="ABCDE1234F"
            maxLength={10}
            value={kycData.panNumber}
            onChange={(e) =>
              handleKycFieldChange(
                'panNumber',
                e.target.value.toUpperCase().slice(0, 10),
              )
            }
            style={{ textTransform: 'uppercase' }}
          />
          <button
            className="btn-secondary"
            disabled={kycData.panNumber.length < 10 || panVerifying || panVerified}
            onClick={handleVerifyPan}
          >
            {panVerifying ? (
              <span className="onb-spinner" />
            ) : panVerified ? (
              'Verified'
            ) : (
              'Verify'
            )}
          </button>
        </div>
      </div>
      {panVerified && (
        <div className="onb-pan-result card">
          <div className="badge badge-success">Verified</div>
          <div className="onb-pan-name">{kycData.panName}</div>
          <div className="onb-pan-note">
            Name matched with PAN records successfully.
          </div>
        </div>
      )}
    </div>
  );

  const renderKycStep3 = () => (
    <div className="onb-kyc-form">
      <h3 className="onb-kyc-form-title">Bank Account Details</h3>
      <p className="onb-kyc-form-subtitle">
        For commission payouts and settlements
      </p>
      <div className="onb-form-group">
        <label className="onb-label">Bank Name</label>
        <select
          className="select-field"
          value={kycData.bankName}
          onChange={(e) => handleKycFieldChange('bankName', e.target.value)}
        >
          <option value="">Select bank</option>
          <option value="sbi">State Bank of India</option>
          <option value="hdfc">HDFC Bank</option>
          <option value="icici">ICICI Bank</option>
          <option value="axis">Axis Bank</option>
          <option value="kotak">Kotak Mahindra Bank</option>
        </select>
      </div>
      <div className="onb-form-group">
        <label className="onb-label">Account Number</label>
        <input
          type="tel"
          className="input-field"
          placeholder="Enter account number"
          value={kycData.accountNumber}
          onChange={(e) =>
            handleKycFieldChange(
              'accountNumber',
              e.target.value.replace(/\D/g, ''),
            )
          }
        />
      </div>
      <div className="onb-form-group">
        <label className="onb-label">IFSC Code</label>
        <input
          className="input-field"
          placeholder="e.g. SBIN0001234"
          maxLength={11}
          value={kycData.ifscCode}
          onChange={(e) =>
            handleKycFieldChange('ifscCode', e.target.value.toUpperCase().slice(0, 11))
          }
          style={{ textTransform: 'uppercase' }}
        />
      </div>
      <div className="onb-form-group">
        <label className="onb-label">Account Holder Name</label>
        <input
          className="input-field"
          placeholder="Name as per bank records"
          value={kycData.accountHolderName}
          onChange={(e) =>
            handleKycFieldChange('accountHolderName', e.target.value)
          }
        />
      </div>
    </div>
  );

  const renderKycStep4 = () => (
    <div className="onb-kyc-form">
      <h3 className="onb-kyc-form-title">Document Upload</h3>
      <p className="onb-kyc-form-subtitle">
        Upload a government-issued ID for verification
      </p>
      <div className="onb-form-group">
        <label className="onb-label">Document Type</label>
        <select
          className="select-field"
          value={kycData.docType}
          onChange={(e) => handleKycFieldChange('docType', e.target.value)}
        >
          <option value="aadhaar">Aadhaar Card</option>
          <option value="voter-id">Voter ID</option>
          <option value="driving-license">Driving License</option>
          <option value="passport">Passport</option>
        </select>
      </div>

      <div
        className={`onb-upload-zone ${kycData.docUploaded ? 'uploaded' : ''}`}
        onClick={() => handleKycFieldChange('docUploaded', true)}
      >
        {kycData.docUploaded ? (
          <div className="onb-upload-success">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="var(--success-bg)" />
              <path
                d="M13 20L18 25L27 15"
                stroke="var(--success)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="onb-upload-filename">document_front.jpg</span>
            <span className="onb-upload-change">Tap to change</span>
          </div>
        ) : (
          <div className="onb-upload-empty">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect
                x="1"
                y="1"
                width="38"
                height="38"
                rx="8"
                stroke="var(--border-default)"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <path
                d="M20 14V26M14 20H26"
                stroke="var(--text-tertiary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="onb-upload-label">
              Tap to upload document
            </span>
            <span className="onb-upload-hint">
              JPG, PNG or PDF up to 5MB
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderKycStep5 = () => (
    <div className="onb-kyc-form">
      <h3 className="onb-kyc-form-title">Review & Submit</h3>
      <p className="onb-kyc-form-subtitle">
        Please verify all details before submitting
      </p>

      <div className="onb-review-section card">
        <div className="onb-review-heading">Personal Info</div>
        <div className="onb-review-row">
          <span className="onb-review-label">Name</span>
          <span className="onb-review-value">
            {kycData.fullName || 'Not provided'}
          </span>
        </div>
        <div className="onb-review-row">
          <span className="onb-review-label">DOB</span>
          <span className="onb-review-value">
            {kycData.dateOfBirth || 'Not provided'}
          </span>
        </div>
        <div className="onb-review-row">
          <span className="onb-review-label">Email</span>
          <span className="onb-review-value">
            {kycData.email || 'Not provided'}
          </span>
        </div>
      </div>

      <div className="onb-review-section card">
        <div className="onb-review-heading">PAN Details</div>
        <div className="onb-review-row">
          <span className="onb-review-label">PAN</span>
          <span className="onb-review-value">
            {kycData.panNumber || 'Not provided'}
          </span>
        </div>
        <div className="onb-review-row">
          <span className="onb-review-label">Status</span>
          <span className="onb-review-value">
            {panVerified ? (
              <span className="badge badge-success">Verified</span>
            ) : (
              <span className="badge badge-warning">Pending</span>
            )}
          </span>
        </div>
      </div>

      <div className="onb-review-section card">
        <div className="onb-review-heading">Bank Details</div>
        <div className="onb-review-row">
          <span className="onb-review-label">Bank</span>
          <span className="onb-review-value">
            {kycData.bankName || 'Not provided'}
          </span>
        </div>
        <div className="onb-review-row">
          <span className="onb-review-label">Account</span>
          <span className="onb-review-value">
            {kycData.accountNumber
              ? `****${kycData.accountNumber.slice(-4)}`
              : 'Not provided'}
          </span>
        </div>
        <div className="onb-review-row">
          <span className="onb-review-label">IFSC</span>
          <span className="onb-review-value">
            {kycData.ifscCode || 'Not provided'}
          </span>
        </div>
      </div>

      <div className="onb-review-section card">
        <div className="onb-review-heading">Documents</div>
        <div className="onb-review-row">
          <span className="onb-review-label">ID Proof</span>
          <span className="onb-review-value">
            {kycData.docUploaded ? (
              <span className="badge badge-success">Uploaded</span>
            ) : (
              <span className="badge badge-warning">Pending</span>
            )}
          </span>
        </div>
      </div>

      <div className="onb-consent">
        <p>
          By submitting, I confirm that all information provided is accurate
          and I agree to the{' '}
          <a href="#" className="onb-link">
            Terms &amp; Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="onb-link">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );

  const renderPhase3 = () => (
    <div className="onb-phase onb-phase-kyc">
      <div className="onb-kyc-header">
        <h2 className="onb-kyc-title">Complete Your KYC</h2>
        <p className="onb-kyc-subtitle">
          Step {kycStep} of {KYC_STEPS.length}
        </p>
      </div>

      {renderKycProgress()}

      <div className="onb-kyc-body">
        {kycStep === 1 && renderKycStep1()}
        {kycStep === 2 && renderKycStep2()}
        {kycStep === 3 && renderKycStep3()}
        {kycStep === 4 && renderKycStep4()}
        {kycStep === 5 && renderKycStep5()}
      </div>

      <div className="onb-kyc-actions">
        {kycStep > 1 && (
          <button className="btn-secondary" onClick={handleKycBack}>
            Back
          </button>
        )}
        <button className="btn-primary onb-full-btn" onClick={handleKycNext}>
          {kycStep === 5 ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  );

  /* ── Phase 4: Pending Activation ── */
  const renderPhase4 = () => (
    <div className="onb-phase onb-phase-pending">
      <div className="onb-pending-animation">
        <div className="onb-pending-ring" />
        <div className="onb-pending-ring ring-2" />
        <div className="onb-pending-ring ring-3" />
        <div className="onb-pending-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 8V24L32 32"
              stroke="var(--acko-purple)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h2 className="onb-pending-title">Application Submitted!</h2>
      <p className="onb-pending-subtitle">
        Your KYC application is under review. We will notify you once
        it is approved.
      </p>

      <div className="onb-pending-status card">
        <div className="onb-pending-status-row">
          <span className="onb-pending-status-label">Application ID</span>
          <span className="onb-pending-status-value">
            {applicationId}
          </span>
        </div>
        <div className="onb-pending-status-row">
          <span className="onb-pending-status-label">Status</span>
          <span className="badge badge-warning">Under Review</span>
        </div>
        <div className="onb-pending-status-row">
          <span className="onb-pending-status-label">Expected Time</span>
          <span className="onb-pending-status-value">24-48 hours</span>
        </div>
      </div>

      <div className="onb-pending-steps">
        <div className="onb-pending-step done">
          <div className="onb-pending-step-icon done">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8L6.5 11.5L13 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Application submitted</span>
        </div>
        <div className="onb-pending-step active">
          <div className="onb-pending-step-icon active">
            <span className="onb-mini-spinner" />
          </div>
          <span>KYC verification in progress</span>
        </div>
        <div className="onb-pending-step">
          <div className="onb-pending-step-icon" />
          <span>Account activation</span>
        </div>
      </div>

      <button
        className="btn-secondary onb-full-btn"
        onClick={() => {
          setCurrentPhase(1);
          setOtpSent(false);
          setOtp(['', '', '', '', '', '']);
          setPhone('');
          setKycData(INITIAL_KYC);
          setKycStep(1);
          setPanVerified(false);
        }}
      >
        Back to Home
      </button>
    </div>
  );

  return (
    <div className="onb-container">
      <div className="onb-brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="7" fill="var(--acko-purple)" />
          <path
            d="M8 14L12 18L20 10"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="onb-brand-text">mPOS</span>
      </div>

      {currentPhase === 1 && renderPhase1()}
      {currentPhase === 2 && renderPhase2()}
      {currentPhase === 3 && renderPhase3()}
      {currentPhase === 4 && renderPhase4()}
    </div>
  );
}
