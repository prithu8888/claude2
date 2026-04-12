import { useRef, useState } from 'react';
import AIBadge from '../shared/AIBadge';
import Spinner from '../shared/Spinner';
import type { NetworkUser } from './mockUsers';

interface Props {
  onBack: () => void;
  onImported: (users: NetworkUser[]) => void;
}

type Stage = 'upload' | 'analysing' | 'mapping' | 'validating' | 'results';

type Confidence = 'HIGH' | 'MEDIUM' | 'LOW';

interface Mapping {
  source: string;
  target: string | null;
  confidence: Confidence;
  inference?: string;
  tooltip?: string;
}

// Exact Xiaomi sample mapping per spec
const XIAOMI_MAPPINGS: Mapping[] = [
  { source: 'ASC/Center Manager name', target: 'name', confidence: 'HIGH' },
  { source: 'Xiaomi- PSC ID', target: 'partner_id', confidence: 'HIGH' },
  { source: 'PSC Mobile Number', target: 'phone', confidence: 'HIGH' },
  { source: 'Xiaomi FSM Mobile number', target: 'parent_phone', confidence: 'MEDIUM', inference: 'Likely the FSM (parent) phone for hierarchy linking' },
  { source: 'ASC Address', target: 'address', confidence: 'HIGH' },
  { source: 'ASC Pincode', target: 'pincode', confidence: 'HIGH' },
  { source: 'ASC emai id', target: 'email', confidence: 'HIGH' },
  { source: 'ASC', target: 'group', confidence: 'MEDIUM', inference: 'Inferred as: xiaomi_psc' },
  { source: 'ASP Name', target: null, confidence: 'LOW', tooltip: 'No matching MPOS field' },
];

// First 3 preview rows — formatted as they'll appear in MPOS after mapping
const PREVIEW_ROWS = [
  { name: 'Aarav Gupta', phone: '9840512981', partner_id: 'XMIN-PSC-5521', group: 'xiaomi_psc', parent_phone: '9840510011', pincode: '110001', email: 'aarav@xiaomi.in' },
  { name: 'Divya Menon', phone: '9840513984', partner_id: 'XMIN-PSC-5522', group: 'xiaomi_psc', parent_phone: '9840510011', pincode: '400076', email: 'divya@xiaomi.in' },
  { name: 'Rohit Kashyap', phone: '9840513985', partner_id: 'XMIN-PSC-5523', group: 'xiaomi_psc', parent_phone: '9840510012', pincode: '560038', email: 'rohit@xiaomi.in' },
];

export default function DealerBulkUpload({ onBack, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('upload');

  const startAnalysis = () => {
    setStage('analysing');
    setTimeout(() => setStage('mapping'), 1500);
  };

  const runValidation = () => {
    setStage('validating');
    setTimeout(() => setStage('results'), 800);
  };

  const confidenceClass = (c: Confidence) => `dn-conf dn-conf-${c.toLowerCase()}`;
  const rowClass = (c: Confidence) => (c === 'MEDIUM' ? 'amber' : c === 'LOW' ? 'red' : '');

  const submitValidRows = () => {
    // Create 8 new users for the "import"
    const newUsers: NetworkUser[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `import-${Date.now()}-${i}`,
      name: ['Aarav Gupta', 'Divya Menon', 'Rohit Kashyap', 'Sara Khan', 'Manoj Das', 'Ritu Sinha', 'Kiran Bose', 'Ajay Pillai'][i],
      phone: `98405130${(80 + i).toString().padStart(2, '0')}`,
      group: 'Promoter',
      parentId: 'u4',
      pincode: '560034',
      status: 'Active',
      partnerId: `XMIN-PSC-55${30 + i}`,
    }));
    onImported(newUsers);
  };

  return (
    <div className="dn-bulk">
      <header className="dn-header">
        <div>
          <h1 className="dn-title">Bulk upload</h1>
          <p className="dn-subtitle">
            Upload any partner file format. AI normalises the columns to the MPOS schema.
          </p>
        </div>
        <button className="dn-btn-ghost" onClick={onBack}>\u2190 Back to users</button>
      </header>

      {stage === 'upload' && (
        <div className="dn-bulk-dropzone" onClick={() => fileRef.current?.click()}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={() => startAnalysis()}
          />
          <div className="dn-bulk-dropzone-icon">{'\u{1F4E4}'}</div>
          <div className="dn-bulk-dropzone-title">Drop your partner file here</div>
          <div className="dn-bulk-dropzone-sub">
            CSV, XLS or XLSX. Any column layout. Our AI handles the mapping.
          </div>
          <button className="dn-bulk-simulate" onClick={(e) => { e.stopPropagation(); startAnalysis(); }}>
            <AIBadge label="AI" />
            Simulate upload \u2014 Xiaomi format
          </button>
        </div>
      )}

      {stage === 'analysing' && (
        <div className="dn-bulk-analysing">
          <Spinner size={20} />
          <div>
            <strong style={{ color: 'var(--dn-text)', display: 'block', marginBottom: 2 }}>
              Analysing your file\u2026
            </strong>
            <span>Reading 9 columns \u00b7 matching to MPOS schema</span>
          </div>
        </div>
      )}

      {(stage === 'mapping' || stage === 'validating') && (
        <>
          <div className="dn-bulk-panels">
            <div className="dn-bulk-panel">
              <div className="dn-bulk-panel-header">
                <div className="dn-bulk-panel-title">
                  <AIBadge label="AI" />
                  Column mapping
                </div>
                <span className="dn-bulk-panel-sub">9 columns detected</span>
              </div>
              <table className="dn-mapping-table">
                <thead>
                  <tr>
                    <th>Source column</th>
                    <th>Mapped to</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {XIAOMI_MAPPINGS.map((m) => (
                    <tr key={m.source} className={rowClass(m.confidence)}>
                      <td className="dn-mapping-source">{m.source}</td>
                      <td>
                        {m.target ? (
                          <>
                            <span className="dn-mapping-target">{m.target}</span>
                            {m.inference && <span className="dn-mapping-note">{m.inference}</span>}
                          </>
                        ) : (
                          <span className="dn-mapping-target-none" title={m.tooltip}>unmapped</span>
                        )}
                      </td>
                      <td>
                        <span className={confidenceClass(m.confidence)}>{m.confidence}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dn-bulk-panel">
              <div className="dn-bulk-panel-header">
                <div className="dn-bulk-panel-title">Preview \u2014 first 3 rows</div>
                <span className="dn-bulk-panel-sub">After mapping</span>
              </div>
              <div className="dn-bulk-preview">
                {PREVIEW_ROWS.map((r, i) => (
                  <div key={i} className="dn-bulk-preview-row">
                    <div className="dn-bulk-preview-row-head">
                      <div className="dn-bulk-preview-row-name">{r.name}</div>
                      <span className="dn-group-pill dn-group-promoter">{r.group}</span>
                    </div>
                    <div className="dn-bulk-preview-row-meta">
                      <div>
                        <div className="dn-bulk-preview-label">Phone</div>
                        <div className="dn-bulk-preview-value">{r.phone}</div>
                      </div>
                      <div>
                        <div className="dn-bulk-preview-label">Parent phone</div>
                        <div className="dn-bulk-preview-value">{r.parent_phone}</div>
                      </div>
                      <div>
                        <div className="dn-bulk-preview-label">Partner ID</div>
                        <div className="dn-bulk-preview-value">{r.partner_id}</div>
                      </div>
                      <div>
                        <div className="dn-bulk-preview-label">Pincode</div>
                        <div className="dn-bulk-preview-value">{r.pincode}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dn-bulk-confirm">
            <button className="dn-btn-ghost" onClick={() => setStage('upload')}>Upload different file</button>
            <button className="dn-btn-primary" onClick={runValidation} disabled={stage === 'validating'}>
              {stage === 'validating' ? <><Spinner size={14} /> Validating\u2026</> : 'Confirm mapping and validate'}
            </button>
          </div>
        </>
      )}

      {stage === 'results' && (
        <>
          <div className="dn-bulk-results-summary">
            <div className="dn-summary-card success">
              <div className="dn-summary-card-label">Rows passed</div>
              <div className="dn-summary-card-value">8</div>
              <div className="dn-bulk-preview-label">Ready to import</div>
            </div>
            <div className="dn-summary-card error">
              <div className="dn-summary-card-label">Rows failed</div>
              <div className="dn-summary-card-value">1</div>
              <div className="dn-bulk-preview-label">Needs attention</div>
            </div>
            <div className="dn-summary-card">
              <div className="dn-summary-card-label">Total in file</div>
              <div className="dn-summary-card-value" style={{ color: 'var(--dn-text)' }}>9</div>
              <div className="dn-bulk-preview-label">9 rows detected</div>
            </div>
          </div>

          <div className="dn-error-row">
            <div className="dn-error-icon">\u2715</div>
            <div className="dn-error-body">
              <strong>Row 4 failed \u2014 phone number 9840513986 already exists in the system</strong>
              <span>Remove this row from the file or use a different number.</span>
            </div>
          </div>

          <div className="dn-bulk-actions-bar">
            <button className="dn-download-link">Download failed rows (1)</button>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="dn-btn-ghost" onClick={() => setStage('upload')}>Start over</button>
              <button className="dn-btn-primary" onClick={submitValidRows}>
                Submit 8 valid rows
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
