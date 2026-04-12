import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { sales, commissions, getProductById } from '../../data/mockData';
import { formatINR, t } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './PromoterHome.css';

function getGreeting(): 'morning' | 'afternoon' | 'evening' {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function PromoterHome() {
  const navigate = useNavigate();
  const { authUser, activeBrand, language } = useAppStore();

  const name = (authUser?.name ?? 'Amit').split(' ')[0];
  const greetingKey = `home.greeting.${getGreeting()}` as const;

  const recentSales = sales.slice(0, 3);
  const todayEarnings = commissions.filter((c) => c.status === 'paid').reduce((a, b) => a + b.amount, 0) * 0.3;
  const salesToday = 4;
  const monthlyTarget = 80;
  const monthlyDone = 47;

  return (
    <div className="promoter-home">
      <section className="home-greeting-block">
        <div>
          <div className="greeting-subtitle">{t(greetingKey, language)}</div>
          <h1 className="greeting-name">{name}</h1>
        </div>
        <div className="home-brand-chip">
          <span className="brand-dot" />
          {activeBrand}
        </div>
      </section>

      <section className="home-ai-nudge">
        <AIBadge label="Suggested for you" shimmer />
        <div>
          <strong>You’ve sold 8 plans this week.</strong>
          <span>2 more and you hit Silver tier with 15% commission bonus.</span>
        </div>
      </section>

      <section className="home-cta-wrap">
        <button className="home-cta" onClick={() => navigate('/sell')}>
          <div className="home-cta-content">
            <div>
              <div className="home-cta-label">{t('home.startNewSale', language)}</div>
              <div className="home-cta-sub">Scan IMEI &middot; Pick plan &middot; Issue policy</div>
            </div>
            <div className="home-cta-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </button>
      </section>

      <section className="home-numbers">
        <div className="home-stat">
          <div className="home-stat-label">{t('home.salesToday', language)}</div>
          <div className="home-stat-value">{salesToday}</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-label">{t('home.earningsToday', language)}</div>
          <div className="home-stat-value">{formatINR(Math.round(todayEarnings))}</div>
        </div>
      </section>

      <section className="home-target">
        <div className="home-target-header">
          <div>
            <div className="home-target-label">{t('home.monthTarget', language)}</div>
            <div className="home-target-value">{monthlyDone} / {monthlyTarget}</div>
          </div>
          <div className="home-target-pct">{Math.round((monthlyDone / monthlyTarget) * 100)}%</div>
        </div>
        <div className="home-target-bar">
          <div className="home-target-fill" style={{ width: `${(monthlyDone / monthlyTarget) * 100}%` }} />
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h3>{t('home.recentSales', language)}</h3>
          <button className="link-btn" onClick={() => navigate('/transactions')}>
            {t('common.viewAll', language)}
          </button>
        </div>
        <div className="home-sales-list">
          {recentSales.map((sale) => {
            const product = getProductById(sale.productId);
            return (
              <div key={sale.id} className="home-sale-row" onClick={() => navigate('/transactions')}>
                <div className="home-sale-icon">&#128241;</div>
                <div className="home-sale-info">
                  <div className="home-sale-product">{product?.name ?? 'Unknown device'}</div>
                  <div className="home-sale-date">{sale.date}</div>
                </div>
                <div className="home-sale-right">
                  <div className="home-sale-amount">+{formatINR(sale.commission)}</div>
                  <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <h3>Powered by AI</h3>
          <AIBadge shimmer label="AI" />
        </div>
        <div className="home-ai-grid">
          <button className="home-ai-card home-ai-card-primary" onClick={() => navigate('/ask')}>
            <div className="home-ai-card-icon">&#10022;</div>
            <div className="home-ai-card-title">Ask MPOS</div>
            <div className="home-ai-card-sub">Get answers, insights, and take actions in plain English</div>
          </button>
          <button className="home-ai-card" onClick={() => navigate('/training')}>
            <div className="home-ai-card-icon">&#128104;&#8205;&#127891;</div>
            <div className="home-ai-card-title">AI Sales Coach</div>
            <div className="home-ai-card-sub">Personalised tips based on your sales performance</div>
          </button>
          <button className="home-ai-card" onClick={() => navigate('/claims/new')}>
            <div className="home-ai-card-icon">&#128247;</div>
            <div className="home-ai-card-title">Smart Claims</div>
            <div className="home-ai-card-sub">Upload photos, AI checks quality & damage</div>
          </button>
          <button className="home-ai-card" onClick={() => navigate('/kyc')}>
            <div className="home-ai-card-icon">&#128196;</div>
            <div className="home-ai-card-title">AI KYC</div>
            <div className="home-ai-card-sub">Complete your KYC in minutes with AI auto-fill</div>
          </button>
        </div>
      </section>

      <section className="home-quick-grid">
        <button className="home-quick-link" onClick={() => navigate('/incentives')}>
          <div className="home-quick-icon ql-blue">&#128176;</div>
          <span>{t('home.myIncentives', language)}</span>
        </button>
        <button className="home-quick-link" onClick={() => navigate('/claims')}>
          <div className="home-quick-icon ql-green">&#128203;</div>
          <span>{t('home.fileClaim', language)}</span>
        </button>
        <button className="home-quick-link" onClick={() => navigate('/training')}>
          <div className="home-quick-icon ql-purple">&#127891;</div>
          <span>Training</span>
        </button>
        <button className="home-quick-link" onClick={() => navigate('/settings')}>
          <div className="home-quick-icon ql-orange">&#128100;</div>
          <span>Profile</span>
        </button>
      </section>
    </div>
  );
}
