import { useMemo, useState } from 'react';
import { getChildren, getParentName, validParentsFor, type NetworkUser } from './mockUsers';
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

  const oldParentName = getParentName(users, target.parentId);
  const children = getChildren(users, target.id);

  const options = useMemo(() => {
    const list = validParentsFor(users, target.group).filter((p) => p.id !== target.parentId);
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
    }, 800);
  };

  return (
    <div className="dn-backdrop" onClick={onClose}>
      <div className="dn-slideover" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header">
          <div>
            <div className="dn-modal-title">Move user</div>
            <div className="dn-modal-sub">{target.name} \u00b7 {target.group}</div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">\u2715</button>
        </div>

        <div className="dn-modal-body">
          <div className="dn-field">
            <label>Current parent</label>
            <div className="dn-current-parent">
              <div className="dn-user-avatar">
                {oldParentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <strong>{oldParentName}</strong>
                {target.parentId && (
                  <span> \u00b7 {users.find((u) => u.id === target.parentId)?.group}</span>
                )}
              </div>
            </div>
          </div>

          {children.length > 0 && (
            <div className="dn-info-box">
              <span className="dn-info-icon">\u2139</span>
              <div>
                This user has <strong>{children.length} child{children.length !== 1 ? 'ren' : ''}</strong>. They will stay with {target.name} under the new parent. You can reassign them separately from each user\u2019s action menu.
              </div>
            </div>
          )}

          <div className="dn-field">
            <label>New parent {target.group === 'Sub-dealer' ? '(pick a Dealer)' : '(pick a Sub-dealer)'}</label>
            <input
              className="dn-input"
              placeholder={`Search ${target.group === 'Sub-dealer' ? 'dealers' : 'sub-dealers'} by name or phone`}
              value={selectedParent ? selectedParent.name : search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedParentId(null);
              }}
            />
            {!selectedParent && (
              <div className="dn-parent-list">
                {options.length === 0 ? (
                  <div className="dn-parent-empty">No valid parents available</div>
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
                        <div className="dn-user-sub">{p.phone} \u00b7 {p.group}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
            {selectedParent && (
              <div className="dn-field-hint success">
                <span>\u2713</span> Will report to {selectedParent.name}
                <button className="dn-btn-ghost dn-link-btn" onClick={() => setSelectedParentId(null)}>Change</button>
              </div>
            )}
          </div>
        </div>

        <div className="dn-modal-footer">
          <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="dn-btn-primary" onClick={confirm} disabled={!selectedParentId || loading}>
            {loading ? <><Spinner size={14} /> Moving\u2026</> : 'Confirm move'}
          </button>
        </div>
      </div>
    </div>
  );
}
