import { useEffect, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { t } from '../../i18n/strings';
import './DemoShowcase.css';

interface Slide {
  id: number;
  titleKey: Parameters<typeof t>[0];
  subKey: Parameters<typeof t>[0];
  illustration: ReactElement;
  gradient: string;
}

const slides: Slide[] = [
  {
    id: 1,
    titleKey: 'demo.slide1.title',
    subKey: 'demo.slide1.sub',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E1B4B 100%)',
    illustration: (
      <svg viewBox="0 0 400 300" className="demo-illustration">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <rect x="120" y="40" width="160" height="220" rx="24" fill="url(#g1)" opacity="0.15" />
        <rect x="130" y="50" width="140" height="200" rx="18" fill="url(#g1)" />
        <rect x="150" y="80" width="100" height="12" rx="6" fill="white" opacity="0.9" />
        <rect x="150" y="110" width="60" height="8" rx="4" fill="white" opacity="0.6" />
        <rect x="150" y="140" width="100" height="40" rx="8" fill="white" opacity="0.95" />
        <text x="200" y="168" textAnchor="middle" fill="#1E1B4B" fontSize="16" fontWeight="700" fontFamily="DM Sans">Sold!</text>
        <circle cx="310" cy="80" r="18" fill="#10B981" />
        <path d="M302 80 l6 6 l12 -12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g opacity="0.3">
          <circle cx="80" cy="120" r="4" fill="white" />
          <circle cx="340" cy="160" r="3" fill="white" />
          <circle cx="60" cy="200" r="5" fill="white" />
        </g>
      </svg>
    ),
  },
  {
    id: 2,
    titleKey: 'demo.slide2.title',
    subKey: 'demo.slide2.sub',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #1E1B4B 100%)',
    illustration: (
      <svg viewBox="0 0 400 300" className="demo-illustration">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <rect x="80" y="60" width="240" height="180" rx="16" fill="url(#g2)" opacity="0.15" />
        <rect x="90" y="70" width="220" height="160" rx="12" fill="white" />
        <rect x="110" y="90" width="80" height="8" rx="4" fill="#1E1B4B" />
        <rect x="110" y="108" width="140" height="6" rx="3" fill="#94A3B8" />
        <rect x="110" y="130" width="180" height="36" rx="8" fill="#F1F5F9" stroke="#3B82F6" strokeWidth="1.5" />
        <text x="120" y="152" fill="#3B82F6" fontSize="14" fontWeight="600" fontFamily="DM Sans">GSTIN 29AA BBB 1234 C1Z5</text>
        <circle cx="270" cy="148" r="10" fill="#10B981" />
        <path d="M264 148 l5 5 l9 -9" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="110" y="180" width="80" height="28" rx="6" fill="#3B82F6" />
        <text x="150" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="DM Sans">Verify</text>
      </svg>
    ),
  },
  {
    id: 3,
    titleKey: 'demo.slide3.title',
    subKey: 'demo.slide3.sub',
    gradient: 'linear-gradient(135deg, #10B981 0%, #1E1B4B 100%)',
    illustration: (
      <svg viewBox="0 0 400 300" className="demo-illustration">
        <rect x="60" y="40" width="280" height="220" rx="16" fill="white" opacity="0.12" />
        <rect x="70" y="50" width="260" height="200" rx="12" fill="white" />
        <text x="90" y="85" fill="#64748B" fontSize="12" fontFamily="DM Sans">Earned this month</text>
        <text x="90" y="115" fill="#0F172A" fontSize="28" fontWeight="700" fontFamily="DM Sans">\u20B93,450</text>
        <g transform="translate(90 140)">
          {[40, 60, 45, 75, 55, 80, 90].map((h, i) => (
            <rect key={i} x={i * 30} y={100 - h} width="20" height={h} rx="3" fill="#3B82F6" opacity={0.4 + i * 0.08} />
          ))}
        </g>
      </svg>
    ),
  },
  {
    id: 4,
    titleKey: 'demo.slide4.title',
    subKey: 'demo.slide4.sub',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #1E1B4B 100%)',
    illustration: (
      <svg viewBox="0 0 400 300" className="demo-illustration">
        <circle cx="200" cy="150" r="110" fill="white" opacity="0.1" />
        <circle cx="200" cy="150" r="80" fill="white" />
        <path d="M165 150 l20 20 l50 -50" stroke="#10B981" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="120" cy="100" r="18" fill="#3B82F6" />
        <text x="120" y="106" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="DM Sans">1</text>
        <circle cx="280" cy="100" r="18" fill="#6366F1" />
        <text x="280" y="106" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="DM Sans">2</text>
        <circle cx="200" cy="260" r="18" fill="#8B5CF6" />
        <text x="200" y="266" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="DM Sans">3</text>
      </svg>
    ),
  },
  {
    id: 5,
    titleKey: 'demo.slide5.title',
    subKey: 'demo.slide5.sub',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #1E1B4B 100%)',
    illustration: (
      <svg viewBox="0 0 400 300" className="demo-illustration">
        <rect x="40" y="60" width="320" height="180" rx="16" fill="white" opacity="0.95" />
        <text x="200" y="120" textAnchor="middle" fill="#1E1B4B" fontSize="22" fontWeight="700" fontFamily="DM Sans">
          A | \u0905 | \u0905 | \u0C85 | \u0B85
        </text>
        <text x="200" y="160" textAnchor="middle" fill="#64748B" fontSize="13" fontFamily="DM Sans">6 languages supported</text>
        <g>
          {['EN', 'HI', 'TA', 'TE', 'KN', 'MR'].map((lang, i) => (
            <g key={lang} transform={`translate(${70 + i * 45} 185)`}>
              <rect width="36" height="28" rx="6" fill="#3B82F6" opacity={0.15} />
              <text x="18" y="18" textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="600" fontFamily="DM Sans">{lang}</text>
            </g>
          ))}
        </g>
      </svg>
    ),
  },
];

export default function DemoShowcase() {
  const navigate = useNavigate();
  const { setHasSeenDemo, language } = useAppStore();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
    setHasSeenDemo(true);
    navigate('/login');
  };

  const currentSlide = slides[activeIndex];

  return (
    <div className="demo-showcase" style={{ background: currentSlide.gradient }}>
      <div className="demo-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="demo-header">
        <div className="demo-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="white" />
            <path d="M9 16L13.5 20.5L23 11" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>ACKO MPOS</span>
        </div>
        <button className="demo-skip" onClick={handleFinish}>
          {t('common.skip', language)}
        </button>
      </header>

      <main className="demo-content">
        <div className="demo-illustration-wrap" key={currentSlide.id}>
          {currentSlide.illustration}
        </div>

        <div className="demo-text" key={`text-${currentSlide.id}`}>
          <h1 className="demo-title">{t(currentSlide.titleKey, language)}</h1>
          <p className="demo-sub">{t(currentSlide.subKey, language)}</p>
        </div>
      </main>

      <footer className="demo-footer">
        <div className="demo-dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`demo-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="demo-cta" onClick={handleFinish}>
          {t('common.getStarted', language)}
          <span className="demo-cta-arrow">&rarr;</span>
        </button>
      </footer>
    </div>
  );
}
