import './AIBadge.css';

interface AIBadgeProps {
  label?: string;
  shimmer?: boolean;
  size?: 'sm' | 'md';
}

/**
 * AIBadge — shown whenever AI is acting in the UI.
 * Per spec: "✦ AI" in electric blue, with optional shimmer pulse animation.
 */
export default function AIBadge({ label = 'AI', shimmer = false, size = 'sm' }: AIBadgeProps) {
  return (
    <span className={`ai-badge ai-badge-${size} ${shimmer ? 'shimmer' : ''}`}>
      <span className="ai-badge-sparkle">&#10022;</span>
      <span className="ai-badge-label">{label}</span>
    </span>
  );
}

interface AIShimmerBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function AIShimmerBox({ children, className = '' }: AIShimmerBoxProps) {
  return <div className={`ai-shimmer-box ${className}`}>{children}</div>;
}
