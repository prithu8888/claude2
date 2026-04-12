import { useRef, useState } from 'react';
import Spinner from '../shared/Spinner';
import type { NetworkUser } from './mockUsers';

interface Props {
  onBack: () => void;
  onImported: (users: NetworkUser[]) => void;
}

type Stage = 'upload' | 'processing' | 'errors' | 'confirm' | 'creating' | 'done';

interface ErrorRow {
  id: string;
  rowNumber: number;
  kind: 'missing_parent' | 'duplicate_phone';
  name: string;
  phone: string;
  parentPhone?: string;
  title: string;
  message: string;
}

const INITIAL_ERRORS: ErrorRow[] = [
  {
    id: 'e1',
    rowNumber: 4,
    kind: 'missing_parent',
    name: 'Deepika Rao',
    phone: '9712345678',
    parentPhone: '9999999999',
    title: 'Parent not found',
    message:
      "We couldn’t find this person’s manager. The number 9999999999 isn’t in your file and isn’t in MPOS.",
  },
  {
    id: 'e2',
    rowNumber: 9,
    kind: 'duplicate_phone',
    name: 'Suresh Pillai',
    phone: '9801234567',
    title: 'Phone duplicate',
    message: 'This phone is already registered in MPOS under Suresh R. Use a different number or remove this row.',
  },
];

export default function DealerBulkUpload({ onBack, onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('upload');
  const [errors] = useState(INITIAL_ERRORS);
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Set<string>>(new Set(['e1']));
  const [edits, setEdits] = useState<Record<string, string>>({});

  const visible = errors.filter((e) => !removed.has(e.id));
  const unresolved = visible.filter((e) => !resolved.has(e.id));
  const allResolved = unresolved.length === 0;

  const readyRows = 10 + visible.length - unresolved.length;

  const handleUpload = () => {
    setStage('processing');
    setTimeout(() => setStage('errors'), 1500);
  };

  const save = (id: string) => {
    setResolved((s) => new Set([...s, id]));
    const next = new Set(editing);
    next.delete(id);
    setEditing(next);
  };

  const remove = (id: string) => {
    const el = document.getElementById(`bulk-err-${id}`);
    if (el) el.classList.add('wiz-error-removing');
    setTimeout(() => {
      setRemoved((s) => new Set([...s, id]));
    }, 200);
  };

  const startEdit = (id: string) => setEditing(new Set([...editing, id]));

  const createUsers = () => {
    setStage('creating');
    setTimeout(() => {
      setStage('done');
    }, 1000);
  };

  const finishAndReturn = () => {
    const newUsers: NetworkUser[] = Array.from({ length: readyRows }).map((_, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      name: ['Rajesh Kumar', 'Anita Singh', 'Priya K', 'Anil M', 'Sonia D', 'Rakesh B', 'Neha T', 'Aditya P', 'Manoj C', 'Ritu V', 'Sameer L', 'Kavita M'][i] ?? `Imported User ${i + 1}`,
      phone: `99880${(i + 10).toString().padStart(5, '0')}`,
      parentId: 'd1',
      status: 'Active',
    }));
    onImported(newUsers);
  };

  // ----- UPLOAD -----
  if (stage === 'upload') {
    return (
      <div className="dn-bulk">
        <header className="dn-header">
          <div>
            <h1 className="dn-title">Bulk upload</h1>
            <p className="dn-subtitle">Step 1 of 3 &middot; Upload your file</p>
          </div>
          <button className="dn-btn-ghost" onClick={onBack}>← Back to users</button>
        </header>

        <div className="dn-bulk-intro">
          <p>
            Your file needs three columns: each person’s name, their phone number, and their manager’s phone number.
          </p>
          <div className="dn-bulk-example-table">
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
                  <td>Rajesh Kumar</td>
                  <td>9876543210</td>
                  <td>9856789012</td>
                </tr>
                <tr>
                  <td>Anita Singh</td>
                  <td>9865432109</td>
                  <td>9876543210</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="dn-bulk-caption">
            Column names don’t need to match exactly. We’ll figure it out.
          </div>
        </div>

        <div className="dn-bulk-dropzone" onClick={() => fileRef.current?.click()}>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
          <div className="dn-bulk-dropzone-icon">📤</div>
          <div className="dn-bulk-dropzone-title">Drag file here or click to browse</div>
          <div className="dn-bulk-dropzone-sub">Excel or CSV</div>
        </div>
        <div className="dn-bulk-sub-actions">
          <button className="dn-link-btn-grey" type="button">Download sample template</button>
          <button className="dn-bulk-simulate" onClick={handleUpload}>
            Simulate: upload test file (5 rows, 2 errors)
          </button>
        </div>
      </div>
    );
  }

  // ----- PROCESSING -----
  if (stage === 'processing') {
    return (
      <div className="dn-bulk">
        <div className="dn-bulk-loading">
          <Spinner size={28} />
          <div>
            <strong>Building hierarchy…</strong>
            <span>Reading your file and matching people to their managers</span>
          </div>
        </div>
      </div>
    );
  }

  // ----- ERRORS -----
  if (stage === 'errors') {
    return (
      <div className="dn-bulk">
        <header className="dn-header">
          <div>
            <h1 className="dn-title">Fix errors</h1>
            <p className="dn-subtitle">Step 2 of 3 &middot; {unresolved.length} {unresolved.length === 1 ? 'row needs' : 'rows need'} your attention</p>
          </div>
          <button className="dn-btn-ghost" onClick={onBack}>← Back to users</button>
        </header>

        <div className="dn-bulk-result-pills">
          <span className="dn-bulk-pill dn-bulk-pill-green">{readyRows} rows ready</span>
          <span className={`dn-bulk-pill dn-bulk-pill-red ${unresolved.length === 0 ? 'zero' : ''}`}>
            {unresolved.length} rows need fixing
          </span>
        </div>

        <div className="dn-bulk-error-list">
          {errors.map((err) => {
            if (removed.has(err.id)) return null;
            const fixed = resolved.has(err.id);
            const editingNow = editing.has(err.id);
            return (
              <div key={err.id} id={`bulk-err-${err.id}`} className={`dn-bulk-error-card ${fixed ? 'fixed' : ''}`}>
                <div className="dn-bulk-error-top">
                  <span className="dn-row-badge">Row {err.rowNumber}</span>
                  <span className={`dn-error-type-badge ${fixed ? 'fixed' : ''}`}>
                    {fixed ? '✓ Fixed' : err.title}
                  </span>
                </div>
                <div className="dn-bulk-error-person">
                  <strong>{err.name}</strong>
                  <span>&middot; {err.phone}</span>
                </div>
                {!fixed && (
                  <>
                    <div className="dn-bulk-error-msg">{err.message}</div>
                    {err.kind === 'missing_parent' && (
                      <div className="dn-review-inline-edit">
                        <label>Manager’s phone number</label>
                        <input
                          className="dn-input dn-input-error-highlight"
                          defaultValue={err.parentPhone}
                          value={edits[err.id] ?? err.parentPhone ?? ''}
                          onChange={(e) => setEdits({ ...edits, [err.id]: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        />
                        <div className="dn-input-hint">Enter the phone of someone already in MPOS or in this file</div>
                        <div className="dn-review-error-actions">
                          <button className="dn-link-blue" onClick={() => save(err.id)}>Save</button>
                          <button className="dn-link-grey" onClick={() => remove(err.id)}>Remove this row</button>
                        </div>
                      </div>
                    )}
                    {err.kind === 'duplicate_phone' && (
                      !editingNow ? (
                        <div className="dn-review-error-actions">
                          <button className="dn-link-blue" onClick={() => startEdit(err.id)}>Enter different number</button>
                          <button className="dn-link-grey" onClick={() => remove(err.id)}>Remove this row</button>
                        </div>
                      ) : (
                        <div className="dn-review-inline-edit">
                          <label>New phone number</label>
                          <input
                            className="dn-input dn-input-error-highlight"
                            placeholder="10-digit number"
                            value={edits[err.id] ?? ''}
                            onChange={(e) => setEdits({ ...edits, [err.id]: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          />
                          <div className="dn-review-error-actions">
                            <button className="dn-link-blue" onClick={() => save(err.id)}>Save</button>
                            <button className="dn-link-grey" onClick={() => remove(err.id)}>Remove this row</button>
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!allResolved && (
          <div className="dn-cta-hint">Fix or remove {unresolved.length === 1 ? 'the row' : 'both rows'} to continue</div>
        )}

        <div className="dn-bulk-actions-bar">
          <button className="dn-btn-ghost" onClick={() => setStage('upload')}>Start over</button>
          <button className="dn-btn-primary" disabled={!allResolved} onClick={() => setStage('confirm')}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // ----- CONFIRM -----
  if (stage === 'confirm') {
    return (
      <div className="dn-bulk">
        <header className="dn-header">
          <div>
            <h1 className="dn-title">Confirm import</h1>
            <p className="dn-subtitle">Step 3 of 3 &middot; Ready to add {readyRows} users</p>
          </div>
          <button className="dn-btn-ghost" onClick={() => setStage('errors')}>← Back</button>
        </header>

        <div className="dn-bulk-confirm-card">
          <div className="dn-bulk-confirm-title">Ready to add {readyRows} users</div>
          <div className="dn-bulk-confirm-rows">
            <div className="dn-summary-row">
              <span className="dn-dot dn-dot-blue" />
              <span><strong>2 Dealers</strong></span>
            </div>
            <div className="dn-summary-row">
              <span className="dn-dot dn-dot-teal" />
              <span><strong>4 Sub-dealers</strong></span>
            </div>
            <div className="dn-summary-row">
              <span className="dn-dot dn-dot-purple" />
              <span><strong>4 Promoters</strong></span>
            </div>
          </div>
          <div className="dn-bulk-confirm-note">
            Roles were assigned automatically based on each person’s manager.
          </div>
        </div>

        <div className="dn-bulk-confirm-cta-note">
          Once confirmed, these users will be created and can log into MPOS.
        </div>

        <div className="dn-bulk-actions-bar">
          <button className="dn-btn-ghost" onClick={() => setStage('errors')}>Back</button>
          <button className="dn-btn-primary" onClick={createUsers}>
            Create {readyRows} users →
          </button>
        </div>
      </div>
    );
  }

  // ----- CREATING -----
  if (stage === 'creating') {
    return (
      <div className="dn-bulk">
        <div className="dn-bulk-loading">
          <Spinner size={28} />
          <div>
            <strong>Creating users…</strong>
            <span>Provisioning accounts and sending invites</span>
          </div>
        </div>
      </div>
    );
  }

  // ----- DONE -----
  return (
    <div className="dn-bulk">
      <div className="dn-bulk-done">
        <div className="dn-bulk-success-icon">✓</div>
        <h2>{readyRows} users added</h2>
        <p className="dn-text-muted">They can now log into MPOS.</p>
        <button className="dn-btn-primary" onClick={finishAndReturn}>
          Back to dashboard →
        </button>
      </div>
    </div>
  );
}
