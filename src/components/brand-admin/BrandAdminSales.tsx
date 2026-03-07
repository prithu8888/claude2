import { useState, useMemo } from 'react';
import { sales, products, getProductById, getPlanById } from '../../data/mockData';
import './BrandAdmin.css';

export default function BrandAdminSales() {
  const [productFilter, setProductFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<'date' | 'commission'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const enrichedSales = useMemo(() => {
    return sales.map((s) => {
      const product = getProductById(s.productId);
      const plan = getPlanById(s.planId);
      return {
        ...s,
        productName: product?.name ?? 'Unknown',
        planName: plan?.name ?? 'Unknown',
        premium: plan?.premium ?? 0,
      };
    });
  }, []);

  const filteredSales = useMemo(() => {
    let result = [...enrichedSales];

    if (productFilter) {
      result = result.filter((s) => s.productId === productFilter);
    }
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (dateFrom) {
      result = result.filter((s) => s.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((s) => s.date <= dateTo);
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDir === 'asc'
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      }
      return sortDir === 'asc'
        ? a.commission - b.commission
        : b.commission - a.commission;
    });

    return result;
  }, [enrichedSales, productFilter, statusFilter, dateFrom, dateTo, sortField, sortDir]);

  const summaryStats = useMemo(() => {
    const total = filteredSales.length;
    const completed = filteredSales.filter((s) => s.status === 'completed').length;
    const totalPremium = filteredSales.reduce((sum, s) => sum + s.premium, 0);
    const totalCommission = filteredSales.reduce((sum, s) => sum + s.commission, 0);
    return { total, completed, totalPremium, totalCommission };
  }, [filteredSales]);

  function handleSort(field: 'date' | 'commission') {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  function sortIndicator(field: string) {
    if (sortField !== field) return <span className="sort-indicator">--</span>;
    return <span className="sort-indicator">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  }

  return (
    <div className="ba-page">
      <div className="ba-page-header">
        <h1>Sales & Policies</h1>
        <div className="ba-page-header-actions">
          <button className="btn-secondary">Export CSV</button>
        </div>
      </div>

      <div className="ba-summary-stats">
        <div className="ba-summary-stat">
          <div className="ba-summary-stat-label">Total Policies</div>
          <div className="ba-summary-stat-value">{summaryStats.total}</div>
        </div>
        <div className="ba-summary-stat">
          <div className="ba-summary-stat-label">Completed</div>
          <div className="ba-summary-stat-value">{summaryStats.completed}</div>
        </div>
        <div className="ba-summary-stat">
          <div className="ba-summary-stat-label">Total Premium</div>
          <div className="ba-summary-stat-value">Rs.{summaryStats.totalPremium.toLocaleString('en-IN')}</div>
        </div>
        <div className="ba-summary-stat">
          <div className="ba-summary-stat-label">Total Commission</div>
          <div className="ba-summary-stat-value">Rs.{summaryStats.totalCommission.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="ba-filter-bar">
        <input
          className="input-field"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From date"
        />
        <input
          className="input-field"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To date"
        />
        <select
          className="select-field"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select
          className="select-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="ba-table-wrapper">
        <table className="ba-table">
          <thead>
            <tr>
              <th>Policy ID</th>
              <th>Product</th>
              <th>Customer</th>
              <th onClick={() => handleSort('date')}>Date {sortIndicator('date')}</th>
              <th onClick={() => handleSort('commission')}>Premium {sortIndicator('commission')}</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.id.toUpperCase()}</td>
                <td>
                  <div>{sale.productName}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    {sale.planName}
                  </div>
                </td>
                <td>{sale.customerId.toUpperCase()}</td>
                <td>{sale.date}</td>
                <td>Rs.{sale.premium.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ba-status-${sale.status}`}>
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
