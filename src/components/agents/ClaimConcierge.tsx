import './Agents.css';

export default function ClaimConcierge({ claimRef }: { claimRef: string }) {
  return (
    <div className="agent-panel">
      <div className="agent-header">
        <span className="ai-chip">AI</span>
        <span className="agent-title">Claim Concierge</span>
      </div>
      <div className="agent-body">
        <div className="agent-concierge-msg">
          <div className="agent-concierge-bubble">
            <p>Your claim <strong>{claimRef}</strong> has been filed successfully.</p>
            <p>Here is what happens next:</p>
            <ol className="agent-concierge-steps">
              <li>Our team will review your claim within 24 hours</li>
              <li>You will receive status updates via WhatsApp</li>
              <li>If approved, settlement will be processed within 5-7 business days</li>
            </ol>
            <p>Need help? Reply to the WhatsApp message or call our helpline at <strong>1800-XXX-XXXX</strong>.</p>
          </div>
          <div className="agent-concierge-whatsapp">
            <span className="agent-concierge-wa-icon">&#128172;</span>
            <span>WhatsApp notification sent to customer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
