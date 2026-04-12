import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DealerSetupWizard.css';

type StepId = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Upload' },
  { id: 3, label: 'Map columns' },
  { id: 4, label: 'Fix errors' },
  { id: 5, label: 'Preview' },
  { id: 6, label: 'Done' },
];

// ----- Mock data (inline per spec) -----

interface MappingRow {
  id: string;
  column: string;
  sample: string;
  mapsTo: string | null;
  confidence: 'MATCHED' | 'CHECK' | 'SKIPPED';
  tooltip?: string;
}

const INITIAL_MAPPING: MappingRow[] = [
  { id: 'r1', column: 'Xiaomi FSM Mobile number', sample: '9840513986', mapsTo: 'parent_phone', confidence: 'CHECK', tooltip: "This looks like a parent\u2019s phone number but we\u2019re not 100% certain. Please confirm." },
  { id: 'r2', column: 'ASC', sample: 'PSC', mapsTo: 'group \u2192 xiaomi_psc', confidence: 'CHECK', tooltip: 'Inferred group type from column value. Please confirm this maps correctly.' },
  { id: 'r3', column: 'ASC/Center Manager name', sample: 'Paul Singarayar', mapsTo: 'name', confidence: 'MATCHED' },
  { id: 'r4', column: 'Xiaomi- PSC ID', sample: 'XMIN4413', mapsTo: 'partner_id', confidence: 'MATCHED' },
  { id: 'r5', column: 'PSC Mobile Number', sample: '9489391717', mapsTo: 'phone', confidence: 'MATCHED' },
  { id: 'r6', column: 'ASC Address', sample: 'I2K Mobiles, 37A, Madurai', mapsTo: 'address', confidence: 'MATCHED' },
  { id: 'r7', column: 'ASC Pincode', sample: '625001', mapsTo: 'pincode', confidence: 'MATCHED' },
  { id: 'r8', column: 'ASC emai id', sample: 'i2k.psc@radiant.com', mapsTo: 'email', confidence: 'MATCHED' },
  { id: 'r9', column: 'ASP Name', sample: 'Radiant E Serve', mapsTo: null, confidence: 'SKIPPED', tooltip: 'No matching MPOS field found. This column will be ignored unless you map it manually.' },
  { id: 'r10', column: 'ASP Mobile', sample: '9962817317', mapsTo: null, confidence: 'SKIPPED' },
  { id: 'r11', column: 'Xiaomi FSM Name', sample: 'Mr. Boopathi', mapsTo: null, confidence: 'SKIPPED' },
];

const MPOS_FIELDS = ['name', 'phone', 'partner_id', 'parent_phone', 'address', 'pincode', 'email', 'group \u2192 xiaomi_psc', 'ignore this column'];

interface ErrorRow {
  id: string;
  rowNumber: number;
  name: string;
  phone: string;
  message: string;
}

const INITIAL_ERRORS: ErrorRow[] = [
  {
    id: 'e1',
    rowNumber: 4,
    name: 'Paul Singarayar',
    phone: '9840513986',
    message: 'This phone number already exists in MPOS. A user with this number was previously created under a different partner. Use a different number or contact ACKO support.',
  },
  {
    id: 'e2',
    rowNumber: 17,
    name: 'Rajan Muthusamy',
    phone: '9789012345',
    message: 'Parent phone 9876543210 not found in this file. Make sure the parent\u2019s row is also in your file, or check the number.',
  },
  {
    id: 'e3',
    rowNumber: 31,
    name: '',
    phone: '9812345678',
    message: 'Name is required. This row is missing the dealer\u2019s name.',
  },
];

// Hierarchy preview data
const DEALER_1 = {
  name: 'Mohammed Ali',
  phone: '9856789012',
  subdealers: [
    {
      name: 'Priya Nair',
      phone: '9845678901',
      promoters: [
        { name: 'Kavya M', phone: '9834567890' },
        { name: 'Suresh R', phone: '9823456789' },
      ],
    },
    {
      name: 'Amit Singh',
      phone: '9812345678',
      promoters: [
        { name: 'Rahul D', phone: '9801234567' },
        { name: 'Meera K', phone: '9890123456' },
        { name: 'Vijay S', phone: '9879012345' },
      ],
    },
  ],
};

// ----- Helpers -----

function Stepper({ current, completed }: { current: StepId; completed: Set<StepId> }) {
  return (
    <div className="wiz-stepper">
      {STEPS.map((s, i) => {
        const isActive = s.id === current;
        const isDone = completed.has(s.id);
        return (
          <div key={s.id} className="wiz-step-wrap">
            <div className={`wiz-step-dot ${isActive ? 'active' : isDone ? 'done' : 'pending'}`}>
              {isDone ? <span>&#10003;</span> : <span>{s.id}</span>}
            </div>
            <div className="wiz-step-label">{s.label}</div>
            {i < STEPS.length - 1 && (
              <div className={`wiz-step-line ${isDone ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ----- Step 1: Welcome -----

function Step1Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="wiz-step-content">
      <h1 className="wiz-h1">Welcome to MPOS, Oppo India</h1>
      <p className="wiz-sub">Let\u2019s get your team set up. This should take about 10 minutes.</p>

      <div className="wiz-info-cards">
        <div className="wiz-info-card">
          <div className="wiz-info-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="wiz-info-title">Add your dealers, sub-dealers, and promoters</div>
          <div className="wiz-info-body">
            All 3 levels need to be in the system before your team can sell plans.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <rect x="3" y="15" width="6" height="4" rx="1" />
              <rect x="15" y="15" width="6" height="4" rx="1" />
              <path d="M12 7v4M6 15v-2h12v2" />
            </svg>
          </div>
          <div className="wiz-info-title">Relationships matter</div>
          <div className="wiz-info-body">
            Each promoter reports to a sub-dealer, each sub-dealer reports to a dealer. We\u2019ll help you set this up correctly.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6M9 15l3-3 3 3" />
            </svg>
          </div>
          <div className="wiz-info-title">Upload any file format</div>
          <div className="wiz-info-body">
            Send us your existing spreadsheet \u2014 any format, any column names. Our AI will do the mapping.
          </div>
        </div>
      </div>

      <div className="wiz-note-box">
        <strong>Before you start:</strong> ACKO has already configured your hierarchy structure
        (Dealers &rarr; Sub-dealers &rarr; Promoters). You just need to add the people.
      </div>

      <div className="wiz-footer-solo">
        <button className="wiz-btn-primary wiz-btn-wide" onClick={onNext}>
          Let\u2019s get started &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 2: Upload -----

const LOADING_MESSAGES = ['Reading your file\u2026', 'Identifying columns\u2026', 'Mapping to MPOS schema\u2026'];

function Step2Upload({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (!loading) return;
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, LOADING_MESSAGES.length - 1);
      setLoadingText(LOADING_MESSAGES[msgIdx]);
    }, 500);
    const finish = setTimeout(onNext, 1500);
    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
  }, [loading, onNext]);

  if (loading) {
    return (
      <div className="wiz-step-content">
        <div className="wiz-loading-block">
          <div className="wiz-big-spinner" />
          <div className="wiz-loading-text">{loadingText}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wiz-step-content">
      <h1 className="wiz-h1">Upload your team file</h1>
      <p className="wiz-sub">Any Excel or CSV file works. We\u2019ll handle the formatting.</p>

      {!uploaded ? (
        <>
          <label className="wiz-dropzone">
            <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={() => setUploaded(true)} />
            <div className="wiz-dropzone-icon">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="wiz-dropzone-title">Drag your file here, or click to browse</div>
            <div className="wiz-dropzone-sub">Supports .xlsx, .xls, .csv \u2014 any format</div>
          </label>
          <button className="wiz-link-grey" type="button">Don\u2019t have a file? Download our template instead</button>
          <button className="wiz-simulate-btn" onClick={() => setUploaded(true)}>
            Simulate: Upload Xiaomi file
          </button>
        </>
      ) : (
        <div className="wiz-upload-success">
          <div className="wiz-upload-success-icon">&#10003;</div>
          <div className="wiz-upload-success-body">
            <div className="wiz-upload-success-title">Xiaomi_onboarding_sample.xlsx uploaded</div>
            <div className="wiz-upload-success-meta">11 columns &middot; 47 rows detected</div>
          </div>
          <button className="wiz-link-grey wiz-inline-link" onClick={() => setUploaded(false)}>Remove file</button>
        </div>
      )}

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button
          className="wiz-btn-primary"
          disabled={!uploaded}
          onClick={() => setLoading(true)}
        >
          Analyse with AI &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 3: Column mapping -----

function Step3Mapping({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [rows, setRows] = useState<MappingRow[]>(INITIAL_MAPPING);

  // Sort: amber first, then matched, then skipped
  const orderedRows = [...rows].sort((a, b) => {
    const order = { CHECK: 0, MATCHED: 1, SKIPPED: 2 };
    return order[a.confidence] - order[b.confidence];
  });

  const counts = {
    matched: rows.filter((r) => r.confidence === 'MATCHED').length,
    check: rows.filter((r) => r.confidence === 'CHECK').length,
    skipped: rows.filter((r) => r.confidence === 'SKIPPED').length,
  };

  const handleMapIt = (id: string, field: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, mapsTo: field, confidence: 'MATCHED' as const } : r)));
  };

  const handleChange = (id: string, field: string) => {
    if (field === 'ignore this column') {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, mapsTo: null, confidence: 'SKIPPED' as const } : r)));
    } else {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, mapsTo: field, confidence: 'MATCHED' as const } : r)));
    }
  };

  return (
    <div className="wiz-step-content wiz-step-wide">
      <h1 className="wiz-h1">Review AI column mapping</h1>
      <p className="wiz-sub">
        We\u2019ve mapped your columns to MPOS fields. Check the amber rows \u2014 everything else looks good.
      </p>

      <div className="wiz-summary-pills">
        <span className="wiz-pill wiz-pill-green">{counts.matched} columns mapped automatically</span>
        <span className="wiz-pill wiz-pill-amber">{counts.check} columns need your review</span>
        <span className="wiz-pill wiz-pill-grey">{counts.skipped === 0 ? 'No columns skipped' : `${counts.skipped} columns skipped`}</span>
      </div>

      <div className="wiz-table-wrap">
        <table className="wiz-table">
          <thead>
            <tr>
              <th>Your column</th>
              <th>Sample data</th>
              <th>Maps to</th>
              <th>Confidence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orderedRows.map((r) => (
              <tr key={r.id} className={`wiz-row wiz-row-${r.confidence.toLowerCase()}`}>
                <td className="wiz-col-column">{r.column}</td>
                <td className="wiz-col-sample">{r.sample}</td>
                <td className="wiz-col-target">
                  {r.mapsTo ? (
                    <select
                      className="wiz-inline-select"
                      value={r.mapsTo}
                      onChange={(e) => handleChange(r.id, e.target.value)}
                    >
                      {!MPOS_FIELDS.includes(r.mapsTo) && <option value={r.mapsTo}>{r.mapsTo}</option>}
                      {MPOS_FIELDS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="wiz-not-mapped">\u2014 not mapped</span>
                  )}
                </td>
                <td>
                  <span className={`wiz-conf wiz-conf-${r.confidence.toLowerCase()}`}>
                    {r.confidence}
                  </span>
                  {r.tooltip && (
                    <span className="wiz-tooltip-wrap">
                      <span className="wiz-tooltip-icon">?</span>
                      <span className="wiz-tooltip">{r.tooltip}</span>
                    </span>
                  )}
                </td>
                <td className="wiz-col-action">
                  {r.confidence === 'SKIPPED' ? (
                    <button className="wiz-link-blue" onClick={() => handleMapIt(r.id, 'name')}>Map it</button>
                  ) : r.confidence === 'CHECK' ? (
                    <select
                      className="wiz-inline-select"
                      value={r.mapsTo ?? ''}
                      onChange={(e) => handleChange(r.id, e.target.value)}
                    >
                      {MPOS_FIELDS.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  ) : (
                    <button className="wiz-link-grey">Change</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="wiz-info-note">
        Skipped columns will not be imported. This is fine \u2014 MPOS only needs the mapped fields.
      </div>

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button className="wiz-btn-primary" onClick={onNext}>
          Confirm mapping and validate &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 4: Fix Errors -----

function Step4Errors({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [errors, setErrors] = useState<ErrorRow[]>(INITIAL_ERRORS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, { name: string; phone: string }>>({});
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const unresolvedCount = errors.filter((e) => !resolvedIds.has(e.id)).length;
  const readyCount = 44 + (errors.length - unresolvedCount);

  const handleRemove = (id: string) => {
    // fade out via CSS then remove
    const el = document.getElementById(`err-${id}`);
    if (el) el.classList.add('wiz-error-removing');
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== id));
    }, 250);
  };

  const handleEditStart = (err: ErrorRow) => {
    setEditingId(err.id);
    setEditValues({ ...editValues, [err.id]: { name: err.name, phone: err.phone } });
  };

  const handleEditSave = (id: string) => {
    setErrors((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...editValues[id] } : e)),
    );
    setResolvedIds(new Set([...resolvedIds, id]));
    setEditingId(null);
  };

  const allResolved = unresolvedCount === 0;

  return (
    <div className="wiz-step-content">
      <h1 className="wiz-h1">Almost there \u2014 fix these errors</h1>
      <p className="wiz-sub">
        {readyCount} rows are ready. {unresolvedCount > 0 ? `${unresolvedCount} rows need attention before we can create the accounts.` : 'All errors resolved.'}
      </p>

      <div className="wiz-green-summary">
        <span className="wiz-green-summary-icon">&#10003;</span>
        {readyCount} rows will be created successfully
      </div>

      {errors.length > 0 && (
        <div className={`wiz-errors-section ${allResolved ? 'all-resolved' : ''}`}>
          <div className="wiz-errors-header">
            {allResolved ? 'All errors resolved.' : `${unresolvedCount} row${unresolvedCount !== 1 ? 's' : ''} need fixing`}
          </div>
          <div className="wiz-error-list">
            {errors.map((err) => {
              const resolved = resolvedIds.has(err.id);
              const editing = editingId === err.id;
              return (
                <div key={err.id} id={`err-${err.id}`} className={`wiz-error-card ${resolved ? 'resolved' : ''}`}>
                  <div className="wiz-error-head">
                    <span className="wiz-row-badge">Row {err.rowNumber}</span>
                    <div className="wiz-error-info">
                      <strong>{err.name || <em>(blank)</em>}</strong>
                      <span>&middot; Phone: {err.phone}</span>
                    </div>
                    {resolved && <span className="wiz-resolved-check">&#10003; Fixed</span>}
                  </div>
                  {!resolved && (
                    <>
                      <div className="wiz-error-msg">{err.message}</div>
                      {!editing ? (
                        <div className="wiz-error-actions">
                          <button className="wiz-btn-secondary" onClick={() => handleEditStart(err)}>
                            Edit this row
                          </button>
                          <button className="wiz-btn-secondary wiz-btn-danger-secondary" onClick={() => handleRemove(err.id)}>
                            Remove this row
                          </button>
                        </div>
                      ) : (
                        <div className="wiz-error-edit">
                          <div className="wiz-edit-grid">
                            <div className="wiz-field">
                              <label>Name</label>
                              <input
                                className="wiz-input"
                                value={editValues[err.id]?.name ?? ''}
                                onChange={(e) => setEditValues({ ...editValues, [err.id]: { ...editValues[err.id], name: e.target.value } })}
                              />
                            </div>
                            <div className="wiz-field">
                              <label>Phone</label>
                              <input
                                className="wiz-input"
                                value={editValues[err.id]?.phone ?? ''}
                                onChange={(e) => setEditValues({ ...editValues, [err.id]: { ...editValues[err.id], phone: e.target.value.replace(/\D/g, '').slice(0, 10) } })}
                              />
                            </div>
                          </div>
                          <div className="wiz-error-actions">
                            <button className="wiz-btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                            <button className="wiz-btn-primary wiz-btn-small" onClick={() => handleEditSave(err.id)}>
                              Save changes
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="wiz-footer wiz-footer-wide">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <div className="wiz-footer-right">
          <button className="wiz-link-grey" title="Skipped rows will not be created. You can re-upload them anytime.">
            Skip for now \u2014 I\u2019ll fix these later
          </button>
          <button className="wiz-btn-primary" disabled={!allResolved} onClick={onNext}>
            Preview hierarchy &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Step 5: Hierarchy Preview -----

function Step5Preview({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['d1']));
  const [allExpanded, setAllExpanded] = useState(false);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const toggleAll = () => {
    if (allExpanded) {
      setExpanded(new Set());
      setAllExpanded(false);
    } else {
      setExpanded(new Set(['d1', 'd2', 'd3', 'sd1a', 'sd1b', 'sd2a', 'sd2b', 'sd2c', 'sd3a', 'sd3b', 'sd3c']));
      setAllExpanded(true);
    }
  };

  const d1Expanded = expanded.has('d1');
  const sd1aExpanded = expanded.has('sd1a') || allExpanded;
  const sd1bExpanded = expanded.has('sd1b') || allExpanded;

  return (
    <div className="wiz-step-content wiz-step-wide">
      <h1 className="wiz-h1">Review your hierarchy</h1>
      <p className="wiz-sub">
        This is what we\u2019re about to create. Check that everything looks right before we commit.
      </p>

      <div className="wiz-stats-row">
        <span className="wiz-stat-pill wiz-stat-blue">3 Dealers</span>
        <span className="wiz-stat-pill wiz-stat-teal">8 Sub-dealers</span>
        <span className="wiz-stat-pill wiz-stat-purple">36 Promoters</span>
        <span className="wiz-stat-pill wiz-stat-grey">47 Total users</span>
      </div>

      <div className="wiz-tree-toolbar">
        <button className="wiz-link-blue" onClick={toggleAll}>
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="wiz-tree">
        {/* Dealer 1 — fully expanded by default */}
        <div className="wiz-tree-level wiz-tree-level-dealers">
          <TreeNode
            type="dealer"
            name={DEALER_1.name}
            phone={DEALER_1.phone}
            expanded={d1Expanded}
            onToggle={() => toggle('d1')}
            count={`${DEALER_1.subdealers.length} sub-dealers, ${DEALER_1.subdealers.reduce((a, s) => a + s.promoters.length, 0)} promoters`}
          />
          <TreeNode
            type="dealer"
            name="Suresh Bhat"
            phone="9767654321"
            expanded={expanded.has('d2') || allExpanded}
            onToggle={() => toggle('d2')}
            count="3 sub-dealers, 14 promoters"
          />
          <TreeNode
            type="dealer"
            name="Farida Qureshi"
            phone="9656543210"
            expanded={expanded.has('d3') || allExpanded}
            onToggle={() => toggle('d3')}
            count="3 sub-dealers, 14 promoters"
          />
        </div>

        {d1Expanded && (
          <>
            <div className="wiz-tree-connector" />
            <div className="wiz-tree-level wiz-tree-level-subdealers">
              {DEALER_1.subdealers.map((sd, i) => {
                const sdKey = i === 0 ? 'sd1a' : 'sd1b';
                const sdExpanded = i === 0 ? sd1aExpanded : sd1bExpanded;
                return (
                  <div key={sdKey} className="wiz-tree-subbranch">
                    <TreeNode
                      type="subdealer"
                      name={sd.name}
                      phone={sd.phone}
                      expanded={sdExpanded}
                      onToggle={() => toggle(sdKey)}
                      count={`${sd.promoters.length} promoters`}
                    />
                    {sdExpanded && (
                      <>
                        <div className="wiz-tree-connector" />
                        <div className="wiz-tree-level-promoters">
                          {sd.promoters.map((p) => (
                            <TreeNode key={p.phone} type="promoter" name={p.name} phone={p.phone} />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button className="wiz-btn-primary wiz-btn-large" onClick={onNext}>
          Create 47 users &rarr;
        </button>
      </div>
    </div>
  );
}

function TreeNode({
  type,
  name,
  phone,
  expanded,
  onToggle,
  count,
}: {
  type: 'dealer' | 'subdealer' | 'promoter';
  name: string;
  phone: string;
  expanded?: boolean;
  onToggle?: () => void;
  count?: string;
}) {
  return (
    <div className={`wiz-tree-node wiz-tree-node-${type}`}>
      <div className="wiz-tree-node-name">{name}</div>
      <div className="wiz-tree-node-phone">{phone}</div>
      {count && onToggle && (
        <button className="wiz-tree-expand" onClick={onToggle}>
          {expanded ? '\u2212' : '+'} {count}
        </button>
      )}
    </div>
  );
}

// ----- Step 6: Done -----

function Step6Done({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  return (
    <div className="wiz-step-content">
      <div className="wiz-done-banner">
        <span className="wiz-done-banner-icon">&#10003;</span>
        47 users created successfully
      </div>

      <div className="wiz-checkmark-anim">
        <div className="wiz-checkmark-circle">
          <svg viewBox="0 0 52 52" width="60" height="60">
            <path fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M14 27 l8 8 l16 -16" />
          </svg>
        </div>
      </div>

      <h1 className="wiz-h1 wiz-h1-center">Your team is ready to sell</h1>
      <p className="wiz-sub wiz-sub-center">
        All dealers, sub-dealers, and promoters have been added to MPOS.
        They can now log in and start issuing plans.
      </p>

      <div className="wiz-done-cards">
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Share login instructions</div>
          <div className="wiz-done-card-body">Send your team their MPOS login details.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Download onboarding guide</button>
        </div>
        <div className="wiz-done-card wiz-done-card-primary">
          <div className="wiz-done-card-title">View your team</div>
          <div className="wiz-done-card-body">See all users in the dashboard.</div>
          <button className="wiz-btn-primary wiz-done-card-btn" onClick={onGoToDashboard}>
            Go to dashboard &rarr;
          </button>
        </div>
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Add more users later</div>
          <div className="wiz-done-card-body">You can always add individual users or upload another file from the dashboard.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Learn how</button>
        </div>
      </div>

      <div className="wiz-done-summary">
        Created: 44 dealers/sub-dealers/promoters &middot; Skipped: 3 rows (download) &middot; Time taken: 4 minutes
      </div>
    </div>
  );
}

// ----- Main wizard -----

export default function DealerSetupWizard() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<StepId>(1);
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const timerRef = useRef<number | null>(null);

  const go = (to: StepId, dir: 'forward' | 'back' = 'forward') => {
    setDirection(dir);
    setTransitioning(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (dir === 'forward') {
        setCompleted((c) => new Set([...c, current]));
      }
      setCurrent(to);
      setTransitioning(false);
    }, 300);
  };

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const next = (to: StepId) => go(to, 'forward');
  const back = (to: StepId) => go(to, 'back');

  return (
    <div className="wiz-app">
      <header className="wiz-header">
        <div className="wiz-logo">ACKO</div>
        <div className="wiz-stepper-wrap">
          <Stepper current={current} completed={completed} />
        </div>
        <div className="wiz-partner">Oppo India</div>
      </header>

      <main className="wiz-main">
        <div className={`wiz-page ${transitioning ? (direction === 'forward' ? 'out-left' : 'out-right') : 'in'}`}>
          {current === 1 && <Step1Welcome onNext={() => next(2)} />}
          {current === 2 && <Step2Upload onBack={() => back(1)} onNext={() => next(3)} />}
          {current === 3 && <Step3Mapping onBack={() => back(2)} onNext={() => next(4)} />}
          {current === 4 && <Step4Errors onBack={() => back(3)} onNext={() => next(5)} />}
          {current === 5 && <Step5Preview onBack={() => back(4)} onNext={() => next(6)} />}
          {current === 6 && <Step6Done onGoToDashboard={() => navigate('/dealer-network')} />}
        </div>
      </main>
    </div>
  );
}
