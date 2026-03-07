import { useState } from 'react';
import './SuperAdmin.css';

interface Settlement {
  id: string;
  brand: string;
  period: string;
  grossAmount: number;
  commission: number;
  gst: number;
  netPayable: number;
  status: 'settled' | 'pending' | 'processing' | 'failed';
  settledDate?: string;
}

interface GSTRecon {
  id: string;
  month: string;
  brand: string;
  gstCollected: number;
  gstPayable: number;
  gstFiled: number;
  difference: number;
  status: 'reconciled' | 'pending' | 'mismatch';
}

const revenueCards = [
  { label: 'Total Revenue', value: '\u20B932.5Cr', sub: 'FY 2025-26', accent: 'purple' },
  { label: 'Commission Paid', value: '\u20B94.8Cr', sub: '14.8% of GWP', accent: 'green' },
  { label: 'Pending Settlements', value: '\u20B91.2Cr', sub: '18 batches', accent: 'orange' },
  { label: 'GST Collected', value: '\u20B95.85Cr', sub: '18% of GWP', accent: 'blue' },
];

const settlements: Settlement[] = [
  { id: 'st1', brand: 'Samsung', period: 'Mar 1-7, 2026', grossAmount: 1245000, commission: 186750, gst: 224100, netPayable: 834150, status: 'pending' },
  { id: 'st2', brand: 'Ather', period: 'Mar 1-7, 2026', grossAmount: 890000, commission: 133500, gst: 160200, netPayable: 596300, status: 'processing' },
  { id: 'st3', brand: 'Xiaomi', period: 'Feb 22-28, 2026', grossAmount: 678000, commission: 101700, gst: 122040, netPayable: 454260, status: 'settled', settledDate: '2026-03-03' },
  { id: 'st4', brand: 'Ola', period: 'Feb 22-28, 2026', grossAmount: 534000, commission: 80100, gst: 96120, netPayable: 357780, status: 'settled', settledDate: '2026-03-03' },
  { id: 'st5', brand: 'Bajaj', period: 'Feb 22-28, 2026', grossAmount: 312000, commission: 46800, gst: 56160, netPayable: 209040, status: 'failed' },
  { id: 'st6', brand: 'TVS', period: 'Feb 15-21, 2026', grossAmount: 189000, commission: 28350, gst: 34020, netPayable: 126630, status: 'settled', settledDate: '2026-02-25' },
];

const gstRecon: GSTRecon[] = [
  { id: 'g1', month: 'March 2026', brand: 'Samsung', gstCollected: 224100, gstPayable: 224100, gstFiled: 220000, difference: 4100, status: 'mismatch' },
  { id: 'g2', month: 'March 2026', brand: 'Ather', gstCollected: 160200, gstPayable: 160200, gstFiled: 160200, difference: 0, status: 'reconciled' },
  { id: 'g3', month: 'February 2026', brand: 'Xiaomi', gstCollected: 122040, gstPayable: 122040, gstFiled: 122040, difference: 0, status: 'reconciled' },
  { id: 'g4', month: 'February 2026', brand: 'Ola', gstCollected: 96120, gstPayable: 96120, gstFiled: 96120, difference: 0, status: 'reconciled' },
  { id: 'g5', month: 'February 2026', brand: 'Bajaj', gstCollected: 56160, gstPayable: 56160, gstFiled: 0, difference: 56160, status: 'pending' },
];

const settlementBadge: Record<string, string> = {
  settled: 'badge-success',
  pending: 'badge-warning',
  processing: 'badge-info',
  failed: 'badge-error',
};

const reconBadge: Record<string, string> = {
  reconciled: 'badge-success',
  pending: 'badge-warning',
  mismatch: 'badge-error',
};

function formatCurrency(n: number): string {
  if (n >= 10000000) return '\u20B9' + (n / 10000000).toFixed(2) + 'Cr';
  if (n >= 100000) return '\u20B9' + (n / 100000).toFixed(2) + 'L';
  return '\u20B9' + n.toLocaleString();
}

export default function SuperAdminFinance() {
  const [tab, setTab] = useState<'settlements' | 'gst'>('settlements');

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Financial Operations</h1>
          <p>Revenue, settlements, and GST reconciliation</p>
        </div>
        <button className="btn-secondary">Download Report</button>
      </div>

      <div className="sa-revenue-grid">
        {revenueCards.map((c) => (
          <div key={c.label} className="card sa-metric-card sa-revenue-card">
            <div className={`metric-accent ${c.accent}`} />
            <span className="metric-label" style={{ paddingLeft: 'var(--space-3)' }}>{c.label}</span>
            <span className="metric-value" style={{ paddingLeft: 'var(--space-3)' }}>{c.value}</span>
            <span className="metric-sub" style={{ paddingLeft: 'var(--space-3)' }}>{c.sub}</span>
          </div>
        ))}
      </div>

      <div className="sa-filter-bar" style={{ gap: 0, marginBottom: 'var(--space-4)' }}>
        <button
          className={tab === 'settlements' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('settlements')}
          style={{ borderRadius: 'var(--radius-md) 0 0 var(--radius-md)' }}
        >
          Settlement Tracking
        </button>
        <button
          className={tab === 'gst' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setTab('gst')}
          style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
        >
          GST Reconciliation
        </button>
      </div>

      {tab === 'settlements' && (
        <div className="card sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Period</th>
                <th>Gross Amount</th>
                <th>Commission</th>
                <th>GST</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th>Settled Date</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((s) => (
                <tr key={s.id}>
                  <td className="td-bold">{s.brand}</td>
                  <td>{s.period}</td>
                  <td>{formatCurrency(s.grossAmount)}</td>
                  <td>{formatCurrency(s.commission)}</td>
                  <td>{formatCurrency(s.gst)}</td>
                  <td className="td-bold">{formatCurrency(s.netPayable)}</td>
                  <td>
                    <span className={`badge ${settlementBadge[s.status]}`}>
                      {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                    </span>
                  </td>
                  <td>{s.settledDate || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gst' && (
        <div className="card sa-table-container">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Brand</th>
                <th>GST Collected</th>
                <th>GST Payable</th>
                <th>GST Filed</th>
                <th>Difference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {gstRecon.map((g) => (
                <tr key={g.id}>
                  <td>{g.month}</td>
                  <td className="td-bold">{g.brand}</td>
                  <td>{formatCurrency(g.gstCollected)}</td>
                  <td>{formatCurrency(g.gstPayable)}</td>
                  <td>{formatCurrency(g.gstFiled)}</td>
                  <td className={g.difference > 0 ? 'td-bold' : ''}>
                    {g.difference > 0 ? formatCurrency(g.difference) : '--'}
                  </td>
                  <td>
                    <span className={`badge ${reconBadge[g.status]}`}>
                      {g.status.charAt(0).toUpperCase() + g.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
