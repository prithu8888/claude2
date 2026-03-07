import { useState, useMemo } from 'react';
import { dealers } from '../../data/mockData';
import './BrandAdmin.css';

interface DealerDetail {
  id: string;
  name: string;
  city: string;
  status: 'active' | 'inactive';
  sales: number;
  lastActive: string;
}

export default function BrandAdminDealers() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDealer, setSelectedDealer] = useState<DealerDetail | null>(null);
  const [sortField, setSortField] = useState<keyof DealerDetail>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const cities = useMemo(() => [...new Set(dealers.map((d) => d.city))].sort(), []);

  const filteredDealers = useMemo(() => {
    let result = [...dealers];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
      );
    }
    if (cityFilter) {
      result = result.filter((d) => d.city === cityFilter);
    }
    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [search, cityFilter, statusFilter, sortField, sortDir]);

  function handleSort(field: keyof DealerDetail) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function sortIndicator(field: keyof DealerDetail) {
    if (sortField !== field) return <span className="sort-indicator">--</span>;
    return <span className="sort-indicator">{sortDir === 'asc' ? '\u25B2' : '\u25BC'}</span>;
  }

  return (
    <div className="ba-page">
      <div className="ba-page-header">
        <h1>Dealers</h1>
        <div className="ba-page-header-actions">
          <button className="btn-primary">+ Add Dealer</button>
        </div>
      </div>

      <div className="ba-filter-bar">
        <input
          className="input-field ba-search-input"
          type="text"
          placeholder="Search dealers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select-field"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="select-field"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="ba-table-wrapper">
        <table className="ba-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>Dealer Name {sortIndicator('name')}</th>
              <th onClick={() => handleSort('city')}>City {sortIndicator('city')}</th>
              <th onClick={() => handleSort('status')}>Status {sortIndicator('status')}</th>
              <th onClick={() => handleSort('sales')}>Sales Count {sortIndicator('sales')}</th>
              <th onClick={() => handleSort('lastActive')}>Last Active {sortIndicator('lastActive')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((dealer) => (
              <tr
                key={dealer.id}
                className="clickable"
                onClick={() => setSelectedDealer(dealer)}
              >
                <td>{dealer.name}</td>
                <td>{dealer.city}</td>
                <td>
                  <span className={`badge ba-status-${dealer.status}`}>
                    {dealer.status}
                  </span>
                </td>
                <td>{dealer.sales}</td>
                <td>{dealer.lastActive}</td>
                <td>
                  <button
                    className="ba-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDealer(dealer);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDealer && (
        <div className="ba-modal-overlay" onClick={() => setSelectedDealer(null)}>
          <div className="ba-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ba-modal-header">
              <h2>{selectedDealer.name}</h2>
              <button className="ba-modal-close" onClick={() => setSelectedDealer(null)}>
                x
              </button>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Dealer ID</span>
              <span className="ba-modal-row-value">{selectedDealer.id.toUpperCase()}</span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">City</span>
              <span className="ba-modal-row-value">{selectedDealer.city}</span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Status</span>
              <span className="ba-modal-row-value">
                <span className={`badge ba-status-${selectedDealer.status}`}>
                  {selectedDealer.status}
                </span>
              </span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Total Sales</span>
              <span className="ba-modal-row-value">{selectedDealer.sales}</span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Last Active</span>
              <span className="ba-modal-row-value">{selectedDealer.lastActive}</span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Avg. Activation Time</span>
              <span className="ba-modal-row-value">2.3 days</span>
            </div>
            <div className="ba-modal-row">
              <span className="ba-modal-row-label">Commission Rate</span>
              <span className="ba-modal-row-value">20%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
