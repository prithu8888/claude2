import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, type Language } from '../../store/useAppStore';
import type { Role } from '../../types/mpos';
import { t, languageLabels } from '../../i18n/strings';
import './Login.css';

type Tab = 'otp' | 'google';

const roleOptions: { value: Role; label: string }[] = [
  { value: 'acko-super-admin', label: 'Super Admin (ACKO internal)' },
  { value: 'brand-admin', label: 'Brand Admin' },
  { value: 'dealer', label: 'Dealer Admin' },
  { value: 'promoter', label: 'Sales Agent / Promoter' },
];

export default function Login() {
  const navigate = useNavigate();
  const { setAuthenticated, setActiveRole, activeRole, language, setLanguage } = useAppStore();

  const [tab, setTab] = useState<Tab>('otp');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!otpSent) return;
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, otpSent]);

  useEffect(() => {
    if (!toastMessage) return;
    const id = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(id);
  }, [toastMessage]);

  const handleSendOtp = () => {
    if (phone.length !== 10) {
      setToastMessage('Enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setCountdown(30);
    setToastMessage(`OTP sent to +91 XXXXXX${phone.slice(-4)}`);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otpDigits.some((d) => !d)) {
      setToastMessage('Enter the complete 6-digit OTP');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setAuthenticated(true, {
        name: activeRole === 'promoter' ? 'Amit Sharma' : activeRole === 'dealer' ? 'Ramesh Kumar' : activeRole === 'brand-admin' ? 'Priya Menon' : 'Neha Gupta',
        phone: `+91 ${phone || '98765XXXXX'}`,
      });
      navigate('/home');
    }, 900);
  };

  const handleGoogleSignIn = () => {
    setVerifying(true);
    setTimeout(() => {
      setAuthenticated(true, {
        name: 'Rahul Iyer',
        phone: '+91 98765XXXXX',
      });
      navigate('/home');
    }, 800);
  };

  const handleResend = () => {
    setCountdown(30);
    setOtpDigits(['', '', '', '', '', '']);
    setToastMessage('OTP re-sent');
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="login-screen">
      <div className="login-bg-gradient" />

      <header className="login-header">
        <div className="login-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1E1B4B" />
            <path d="M9 16L13.5 20.5L23 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>ACKO MPOS</span>
        </div>
      </header>

      <main className="login-main">
        <div className="login-card card">
          <div className="login-title-block">
            <h1 className="login-title">{t('auth.welcome', language)}</h1>
            <p className="login-subtitle">{t('auth.subtitle', language)}</p>
          </div>

          <div className="login-tabs" role="tablist">
            <button
              role="tab"
              className={`login-tab ${tab === 'otp' ? 'active' : ''}`}
              onClick={() => setTab('otp')}
            >
              {t('auth.mobileOtp', language)}
            </button>
            <button
              role="tab"
              className={`login-tab ${tab === 'google' ? 'active' : ''}`}
              onClick={() => setTab('google')}
            >
              {t('auth.googleSignin', language)}
            </button>
          </div>

          {tab === 'otp' ? (
            <div className="login-tab-content">
              {!otpSent ? (
                <>
                  <label className="login-label">{t('auth.mobileNumber', language)}</label>
                  <div className="login-phone-input">
                    <div className="login-phone-prefix">
                      <span className="flag">{'🇮🇳'}</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="98765 43210"
                      className="login-phone-field"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <button
                    className="btn-primary login-btn-wide"
                    onClick={handleSendOtp}
                    disabled={phone.length !== 10}
                  >
                    {t('auth.sendOtp', language)}
                  </button>
                </>
              ) : (
                <>
                  <label className="login-label">{t('auth.enterOtp', language)}</label>
                  <div className="login-otp-row">
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        className="login-otp-box"
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>
                  <div className="login-otp-meta">
                    {countdown > 0 ? (
                      <span className="text-secondary">
                        {t('auth.resendIn', language)} {countdown}s
                      </span>
                    ) : (
                      <button className="login-resend" onClick={handleResend}>
                        {t('auth.resendOtp', language)}
                      </button>
                    )}
                  </div>
                  <button
                    className="btn-primary login-btn-wide"
                    onClick={handleVerify}
                    disabled={verifying}
                  >
                    {verifying ? 'Verifying…' : t('auth.verifyOtp', language)}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="login-tab-content">
              <button className="google-btn" onClick={handleGoogleSignIn} disabled={verifying}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.257h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                {verifying ? 'Signing in…' : t('auth.signInGoogle', language)}
              </button>
              <p className="google-note text-secondary">
                We’ll use your Google account to authenticate. Your workspace will be loaded based on the role below.
              </p>
            </div>
          )}

          <div className="login-divider">
            <span>Demo controls</span>
          </div>

          <div className="login-demo-controls">
            <div className="login-field">
              <label className="login-label-sm">{t('auth.demoRole', language)}</label>
              <select
                className="select-field"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as Role)}
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="login-field">
              <label className="login-label-sm">{t('auth.language', language)}</label>
              <select
                className="select-field"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {Object.entries(languageLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </main>

      {toastMessage && (
        <div className="login-toast">
          <span className="login-toast-dot" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
