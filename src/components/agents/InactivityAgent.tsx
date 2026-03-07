import { useState, useEffect } from 'react';
import './Agents.css';

interface InactivePromoter {
  name: string;
  lastActive: string;
  daysInactive: number;
  suggestedAction: string;
}

export default function InactivityAgent() {
  const [data, setData] = useState<InactivePromoter[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudged, setNudged] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        { name: 'Sneha Reddy', lastActive: '2026-02-10', daysInactive: 25, suggestedAction: 'Send WhatsApp reminder with latest offers' },
        { name: 'Rahul Verma', lastActive: '2026-02-20', daysInactive: 15, suggestedAction: 'Schedule training call for new EV products' },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNudge = (name: string) => {
    setNudged((prev) => new Set(prev).add(name));
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">Inactivity Intervention</span>
      </div>

      {loading ? (
        <div className="agent-processing">
          <div className="agent-spinner" />
          <span>Detecting inactive promoters...</span>
        </div>
      ) : (
        <div className="agent-body">
          {data.length === 0 ? (
            <p className="agent-desc">All promoters are active. No intervention needed.</p>
          ) : (
            <div className="agent-inactive-list">
              {data.map((p) => (
                <div key={p.name} className="agent-inactive-card">
                  <div className="agent-inactive-header">
                    <span className="agent-inactive-name">{p.name}</span>
                    <span className="badge badge-error">{p.daysInactive}d inactive</span>
                  </div>
                  <p className="agent-inactive-action">{p.suggestedAction}</p>
                  <button
                    className={`btn-secondary agent-nudge-btn ${nudged.has(p.name) ? 'nudged' : ''}`}
                    onClick={() => handleNudge(p.name)}
                    disabled={nudged.has(p.name)}
                  >
                    {nudged.has(p.name) ? 'Nudge Sent via WhatsApp' : 'Send Nudge'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
