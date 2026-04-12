import { useState, useMemo } from 'react';
import { commissions, walletTransactions, sales, getProductById, getPlanById } from '../../data/mockData';
import type { Commission, WalletTransaction } from '../../types/mpos';
import CommissionDisputeTracer from '../agents/CommissionDisputeTracer';
import './Wallet.css';

type Tab = 'earnings' | 'transactions';

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'paid':
    case 'completed':
      return 'badge badge-success';
    case 'pending':
    case 'approved':
      return status === 'approved' ? 'badge badge-info' : 'badge badge-warning';
    case 'disputed':
    case 'failed':
      return 'badge badge-error';
    default:
      return 'badge';
  }
}

function getTransactionTypeClass(type: WalletTransaction['type']): string {
  switch (type) {
    case 'credit':
      return 'wallet-amount-credit';
    case 'debit':
    case 'withdrawal':
      return 'wallet-amount-debit';
    default:
      return '';
  }
}

export default function Wallet() {
  const [activeTab, setActiveTab] = useState<Tab>('earnings');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const walletBalance = useMemo(() => {
    return walletTransactions.reduce((acc, tx) => {
      if (tx.type === 'credit' && tx.status === 'completed') return acc + tx.amount;
      if ((tx.type === 'debit' || tx.type === 'withdrawal') && tx.status === 'completed') return acc - tx.amount;
      return acc;
    }, 0);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const getSaleDetails = (saleId: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return null;
    const product = getProductById(sale.productId);
    const plan = getPlanById(sale.planId);
    return { sale, product, plan };
  };

  return (
    <div className="wallet-page">
      <div className="wallet-balance-card card">
        <div className="wallet-balance-info">
          <span className="wallet-balance-label">Wallet Balance</span>
          <span className="wallet-balance-amount">{formatCurrency(walletBalance)}</span>
          <span className="wallet-balance-sub">Available for withdrawal</span>
        </div>
        <button className="btn-primary wallet-withdraw-btn">Withdraw</button>
      </div>

      <div className="wallet-tabs">
        <button
          className={`wallet-tab ${activeTab === 'earnings' ? 'wallet-tab-active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
        <button
          className={`wallet-tab ${activeTab === 'transactions' ? 'wallet-tab-active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
      </div>

      {activeTab === 'earnings' && (
        <div className="wallet-list">
          {commissions.map((cm: Commission) => {
            const details = getSaleDetails(cm.saleId);
            const isExpanded = expandedRow === cm.id;

            return (
              <div key={cm.id} className="wallet-row-wrapper">
                <div
                  className={`wallet-row card ${isExpanded ? 'wallet-row-expanded' : ''}`}
                  onClick={() => toggleExpand(cm.id)}
                >
                  <div className="wallet-row-left">
                    <span className="wallet-row-date">{formatDate(cm.date)}</span>
                    <span className="wallet-row-desc">
                      {details?.product?.name ?? 'Unknown Product'} - {details?.plan?.name ?? 'Unknown Plan'}
                    </span>
                  </div>
                  <div className="wallet-row-right">
                    <span className="wallet-amount-credit">{formatCurrency(cm.amount)}</span>
                    <span className={getStatusBadgeClass(cm.status)}>{cm.status}</span>
                  </div>
                  <span className={`wallet-row-chevron ${isExpanded ? 'wallet-row-chevron-open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4.47 5.97a.75.75 0 011.06 0L8 8.44l2.47-2.47a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 010-1.06z" />
                    </svg>
                  </span>
                </div>

                {isExpanded && details && (
                  <div className="wallet-expanded-details card">
                    <div className="wallet-detail-grid">
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Sale ID</span>
                        <span className="wallet-detail-value">{details.sale.id}</span>
                      </div>
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Product</span>
                        <span className="wallet-detail-value">{details.product?.name}</span>
                      </div>
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Plan</span>
                        <span className="wallet-detail-value">{details.plan?.name}</span>
                      </div>
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Premium</span>
                        <span className="wallet-detail-value">{formatCurrency(details.plan?.premium ?? 0)}</span>
                      </div>
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Device ID</span>
                        <span className="wallet-detail-value">{details.sale.deviceIdentifier}</span>
                      </div>
                      <div className="wallet-detail-item">
                        <span className="wallet-detail-label">Sale Date</span>
                        <span className="wallet-detail-value">{formatDate(details.sale.date)}</span>
                      </div>
                      {cm.paidDate && (
                        <div className="wallet-detail-item">
                          <span className="wallet-detail-label">Paid Date</span>
                          <span className="wallet-detail-value">{formatDate(cm.paidDate)}</span>
                        </div>
                      )}
                    </div>
                    <CommissionDisputeTracer
                      commissionAmount={cm.amount}
                      premiumAmount={details.plan?.premium ?? 0}
                      productName={details.product?.name ?? 'Unknown'}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="wallet-list">
          {walletTransactions.map((tx: WalletTransaction) => (
            <div key={tx.id} className="wallet-row card">
              <div className="wallet-row-left">
                <span className="wallet-row-date">{formatDate(tx.date)}</span>
                <span className="wallet-row-desc">{tx.description}</span>
              </div>
              <div className="wallet-row-right">
                <span className={getTransactionTypeClass(tx.type)}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <span className={getStatusBadgeClass(tx.status)}>{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
