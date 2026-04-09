import { useEffect, useRef, useState } from 'react';
import { formatINR } from '../../i18n/strings';
import AIBadge from '../shared/AIBadge';
import './AskMpos.css';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  kind?: 'text' | 'table' | 'action' | 'narrative';
  table?: { headers: string[]; rows: (string | number)[][] };
  actionLabel?: string;
}

const sampleQueries = [
  'Show me sales by state this month',
  "Which agents haven't sold anything in 7 days?",
  'What\u2019s the attach rate for Xiaomi Redmi Note 13 Pro?',
  'Create a campaign for Karnataka dealers this weekend',
  'Why is my loss ratio going up?',
];

// Deterministic mock responses matched against the query keywords
function generateResponse(query: string): ChatMessage {
  const q = query.toLowerCase();
  const id = 'response';

  if (q.includes('sales by state') || q.includes('by state')) {
    return {
      id,
      role: 'assistant',
      kind: 'table',
      content: 'Here\u2019s your sales by state for March 2026:',
      table: {
        headers: ['State', 'Policies', 'GWP', 'MoM'],
        rows: [
          ['Karnataka', 1423, formatINR(645000), '+12%'],
          ['Tamil Nadu', 1102, formatINR(498000), '+8%'],
          ['Maharashtra', 980, formatINR(445000), '+15%'],
          ['Delhi', 876, formatINR(392000), '+4%'],
          ['Telangana', 654, formatINR(288000), '-2%'],
        ],
      },
    };
  }

  if (q.includes("haven't sold") || q.includes('inactive') || q.includes('7 days')) {
    return {
      id,
      role: 'assistant',
      kind: 'table',
      content: 'I found 6 agents with zero sales in the last 7 days:',
      table: {
        headers: ['Agent', 'Dealer', 'Last sale', 'Status'],
        rows: [
          ['Rahul Kumar', 'Croma Koramangala', '14 days ago', 'Active'],
          ['Sneha Reddy', 'Reliance Digital', '9 days ago', 'Active'],
          ['Arjun Nair', 'Vijay Sales', '21 days ago', 'Inactive'],
          ['Meena Iyer', 'Sangeetha Mobiles', '8 days ago', 'Active'],
          ['Kiran Sharma', 'Poorvika Mobiles', '10 days ago', 'Active'],
          ['Deepa Rao', 'Croma Jayanagar', '12 days ago', 'Active'],
        ],
      },
    };
  }

  if (q.includes('attach rate')) {
    return {
      id,
      role: 'assistant',
      kind: 'narrative',
      content:
        'The attach rate for Xiaomi Redmi Note 13 Pro is 8.2% this month \u2014 up from 7.1% in February. This is 0.4pp above your brand average. Karnataka and Tamil Nadu are driving the uplift, while Delhi NCR is lagging at 5.8%. Recommendation: the new "Monsoon Shield" campaign is resonating with mid-range device buyers; consider extending it to Delhi.',
    };
  }

  if (q.includes('create') && q.includes('campaign')) {
    return {
      id,
      role: 'assistant',
      kind: 'action',
      content:
        'I\u2019ve drafted a campaign based on your request. Review the details below and confirm to create.\n\n• Name: Karnataka Weekend Special\n• Discount: 10% off all plans\n• Duration: Sat, 12 Apr \u2013 Sun, 13 Apr 2026\n• States: Karnataka\n• Expected uplift: +18% vs regular weekend baseline',
      actionLabel: 'Create campaign',
    };
  }

  if (q.includes('loss ratio') || q.includes('why')) {
    return {
      id,
      role: 'assistant',
      kind: 'narrative',
      content:
        'Your loss ratio is up 3.2pp MoM, mostly driven by two factors:\n\n1. Samsung A-series screen damage claims: claim frequency on this category has doubled in the last 30 days. The root cause appears to be a defective screen batch in models manufactured Q4 2025.\n\n2. Ather 450X battery claims: cold-weather degradation claims spiked in North India during February.\n\nRecommendation: Work with underwriting to introduce a device-level claim cap for the affected Samsung batch, and tighten the battery claim guidelines for EVs in North India.',
    };
  }

  return {
    id,
    role: 'assistant',
    kind: 'text',
    content:
      'I can help with data queries, insights, and actions across your MPOS tenant. Try asking about sales performance, agent activity, campaign ideas, claim patterns, or anomalies.',
  };
}

export default function AskMpos() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);
  const nextId = () => `m${++idCounter.current}`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const handleSend = (queryText?: string) => {
    const query = (queryText ?? input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: nextId(),
      role: 'user',
      content: query,
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const response = { ...generateResponse(query), id: nextId() };
      setMessages((m) => [...m, response]);
      setThinking(false);
    }, 900);
  };

  return (
    <div className="ask-page">
      <header className="ask-header">
        <div>
          <h1 className="page-title">
            Ask MPOS <AIBadge label="AI" />
          </h1>
          <p className="text-secondary">Natural-language queries, insights, and one-tap actions across your tenant</p>
        </div>
        <div className="ask-key-wrap">
          <label className="ask-key-label">Anthropic API key (optional)</label>
          <input
            type="password"
            className="input-field ask-key-input"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </header>

      <div className="ask-chat card">
        <div className="ask-scroll" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="ask-empty">
              <div className="ask-empty-glow">
                <AIBadge label="Ask MPOS" shimmer />
              </div>
              <h2>What would you like to know?</h2>
              <p className="text-secondary">Choose a sample query or type your own below.</p>
              <div className="ask-chips">
                {sampleQueries.map((q) => (
                  <button key={q} className="ask-chip" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ask-messages">
              {messages.map((m) => (
                <div key={m.id} className={`ask-msg ask-msg-${m.role}`}>
                  {m.role === 'assistant' && (
                    <div className="ask-msg-header">
                      <AIBadge label="AI" />
                      <span className="text-tertiary">MPOS Assistant</span>
                    </div>
                  )}
                  <div className="ask-msg-body">
                    {m.content.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                    {m.kind === 'table' && m.table && (
                      <div className="ask-table">
                        <div className="ask-table-head">
                          {m.table.headers.map((h) => (
                            <div key={h}>{h}</div>
                          ))}
                        </div>
                        {m.table.rows.map((row, i) => (
                          <div key={i} className="ask-table-row">
                            {row.map((cell, j) => (
                              <div key={j}>{cell}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.kind === 'action' && (
                      <div className="ask-msg-actions">
                        <button className="btn-primary">{m.actionLabel}</button>
                        <button className="btn-ghost">Modify</button>
                      </div>
                    )}
                    {m.role === 'assistant' && m.kind !== 'action' && (
                      <div className="ask-msg-actions">
                        <button className="btn-ghost">Copy</button>
                        <button className="btn-ghost">Export CSV</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="ask-msg ask-msg-assistant">
                  <div className="ask-msg-header">
                    <AIBadge label="AI" shimmer />
                    <span className="text-tertiary">Thinking\u2026</span>
                  </div>
                  <div className="ask-thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ask-input-row">
          <input
            className="ask-input"
            placeholder="Ask anything about your tenant\u2026"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn-primary" onClick={() => handleSend()} disabled={!input || thinking}>
            {thinking ? 'Thinking\u2026' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
