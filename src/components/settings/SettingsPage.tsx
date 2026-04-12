import { useState } from 'react';
import { useAppStore, type Language } from '../../store/useAppStore';
import { languageLabels } from '../../i18n/strings';
import './SettingsPage.css';

type Tab = 'profile' | 'notifications' | 'security' | 'branding' | 'nominee';

export default function SettingsPage() {
  const { authUser, activeRole, language, setLanguage } = useAppStore();
  const [tab, setTab] = useState<Tab>('profile');

  const [notifPrefs, setNotifPrefs] = useState({
    sms: { policy: true, claim: true, incentive: true },
    whatsapp: { policy: true, claim: true, incentive: true },
    email: { policy: false, claim: true, incentive: true },
  });

  const [brandColor, setBrandColor] = useState('#1E1B4B');
  const [brandName, setBrandName] = useState('Xiaomi India');

  const toggle = (channel: keyof typeof notifPrefs, event: string) => {
    setNotifPrefs({
      ...notifPrefs,
      [channel]: {
        ...notifPrefs[channel],
        [event]: !notifPrefs[channel][event as keyof typeof notifPrefs.sms],
      },
    });
  };

  const isBrandAdmin = activeRole === 'brand-admin' || activeRole === 'acko-super-admin';

  const initials = (authUser?.name ?? 'Amit Sharma')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1 className="page-title">Settings</h1>
        <p className="text-secondary">Manage your profile, branding and preferences</p>
      </header>

      <div className="settings-layout">
        <aside className="settings-tabs">
          <button className={`settings-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <span>&#128100;</span> Profile
          </button>
          <button className={`settings-tab ${tab === 'notifications' ? 'active' : ''}`} onClick={() => setTab('notifications')}>
            <span>&#128276;</span> Notifications
          </button>
          <button className={`settings-tab ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}>
            <span>&#128274;</span> Security
          </button>
          {isBrandAdmin && (
            <button className={`settings-tab ${tab === 'branding' ? 'active' : ''}`} onClick={() => setTab('branding')}>
              <span>&#127912;</span> Branding
            </button>
          )}
          <button className={`settings-tab ${tab === 'nominee' ? 'active' : ''}`} onClick={() => setTab('nominee')}>
            <span>&#128105;</span> Nominee
          </button>
        </aside>

        <main className="settings-main">
          {tab === 'profile' && (
            <div className="card">
              <h3>Profile</h3>
              <div className="settings-avatar-row">
                <div className="settings-avatar">{initials}</div>
                <div>
                  <button className="btn-secondary">Upload avatar</button>
                  <div className="text-secondary settings-avatar-hint">JPG or PNG, max 2MB</div>
                </div>
              </div>
              <div className="settings-field-grid">
                <div className="settings-field">
                  <label>Full name</label>
                  <input className="input-field" defaultValue={authUser?.name ?? 'Amit Sharma'} />
                </div>
                <div className="settings-field">
                  <label>Mobile (read-only after KYC)</label>
                  <input className="input-field" defaultValue={authUser?.phone ?? '+91 98765XXXXX'} disabled />
                </div>
                <div className="settings-field">
                  <label>Email</label>
                  <input className="input-field" placeholder="you@example.com" />
                </div>
                <div className="settings-field">
                  <label>Language</label>
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
              <div className="settings-bank card-inner">
                <div>
                  <div className="settings-bank-label">Linked bank account</div>
                  <div>HDFC Bank &bull; •••• 4521</div>
                </div>
                <button className="btn-secondary">Change account</button>
              </div>
              <div className="settings-warning">
                Changing your bank account triggers a 7-day cooling period. Withdrawals will be blocked during this time.
              </div>
              <div className="settings-actions">
                <button className="btn-primary">Save changes</button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card">
              <h3>Notification preferences</h3>
              <p className="text-secondary">Choose which updates you receive on each channel.</p>
              <div className="notif-table">
                <div className="notif-row notif-row-head">
                  <div>Event</div>
                  <div>SMS</div>
                  <div>WhatsApp</div>
                  <div>Email</div>
                </div>
                {[
                  { id: 'policy', label: 'Policy issued & renewed' },
                  { id: 'claim', label: 'Claim status updates' },
                  { id: 'incentive', label: 'Incentives credited & milestones' },
                ].map((ev) => (
                  <div key={ev.id} className="notif-row">
                    <div>{ev.label}</div>
                    {(['sms', 'whatsapp', 'email'] as const).map((ch) => (
                      <div key={ch}>
                        <button
                          className={`toggle ${notifPrefs[ch][ev.id as keyof typeof notifPrefs.sms] ? 'on' : ''}`}
                          onClick={() => toggle(ch, ev.id)}
                        >
                          <span className="toggle-knob" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <h3>Security</h3>
              <div className="settings-sec-item">
                <div>
                  <div className="settings-sec-title">Change PIN</div>
                  <div className="text-secondary">Used to authorise withdrawals and sensitive actions</div>
                </div>
                <button className="btn-secondary">Change</button>
              </div>
              <div className="settings-sec-item">
                <div>
                  <div className="settings-sec-title">Biometric login</div>
                  <div className="text-secondary">Use fingerprint or face ID on mobile</div>
                </div>
                <button className="toggle on"><span className="toggle-knob" /></button>
              </div>
              <div className="settings-sec-item">
                <div>
                  <div className="settings-sec-title">Two-factor authentication</div>
                  <div className="text-secondary">Required for withdrawals above ₹20,000</div>
                </div>
                <button className="toggle on"><span className="toggle-knob" /></button>
              </div>
              <div className="settings-sec-item">
                <div>
                  <div className="settings-sec-title">Active sessions</div>
                  <div className="text-secondary">2 devices signed in</div>
                </div>
                <button className="btn-ghost">Manage</button>
              </div>
            </div>
          )}

          {tab === 'branding' && isBrandAdmin && (
            <div className="card">
              <h3>Brand settings</h3>
              <p className="text-secondary">Customise how your brand appears across MPOS and on policy certificates.</p>
              <div className="settings-field-grid">
                <div className="settings-field">
                  <label>Brand name</label>
                  <input className="input-field" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                </div>
                <div className="settings-field">
                  <label>Support contact</label>
                  <input className="input-field" placeholder="support@xiaomi.in" />
                </div>
                <div className="settings-field">
                  <label>Tagline</label>
                  <input className="input-field" placeholder="Innovation for everyone" />
                </div>
                <div className="settings-field">
                  <label>Primary colour</label>
                  <div className="settings-color-input">
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
                    <code>{brandColor}</code>
                  </div>
                </div>
              </div>
              <div className="settings-logo-upload">
                <div>
                  <div className="settings-sec-title">Brand logo</div>
                  <div className="text-secondary">Shown in nav and on policy documents</div>
                </div>
                <button className="btn-secondary">Upload SVG or PNG</button>
              </div>

              <h4>Policy certificate preview</h4>
              <div className="settings-preview" style={{ borderTopColor: brandColor }}>
                <div className="settings-preview-header" style={{ background: brandColor }}>
                  <strong>{brandName}</strong>
                  <span>Powered by ACKO</span>
                </div>
                <div className="settings-preview-body">
                  <div className="settings-preview-title">Device Protection Certificate</div>
                  <div className="settings-preview-grid">
                    <div><span>Policy no.</span><strong>ACK-2026-1432</strong></div>
                    <div><span>Device</span><strong>Redmi Note 13 Pro</strong></div>
                    <div><span>Plan</span><strong>Extended Warranty 1Y</strong></div>
                    <div><span>Premium</span><strong>₹2,199</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'nominee' && (
            <div className="card">
              <h3>Next-of-kin nominee</h3>
              <p className="text-secondary">
                Register a nominee to receive pending incentive settlements if you become inactive for 90+ days.
                This action is irreversible — confirm carefully.
              </p>
              <div className="settings-field-grid">
                <div className="settings-field">
                  <label>Nominee name</label>
                  <input className="input-field" placeholder="Full name" />
                </div>
                <div className="settings-field">
                  <label>Relationship</label>
                  <select className="select-field">
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                  </select>
                </div>
                <div className="settings-field">
                  <label>Nominee mobile</label>
                  <input className="input-field" placeholder="+91 98765XXXXX" />
                </div>
                <div className="settings-field">
                  <label>Nominee Aadhaar (masked)</label>
                  <input className="input-field" placeholder="XXXX XXXX XXXX" />
                </div>
              </div>
              <div className="settings-warning">
                Nominee settlement requires 2-factor confirmation: OTP + manager PIN. The nominee cannot be changed within 30 days of registration.
              </div>
              <div className="settings-actions">
                <button className="btn-primary">Save nominee</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
