import { useState } from 'react';
import AIBadge from '../shared/AIBadge';
import { planConfigPrompt, type DealBrief } from '../../prompts';
import './PlanConfigGenerator.css';

// Reference config from the closest partner (Xiaomi) — used as the
// base for generating a new partner's plan details
const referenceConfig = {
  plan_name: 'Xiaomi Extended Warranty 12M',
  partner_name: 'Xiaomi India',
  product_category: 'mobile',
  device_price_min: 7999,
  device_price_max: 24999,
  plan_duration_months: 12,
  master_sclip_policy_number: 'SCLIP-XMI-2025-0412',
  premium_percent: 4.5,
  refund_type: 'pro-rata',
  depreciation_logic: { '90': 0.2, '180': 0.3, '270': 0.4, '365': 0.5 },
  comms_policy_issued_template: 'POLICY_ISSUED_STD_v3',
  comms_claim_status_template: 'CLAIM_STATUS_STD_v2',
  comms_renewal_reminder_template: 'RENEWAL_NUDGE_v4',
  gst_rate: 18,
  tds_rate: 2,
};

type Source = 'copied_from_reference' | 'generated_from_brief' | 'NEEDS_INPUT';
type Confidence = 'HIGH' | 'MEDIUM' | 'NEEDS_REVIEW';

interface FieldOutput {
  value: string | number | null | object;
  source: Source;
  confidence: Confidence;
  note?: string;
}

type ConfigOutput = Record<string, FieldOutput>;

// Deterministic mock generator — mirrors what Claude would produce with
// planConfigPrompt(brief, referenceConfig) as the system prompt
function mockGenerate(brief: DealBrief): ConfigOutput {
  const duration = parseInt(brief.plan_duration.replace('M', ''), 10);
  return {
    plan_name: {
      value: `${brief.partner_name} Extended Warranty ${brief.plan_duration}`,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    partner_name: {
      value: brief.partner_name,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    product_category: {
      value: brief.product_category,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    device_price_min: {
      value: brief.device_price_min,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    device_price_max: {
      value: brief.device_price_max,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    plan_duration_months: {
      value: duration,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    master_sclip_policy_number: {
      value: brief.master_sclip_policy_number,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    premium_structure: {
      value: brief.premium_structure,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    premium_percent: {
      value: brief.premium_percent,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    purchase_type: {
      value: brief.purchase_type,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    b2b_plan: {
      value: brief.b2b_plan,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    partner_channel: {
      value: brief.partner_channel,
      source: 'generated_from_brief',
      confidence: 'HIGH',
    },
    // Copied from reference
    refund_type: { value: 'pro-rata', source: 'copied_from_reference', confidence: 'HIGH' },
    depreciation_logic: {
      value: referenceConfig.depreciation_logic,
      source: 'copied_from_reference',
      confidence: 'HIGH',
    },
    comms_policy_issued_template: {
      value: 'POLICY_ISSUED_STD_v3',
      source: 'copied_from_reference',
      confidence: 'HIGH',
    },
    comms_claim_status_template: {
      value: 'CLAIM_STATUS_STD_v2',
      source: 'copied_from_reference',
      confidence: 'HIGH',
    },
    comms_renewal_reminder_template: {
      value: 'RENEWAL_NUDGE_v4',
      source: 'copied_from_reference',
      confidence: 'HIGH',
    },
    gst_rate: { value: 18, source: 'copied_from_reference', confidence: 'HIGH' },
    tds_rate: { value: 2, source: 'copied_from_reference', confidence: 'HIGH' },
    // Needs input (partner-specific / can't be auto-generated)
    coi_template_name: {
      value: null,
      source: 'NEEDS_INPUT',
      confidence: 'NEEDS_REVIEW',
      note: 'COI template names are partner-specific and must be confirmed with legal.',
    },
    program_id: {
      value: null,
      source: 'NEEDS_INPUT',
      confidence: 'NEEDS_REVIEW',
      note: 'Program ID is assigned by ops after deal signing.',
    },
    review_link: {
      value: null,
      source: 'NEEDS_INPUT',
      confidence: 'NEEDS_REVIEW',
      note: 'Public review link created after COI is uploaded.',
    },
    underwriter_contact: {
      value: null,
      source: 'NEEDS_INPUT',
      confidence: 'NEEDS_REVIEW',
      note: 'Ops to assign an underwriter.',
    },
    escalation_email: {
      value: null,
      source: 'NEEDS_INPUT',
      confidence: 'NEEDS_REVIEW',
      note: 'Partner\u2019s escalation contact \u2014 confirm with BD.',
    },
  };
}

export default function PlanConfigGenerator() {
  const [brief, setBrief] = useState<DealBrief>({
    partner_name: 'Oppo India',
    product_category: 'mobile',
    purchase_type: 'opt-in',
    device_price_min: 9999,
    device_price_max: 29999,
    plan_duration: '24M',
    b2b_plan: 'no',
    master_sclip_policy_number: 'SCLIP-OPO-2026-0128',
    premium_structure: 'Acko GI',
    premium_percent: 4.8,
    partner_channel: 'mixed',
  });

  const [generated, setGenerated] = useState<ConfigOutput | null>(null);
  const [generating, setGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(mockGenerate(brief));
      setGenerating(false);
    }, 1400);
  };

  const sourceClass = (s: Source) => {
    if (s === 'copied_from_reference') return 'src-copied';
    if (s === 'generated_from_brief') return 'src-generated';
    return 'src-needs-input';
  };

  const sourceLabel = (s: Source) => {
    if (s === 'copied_from_reference') return 'From reference';
    if (s === 'generated_from_brief') return 'From deal brief';
    return 'Needs input';
  };

  return (
    <div className="pcg-page">
      <header className="pcg-header">
        <div>
          <h1 className="page-title">Partner Plan Config Generator</h1>
          <p className="text-secondary">
            Enter a deal brief \u2014 AI pre-fills the Plan Details config using the closest existing partner as reference.
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? 'Hide' : 'View'} system prompt
        </button>
      </header>

      {showPrompt && (
        <div className="pcg-prompt-view card">
          <div className="pcg-prompt-header">
            <AIBadge label="System prompt \u2014 Plan Config" />
            <span className="text-tertiary">Sent to Claude as the system message</span>
          </div>
          <pre className="pcg-prompt-text">{planConfigPrompt(brief, referenceConfig)}</pre>
        </div>
      )}

      <div className="pcg-grid">
        <div className="card pcg-form-card">
          <h3>Deal brief</h3>
          <div className="pcg-form-grid">
            <div className="pcg-field">
              <label>Partner name</label>
              <input
                className="input-field"
                value={brief.partner_name}
                onChange={(e) => setBrief({ ...brief, partner_name: e.target.value })}
              />
            </div>
            <div className="pcg-field">
              <label>Product category</label>
              <select
                className="select-field"
                value={brief.product_category}
                onChange={(e) => setBrief({ ...brief, product_category: e.target.value as DealBrief['product_category'] })}
              >
                <option value="mobile">Mobile</option>
                <option value="tv">TV</option>
                <option value="laptop">Laptop</option>
                <option value="wearable">Wearable</option>
              </select>
            </div>
            <div className="pcg-field">
              <label>Purchase type</label>
              <select
                className="select-field"
                value={brief.purchase_type}
                onChange={(e) => setBrief({ ...brief, purchase_type: e.target.value as DealBrief['purchase_type'] })}
              >
                <option value="opt-in">Opt-in</option>
                <option value="mandatory">Mandatory</option>
              </select>
            </div>
            <div className="pcg-field">
              <label>Plan duration</label>
              <select
                className="select-field"
                value={brief.plan_duration}
                onChange={(e) => setBrief({ ...brief, plan_duration: e.target.value as DealBrief['plan_duration'] })}
              >
                <option value="12M">12 months</option>
                <option value="24M">24 months</option>
                <option value="36M">36 months</option>
              </select>
            </div>
            <div className="pcg-field">
              <label>Device price min (\u20B9)</label>
              <input
                className="input-field"
                type="number"
                value={brief.device_price_min}
                onChange={(e) => setBrief({ ...brief, device_price_min: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="pcg-field">
              <label>Device price max (\u20B9)</label>
              <input
                className="input-field"
                type="number"
                value={brief.device_price_max}
                onChange={(e) => setBrief({ ...brief, device_price_max: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="pcg-field">
              <label>B2B plan</label>
              <select
                className="select-field"
                value={brief.b2b_plan}
                onChange={(e) => setBrief({ ...brief, b2b_plan: e.target.value as DealBrief['b2b_plan'] })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="pcg-field">
              <label>Partner channel</label>
              <select
                className="select-field"
                value={brief.partner_channel}
                onChange={(e) => setBrief({ ...brief, partner_channel: e.target.value as DealBrief['partner_channel'] })}
              >
                <option value="LFR">LFR</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div className="pcg-field pcg-field-wide">
              <label>Master SCLIP policy number</label>
              <input
                className="input-field"
                value={brief.master_sclip_policy_number}
                onChange={(e) => setBrief({ ...brief, master_sclip_policy_number: e.target.value })}
              />
            </div>
            <div className="pcg-field">
              <label>Premium structure</label>
              <select
                className="select-field"
                value={brief.premium_structure}
                onChange={(e) => setBrief({ ...brief, premium_structure: e.target.value as DealBrief['premium_structure'] })}
              >
                <option value="Acko GI">Acko GI</option>
                <option value="Acko Tech">Acko Tech</option>
                <option value="split">Split</option>
              </select>
            </div>
            <div className="pcg-field">
              <label>Premium percent (%)</label>
              <input
                className="input-field"
                type="number"
                step="0.1"
                value={brief.premium_percent}
                onChange={(e) => setBrief({ ...brief, premium_percent: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="pcg-reference-note">
            <AIBadge label="Reference" />
            <span>
              Using <strong>Xiaomi India</strong> as the closest reference config. All shared fields (comms
              templates, refund logic, depreciation) will be copied exactly.
            </span>
          </div>

          <div className="pcg-actions">
            <button className="btn-primary" onClick={handleGenerate} disabled={generating}>
              {generating ? 'Generating\u2026' : 'Generate plan config'}
            </button>
          </div>
        </div>

        <div className="card pcg-output-card">
          <div className="pcg-output-header">
            <h3>Generated config</h3>
            {generated && <AIBadge label="AI generated" />}
          </div>

          {!generated && !generating && (
            <div className="pcg-empty">
              <div className="pcg-empty-icon">&#128221;</div>
              <p>Enter the deal brief on the left and click Generate. Claude will pre-fill the 42 plan config fields using the reference partner.</p>
            </div>
          )}

          {generating && (
            <div className="pcg-loading">
              <div className="kyc-spinner" />
              <div>
                <strong>Calling AI config generator</strong>
                <div className="text-secondary">Comparing deal brief against reference config\u2026</div>
              </div>
            </div>
          )}

          {generated && (
            <>
              <div className="pcg-legend">
                <span className="src-chip src-generated">From brief</span>
                <span className="src-chip src-copied">From reference</span>
                <span className="src-chip src-needs-input">Needs input</span>
              </div>
              <div className="pcg-fields">
                {Object.entries(generated).map(([key, field]) => (
                  <div key={key} className={`pcg-field-row ${field.source === 'NEEDS_INPUT' ? 'needs-input' : ''}`}>
                    <div className="pcg-field-name">
                      <code>{key}</code>
                      <span className={`src-chip ${sourceClass(field.source)}`}>{sourceLabel(field.source)}</span>
                    </div>
                    <div className="pcg-field-value">
                      {field.value === null ? (
                        <span className="text-tertiary">\u2014 empty \u2014</span>
                      ) : typeof field.value === 'object' ? (
                        <code className="pcg-code">{JSON.stringify(field.value)}</code>
                      ) : (
                        <code className="pcg-code">{String(field.value)}</code>
                      )}
                    </div>
                    {field.note && <div className="pcg-field-note">{field.note}</div>}
                  </div>
                ))}
              </div>
              <div className="pcg-summary">
                <div>
                  <strong>{Object.values(generated).filter((f) => f.source === 'generated_from_brief').length}</strong> from brief
                </div>
                <div>
                  <strong>{Object.values(generated).filter((f) => f.source === 'copied_from_reference').length}</strong> copied
                </div>
                <div>
                  <strong>{Object.values(generated).filter((f) => f.source === 'NEEDS_INPUT').length}</strong> need input
                </div>
              </div>
              <div className="pcg-actions">
                <button className="btn-ghost">Export JSON</button>
                <button className="btn-primary">Save to partner</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
