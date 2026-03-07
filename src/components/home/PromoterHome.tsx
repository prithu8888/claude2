import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { sales, commissions, getProductById } from '../../data/mockData';
import './PromoterHome.css';

export default function PromoterHome() {
  const navigate = useNavigate();
  const { activeBrand, activeVertical } = useAppStore();

  const recentSales = sales.slice(0, 4);
  const totalEarnings = commissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingEarnings = commissions
    .filter((c) => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="promoter-home">
      <div className="home-greeting">
        <h2>Good morning, Amit!</h2>
        <p className="home-subtitle">
          {activeBrand} &middot; {activeVertical.replace(/-/g, ' ')}
        </p>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <span className="stat-value">{sales.length}</span>
          <span className="stat-label">Total Sales</span>
        </div>
        <div className="stat-card accent">
          <span className="stat-value">
            &#8377;{totalEarnings.toLocaleString('en-IN')}
          </span>
          <span className="stat-label">Earned</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            &#8377;{pendingEarnings.toLocaleString('en-IN')}
          </span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="home-actions">
        <button className="btn-primary action-btn" onClick={() => navigate('/sell')}>
          + New Sale
        </button>
        <button
          className="btn-secondary action-btn"
          onClick={() => navigate('/claims')}
        >
          File Claim
        </button>
      </div>

      <section className="home-section">
        <div className="section-header">
          <h3>Recent Sales</h3>
          <button className="link-btn" onClick={() => navigate('/wallet')}>
            View All
          </button>
        </div>
        <div className="sales-list">
          {recentSales.map((sale) => {
            const product = getProductById(sale.productId);
            return (
              <div key={sale.id} className="sale-row card">
                <div className="sale-info">
                  <span className="sale-product">
                    {product?.name ?? 'Unknown Product'}
                  </span>
                  <span className="sale-date">{sale.date}</span>
                </div>
                <div className="sale-right">
                  <span className="sale-amount">
                    &#8377;{sale.commission.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}
                  >
                    {sale.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h3>Quick Links</h3>
        </div>
        <div className="quick-links">
          <button className="quick-link card" onClick={() => navigate('/sell')}>
            <span className="ql-icon">&#128722;</span>
            <span>Sell</span>
          </button>
          <button className="quick-link card" onClick={() => navigate('/wallet')}>
            <span className="ql-icon">&#128176;</span>
            <span>Wallet</span>
          </button>
          <button className="quick-link card" onClick={() => navigate('/claims')}>
            <span className="ql-icon">&#128203;</span>
            <span>Claims</span>
          </button>
          <button
            className="quick-link card"
            onClick={() => navigate('/more')}
          >
            <span className="ql-icon">&#9776;</span>
            <span>More</span>
          </button>
        </div>
      </section>
    </div>
  );
}
