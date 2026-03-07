import { useState, useMemo } from 'react';
import { claims } from '../../data/mockData';
import './BrandAdmin.css';

export default function BrandAdminClaims() {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filteredClaims = useMemo(() => {
    let result = [...claims];

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter((c) => c.type === typeFilter);
    }
    if (dateFrom) {
      result = result.filter((c) => c.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((c) => c.date <= dateTo);
    }

    result.sort((a, b) => {
      if (sortField === 'date') {
        return sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      }
      const aAmt = a.amount ?? 0;
      const bAmt = b.amount ?? 0;
      return sortDir === 'asc' ? aAmt - bAmt : bAmt - aAmt;
    });

    return result;
  }, [statusFilter, typeFilter, dateFrom, dateTo, sortField, sortDir]);

  function handleSort(field: 'date' | 'amount') {
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
        <h1>Claims</h1>
        <div className="ba-page-header-actions">
          <button className="btn-secondary">Export Claims</button>
        </div>
      </div>

      <div className="ba-filter-bar">
        <select
          className="select-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="settled">Settled</option>
          <option value="draft">Draft</option>
        </select>
        <select
          className="select-field"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="damage">Damage</option>
          <option value="theft">Theft</option>
          <option value="malfunction">Malfunction</option>
          <option value="accident">Accident</option>
        </select>
        <input
          className="input-field"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          className="input-field"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className="ba-table-wrapper">
        <table className="ba-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Policy</th>
              <th>Type</th>
              <th>Status</th>
              <th onClick={() => handleSort('amount')}>Amount {sortIndicator('amount')}</th>
              <th onClick={() => handleSort('date')}>Date {sortIndicator('date')}</th>
              <th>Fraud Flag</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id.toUpperCase()}</td>
                <td>{claim.policyId.toUpperCase()}</td>
                <td>
                  <span className="badge badge-info">{claim.type}</span>
                </td>
                <td>
                  <span className={`badge ba-status-${claim.status}`}>
                    {claim.status.replace('-', ' ')}
                  </span>
                </td>
                <td>{claim.amount ? `Rs.${claim.amount.toLocaleString('en-IN')}` : '--'}</td>
                <td>{claim.date}</td>
                <td>
                  {claim.fraudFlag && (
                    <span className={`badge ba-fraud-${claim.fraudFlag}`}>
                      {claim.fraudFlag}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
