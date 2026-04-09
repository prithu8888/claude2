import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './Campaigns.css';

interface Campaign {
  id: string;
  name: string;
  brand: string;
  discount: string;
  status: 'active' | 'scheduled' | 'ended' | 'paused';
  startDate: string;
  endDate: string;
  policiesSold: number;
  budgetUsed: number;
  budgetCap: number;
  states: string[];
}

const initialCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Monsoon Shield',
    brand: 'Xiaomi',
    discount: '12%',
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    policiesSold: 1234,
    budgetUsed: 245000,
    budgetCap: 500000,
    states: ['Karnataka', 'Tamil Nadu', 'Kerala'],
  },
  {
    id: 'c2',
    name: 'Weekend Warrior',
    brand: 'Ather Energy',
    discount: '\u20B9500 off',
    status: 'active',
    startDate: '2026-03-15',
    endDate: '2026-03-31',
    policiesSold: 412,
    budgetUsed: 206000,
    budgetCap: 300000,
    states: ['Maharashtra', 'Gujarat'],
  },
  {
    id: 'c3',
    name: 'Spring Launch',
    brand: 'Xiaomi',
    discount: '15%',
    status: 'scheduled',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    policiesSold: 0,
    budgetUsed: 0,
    budgetCap: 750000,
    states: ['All India'],
  },
  {
    id: 'c4',
    name: 'Republic Day Sale',
    brand: 'Xiaomi',
    discount: '20%',
    status: 'ended',
    startDate: '2026-01-20',
    endDate: '2026-01-31',
    policiesSold: 3421,
    budgetUsed: 685000,
    budgetCap: 700000,
    states: ['All India'],
  },
];

type ViewMode = 'list' | 'create';

export default function Campaigns() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>('list');
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  // Create form state
  const [form, setForm] = useState({
    name: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: '',
    startDate: '',
    endDate: '',
    priceBand: '20-40',
    budgetCap: '',
    states: [] as string[],
  });

  const statusClass = (s: Campaign['status']) => {
    switch (s) {
      case 'active': return 'badge-success';
      case 'scheduled': return 'badge-info';
      case 'ended': return 'badge-neutral';
      case 'paused': return 'badge-warning';
    }
  };

  const handleCreate = () => {
    if (!form.name || !form.discountValue || !form.startDate || !form.endDate) return;
    const newCampaign: Campaign = {
      id: `c${campaigns.length + 1}`,
      name: form.name,
      brand: 'Xiaomi',
      discount: form.discountType === 'percentage' ? `${form.discountValue}%` : `${formatINR(parseInt(form.discountValue, 10))} off`,
      status: 'scheduled',
      startDate: form.startDate,
      endDate: form.endDate,
      policiesSold: 0,
      budgetUsed: 0,
      budgetCap: parseInt(form.budgetCap, 10) || 0,
      states: form.states.length ? form.states : ['All India'],
    };
    setCampaigns([newCampaign, ...campaigns]);
    setView('list');
    setForm({ name: '', discountType: 'percentage', discountValue: '', startDate: '', endDate: '', priceBand: '20-40', budgetCap: '', states: [] });
  };

  if (view === 'create') {
    return (
      <div className="campaigns-page">
        <header className="campaigns-header">
          <div>
            <button className="btn-ghost" onClick={() => setView('list')}>&larr; Back</button>
            <h1 className="page-title">New campaign</h1>
          </div>
        </header>

        <div className="campaign-create-grid">
          <div className="card campaign-form">
            <h3 className="card-title">Campaign details</h3>
            <div className="campaign-field">
              <label>Campaign name</label>
              <input
                className="input-field"
                placeholder="e.g. Holi Special"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="campaign-field-row">
              <div className="campaign-field">
                <label>Discount type</label>
                <select
                  className="select-field"
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percentage' | 'flat' })}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (\u20B9)</option>
                </select>
              </div>
              <div className="campaign-field">
                <label>Value</label>
                <input
                  className="input-field"
                  placeholder={form.discountType === 'percentage' ? '10' : '500'}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            {form.discountValue && (
              <div className="campaign-preview-inline">
                <span className="text-secondary">Preview:</span>
                <span className="line-through text-tertiary">\u20B9444</span>
                <strong>
                  {form.discountType === 'percentage'
                    ? formatINR(Math.round(444 * (1 - parseInt(form.discountValue, 10) / 100)))
                    : formatINR(Math.max(0, 444 - parseInt(form.discountValue, 10)))}
                </strong>
              </div>
            )}

            <div className="campaign-field">
              <label>Device price band</label>
              <div className="campaign-chip-row">
                {['0-10k', '10-20k', '20-40k', '40k+'].map((b) => (
                  <button
                    key={b}
                    className={`chip ${form.priceBand === b ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, priceBand: b })}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="campaign-field">
              <label>Target states</label>
              <div className="campaign-chip-row">
                {['Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Delhi'].map((s) => (
                  <button
                    key={s}
                    className={`chip ${form.states.includes(s) ? 'active' : ''}`}
                    onClick={() =>
                      setForm({
                        ...form,
                        states: form.states.includes(s)
                          ? form.states.filter((x) => x !== s)
                          : [...form.states, s],
                      })
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="campaign-field-row">
              <div className="campaign-field">
                <label>Start date</label>
                <input
                  className="input-field"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="campaign-field">
                <label>End date</label>
                <input
                  className="input-field"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="campaign-field">
              <label>Budget cap (\u20B9)</label>
              <input
                className="input-field"
                placeholder="500000"
                value={form.budgetCap}
                onChange={(e) => setForm({ ...form, budgetCap: e.target.value.replace(/\D/g, '') })}
              />
            </div>

            <div className="campaign-actions">
              <button className="btn-ghost" onClick={() => setView('list')}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate}>Launch campaign</button>
            </div>
          </div>

          <div className="card campaign-preview-card">
            <div className="campaign-ai-header">
              <AIBadge label="AI Campaign Advisor" shimmer />
            </div>
            <h3>Predicted impact</h3>
            <div className="campaign-preview-stats">
              <div>
                <div className="campaign-preview-label">Eligible devices</div>
                <div className="campaign-preview-value">12,400</div>
              </div>
              <div>
                <div className="campaign-preview-label">Estimated uplift</div>
                <div className="campaign-preview-value success">+23%</div>
              </div>
              <div>
                <div className="campaign-preview-label">Expected policies</div>
                <div className="campaign-preview-value">~2,850</div>
              </div>
              <div>
                <div className="campaign-preview-label">Discount spend</div>
                <div className="campaign-preview-value">{formatINR(485000)}</div>
              </div>
            </div>

            <div className="campaign-insight-list">
              <div className="campaign-insight">
                <strong>Similar campaigns</strong>
                <p>Comparable brands ran 12% discount campaigns with 23% attach rate uplift on average.</p>
              </div>
              <div className="campaign-insight">
                <strong>State recommendation</strong>
                <p>Your Karnataka attach rate is 4pp below national average \u2014 a state-specific push here may have highest ROI.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaigns-page">
      <header className="campaigns-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="text-secondary">Manage discount campaigns and promotions across your brand</p>
        </div>
        <button className="btn-primary" onClick={() => setView('create')}>
          <span>+</span> New campaign
        </button>
      </header>

      <div className="campaign-stats-row">
        <div className="campaign-stat">
          <div className="campaign-stat-label">Active campaigns</div>
          <div className="campaign-stat-value">{campaigns.filter((c) => c.status === 'active').length}</div>
        </div>
        <div className="campaign-stat">
          <div className="campaign-stat-label">Policies this month</div>
          <div className="campaign-stat-value">{campaigns.reduce((sum, c) => sum + c.policiesSold, 0).toLocaleString('en-IN')}</div>
        </div>
        <div className="campaign-stat">
          <div className="campaign-stat-label">Budget deployed</div>
          <div className="campaign-stat-value">{formatINR(campaigns.reduce((sum, c) => sum + c.budgetUsed, 0))}</div>
        </div>
      </div>

      <div className="campaign-grid">
        {campaigns.map((c) => (
          <div key={c.id} className="campaign-card card">
            <div className="campaign-card-header">
              <div>
                <div className="campaign-card-name">{c.name}</div>
                <div className="campaign-card-brand">{c.brand}</div>
              </div>
              <span className={`badge ${statusClass(c.status)}`}>{c.status}</span>
            </div>

            <div className="campaign-card-discount">{c.discount} off</div>

            <div className="campaign-card-meta">
              <div>
                <span className="campaign-meta-label">Policies</span>
                <span className="campaign-meta-value">{c.policiesSold.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="campaign-meta-label">Budget used</span>
                <span className="campaign-meta-value">{Math.round((c.budgetUsed / Math.max(c.budgetCap, 1)) * 100)}%</span>
              </div>
              <div>
                <span className="campaign-meta-label">Ends</span>
                <span className="campaign-meta-value">{c.endDate}</span>
              </div>
            </div>

            <div className="campaign-progress">
              <div
                className="campaign-progress-fill"
                style={{ width: `${Math.min(100, (c.budgetUsed / Math.max(c.budgetCap, 1)) * 100)}%` }}
              />
            </div>

            <div className="campaign-card-states">
              {c.states.slice(0, 3).map((s) => (
                <span key={s} className="campaign-state-chip">{s}</span>
              ))}
            </div>

            <div className="campaign-card-actions">
              {c.status === 'scheduled' && <button className="btn-ghost">Edit</button>}
              {c.status === 'active' && <button className="btn-ghost">Pause</button>}
              <button className="btn-ghost" onClick={() => navigate('/transactions')}>View policies</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
