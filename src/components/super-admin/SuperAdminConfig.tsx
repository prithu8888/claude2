import { useState } from 'react';
import './SuperAdmin.css';

interface VerticalConfig {
  id: string;
  name: string;
  code: string;
  planTypes: string[];
  brands: string[];
  active: boolean;
}

interface PlanTemplate {
  id: string;
  name: string;
  vertical: string;
  type: string;
  basePremiumRange: string;
  tenure: string;
  active: boolean;
}

interface CommissionDefault {
  id: string;
  vertical: string;
  role: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
}

const verticals: VerticalConfig[] = [
  { id: 'v1', name: 'Electronics Retail', code: 'electronics-retail', planTypes: ['EW', 'ALD'], brands: ['Samsung', 'Xiaomi'], active: true },
  { id: 'v2', name: 'Electronics ASC', code: 'electronics-asc', planTypes: ['EW'], brands: ['Samsung'], active: true },
  { id: 'v3', name: 'EV 2-Wheeler', code: 'ev-2w', planTypes: ['Comprehensive', 'Third Party', 'PA'], brands: ['Ather', 'Ola', 'Bajaj', 'TVS'], active: true },
  { id: 'v4', name: 'EV 4-Wheeler', code: 'ev-4w', planTypes: ['Comprehensive', 'Third Party', 'PA'], brands: ['Tata'], active: false },
];

const planTemplates: PlanTemplate[] = [
  { id: 't1', name: 'Extended Warranty - Standard', vertical: 'Electronics Retail', type: 'EW', basePremiumRange: '₹1,500 - ₹4,000', tenure: '1-2 Years', active: true },
  { id: 't2', name: 'Accidental & Liquid Damage', vertical: 'Electronics Retail', type: 'ALD', basePremiumRange: '₹2,000 - ₹3,500', tenure: '1 Year', active: true },
  { id: 't3', name: 'EV Comprehensive - 2W', vertical: 'EV 2-Wheeler', type: 'Comprehensive', basePremiumRange: '₹4,000 - ₹7,000', tenure: '1 Year', active: true },
  { id: 't4', name: 'EV Third Party - 2W', vertical: 'EV 2-Wheeler', type: 'Third Party', basePremiumRange: '₹1,500 - ₹2,500', tenure: '1 Year', active: true },
  { id: 't5', name: 'Personal Accident Cover', vertical: 'EV 2-Wheeler', type: 'PA', basePremiumRange: '₹800 - ₹1,200', tenure: '1 Year', active: true },
  { id: 't6', name: 'EV Comprehensive - 4W', vertical: 'EV 4-Wheeler', type: 'Comprehensive', basePremiumRange: '₹20,000 - ₹35,000', tenure: '1 Year', active: false },
];

const commissionDefaults: CommissionDefault[] = [
  { id: 'c1', vertical: 'Electronics Retail', role: 'Promoter', percentage: 20, minAmount: 200, maxAmount: 1000 },
  { id: 'c2', vertical: 'Electronics Retail', role: 'Dealer', percentage: 10, minAmount: 100, maxAmount: 500 },
  { id: 'c3', vertical: 'Electronics Retail', role: 'Distributor', percentage: 5, minAmount: 50, maxAmount: 250 },
  { id: 'c4', vertical: 'EV 2-Wheeler', role: 'Promoter', percentage: 20, minAmount: 300, maxAmount: 1500 },
  { id: 'c5', vertical: 'EV 2-Wheeler', role: 'Dealer', percentage: 12, minAmount: 200, maxAmount: 800 },
  { id: 'c6', vertical: 'EV 4-Wheeler', role: 'Promoter', percentage: 20, minAmount: 500, maxAmount: 6000 },
  { id: 'c7', vertical: 'EV 4-Wheeler', role: 'Dealer', percentage: 10, minAmount: 300, maxAmount: 3000 },
];

type ConfigTab = 'verticals' | 'plans' | 'commissions';

export default function SuperAdminConfig() {
  const [tab, setTab] = useState<ConfigTab>('verticals');

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Platform Configuration</h1>
          <p>Manage verticals, plan templates, and commission structures</p>
        </div>
      </div>

      <div className="sa-filter-bar" style={{ gap: 0, marginBottom: 'var(--space-6)' }}>
        {(['verticals', 'plans', 'commissions'] as ConfigTab[]).map((t, i, arr) => (
          <button
            key={t}
            className={tab === t ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setTab(t)}
            style={{
              borderRadius:
                i === 0
                  ? 'var(--radius-md) 0 0 var(--radius-md)'
                  : i === arr.length - 1
                  ? '0 var(--radius-md) var(--radius-md) 0'
                  : '0',
            }}
          >
            {t === 'verticals' ? 'Verticals' : t === 'plans' ? 'Plan Templates' : 'Commission Defaults'}
          </button>
        ))}
      </div>

      {tab === 'verticals' && (
        <div className="sa-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="sa-section-title" style={{ marginBottom: 0 }}>Vertical Configuration</h2>
            <button className="btn-primary">+ Add Vertical</button>
          </div>
          <div className="card sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Plan Types</th>
                  <th>Brands</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {verticals.map((v) => (
                  <tr key={v.id}>
                    <td className="td-bold">{v.name}</td>
                    <td className="td-mono">{v.code}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                        {v.planTypes.map((pt) => (
                          <span key={pt} className="badge badge-purple">{pt}</span>
                        ))}
                      </div>
                    </td>
                    <td>{v.brands.join(', ')}</td>
                    <td>
                      <span className={`badge ${v.active ? 'badge-success' : 'badge-error'}`}>
                        {v.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="sa-actions">
                        <button className="sa-btn-icon" title="Edit">&#x270F;</button>
                        <button className="sa-btn-icon" title="Toggle">&#x26A1;</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'plans' && (
        <div className="sa-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="sa-section-title" style={{ marginBottom: 0 }}>Plan Templates</h2>
            <button className="btn-primary">+ Add Template</button>
          </div>
          <div className="card sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Template Name</th>
                  <th>Vertical</th>
                  <th>Type</th>
                  <th>Base Premium Range</th>
                  <th>Tenure</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {planTemplates.map((t) => (
                  <tr key={t.id}>
                    <td className="td-bold">{t.name}</td>
                    <td>{t.vertical}</td>
                    <td><span className="badge badge-purple">{t.type}</span></td>
                    <td>{t.basePremiumRange}</td>
                    <td>{t.tenure}</td>
                    <td>
                      <span className={`badge ${t.active ? 'badge-success' : 'badge-error'}`}>
                        {t.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="sa-actions">
                        <button className="sa-btn-icon" title="Edit">&#x270F;</button>
                        <button className="sa-btn-icon" title="Duplicate">&#x2398;</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'commissions' && (
        <div className="sa-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 className="sa-section-title" style={{ marginBottom: 0 }}>Commission Structure Defaults</h2>
            <button className="btn-primary">+ Add Rule</button>
          </div>
          <div className="card sa-table-container">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Vertical</th>
                  <th>Role</th>
                  <th>Commission %</th>
                  <th>Min Amount</th>
                  <th>Max Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissionDefaults.map((c) => (
                  <tr key={c.id}>
                    <td className="td-bold">{c.vertical}</td>
                    <td>{c.role}</td>
                    <td>
                      <span className="badge badge-purple">{c.percentage}%</span>
                    </td>
                    <td>{'₹'}{c.minAmount.toLocaleString()}</td>
                    <td>{'₹'}{c.maxAmount.toLocaleString()}</td>
                    <td>
                      <div className="sa-actions">
                        <button className="sa-btn-icon" title="Edit">&#x270F;</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
