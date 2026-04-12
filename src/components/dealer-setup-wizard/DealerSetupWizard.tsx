import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DealerSetupWizard.css';

type StepId = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Upload' },
  { id: 3, label: 'Confirm details' },
  { id: 4, label: 'Fix errors' },
  { id: 5, label: 'Preview' },
  { id: 6, label: 'Done' },
];

// ----- Mock data (inline per spec) -----

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
    message: 'This phone number is already registered in MPOS under a different account. Please use a different number or remove this person.',
  },
  {
    id: 'e2',
    rowNumber: 17,
    name: 'Rajan Muthusamy',
    phone: '9789012345',
    message: 'We couldn’t find this person’s manager in your file. Check that their manager’s phone number (9876543210) is also in the file.',
  },
  {
    id: 'e3',
    rowNumber: 31,
    name: 'Unknown',
    phone: '9812345678',
    message: 'This person’s name is missing. Please add their name.',
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
        { name: 'Rahul D', phone: '9801234567' },
      ],
    },
    {
      name: 'Amit Singh',
      phone: '9812345678',
      promoters: [
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
      <p className="wiz-sub">Let’s get your team set up. This takes about 10 minutes.</p>

      <div className="wiz-info-cards">
        <div className="wiz-info-card">
          <div className="wiz-info-title">Add your team</div>
          <div className="wiz-info-body">
            Dealers, sub-dealers, and promoters all need to be in the system before anyone can sell.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-title">Hierarchy matters</div>
          <div className="wiz-info-body">
            Promoters report to sub-dealers, sub-dealers report to dealers. We’ll make sure the structure is right.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-title">Any file works</div>
          <div className="wiz-info-body">
            Upload whatever spreadsheet you already have. We’ll handle the rest.
          </div>
        </div>
      </div>

      <div className="wiz-note-box">
        ACKO has already set up your account structure. You just need to add the people.
      </div>

      <div className="wiz-footer-solo">
        <button className="wiz-btn-primary wiz-btn-wide" onClick={onNext}>
          Get started &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 2: Upload -----

const LOADING_MESSAGES = ['Reading your file…', 'Finding your team…', 'Almost done…'];

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
    }, 666);
    const finish = setTimeout(onNext, 2000);
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
      <h1 className="wiz-h1">Upload your team list</h1>
      <p className="wiz-sub">Share the spreadsheet you use to track your dealers and promoters. Any format works.</p>

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
            <div className="wiz-dropzone-sub">Excel or CSV — any column names, any format</div>
          </label>
          <button className="wiz-link-grey" type="button">Download our template instead</button>
          <button className="wiz-simulate-btn" onClick={() => setUploaded(true)}>
            Simulate: Upload Xiaomi file
          </button>
        </>
      ) : (
        <div className="wiz-upload-success">
          <div className="wiz-upload-success-icon">&#10003;</div>
          <div className="wiz-upload-success-body">
            <div className="wiz-upload-success-title">Xiaomi_onboarding_sample.xlsx</div>
            <div className="wiz-upload-success-meta">11 columns &middot; 47 rows</div>
          </div>
          <button className="wiz-link-grey wiz-inline-link" onClick={() => setUploaded(false)}>Remove</button>
        </div>
      )}

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button
          className="wiz-btn-primary"
          disabled={!uploaded}
          onClick={() => setLoading(true)}
        >
          Analyse file &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 3: Confirm details (plain-English v2) -----

// Options available for the two confirmation questions.
// We keep the list of columns from the source file for Q1 "who's the manager?"
// and a simple staff-type list for Q2.
const SOURCE_COLUMNS = [
  'Xiaomi FSM Mobile number',
  'PSC Mobile Number',
  'Xiaomi- PSC ID',
  'ASC/Center Manager name',
  'ASC Address',
  'ASC emai id',
  'ASP Mobile',
];

const STAFF_TYPES = ['Dealer', 'Sub-dealer', 'Promoter', 'Service Center staff', 'Mixed — file has multiple types'];

function Step3Confirm({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [managerColumn, setManagerColumn] = useState('Xiaomi FSM Mobile number');
  const [staffType, setStaffType] = useState('Service Center staff');
  const [openPicker, setOpenPicker] = useState<null | 'manager' | 'staff'>(null);

  return (
    <div className="wiz-step-content">
      <h1 className="wiz-h1">Does this look right?</h1>
      <p className="wiz-sub">We read your file and found your team. Just confirm a couple of things.</p>

      {/* Section A — What we found (green tinted) */}
      <div className="wiz-found-card">
        <div className="wiz-found-row">
          <div className="wiz-found-icon wiz-found-icon-people">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div><strong>47 people</strong> to add</div>
        </div>
        <div className="wiz-found-row">
          <div className="wiz-found-icon wiz-found-icon-hierarchy">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <rect x="3" y="15" width="6" height="4" rx="1" />
              <rect x="15" y="15" width="6" height="4" rx="1" />
              <path d="M12 7v4M6 15v-2h12v2" />
            </svg>
          </div>
          <div><strong>3 dealers</strong>, <strong>8 sub-dealers</strong>, <strong>36 promoters</strong></div>
        </div>
        <div className="wiz-found-row">
          <div className="wiz-found-icon wiz-found-icon-check">&#10003;</div>
          <div>Phone numbers, names, and addresses found</div>
        </div>
        <div className="wiz-found-note">No action needed here — we’ve got this covered.</div>
      </div>

      {/* Section B — Just confirm these 2 things */}
      <div className="wiz-confirm-card">
        <div className="wiz-confirm-title">Just confirm these 2 things</div>

        {/* Item 1 */}
        <div className="wiz-confirm-item">
          <div className="wiz-confirm-question">Who is each person’s manager?</div>
          <div className="wiz-confirm-context">This tells us who reports to whom in your hierarchy.</div>
          <div className="wiz-confirm-answer">
            <span className="wiz-answer-tag">
              <span className="wiz-answer-check">&#10003;</span>
              Using: {managerColumn}
            </span>
            <button className="wiz-link-grey" onClick={() => setOpenPicker(openPicker === 'manager' ? null : 'manager')}>
              {openPicker === 'manager' ? 'Close' : 'Change \u2192'}
            </button>
          </div>
          {openPicker === 'manager' && (
            <div className="wiz-picker">
              {SOURCE_COLUMNS.map((c) => (
                <button
                  key={c}
                  className={`wiz-picker-option ${managerColumn === c ? 'selected' : ''}`}
                  onClick={() => { setManagerColumn(c); setOpenPicker(null); }}
                >
                  {c}
                  {managerColumn === c && <span className="wiz-answer-check">&#10003;</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item 2 */}
        <div className="wiz-confirm-item">
          <div className="wiz-confirm-question">What type of staff are in this file?</div>
          <div className="wiz-confirm-context">This determines what they can do in MPOS.</div>
          <div className="wiz-confirm-answer">
            <span className="wiz-answer-tag">
              <span className="wiz-answer-check">&#10003;</span>
              {staffType}
            </span>
            <button className="wiz-link-grey" onClick={() => setOpenPicker(openPicker === 'staff' ? null : 'staff')}>
              {openPicker === 'staff' ? 'Close' : 'Change \u2192'}
            </button>
          </div>
          {openPicker === 'staff' && (
            <div className="wiz-picker">
              {STAFF_TYPES.map((t) => (
                <button
                  key={t}
                  className={`wiz-picker-option ${staffType === t ? 'selected' : ''}`}
                  onClick={() => { setStaffType(t); setOpenPicker(null); }}
                >
                  {t}
                  {staffType === t && <span className="wiz-answer-check">&#10003;</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button className="wiz-btn-primary" onClick={onNext}>
          Looks right, continue &rarr;
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
      <h1 className="wiz-h1">Almost ready — {unresolvedCount} {unresolvedCount === 1 ? 'thing needs' : 'things need'} your attention</h1>
      <p className="wiz-sub">Fix or remove these rows, then we’re good to go.</p>

      <div className="wiz-green-summary">
        <span className="wiz-green-summary-icon">&#10003;</span>
        {readyCount} rows are ready to be created
      </div>

      {allResolved && errors.length > 0 && (
        <div className="wiz-all-sorted-bar">
          <span className="wiz-green-summary-icon">&#10003;</span>
          All sorted — {readyCount} rows ready to create
        </div>
      )}

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
            Skip for now — I’ll fix these later
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
      <h1 className="wiz-h1">Your team, ready to go</h1>
      <p className="wiz-sub">This is what we’re about to create. Take a look before we commit.</p>

      <div className="wiz-stats-row">
        <span className="wiz-stat-pill wiz-stat-blue">3 Dealers</span>
        <span className="wiz-stat-pill wiz-stat-teal">8 Sub-dealers</span>
        <span className="wiz-stat-pill wiz-stat-purple">33 Promoters</span>
        <span className="wiz-stat-pill wiz-stat-grey">44 Total</span>
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
            count="5 sub-dealers, 14 promoters"
          />
          <TreeNode
            type="dealer"
            name="Farida Qureshi"
            phone="9656543210"
            expanded={expanded.has('d3') || allExpanded}
            onToggle={() => toggle('d3')}
            count="5 sub-dealers, 14 promoters"
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

      <p className="wiz-tree-note">Everything looks correct? Once you confirm, we’ll create all 44 accounts.</p>

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button className="wiz-btn-primary wiz-btn-large" onClick={onNext}>
          Create 44 accounts &rarr;
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
        44 accounts created
      </div>

      <div className="wiz-checkmark-anim">
        <div className="wiz-checkmark-circle">
          <svg viewBox="0 0 52 52" width="60" height="60">
            <path fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M14 27 l8 8 l16 -16" />
          </svg>
        </div>
      </div>

      <h1 className="wiz-h1 wiz-h1-center">Your team is live</h1>
      <p className="wiz-sub wiz-sub-center">
        44 dealers, sub-dealers, and promoters are now in MPOS and can start selling.
      </p>

      <div className="wiz-done-cards">
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Tell your team</div>
          <div className="wiz-done-card-body">Let them know they can log into MPOS now.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Download login instructions</button>
        </div>
        <div className="wiz-done-card wiz-done-card-primary">
          <div className="wiz-done-card-title">View your team</div>
          <div className="wiz-done-card-body">See everyone in the dashboard.</div>
          <button className="wiz-btn-primary wiz-done-card-btn" onClick={onGoToDashboard}>
            Go to dashboard &rarr;
          </button>
        </div>
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Add more later</div>
          <div className="wiz-done-card-body">You can add individual users or upload another file anytime.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Learn how</button>
        </div>
      </div>

      <div className="wiz-done-summary">
        44 created &middot; 3 skipped &middot; Completed in 6 minutes
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
    }, 280);
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
          {current === 3 && <Step3Confirm onBack={() => back(2)} onNext={() => next(4)} />}
          {current === 4 && <Step4Errors onBack={() => back(3)} onNext={() => next(5)} />}
          {current === 5 && <Step5Preview onBack={() => back(4)} onNext={() => next(6)} />}
          {current === 6 && <Step6Done onGoToDashboard={() => navigate('/dealer-network')} />}
        </div>
      </main>
    </div>
  );
}
