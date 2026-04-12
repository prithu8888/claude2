import { useMemo, useRef, useState } from 'react';
import { validParentsFor, type NetworkGroup, type NetworkUser } from './mockUsers';
import Spinner from '../shared/Spinner';

interface Props {
  users: NetworkUser[];
  onClose: () => void;
  onSubmit: (user: NetworkUser) => void;
}

export default function AddUserModal({ users, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState<NetworkGroup>('Promoter');
  const [parentSearch, setParentSearch] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [pincode, setPincode] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const idCounter = useRef(0);

  const validParents = useMemo(() => {
    const list = validParentsFor(users, group);
    if (!parentSearch) return list;
    const q = parentSearch.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || p.phone.includes(q));
  }, [users, group, parentSearch]);

  const duplicatePhone = phone.length === 10 && users.some((u) => u.phone === phone);
  const phoneValid = phone.length === 10 && !duplicatePhone;
  const pincodeValid = pincode.length === 6;
  const needsParent = group !== 'Dealer';
  const canSubmit =
    !!name.trim() &&
    phoneValid &&
    pincodeValid &&
    (!needsParent || !!selectedParentId);

  const selectedParent = users.find((u) => u.id === selectedParentId);

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setTimeout(() => {
      idCounter.current += 1;
      const newUser: NetworkUser = {
        id: `new${idCounter.current}`,
        name: name.trim(),
        phone,
        group,
        parentId: needsParent ? selectedParentId : null,
        pincode,
        email: email.trim() || undefined,
        status: 'Active',
      };
      onSubmit(newUser);
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="dn-backdrop" onClick={onClose}>
      <div className="dn-slideover" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header">
          <div>
            <div className="dn-modal-title">Add user</div>
            <div className="dn-modal-sub">Add a single dealer, sub-dealer, or promoter to your network.</div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">\u2715</button>
        </div>

        <div className="dn-modal-body">
          <div className="dn-field">
            <label>Full name</label>
            <input
              className="dn-input"
              placeholder="e.g. Rahul Sharma"
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
                <span>\u2715</span> This phone number is already registered to {users.find((u) => u.phone === phone)?.name}.
              </div>
            )}
            {phoneValid && (
              <div className="dn-field-hint success">
                <span>\u2713</span> Phone number is available
              </div>
            )}
            {phone.length > 0 && phone.length < 10 && (
              <div className="dn-field-hint">{10 - phone.length} more digit{10 - phone.length !== 1 ? 's' : ''} needed</div>
            )}
          </div>

          <div className="dn-field">
            <label>Group</label>
            <select
              className="dn-select"
              value={group}
              onChange={(e) => {
                setGroup(e.target.value as NetworkGroup);
                setSelectedParentId(null);
                setParentSearch('');
              }}
            >
              <option value="Dealer">Dealer</option>
              <option value="Sub-dealer">Sub-dealer</option>
              <option value="Promoter">Promoter</option>
            </select>
            <div className="dn-field-hint">
              {group === 'Dealer' && 'Top of hierarchy \u2014 has no parent.'}
              {group === 'Sub-dealer' && 'Reports to a Dealer.'}
              {group === 'Promoter' && 'Reports to a Sub-dealer.'}
            </div>
          </div>

          {needsParent && (
            <div className="dn-field">
              <label>Parent {group === 'Sub-dealer' ? '(Dealer)' : '(Sub-dealer)'}</label>
              <input
                className="dn-input"
                placeholder={`Search ${group === 'Sub-dealer' ? 'dealers' : 'sub-dealers'} by name or phone`}
                value={selectedParent ? selectedParent.name : parentSearch}
                onChange={(e) => {
                  setParentSearch(e.target.value);
                  setSelectedParentId(null);
                }}
              />
              {!selectedParent && parentSearch && (
                <div className="dn-parent-list">
                  {validParents.length === 0 ? (
                    <div className="dn-parent-empty">No matches</div>
                  ) : (
                    validParents.slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        className="dn-parent-option"
                        onClick={() => {
                          setSelectedParentId(p.id);
                          setParentSearch('');
                        }}
                      >
                        <div className="dn-user-avatar">{p.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
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
          )}

          <div className="dn-field">
            <label>Pincode</label>
            <input
              className={`dn-input ${pincodeValid ? 'valid' : pincode.length > 0 && !pincodeValid ? 'invalid' : ''}`}
              placeholder="6-digit Indian postal code"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>

          <div className="dn-field">
            <label>Email <span className="dn-field-optional">(optional)</span></label>
            <input
              className="dn-input"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="dn-modal-footer">
          <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="dn-btn-primary" onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? <><Spinner size={14} /> Creating...</> : 'Add user'}
          </button>
        </div>
      </div>
    </div>
  );
}
