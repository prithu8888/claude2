import { agents, ME } from './data';

export default function AgentLeaderboard() {
  const me = agents.find((a) => a.id === ME)!;
  const list = agents.filter((a) => a.region === me.region).sort((a, b) => b.monthPolicies - a.monthPolicies);
  const myIdx = list.findIndex((a) => a.id === ME);
  const above = myIdx > 0 ? list[myIdx - 1] : null;
  const gap = above ? above.monthPolicies - me.monthPolicies + 1 : 0;

  return (
    <div>
      <h2 className="ii-h2">April 2026 Leaderboard</h2>
      <p className="ii-muted" style={{ fontSize: 13, marginBottom: 12 }}>
        Sales agents in your region · {me.region}
      </p>
      <div className="ii-my-rank">
        #{myIdx + 1} · {me.name} (You) · {me.monthPolicies} policies · Rs.{me.monthEarned}
      </div>
      {list.map((a, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        return (
          <div key={a.id} className={`ii-lb-row ${a.id === ME ? 'me' : ''}`}>
            <span className="ii-medal">{medal}</span>
            <span>{a.name}{a.id === ME ? ' (You)' : ''}</span>
            <span>{a.monthPolicies}</span>
            <span>Rs.{a.monthEarned}</span>
          </div>
        );
      })}
      {above && (
        <div className="ii-nudge">
          Sell {gap} more policies this month to move to #{myIdx}.
        </div>
      )}
      <div className="ii-time-chip">18 days left in April</div>
    </div>
  );
}
