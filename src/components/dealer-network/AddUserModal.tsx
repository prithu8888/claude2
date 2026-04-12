import { useMemo, useRef, useState } from 'react';
import {
  validParentsForNew,
  deriveRoleForParent,
  getParentName,
  type NetworkUser,
} from './mockUsers';
import Spinner from '../shared/Spinner';

interface Props {
  users: NetworkUser[];
  onClose: () => void;
  onSubmit: (user: NetworkUser) => void;
}

export default function AddUserModal({ users, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [parentSearch, setParentSearch] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const idCounter = useRef(0);

  const possibleParents = useMemo(() => {
    const list = validParentsForNew(users);
    if (!parentSearch) return list;
    const q = parentSearch.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q));
  }, [users, parentSearch]);

  const duplicatePhone = phone.length === 10 && users.some((u) => u.phone === phone);
  const phoneValid = phone.length === 10 && !duplicatePhone;
  const selectedParent = users.find((u) => u.id === selectedParentId);
  const derivedRole = selectedParentId ? deriveRoleForParent(users, selectedParentId) : null;
  const canSubmit = !!name.trim() && phoneValid && !!selectedParentId;

  const handleSubmit = () => {
    if (!canSubmit || !selectedParentId) return;
    setSubmitting(true);
    setTimeout(() => {
      idCounter.current += 1;
      const newUser: NetworkUser = {
        id: `new${Date.now()}${idCounter.current}`,
        name: name.trim(),
        phone,
        parentId: selectedParentId,
        pincode: pincode || undefined,
        status: 'Active',
      };
      onSubmit(newUser);
      setSubmitting(false);
    }, 600);
  };

  const roleClass = (role: string) => {
    if (role === 'Dealer') return 'role-dealer';
    if (role === 'Sub-dealer') return 'role-subdealer';
    return 'role-promoter';
  };

  return (
    <div className="dn-backdrop" onClick={onClose}>
      <div className="dn-slideover" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header">
          <div>
            <div className="dn-modal-title">Add a new user</div>
            <div className="dn-modal-sub">
              Just tell us who their manager is &mdash; we’ll figure out the role.
            </div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="dn-modal-body">
          <div className="dn-field">
            <label>Full name</label>
            <input
              className="dn-input"
              placeholder="e.g. Rajesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="dn-field">
            <label>Phone number</label>
            <input
              className={`dn-input ${duplicatePhone ? 'invalid' : phoneValid ? 'valid' : ''}`}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
            {duplicatePhone && (
              <div className="dn-field-hint error">
                <span>✕</span> This number is already registered in MPOS.
              </div>
            )}
            {phoneValid && (
              <div className="dn-field-hint success">
                <span>✓</span> Available
              </div>
            )}
          </div>

          <div className="dn-field">
            <label>Who does this person report to?</label>
            <input
              className="dn-input"
              placeholder="Search by name or phone"
              value={selectedParent ? selectedParent.name : parentSearch}
              onChange={(e) => {
                setParentSearch(e.target.value);
                setSelectedParentId(null);
              }}
            />
            {!selectedParent && parentSearch && (
              <div className="dn-parent-list">
                {possibleParents.length === 0 ? (
                  <div className="dn-parent-empty">No matches</div>
                ) : (
                  possibleParents.slice(0, 6).map((p) => {
                    const pRole = deriveRoleForParent(users, p.id);
                    const parentRole = p.parentId ? deriveRoleForParent(users, p.parentId) : 'Partner Admin';
                    return (
                      <button
                        key={p.id}
                        className="dn-parent-option"
                        onClick={() => { setSelectedParentId(p.id); setParentSearch(''); }}
                      >
                        <div className="dn-user-avatar">
                          {p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="dn-user-name">{p.name}</div>
                          <div className="dn-user-sub">{p.phone} &middot; {parentRole === 'Partner Admin' ? 'Partner Admin' : pRole === 'Dealer' ? 'Dealer' : pRole === 'Sub-dealer' ? 'Sub-dealer' : 'Promoter'}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
            {selectedParent && derivedRole && (
              <>
                <div className="dn-derived-pill">
                  <span>This person will be added as a</span>
                  <span className={`dn-role-pill ${roleClass(derivedRole)}`}>{derivedRole}</span>
                </div>
                <div className="dn-field-hint">
                  Reports to {getParentName(users, selectedParent.id)} ({selectedParent.phone})
                  <button className="dn-link-btn" onClick={() => setSelectedParentId(null)}>Change</button>
                </div>
              </>
            )}
          </div>

          <div className="dn-field">
            <label>Pincode <span className="dn-field-optional">(optional)</span></label>
            <input
              className="dn-input"
              placeholder="6-digit pincode"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>
        </div>

        <div className="dn-modal-footer">
          <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="dn-btn-primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? <><Spinner size={14} /> Adding…</> : 'Add user'}
          </button>
        </div>
      </div>
    </div>
  );
}
