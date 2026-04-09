import { useRef, useState } from 'react';
import AIBadge from '../shared/AIBadge';
import {
  formatNormalizerPrompt,
  mockNormalize,
  mockTranslateError,
  type NormalizerResponse,
  type ErrorTranslation,
} from '../../prompts';
import './BulkOnboarding.css';

type Step = 'upload' | 'mapping' | 'validation' | 'import' | 'done';

// A realistic messy partner file — mimics what Xiaomi / Oppo actually send
const SAMPLE_HEADERS = ['EmpID', 'Full Name', 'Mobile No.', 'Designation', 'Address', 'Pin', 'Email ID', 'Manager'];
const SAMPLE_ROWS = [
  ['XMIN4413', 'Rahul Sharma', '9876543210', 'Promoter', '#42, 5th Block, Koramangala, Bengaluru', '560095', 'rahul@xiaomi.in', '9876543200'],
  ['XMIN4414', 'Priya Patel', '9876543211', 'Promoter', '12, MG Road, Mumbai', '400001', 'priya@xiaomi.in', '9876543200'],
  ['XMIN4415', 'Amit Kumar', '9876543210', 'FSM', 'Shop 7, Tolichowki, Hyderabad', '500008', 'amit@xiaomi.in', '9876543200'],
  ['XMIN4416', 'Sneha Reddy', '987654321', 'Promoter', '45, Brigade Road, Bengaluru', 'ABC123', 'sneha@xiaomi.in', '9876543200'],
  ['XMIN4417', 'Vijay Singh', '9876543213', 'Promoter', '78, Sector 18, Noida', '201301', 'vijay@xiaomi.in', '9876543200'],
];

interface ValidationRow {
  rowNumber: number;
  data: Record<string, string>;
  error?: string;
  translation?: ErrorTranslation;
}

const VALID_GROUPS = ['Promoter', 'FSM', 'ASC', 'PSC', 'Dealer', 'Sub-Dealer'];

export default function BulkOnboarding() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState<string | null>(null);
  const [mapping, setMapping] = useState<NormalizerResponse | null>(null);
  const [mappingLoading, setMappingLoading] = useState(false);
  const [rows, setRows] = useState<ValidationRow[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleFileSelect = (_file: File | null) => {
    const name = _file?.name ?? 'xiaomi_promoters_march2026.xlsx';
    setFileName(name);
    setStep('mapping');
    setMappingLoading(true);

    // Simulate AI call — in production this would hit Claude with
    // formatNormalizerPrompt(VALID_GROUPS) as the system prompt
    setTimeout(() => {
      setMapping(mockNormalize(SAMPLE_HEADERS));
      setMappingLoading(false);
    }, 1200);
  };

  const handleMappingApproved = () => {
    setStep('validation');
    // Simulate row validation — introduce 3 errors for demo
    const validated: ValidationRow[] = SAMPLE_ROWS.map((row, i) => {
      const data: Record<string, string> = {};
      SAMPLE_HEADERS.forEach((h, idx) => (data[h.toLowerCase()] = row[idx]));
      const rowNumber = i + 2;

      // Row 3: duplicate phone number (same as row 2)
      if (i === 2) {
        return {
          rowNumber,
          data,
          error: 'ConstraintViolationException: duplicate key value violates unique constraint "users_phone_unique"',
          translation: mockTranslateError(
            'ConstraintViolationException: duplicate key',
            rowNumber,
            { phone: row[2] },
          ),
        };
      }
      // Row 4: invalid pincode
      if (i === 3) {
        return {
          rowNumber,
          data,
          error: 'ValidationError: invalid pincode format',
          translation: mockTranslateError('invalid pincode format', rowNumber, { pincode: row[5] }),
        };
      }
      return { rowNumber, data };
    });
    setRows(validated);
  };

  const handleImport = () => {
    setStep('import');
    setTimeout(() => setStep('done'), 1500);
  };

  const reset = () => {
    setStep('upload');
    setFileName(null);
    setMapping(null);
    setRows([]);
  };

  const confidenceClass = (c: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (c === 'HIGH') return 'conf-high';
    if (c === 'MEDIUM') return 'conf-medium';
    return 'conf-low';
  };

  const cleanRows = rows.filter((r) => !r.error);
  const errorRows = rows.filter((r) => r.error);

  return (
    <div className="bulk-page">
      <header className="bulk-header">
        <div>
          <h1 className="page-title">Bulk User Onboarding</h1>
          <p className="text-secondary">
            Upload any partner file format \u2014 our AI normalises the columns automatically.
          </p>
        </div>
        <button className="btn-ghost" onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? 'Hide' : 'View'} system prompt
        </button>
      </header>

      {showPrompt && (
        <div className="bulk-prompt-view card">
          <div className="bulk-prompt-header">
            <AIBadge label="System prompt \u2014 Format Normaliser" />
            <span className="text-tertiary">Sent to Claude as the system message</span>
          </div>
          <pre className="bulk-prompt-text">{formatNormalizerPrompt(VALID_GROUPS)}</pre>
        </div>
      )}

      {/* Stepper */}
      <div className="bulk-stepper">
        {(['upload', 'mapping', 'validation', 'import', 'done'] as Step[]).map((s, i) => {
          const stepIndex = ['upload', 'mapping', 'validation', 'import', 'done'].indexOf(step);
          const status = i < stepIndex ? 'complete' : i === stepIndex ? 'active' : 'pending';
          return (
            <div key={s} className={`bulk-step bulk-step-${status}`}>
              <div className="bulk-step-num">{status === 'complete' ? '\u2713' : i + 1}</div>
              <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {step === 'upload' && (
        <div className="bulk-upload-zone card" onClick={() => fileRef.current?.click()}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
          <div className="bulk-upload-icon">&#128228;</div>
          <div className="bulk-upload-title">Drop your partner file here</div>
          <div className="bulk-upload-sub">
            CSV, XLS, or XLSX. Any column layout works \u2014 our AI handles the mapping.
          </div>
          <button className="btn-primary" onClick={(e) => { e.stopPropagation(); handleFileSelect(null); }}>
            Choose file
          </button>
          <div className="bulk-upload-demo">
            <AIBadge shimmer label="Try demo" />
            <button className="link-btn" onClick={(e) => { e.stopPropagation(); handleFileSelect(null); }}>
              Use sample Xiaomi file (8 columns, 5 rows)
            </button>
          </div>
        </div>
      )}

      {step === 'mapping' && (
        <div className="card bulk-mapping-card">
          <div className="bulk-card-header">
            <div>
              <div className="bulk-card-title">Column mapping</div>
              <div className="text-secondary">File: {fileName}</div>
            </div>
            <AIBadge shimmer={mappingLoading} label={mappingLoading ? 'AI analysing' : 'AI mapped'} />
          </div>

          {mappingLoading ? (
            <div className="bulk-loading">
              <div className="kyc-spinner" />
              <span>Reading columns and matching to MPOS schema\u2026</span>
            </div>
          ) : mapping ? (
            <>
              <div className="bulk-mapping-legend">
                <span className="conf-chip conf-high">HIGH (&gt;90%)</span>
                <span className="conf-chip conf-medium">MEDIUM (60\u201390%)</span>
                <span className="conf-chip conf-low">LOW (&lt;60%)</span>
              </div>

              <div className="bulk-mapping-table">
                <div className="bulk-mapping-row bulk-mapping-head">
                  <div>Source column</div>
                  <div>&rarr;</div>
                  <div>MPOS field</div>
                  <div>Confidence</div>
                  <div>Notes</div>
                </div>
                {mapping.mappings.map((m) => (
                  <div key={m.source_column} className="bulk-mapping-row">
                    <div className="bulk-source">{m.source_column}</div>
                    <div className="bulk-arrow">&rarr;</div>
                    <div className="bulk-target">
                      {m.target_field ? (
                        <code>{m.target_field}</code>
                      ) : (
                        <span className="text-tertiary">\u2014 unmapped \u2014</span>
                      )}
                    </div>
                    <div>
                      <span className={`conf-chip ${confidenceClass(m.confidence)}`}>{m.confidence}</span>
                    </div>
                    <div className="text-secondary bulk-notes">{m.notes}</div>
                  </div>
                ))}
              </div>

              <div className="bulk-mapping-summary">
                <div className="bulk-ai-insight">
                  <AIBadge label="Group inference" />
                  <span>{mapping.group_inference}</span>
                </div>
                {mapping.missing_required_fields.length > 0 && (
                  <div className="bulk-warning">
                    <span>&#9888;</span>
                    Missing required fields: {mapping.missing_required_fields.join(', ')}
                  </div>
                )}
                {mapping.unmapped_source_columns.length > 0 && (
                  <div className="bulk-info">
                    <span>&#8505;</span>
                    {mapping.unmapped_source_columns.length} column(s) will be ignored: {mapping.unmapped_source_columns.join(', ')}
                  </div>
                )}
              </div>

              <div className="bulk-actions">
                <button className="btn-ghost" onClick={reset}>Start over</button>
                <button
                  className="btn-primary"
                  onClick={handleMappingApproved}
                  disabled={mapping.missing_required_fields.length > 0}
                >
                  Approve mapping & validate rows
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {step === 'validation' && (
        <div className="card bulk-validation-card">
          <div className="bulk-card-header">
            <div>
              <div className="bulk-card-title">Row validation</div>
              <div className="text-secondary">
                {cleanRows.length} row{cleanRows.length !== 1 ? 's' : ''} ready to import &middot;{' '}
                <span className="bulk-error-count">{errorRows.length} row{errorRows.length !== 1 ? 's' : ''} have issues</span>
              </div>
            </div>
            <AIBadge label="AI error translator" />
          </div>

          <div className="bulk-validation-list">
            {rows.map((r) => (
              <div key={r.rowNumber} className={`bulk-val-row ${r.error ? 'error' : 'clean'}`}>
                <div className="bulk-val-header">
                  <span className="bulk-val-num">Row {r.rowNumber}</span>
                  <span className="bulk-val-name">{r.data['full name']}</span>
                  <span className="bulk-val-phone">{r.data['mobile no.']}</span>
                  {r.error ? (
                    <span className="badge badge-error">Error</span>
                  ) : (
                    <span className="badge badge-success">\u2713 Ready</span>
                  )}
                </div>
                {r.error && r.translation && (
                  <div className="bulk-val-error">
                    <div className="bulk-val-raw">
                      <span className="text-tertiary">Raw:</span> <code>{r.error}</code>
                    </div>
                    <div className="bulk-val-translation">
                      <AIBadge label="AI translation" />
                      <div>
                        <strong>{r.translation.plain_english}</strong>
                        <div className="text-secondary">\u279C {r.translation.action}</div>
                        {r.translation.escalate_to_saroj && (
                          <div className="bulk-escalate">
                            &#9888; Escalate to engineering: {r.translation.escalation_reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bulk-actions">
            <button className="btn-ghost" onClick={reset}>Start over</button>
            <button className="btn-secondary" disabled={errorRows.length === 0}>
              Download error rows
            </button>
            <button className="btn-primary" onClick={handleImport}>
              Import {cleanRows.length} clean row{cleanRows.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {step === 'import' && (
        <div className="card bulk-done-card">
          <div className="kyc-spinner" />
          <h3>Importing {cleanRows.length} rows\u2026</h3>
          <p className="text-secondary">Provisioning accounts and sending OTP invites</p>
        </div>
      )}

      {step === 'done' && (
        <div className="card bulk-done-card">
          <div className="withdraw-success-icon">&#10003;</div>
          <h3>Import complete</h3>
          <p className="text-secondary">
            {cleanRows.length} users onboarded to Xiaomi India. OTP invites sent to their mobile numbers.
          </p>
          <button className="btn-primary" onClick={reset}>Upload another file</button>
        </div>
      )}
    </div>
  );
}
