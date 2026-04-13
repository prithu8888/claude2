import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminView from './AdminView';
import AgentView from './AgentView';
import './InstantIncentive.css';

export default function InstantIncentive() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'admin' | 'agent'>('admin');
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };
  return (
    <div className="ii">
      <div className="ii-top">
        <div className="ii-top-left">
          <button className="ii-exit" onClick={() => navigate('/home')}>← Back to MPOS</button>
          <div className="ii-brand">
            <span className="ii-brand-name">Instant Incentive</span>
            <span className="ii-brand-sub">Oppo India</span>
          </div>
        </div>
        <div className="ii-toggle">
          <button className={`ii-toggle-btn ${mode === 'admin' ? 'active' : ''}`} onClick={() => setMode('admin')}>Admin view</button>
          <button className={`ii-toggle-btn ${mode === 'agent' ? 'active' : ''}`} onClick={() => setMode('agent')}>Agent view</button>
        </div>
      </div>
      {mode === 'admin' ? <AdminView onToast={showToast} /> : <AgentView onToast={showToast} />}
      {toast && <div className="ii-toast">{toast}</div>}
    </div>
  );
}
