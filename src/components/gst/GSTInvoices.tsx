import { useState, useMemo } from 'react';
import { invoices } from '../../data/mockData';
import './GSTInvoices.css';

const statusBadge: Record<string, string> = {
  draft: 'badge-info',
  issued: 'badge-purple',
  paid: 'badge-success',
  overdue: 'badge-error',
};

export default function GSTInvoices() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
      if (filterDateFrom && inv.date < filterDateFrom) return false;
      if (filterDateTo && inv.date > filterDateTo) return false;
      return true;
    });
  }, [filterStatus, filterDateFrom, filterDateTo]);

  const totalGSTCollected = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.gst, 0);
  }, []);

  const totalGSTPayable = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === 'issued' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.gst, 0);
  }, []);

  const totalAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.total, 0);
  }, []);

  return (
    <div className="gst-page">
      <div className="gst-page-header">
        <div>
          <h1>Tax & Invoices</h1>
          <p>View invoices, GST summary, and download documents</p>
        </div>
      </div>

      <div className="gst-summary-grid">
        <div className="card gst-summary-card">
          <span className="gst-label">Total Invoiced</span>
          <span className="gst-value">{'\u20B9'}{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="gst-sub">{invoices.length} invoices</span>
        </div>
        <div className="card gst-summary-card">
          <span className="gst-label">GST Collected</span>
          <span className="gst-value">{'\u20B9'}{totalGSTCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="gst-sub">18% GST on commissions</span>
        </div>
        <div className="card gst-summary-card">
          <span className="gst-label">GST Payable</span>
          <span className="gst-value">{'\u20B9'}{totalGSTPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className="gst-sub">Pending invoices</span>
        </div>
      </div>

      <div className="gst-filter-bar">
        <select
          className="select-field"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="issued">Issued</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
        <input
          type="date"
          className="input-field"
          placeholder="From"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          style={{ minWidth: 150 }}
        />
        <input
          type="date"
          className="input-field"
          placeholder="To"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          style={{ minWidth: 150 }}
        />
      </div>

      <div className="card gst-table-container">
        <table className="gst-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>GST (18%)</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id}>
                <td className="td-mono">{inv.invoiceNumber}</td>
                <td>{inv.date}</td>
                <td>
                  <span className="badge badge-purple">
                    {inv.type.charAt(0).toUpperCase() + inv.type.slice(1)}
                  </span>
                </td>
                <td>{'\u20B9'}{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>{'\u20B9'}{inv.gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="td-bold">{'\u20B9'}{inv.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`badge ${statusBadge[inv.status]}`}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="gst-invoice-actions">
                    <button className="gst-btn-sm">View</button>
                    <button className="gst-btn-sm">Download</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            No invoices match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
