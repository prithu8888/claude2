import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import AdminConfig from './AdminConfig';
import AdminAgents from './AdminAgents';
import AdminWithdrawals from './AdminWithdrawals';
import AdminReports from './AdminReports';
import AdminSuggestions from './AdminSuggestions';
import type { Cfg } from './data';

type Tab = 'dashboard' | 'config' | 'agents' | 'withdrawals' | 'reports' | 'ai';

export default function AdminView({ onToast }: { onToast: (msg: string) => void }) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [prefill, setPrefill] = useState<Partial<Cfg> | undefined>(undefined);

  const openConfigWithPrefill = (p: Partial<Cfg>) => {
    setPrefill(p);
    setTab('config');
  };

  return (
    <div className="ii-admin">
      <aside className="ii-side">
        <SideBtn active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon="📊" label="Dashboard" />
        <SideBtn active={tab === 'config'} onClick={() => setTab('config')} icon="⚙" label="Incentive Config" />
        <SideBtn active={tab === 'agents'} onClick={() => setTab('agents')} icon="👥" label="Agents" />
        <SideBtn active={tab === 'withdrawals'} onClick={() => setTab('withdrawals')} icon="💳" label="Withdrawals" />
        <SideBtn active={tab === 'reports'} onClick={() => setTab('reports')} icon="📈" label="Reports" />
        <SideBtn active={tab === 'ai'} onClick={() => setTab('ai')} icon="✦" label="AI Suggestions" />
      </aside>
      <main className="ii-main">
        {tab === 'dashboard' && <AdminDashboard onOpenTab={(t) => setTab(t as Tab)} />}
        {tab === 'config' && <AdminConfig initialPrefill={prefill} onToast={onToast} />}
        {tab === 'agents' && <AdminAgents />}
        {tab === 'withdrawals' && <AdminWithdrawals onToast={onToast} />}
        {tab === 'reports' && <AdminReports />}
        {tab === 'ai' && <AdminSuggestions onApply={openConfigWithPrefill} onToast={onToast} />}
      </main>
    </div>
  );
}

function SideBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button className={`ii-side-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
