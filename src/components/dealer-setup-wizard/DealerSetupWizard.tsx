import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DealerSetupWizard.css';

type StepId = 1 | 2 | 3 | 4 | 5;

const STEPS: { id: StepId; label: string }[] = [
  { id: 1, label: 'Welcome' },
  { id: 2, label: 'Upload' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Preview' },
  { id: 5, label: 'Done' },
];

// ----- Mock data -----

interface ErrorRow {
  id: string;
  rowNumber: number;
  kind: 'missing_parent' | 'duplicate_phone' | 'missing_name';
  name: string;
  phone: string;
  parentPhone?: string;
  title: string; // e.g. "Missing manager"
  message: string;
}

const INITIAL_ERRORS: ErrorRow[] = [
  {
    id: 'e1',
    rowNumber: 4,
    kind: 'missing_parent',
    name: 'Paul Singarayar',
    phone: '9489391717',
    parentPhone: '9840513986',
    title: 'Missing manager',
    message:
      "We couldn’t find Paul’s manager. The number 9840513986 isn’t in your file and isn’t already in MPOS. Either add their manager to this file, or enter the correct manager phone number below.",
  },
  {
    id: 'e2',
    rowNumber: 17,
    kind: 'duplicate_phone',
    name: 'Rajan Muthusamy',
    phone: '9789012345',
    title: 'Phone already exists',
    message:
      'This phone number is already registered in MPOS. This person may already have an account. Use a different number or remove this row.',
  },
  {
    id: 'e3',
    rowNumber: 31,
    kind: 'missing_name',
    name: '',
    phone: '9812345678',
    title: 'Name missing',
    message: 'This person’s name is missing. Please add their name to continue.',
  },
];

// Tree data for Step 4 — Dealer 1 fully expanded
const DEALER_1 = {
  name: 'Mohammed Ali',
  phone: '9856789012',
  subdealers: [
    {
      name: 'Amit Singh',
      phone: '9812345678',
      promoters: [
        { name: 'Suresh R', phone: '9823456789' },
        { name: 'Meera K', phone: '9890123456' },
        { name: 'Vijay S', phone: '9879012345' },
      ],
    },
    {
      name: 'Kavya M',
      phone: '9834567890',
      promoters: [
        { name: 'Rahul D', phone: '9801234567' },
        { name: 'Deepa S', phone: '9878901234' },
      ],
    },
  ],
};

const OTHER_DEALERS = [
  { name: 'Priya Nair', phone: '9845678901' },
  { name: 'Arjun Sharma', phone: '9867890123' },
];

// ----- Stepper -----

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
      <p className="wiz-sub">Let’s get your team set up before they start selling. Takes about 10 minutes.</p>

      <div className="wiz-info-cards">
        <div className="wiz-info-card">
          <div className="wiz-info-title">Upload any file</div>
          <div className="wiz-info-body">
            Share whatever spreadsheet you already use. Any column names, any format.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-title">We figure out the structure</div>
          <div className="wiz-info-body">
            As long as each person has their manager’s phone number, we’ll build the hierarchy automatically.
          </div>
        </div>
        <div className="wiz-info-card">
          <div className="wiz-info-title">Fix and confirm</div>
          <div className="wiz-info-body">
            We’ll flag anything that looks off before creating any accounts.
          </div>
        </div>
      </div>

      <div className="wiz-note-box">
        Your account is already set up. You just need to add your dealers, sub-dealers, and promoters.
      </div>

      <div className="wiz-footer-solo">
        <button className="wiz-btn-primary wiz-btn-wide" onClick={onNext}>
          Let’s get started &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 2: Upload -----

const LOADING_MESSAGES = [
  'Reading your file…',
  'Building your team hierarchy…',
  'Checking for issues…',
];

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
    }, 600);
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
      <p className="wiz-sub">
        Your file needs three columns: each person’s name, their phone number, and their manager’s phone number.
        That’s it.
      </p>

      <div className="wiz-example-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Manager’s phone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paul Singarayar</td>
              <td>9489391717</td>
              <td>9840513986</td>
            </tr>
            <tr>
              <td>Rajan Kumar</td>
              <td>9789012345</td>
              <td>9489391717</td>
            </tr>
            <tr>
              <td>Meera S</td>
              <td>9812345678</td>
              <td>9789012345</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="wiz-caption">
        Column names don’t have to match exactly — we’ll figure it out. What matters is that the data is there.
      </p>

      {!uploaded ? (
        <>
          <label className="wiz-dropzone">
            <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={() => setUploaded(true)} />
            <div className="wiz-dropzone-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="wiz-dropzone-title">Drag your file here, or click to browse</div>
            <div className="wiz-dropzone-sub">Excel or CSV</div>
          </label>
          <button className="wiz-link-grey" type="button">Download a sample template</button>
          <button className="wiz-simulate-btn" onClick={() => setUploaded(true)}>
            Simulate: Upload Xiaomi file
          </button>
        </>
      ) : (
        <div className="wiz-upload-success">
          <div className="wiz-upload-success-icon">&#10003;</div>
          <div className="wiz-upload-success-body">
            <div className="wiz-upload-success-title">Xiaomi_onboarding_sample.xlsx</div>
            <div className="wiz-upload-success-meta">11 columns &middot; 47 rows detected</div>
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
          Process file &rarr;
        </button>
      </div>
    </div>
  );
}

// ----- Step 3: Review (pills + hierarchy summary + error cards) -----

type ErrorCardStatus = 'pending' | 'fixed' | 'removed';

function Step3Review({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [statuses, setStatuses] = useState<Record<string, ErrorCardStatus>>({
    e1: 'pending',
    e2: 'pending',
    e3: 'pending',
  });
  const [editing, setEditing] = useState<Set<string>>(new Set(['e3'])); // e3 starts with input shown
  const [edits, setEdits] = useState<Record<string, { name: string; phone: string; parentPhone: string }>>({});

  const visible = errors.filter((e) => statuses[e.id] !== 'removed');
  const unresolved = visible.filter((e) => statuses[e.id] === 'pending');
  const unresolvedCount = unresolved.length;
  const readyCount = 44 + (errors.length - visible.length) + visible.filter((e) => statuses[e.id] === 'fixed').length;
  const totalCount = 47;
  const allResolved = unresolvedCount === 0;

  const startEdit = (id: string) => {
    const err = errors.find((e) => e.id === id);
    if (!err) return;
    setEdits({
      ...edits,
      [id]: {
        name: edits[id]?.name ?? err.name,
        phone: edits[id]?.phone ?? '',
        parentPhone: edits[id]?.parentPhone ?? err.parentPhone ?? '',
      },
    });
    setEditing(new Set([...editing, id]));
  };

  const save = (id: string) => {
    setStatuses({ ...statuses, [id]: 'fixed' });
    const next = new Set(editing);
    next.delete(id);
    setEditing(next);
  };

  const remove = (id: string) => {
    // Fade out visually first
    const el = document.getElementById(`err-${id}`);
    if (el) el.classList.add('wiz-error-removing');
    setTimeout(() => {
      setStatuses((s) => ({ ...s, [id]: 'removed' }));
      setErrors((e) => e.filter((x) => x.id !== id));
    }, 220);
  };

  return (
    <div className="wiz-step-content">
      <h1 className="wiz-h1">Review your team</h1>
      <p className="wiz-sub">We’ve processed your file and mapped everyone into the hierarchy.</p>

      {/* Stat pills */}
      <div className="wiz-review-pills">
        <span className="wiz-review-pill wiz-review-pill-green">{readyCount} ready</span>
        <span className={`wiz-review-pill wiz-review-pill-red ${unresolvedCount === 0 ? 'zero' : ''}`}>
          {unresolvedCount} need fixing
        </span>
        <span className="wiz-review-pill wiz-review-pill-grey">{totalCount} total</span>
      </div>

      {/* Hierarchy summary card */}
      <div className="wiz-summary-card">
        <div className="wiz-summary-title">What we found</div>
        <div className="wiz-summary-row">
          <span className="wiz-dot wiz-dot-blue" />
          <span><strong>3 Dealers</strong> identified</span>
        </div>
        <div className="wiz-summary-row">
          <span className="wiz-dot wiz-dot-teal" />
          <span><strong>8 Sub-dealers</strong> identified</span>
        </div>
        <div className="wiz-summary-row">
          <span className="wiz-dot wiz-dot-purple" />
          <span><strong>33 Promoters</strong> identified</span>
        </div>
        <div className="wiz-summary-divider" />
        <div className="wiz-summary-note">
          Groups were assigned automatically based on each person’s manager.
        </div>
      </div>

      {/* Error section */}
      {unresolvedCount > 0 && (
        <div className="wiz-error-section-title">
          {unresolvedCount} {unresolvedCount === 1 ? 'row needs' : 'rows need'} your attention
        </div>
      )}

      {allResolved && errors.length !== visible.length && (
        <div className="wiz-all-sorted-bar">
          <span className="wiz-green-summary-icon">&#10003;</span>
          All sorted — {readyCount} rows ready to create
        </div>
      )}
      {allResolved && errors.length === visible.length && visible.length > 0 && (
        <div className="wiz-all-sorted-bar">
          <span className="wiz-green-summary-icon">&#10003;</span>
          All sorted — {readyCount} rows ready to create
        </div>
      )}

      <div className="wiz-error-list">
        {errors.map((err) => {
          const status = statuses[err.id];
          const isEditing = editing.has(err.id);
          const isFixed = status === 'fixed';
          return (
            <div
              key={err.id}
              id={`err-${err.id}`}
              className={`wiz-review-error ${isFixed ? 'fixed' : ''}`}
            >
              <div className="wiz-review-error-top">
                <span className="wiz-row-badge">Row {err.rowNumber}</span>
                <span className={`wiz-error-type-badge ${isFixed ? 'fixed' : ''}`}>
                  {isFixed ? '\u2713 Fixed' : err.title}
                </span>
              </div>

              <div className="wiz-review-error-person">
                <strong>{edits[err.id]?.name || err.name || 'Unknown'}</strong>
                <span>&middot; {err.phone}</span>
              </div>

              {!isFixed && (
                <>
                  <div className="wiz-review-error-msg">{err.message}</div>

                  {/* Missing parent — always show input */}
                  {err.kind === 'missing_parent' && (
                    <div className="wiz-review-inline-edit">
                      <label>Manager’s phone number</label>
                      <input
                        className="wiz-input wiz-input-error"
                        defaultValue={err.parentPhone}
                        value={edits[err.id]?.parentPhone ?? err.parentPhone ?? ''}
                        onChange={(e) => setEdits({
                          ...edits,
                          [err.id]: { ...edits[err.id], name: err.name, phone: err.phone, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) },
                        })}
                      />
                      <div className="wiz-input-hint">
                        Enter the phone of someone already in MPOS or in your file
                      </div>
                      <div className="wiz-review-error-actions">
                        <button className="wiz-link-blue" onClick={() => save(err.id)}>
                          Save
                        </button>
                        <button className="wiz-link-grey" onClick={() => remove(err.id)}>
                          Remove Paul from this upload
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Duplicate phone — link that expands input */}
                  {err.kind === 'duplicate_phone' && (
                    <>
                      {!isEditing ? (
                        <div className="wiz-review-error-actions">
                          <button className="wiz-link-blue" onClick={() => startEdit(err.id)}>
                            Enter a different number
                          </button>
                          <button className="wiz-link-grey" onClick={() => remove(err.id)}>
                            Remove Rajan from this upload
                          </button>
                        </div>
                      ) : (
                        <div className="wiz-review-inline-edit">
                          <label>New phone number</label>
                          <input
                            className="wiz-input wiz-input-error"
                            placeholder="10-digit number"
                            value={edits[err.id]?.phone ?? ''}
                            onChange={(e) => setEdits({
                              ...edits,
                              [err.id]: { ...edits[err.id], name: err.name, phone: e.target.value.replace(/\D/g, '').slice(0, 10), parentPhone: '' },
                            })}
                          />
                          <div className="wiz-review-error-actions">
                            <button className="wiz-link-blue" onClick={() => save(err.id)}>
                              Save
                            </button>
                            <button className="wiz-link-grey" onClick={() => remove(err.id)}>
                              Remove Rajan from this upload
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Missing name — immediate input */}
                  {err.kind === 'missing_name' && (
                    <div className="wiz-review-inline-edit">
                      <label>Name</label>
                      <input
                        className="wiz-input wiz-input-error"
                        placeholder="Enter their full name"
                        value={edits[err.id]?.name ?? ''}
                        onChange={(e) => setEdits({
                          ...edits,
                          [err.id]: { ...edits[err.id], name: e.target.value, phone: err.phone, parentPhone: '' },
                        })}
                      />
                      <div className="wiz-review-error-actions">
                        <button className="wiz-link-blue" onClick={() => save(err.id)}>
                          Save
                        </button>
                        <button className="wiz-link-grey" onClick={() => remove(err.id)}>
                          Remove from this upload
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

      {!allResolved && (
        <div className="wiz-cta-hint">Fix or remove the {unresolvedCount} row{unresolvedCount !== 1 ? 's' : ''} above to continue.</div>
      )}

      <div className="wiz-footer wiz-footer-wide">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <div className="wiz-footer-right">
          <button
            className="wiz-link-grey"
            title="These 3 people won’t be created now. You can add them anytime from the dashboard."
          >
            Skip all — I’ll fix these later
          </button>
          <button
            className="wiz-btn-primary"
            disabled={!allResolved}
            onClick={onNext}
          >
            Preview my team &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Step 4: Preview with root admin node -----

function Step4Preview({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['d1']));
  const [allExpanded, setAllExpanded] = useState(false);
  const [creating, setCreating] = useState(false);

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
      setExpanded(new Set(['d1', 'd2', 'd3']));
      setAllExpanded(true);
    }
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(onNext, 1500);
  };

  if (creating) {
    return (
      <div className="wiz-step-content">
        <div className="wiz-loading-block">
          <div className="wiz-big-spinner" />
          <div className="wiz-loading-text">Creating accounts…</div>
        </div>
      </div>
    );
  }

  const d1Expanded = expanded.has('d1');
  const d2Expanded = expanded.has('d2') || allExpanded;
  const d3Expanded = expanded.has('d3') || allExpanded;

  return (
    <div className="wiz-step-content wiz-step-wide">
      <h1 className="wiz-h1">Your team is ready</h1>
      <p className="wiz-sub">Take a look at the hierarchy before we create the accounts.</p>

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
        {/* Root admin node */}
        <div className="wiz-tree-root">
          <div className="wiz-root-node">
            <div className="wiz-root-name">Oppo India Admin</div>
            <div className="wiz-root-sub">Root account &mdash; already exists</div>
          </div>
        </div>

        <div className="wiz-tree-connector" />

        {/* Dealers */}
        <div className="wiz-tree-level-dealers">
          <DealerNode
            name={DEALER_1.name}
            phone={DEALER_1.phone}
            expanded={d1Expanded}
            onToggle={() => toggle('d1')}
            collapsedLabel="Tap to see 2 sub-dealers, 5 promoters"
          />
          <DealerNode
            name={OTHER_DEALERS[0].name}
            phone={OTHER_DEALERS[0].phone}
            expanded={d2Expanded}
            onToggle={() => toggle('d2')}
            collapsedLabel="Tap to see 3 sub-dealers, 11 promoters"
          />
          <DealerNode
            name={OTHER_DEALERS[1].name}
            phone={OTHER_DEALERS[1].phone}
            expanded={d3Expanded}
            onToggle={() => toggle('d3')}
            collapsedLabel="Tap to see 3 sub-dealers, 11 promoters"
          />
        </div>

        {d1Expanded && (
          <>
            <div className="wiz-tree-connector" />
            <div className="wiz-tree-level-subdealers">
              {DEALER_1.subdealers.map((sd) => (
                <div key={sd.phone} className="wiz-tree-subbranch">
                  <div className="wiz-sub-node">
                    <div className="wiz-sub-badge">Sub-dealer</div>
                    <div className="wiz-sub-name">{sd.name}</div>
                    <div className="wiz-sub-phone">{sd.phone}</div>
                  </div>
                  <div className="wiz-tree-connector" />
                  <div className="wiz-tree-level-promoters">
                    {sd.promoters.map((p) => (
                      <div key={p.phone} className="wiz-prom-node">
                        <div className="wiz-prom-badge">Promoter</div>
                        <div className="wiz-prom-name">{p.name}</div>
                        <div className="wiz-prom-phone">{p.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="wiz-tree-bottom-note">
        Once you confirm, all 44 accounts will be created. This cannot be undone from this screen.
      </div>

      <div className="wiz-footer">
        <button className="wiz-btn-ghost" onClick={onBack}>&larr; Back</button>
        <button className="wiz-btn-primary wiz-btn-large" onClick={handleCreate}>
          Create 44 accounts &rarr;
        </button>
      </div>
    </div>
  );
}

function DealerNode({
  name,
  phone,
  expanded,
  onToggle,
  collapsedLabel,
}: {
  name: string;
  phone: string;
  expanded: boolean;
  onToggle: () => void;
  collapsedLabel: string;
}) {
  return (
    <div className={`wiz-dealer-node ${expanded ? 'expanded' : ''}`}>
      <div className="wiz-dealer-badge">Dealer</div>
      <div className="wiz-dealer-name">{name}</div>
      <div className="wiz-dealer-phone">{phone}</div>
      {!expanded && (
        <button className="wiz-dealer-expand" onClick={onToggle}>
          {collapsedLabel}
        </button>
      )}
      {expanded && (
        <button className="wiz-dealer-expand wiz-dealer-expand-active" onClick={onToggle}>
          Collapse
        </button>
      )}
    </div>
  );
}

// ----- Step 5: Done -----

function Step5Done({ onGoToDashboard }: { onGoToDashboard: () => void }) {
  return (
    <div className="wiz-step-content wiz-step-done">
      <div className="wiz-checkmark-anim">
        <div className="wiz-checkmark-circle">
          <svg viewBox="0 0 52 52" width="52" height="52">
            <path fill="none" stroke="#3B6D11" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M14 27 l8 8 l16 -16" />
          </svg>
        </div>
      </div>

      <h1 className="wiz-h1 wiz-h1-center">Your team is live</h1>
      <p className="wiz-sub wiz-sub-center">
        44 accounts created. Your dealers, sub-dealers, and promoters can now log in and start selling.
      </p>

      <div className="wiz-done-cards">
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Share login details</div>
          <div className="wiz-done-card-body">Your team will need their MPOS login to get started.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Download instructions</button>
        </div>
        <div className="wiz-done-card wiz-done-card-primary">
          <div className="wiz-done-card-title">View your team</div>
          <div className="wiz-done-card-body">See all accounts in the dashboard.</div>
          <button className="wiz-btn-primary wiz-done-card-btn" onClick={onGoToDashboard}>
            Go to dashboard &rarr;
          </button>
        </div>
        <div className="wiz-done-card">
          <div className="wiz-done-card-title">Add more people</div>
          <div className="wiz-done-card-body">You can add individual users or upload another file anytime.</div>
          <button className="wiz-btn-secondary wiz-done-card-btn">Learn how</button>
        </div>
      </div>

      <div className="wiz-done-summary">
        44 created &middot; 3 skipped &middot; Completed in 8 minutes
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
          {current === 3 && <Step3Review onBack={() => back(2)} onNext={() => next(4)} />}
          {current === 4 && <Step4Preview onBack={() => back(3)} onNext={() => next(5)} />}
          {current === 5 && <Step5Done onGoToDashboard={() => navigate('/dealer-network')} />}
        </div>
      </main>
    </div>
  );
}
