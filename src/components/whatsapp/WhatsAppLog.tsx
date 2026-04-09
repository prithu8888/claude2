import { useState } from 'react';
import AIBadge from '../shared/AIBadge';
import './WhatsAppLog.css';

type DeliveryStatus = 'delivered' | 'read' | 'failed' | 'sent';
type Category = 'customer' | 'agent' | 'dealer';

interface WaMessage {
  id: string;
  to: string;
  phone: string;
  template: string;
  category: Category;
  status: DeliveryStatus;
  sentAt: string;
  preview: string;
}

const messages: WaMessage[] = [
  { id: 'w1', to: 'Priya Patel', phone: '+91 98765XXXXX', template: 'Policy Issued', category: 'customer', status: 'read', sentAt: '2026-03-07 10:42', preview: 'Your ACKO device protection policy ACK-2026-1432 has been activated. View policy: bit.ly/xyz' },
  { id: 'w2', to: 'Amit Sharma', phone: '+91 98764XXXXX', template: 'Daily Summary', category: 'agent', status: 'delivered', sentAt: '2026-03-07 08:00', preview: 'Hi Amit, you sold 5 plans yesterday and earned \u20B9245. Keep it up!' },
  { id: 'w3', to: 'Croma Koramangala', phone: '+91 98763XXXXX', template: 'Weekly Report', category: 'dealer', status: 'read', sentAt: '2026-03-07 09:15', preview: 'Your weekly performance report: 47 policies sold, \u20B92,340 in commissions.' },
  { id: 'w4', to: 'Rahul Kumar', phone: '+91 98762XXXXX', template: 'Claim Status', category: 'customer', status: 'read', sentAt: '2026-03-06 16:30', preview: 'Your claim CLM-884 has been approved. \u20B98,500 will be credited within 3 business days.' },
  { id: 'w5', to: 'Sneha Reddy', phone: '+91 98761XXXXX', template: 'Incentive Credited', category: 'agent', status: 'delivered', sentAt: '2026-03-06 12:00', preview: 'Incentive of \u20B91,200 has been credited to your wallet. Withdraw anytime.' },
  { id: 'w6', to: 'Vikram Singh', phone: '+91 98760XXXXX', template: 'Renewal Reminder', category: 'customer', status: 'sent', sentAt: '2026-03-06 10:45', preview: 'Hi Vikram, your Samsung S24 protection plan expires in 15 days. Renew to stay protected.' },
  { id: 'w7', to: 'EV World Bengaluru', phone: '+91 98759XXXXX', template: 'New Campaign', category: 'dealer', status: 'delivered', sentAt: '2026-03-05 14:22', preview: 'A new campaign "Monsoon Shield" is now live. 12% off all device protection plans.' },
  { id: 'w8', to: 'Kiran Rao', phone: '+91 98758XXXXX', template: 'Payment Link', category: 'customer', status: 'failed', sentAt: '2026-03-05 11:12', preview: 'Pay \u20B9444 to complete your device protection purchase.' },
];

const templates = [
  { name: 'Policy Issued', category: 'customer' as Category, sent: 1432, description: 'Sent to customer right after policy issuance' },
  { name: 'Claim Status', category: 'customer' as Category, sent: 88, description: 'Claim status change notifications' },
  { name: 'Renewal Reminder', category: 'customer' as Category, sent: 245, description: 'Sent 30/15/7 days before expiry' },
  { name: 'Payment Link', category: 'customer' as Category, sent: 412, description: 'UPI/card payment link for pending purchases' },
  { name: 'Daily Summary', category: 'agent' as Category, sent: 890, description: 'Daily performance summary for agents' },
  { name: 'Incentive Credited', category: 'agent' as Category, sent: 324, description: 'Commission credit notification' },
  { name: 'Weekly Report', category: 'dealer' as Category, sent: 156, description: 'Weekly performance report' },
  { name: 'New Campaign', category: 'dealer' as Category, sent: 67, description: 'Campaign launch notification' },
];

export default function WhatsAppLog() {
  const [tab, setTab] = useState<'log' | 'templates'>('log');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const filtered = messages.filter((m) => categoryFilter === 'all' || m.category === categoryFilter);

  const statusClass = (s: DeliveryStatus) => {
    switch (s) {
      case 'read': return 'badge-success';
      case 'delivered': return 'badge-info';
      case 'sent': return 'badge-neutral';
      case 'failed': return 'badge-error';
    }
  };

  const statusLabel = (s: DeliveryStatus) => {
    switch (s) {
      case 'read': return 'Read';
      case 'delivered': return 'Delivered';
      case 'sent': return 'Sent';
      case 'failed': return 'Failed';
    }
  };

  return (
    <div className="wa-page">
      <header className="wa-header">
        <div>
          <h1 className="page-title">WhatsApp</h1>
          <p className="text-secondary">Notifications sent to customers, agents, and dealers</p>
        </div>
        <div className="wa-stats-inline">
          <div>
            <div className="wa-stat-value">3,614</div>
            <div className="wa-stat-label">Sent this month</div>
          </div>
          <div>
            <div className="wa-stat-value success">92%</div>
            <div className="wa-stat-label">Read rate</div>
          </div>
        </div>
      </header>

      <div className="wa-ai-note">
        <AIBadge label="AI Personalisation" shimmer />
        <span>
          Message content is dynamically personalised. E.g., renewal reminders mention device age, usage patterns and monsoon-season considerations.
        </span>
      </div>

      <div className="wa-tabs">
        <button className={`wa-tab ${tab === 'log' ? 'active' : ''}`} onClick={() => setTab('log')}>
          Message log
        </button>
        <button className={`wa-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>
          Templates
        </button>
      </div>

      {tab === 'log' && (
        <>
          <div className="wa-filters">
            <button
              className={`chip ${categoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All
            </button>
            <button
              className={`chip ${categoryFilter === 'customer' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('customer')}
            >
              Customer
            </button>
            <button
              className={`chip ${categoryFilter === 'agent' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('agent')}
            >
              Agent
            </button>
            <button
              className={`chip ${categoryFilter === 'dealer' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('dealer')}
            >
              Dealer
            </button>
          </div>

          <div className="wa-log-list">
            {filtered.map((m) => (
              <div key={m.id} className="wa-msg card">
                <div className="wa-msg-avatar">
                  <svg viewBox="0 0 32 32" width="24" height="24">
                    <circle cx="16" cy="16" r="16" fill="#25D366" />
                    <path d="M22.9 19.2c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.3-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.4 4.8 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5s-.2-.1-.5-.3z" fill="white" />
                  </svg>
                </div>
                <div className="wa-msg-body">
                  <div className="wa-msg-header">
                    <div>
                      <strong>{m.to}</strong>
                      <span className="text-tertiary">{m.phone}</span>
                    </div>
                    <div className="wa-msg-meta">
                      <span className={`badge ${statusClass(m.status)}`}>{statusLabel(m.status)}</span>
                      <span className="text-tertiary wa-msg-time">{m.sentAt}</span>
                    </div>
                  </div>
                  <div className="wa-msg-template-row">
                    <span className="wa-msg-template">Template: {m.template}</span>
                    <span className="wa-category-pill">{m.category}</span>
                  </div>
                  <div className="wa-msg-preview">{m.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'templates' && (
        <div className="wa-templates-grid">
          {templates.map((t) => (
            <div key={t.name} className="wa-template card">
              <div className="wa-template-header">
                <div>
                  <div className="wa-template-name">{t.name}</div>
                  <div className="text-tertiary wa-template-cat">{t.category}</div>
                </div>
                <span className="badge badge-success">Approved</span>
              </div>
              <div className="wa-template-desc">{t.description}</div>
              <div className="wa-template-stats">
                <div>
                  <span className="wa-template-stat-value">{t.sent.toLocaleString('en-IN')}</span>
                  <span className="wa-template-stat-label">Sent this month</span>
                </div>
                <button className="btn-ghost">Preview</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
