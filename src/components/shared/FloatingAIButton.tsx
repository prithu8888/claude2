import { useNavigate, useLocation } from 'react-router-dom';
import './FloatingAIButton.css';

/**
 * Floating "Ask MPOS" AI button — visible on every authenticated page
 * so AI capabilities are always one tap away.
 */
export default function FloatingAIButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on the Ask MPOS page itself, auth, demo
  if (location.pathname.startsWith('/ask') || location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <button
      className="fab-ai"
      onClick={() => navigate('/ask')}
      aria-label="Ask MPOS"
    >
      <span className="fab-ai-sparkle">&#10022;</span>
      <span className="fab-ai-label">Ask MPOS</span>
      <span className="fab-ai-pulse" />
    </button>
  );
}
