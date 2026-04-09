import { useMemo, useState } from 'react';
import { sales, getProductById, getPlanById } from '../../data/mockData';
import { formatINR } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './Transactions.css';

type Status = 'all' | 'completed' | 'pending' | 'cancelled';

const statusClass = (status: string) => {
  switch (status) {
    case 'completed':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-info';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Issued';
    case 'pending':
      return 'Payment Pending';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [smartFilter, setSmartFilter] = useState('');
  const [smartFilterActive, setSmartFilterActive] = useState(false);

  const rows = useMemo(() => {
    return sales
      .map((s) => {
        const product = getProductById(s.productId);
        const plan = getPlanById(s.planId);
        const customerName = `Customer ${s.customerId.slice(-1).toUpperCase()}${s.customerId}`;
        // Anomaly: duplicate-looking IMEI or unusually high commission
        const isAnomaly = s.commission > 5000;
        return {
          ...s,
          product,
          plan,
          customerName,
          isAnomaly,
        };
      })
      .filter((r) => {
        if (status !== 'all' && r.status !== status) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.product?.name.toLowerCase().includes(q) ||
          r.deviceIdentifier.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q)
        );
      });
  }, [search, status]);

  const handleSmartFilter = () => {
    if (!smartFilter) return;
    setSmartFilterActive(true);
    // Simulated AI translation of natural language query
    const q = smartFilter.toLowerCase();
    if (q.includes('pending')) setStatus('pending');
    else if (q.includes('completed') || q.includes('issued')) setStatus('completed');
    if (q.includes('samsung')) setSearch('samsung');
    else if (q.includes('xiaomi')) setSearch('xiaomi');
    else if (q.includes('ather')) setSearch('ather');
  };

  const clearSmartFilter = () => {
    setSmartFilterActive(false);
    setSmartFilter('');
    setSearch('');
    setStatus('all');
  };

  const handleExport = () => {
    // Generate CSV in-memory (simulated)
    const headers = ['Transaction ID', 'Customer', 'Device', 'Plan', 'Date', 'Amount', 'Status'];
    const csv = [
      headers.join(','),
      ...rows.map((r) => [r.id, r.customerName, r.product?.name, r.plan?.name, r.date, r.commission, r.status].join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tx-page">
      <header className="tx-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="text-secondary">All policies issued across your dealers and agents</p>
        </div>
        <button className="btn-secondary" onClick={handleExport}>
          <span>&#x2B07;</span> Export CSV
        </button>
      </header>

      <div className="tx-smart-filter card">
        <AIBadge label="Smart filter" />
        <input
          className="tx-smart-input"
          placeholder="Try: all Samsung sales last week with pending payment"
          value={smartFilter}
          onChange={(e) => setSmartFilter(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSmartFilter()}
        />
        {smartFilterActive ? (
          <button className="btn-ghost" onClick={clearSmartFilter}>Clear</button>
        ) : (
          <button className="btn-primary" onClick={handleSmartFilter} disabled={!smartFilter}>Run</button>
        )}
      </div>

      <div className="tx-filters">
        <input
          className="input-field tx-search"
          placeholder="Search by customer, IMEI, device, transaction ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select-field tx-status" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
          <option value="all">All status</option>
          <option value="completed">Issued</option>
          <option value="pending">Payment Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="tx-empty card">
          <div className="tx-empty-icon">&#128270;</div>
          <div className="tx-empty-title">No transactions match your filters</div>
          <div className="tx-empty-sub">Try changing the filters or smart search query</div>
          <button className="btn-secondary" onClick={clearSmartFilter}>Clear all filters</button>
        </div>
      ) : (
        <div className="tx-table card">
          <div className="tx-row tx-row-head">
            <div>Transaction ID</div>
            <div>Customer</div>
            <div>Device / Plan</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          {rows.map((r) => (
            <div key={r.id}>
              <div
                className={`tx-row ${expandedId === r.id ? 'expanded' : ''}`}
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="tx-cell-id">
                  {r.id.toUpperCase()}
                  {r.isAnomaly && (
                    <span className="tx-anomaly">&#9888; Review</span>
                  )}
                </div>
                <div>{r.customerName}</div>
                <div>
                  <div className="tx-device">{r.product?.name ?? 'Unknown device'}</div>
                  <div className="tx-plan-sub">{r.plan?.name}</div>
                </div>
                <div>{r.date}</div>
                <div className="tx-amount">{formatINR(r.commission * 2.5)}</div>
                <div>
                  <span className={`badge ${statusClass(r.status)}`}>{statusLabel(r.status)}</span>
                </div>
              </div>

              {expandedId === r.id && (
                <div className="tx-expanded">
                  <div className="tx-expanded-grid">
                    <div>
                      <div className="tx-expanded-label">Policy details</div>
                      <div>IMEI: {r.deviceIdentifier}</div>
                      <div>Plan: {r.plan?.name}</div>
                      <div>Tenure: {r.plan?.tenure}</div>
                      <div>Coverage: {r.plan?.coverage.join(', ')}</div>
                    </div>
                    <div>
                      <div className="tx-expanded-label">Payment</div>
                      <div>Method: UPI</div>
                      <div>Agent commission: {formatINR(r.commission)}</div>
                      <div>Dealer commission: {formatINR(Math.round(r.commission * 0.4))}</div>
                    </div>
                    <div>
                      <div className="tx-expanded-label">Timeline</div>
                      <div>&#10003; Initiated &mdash; {r.date}</div>
                      <div>&#10003; Payment &mdash; {r.date}</div>
                      <div>&#10003; Policy issued &mdash; {r.date}</div>
                    </div>
                  </div>
                  {r.isAnomaly && (
                    <div className="tx-anomaly-box">
                      <AIBadge label="AI anomaly" shimmer />
                      <span>This transaction was auto-flagged because the commission amount is unusually high for this device category. Review before settlement.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
