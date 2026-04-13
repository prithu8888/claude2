import { useState } from 'react';
import AgentHome from './AgentHome';
import AgentHistory from './AgentHistory';
import AgentWithdraw from './AgentWithdraw';
import AgentLeaderboard from './AgentLeaderboard';
import AgentMore from './AgentMore';

type Tab = 'home' | 'history' | 'withdraw' | 'leaderboard' | 'more';

export default function AgentView({ onToast }: { onToast: (msg: string) => void }) {
  const [tab, setTab] = useState<Tab>('home');
  const goto = (t: string) => setTab(t as Tab);

  return (
    <div className="ii-agent-wrap">
      <div className="ii-agent-frame">
        <div className="ii-agent-view">
          {tab === 'home' && <AgentHome goto={goto} />}
          {tab === 'history' && <AgentHistory />}
          {tab === 'withdraw' && <AgentWithdraw goto={goto} onToast={onToast} />}
          {tab === 'leaderboard' && <AgentLeaderboard />}
          {tab === 'more' && <AgentMore />}
        </div>
        <nav className="ii-tabbar">
          {(['home', 'history', 'withdraw', 'leaderboard', 'more'] as Tab[]).map((t) => (
            <button key={t} className={`ii-tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              <span className="ii-tab-icon">
                {t === 'home' ? '⌂' : t === 'history' ? '☰' : t === 'withdraw' ? '↗' : t === 'leaderboard' ? '🏆' : '⋯'}
              </span>
              <span>{t === 'home' ? 'Home' : t === 'history' ? 'History' : t === 'withdraw' ? 'Withdraw' : t === 'leaderboard' ? 'Leaderboard' : 'More'}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
