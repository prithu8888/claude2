import { useState } from 'react';
import './BrandAdmin.css';

interface NotificationPref {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function BrandAdminSettings() {
  const [notifications, setNotifications] = useState<NotificationPref[]>([
    { key: 'new-policy', label: 'New Policy Alerts', description: 'Get notified when a new policy is issued', enabled: true },
    { key: 'claim-filed', label: 'Claim Filed', description: 'Alert when a claim is submitted', enabled: true },
    { key: 'dealer-onboard', label: 'Dealer Onboarding', description: 'Notification for new dealer registrations', enabled: true },
    { key: 'daily-digest', label: 'Daily Digest', description: 'Daily summary of key metrics and activities', enabled: false },
    { key: 'commission-payout', label: 'Commission Payouts', description: 'Alerts for commission processing and payouts', enabled: true },
    { key: 'fraud-alert', label: 'Fraud Alerts', description: 'Immediate notification for flagged claims', enabled: true },
  ]);

  function toggleNotification(key: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.key === key ? { ...n, enabled: !n.enabled } : n))
    );
  }

  const commissionRates = [
    { product: 'Extended Warranty (EW)', rate: '20%', payout: 'Monthly' },
    { product: 'Accidental & Liquid Damage (ALD)', rate: '20%', payout: 'Monthly' },
    { product: 'Comprehensive (EV)', rate: '20%', payout: 'Monthly' },
    { product: 'Third Party (EV)', rate: '15%', payout: 'Monthly' },
    { product: 'Personal Accident (PA)', rate: '18%', payout: 'Monthly' },
  ];

  const brandProfile = [
    { label: 'Brand Name', value: 'Samsung India' },
    { label: 'Vertical', value: 'Electronics Retail' },
    { label: 'Contact Email', value: 'admin@samsung-india.com' },
    { label: 'Contact Phone', value: '+91 98765 00001' },
    { label: 'Region', value: 'Pan India' },
    { label: 'Onboarded Since', value: 'January 2025' },
    { label: 'Account Manager', value: 'Vikram Mehta (Acko)' },
  ];

  return (
    <div className="ba-page">
      <div className="ba-page-header">
        <h1>Settings</h1>
      </div>

      <div className="ba-settings-section">
        <h3>Commission Rates</h3>
        <div className="ba-table-wrapper" style={{ boxShadow: 'none', border: 'none' }}>
          <table className="ba-table">
            <thead>
              <tr>
                <th>Product Type</th>
                <th>Commission Rate</th>
                <th>Payout Frequency</th>
              </tr>
            </thead>
            <tbody>
              {commissionRates.map((r) => (
                <tr key={r.product}>
                  <td>{r.product}</td>
                  <td>{r.rate}</td>
                  <td>{r.payout}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ba-settings-section">
        <h3>Brand Profile</h3>
        {brandProfile.map((item) => (
          <div key={item.label} className="ba-settings-row">
            <span className="ba-settings-row-label">{item.label}</span>
            <span className="ba-settings-row-value">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="ba-settings-section">
        <h3>Notification Preferences</h3>
        {notifications.map((n) => (
          <div key={n.key} className="ba-settings-row">
            <div>
              <div className="ba-settings-row-label">{n.label}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                {n.description}
              </div>
            </div>
            <div
              className={`ba-toggle ${n.enabled ? 'active' : ''}`}
              onClick={() => toggleNotification(n.key)}
              role="switch"
              aria-checked={n.enabled}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleNotification(n.key);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
