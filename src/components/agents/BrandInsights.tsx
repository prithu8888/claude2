import { useState, useEffect } from 'react';
import './Agents.css';

interface Insight {
  type: 'trend' | 'alert' | 'recommendation';
  title: string;
  description: string;
  metric?: string;
}

export default function BrandInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInsights([
        {
          type: 'trend',
          title: 'Sales Momentum Up',
          description: 'Policy sales increased 23% week-over-week. Electronics Retail vertical is driving growth.',
          metric: '+23% WoW',
        },
        {
          type: 'alert',
          title: '3 Dealers Inactive >7 Days',
          description: 'Digital Dreams (Kolkata), Greenride Motors (Pune), and 1 other dealer have not logged a sale in the past 7 days.',
        },
        {
          type: 'recommendation',
          title: 'Optimize EV Commission Structure',
          description: 'EV 2W dealers show 40% higher activation when commission rates exceed 18%. Consider adjusting Tier 2 rates.',
        },
        {
          type: 'trend',
          title: 'Claims Ratio Improving',
          description: 'Claims ratio decreased from 14.1% to 12.4% this month. Fraud Gate screening contributing to reduction.',
          metric: '-1.7%',
        },
      ]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const typeIcon = (type: string) => {
    switch (type) {
      case 'trend': return '↑';
      case 'alert': return '⚠';
      case 'recommendation': return '✨';
      default: return 'ℹ';
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'trend': return 'success';
      case 'alert': return 'warning';
      case 'recommendation': return 'info';
      default: return 'info';
    }
  };

  return (
    <div className="agent-panel agent-panel-wide">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">AI Insights</span>
      </div>

      {loading ? (
        <div className="agent-processing">
          <div className="agent-spinner" />
          <span>Analyzing business data...</span>
        </div>
      ) : (
        <div className="agent-insights-list">
          {insights.map((insight, i) => (
            <div key={i} className={`agent-insight-card ${typeColor(insight.type)}`}>
              <div className="agent-insight-header">
                <span className="agent-insight-icon">{typeIcon(insight.type)}</span>
                <span className="agent-insight-title">{insight.title}</span>
                {insight.metric && (
                  <span className={`badge badge-${typeColor(insight.type)}`}>{insight.metric}</span>
                )}
              </div>
              <p className="agent-insight-desc">{insight.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
