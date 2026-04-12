import { useMemo, useState } from 'react';
import {
  getParentName,
  getChildren,
  deriveRole,
  validHorizontalParents,
  type NetworkUser,
} from './mockUsers';
import Spinner from '../shared/Spinner';

interface Props {
  users: NetworkUser[];
  target: NetworkUser;
  onClose: () => void;
  onConfirm: (userId: string, newParentId: string | null, oldParentName: string, newParentName: string) => void;
}

export default function MoveUserModal({ users, target, onClose, onConfirm }: Props) {
  const [search, setSearch] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const role = deriveRole(users, target);
  const oldParentName = getParentName(users, target.parentId);
  const children = getChildren(users, target.id);

  const options = useMemo(() => {
    const list = validHorizontalParents(users, target);
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q));
  }, [users, target, search]);

  const selectedParent = users.find((u) => u.id === selectedParentId);

  const confirm = () => {
    if (!selectedParent) return;
    setLoading(true);
    setTimeout(() => {
      onConfirm(target.id, selectedParent.id, oldParentName, selectedParent.name);
      setLoading(false);
    }, 600);
  };

  const roleClass = role === 'Sub-dealer' ? 'role-subdealer' : 'role-promoter';
  const helperLabel =
    role === 'Sub-dealer' ? 'Pick a different Dealer' : 'Pick a different Sub-dealer';

  return (
    <div className="dn-backdrop" onClick={onClose}>
      <div className="dn-slideover" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header">
          <div>
            <div className="dn-modal-title">Move user</div>
            <div className="dn-modal-sub">Role stays the same &mdash; only their manager changes.</div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="dn-modal-body">
          {/* User summary */}
          <div className="dn-move-summary">
            <div className="dn-move-summary-top">
              <div className="dn-user-avatar">
                {target.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="dn-user-name">{target.name}</div>
                <div className="dn-user-sub">{target.phone}</div>
              </div>
              <span className={`dn-role-pill ${roleClass}`}>{role}</span>
            </div>
            <div className="dn-move-current">
              Currently reports to <strong>{oldParentName}</strong>
            </div>
          </div>

          {/* New parent picker */}
          <div className="dn-field">
            <label>Who should they report to now?</label>
            <input
              className="dn-input"
              placeholder={`${helperLabel} &mdash; search by name or phone`}
              value={selectedParent ? selectedParent.name : search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedParentId(null);
              }}
            />
            {!selectedParent && (
              <div className="dn-parent-list">
                {options.length === 0 ? (
                  <div className="dn-parent-empty">No other {role === 'Sub-dealer' ? 'dealers' : 'sub-dealers'} available</div>
                ) : (
                  options.slice(0, 6).map((p) => (
                    <button
                      key={p.id}
                      className="dn-parent-option"
                      onClick={() => { setSelectedParentId(p.id); setSearch(''); }}
                    >
                      <div className="dn-user-avatar">
                        {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="dn-user-name">{p.name}</div>
                        <div className="dn-user-sub">{p.phone}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Preview card */}
          {selectedParent && (
            <div className="dn-move-preview">
              <strong>
                {target.name} will move from {oldParentName} to {selectedParent.name}
              </strong>
              <div className="dn-move-preview-sub">
                Role stays the same: <span className={`dn-role-pill ${roleClass}`}>{role}</span>
              </div>
            </div>
          )}

          {/* Children warning */}
          {children.length > 0 && (
            <div className="dn-move-warning">
              <span className="dn-warning-icon">!</span>
              <div>
                <strong>
                  {target.name} has {children.length} {children.length === 1 ? 'person' : 'people'} reporting to them
                  ({children.map((c) => c.name).join(', ')}).
                </strong>
                <span>
                  They will stay under {oldParentName} &mdash; you’ll need to move them separately if needed.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="dn-modal-footer">
          <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="dn-btn-primary" onClick={confirm} disabled={!selectedParentId || loading}>
            {loading ? <><Spinner size={14} /> Moving…</> : 'Confirm move'}
          </button>
        </div>
      </div>
    </div>
  );
}
