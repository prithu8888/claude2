import { useMemo, useState } from 'react';
import {
  deriveRole,
  getChildren,
  suggestReassignments,
  type NetworkUser,
} from './mockUsers';
import Spinner from '../shared/Spinner';

interface Props {
  users: NetworkUser[];
  target: NetworkUser;
  onClose: () => void;
  onConfirm: (
    userId: string,
    option: 'auto' | 'manual' | 'none',
    reassignments: { childId: string; newParentId: string | null }[],
    reassignmentTargetName?: string,
  ) => void;
}

type Option = 'auto' | 'manual' | 'none';

export default function DeactivateModal({ users, target, onClose, onConfirm }: Props) {
  const directChildren = useMemo(() => getChildren(users, target.id), [users, target]);
  const hasChildren = directChildren.length > 0;
  const role = deriveRole(users, target);

  const suggestions = useMemo(() => suggestReassignments(users, target, 2), [users, target]);

  const [option, setOption] = useState<Option | null>(hasChildren ? null : 'none');
  const [reassignTargetId, setReassignTargetId] = useState<string | null>(
    suggestions[0]?.id ?? null,
  );
  const [loading, setLoading] = useState(false);

  const topSuggestion = suggestions.find((s) => s.id === reassignTargetId) ?? suggestions[0];

  const confirm = () => {
    if (!option) return;
    setLoading(true);
    setTimeout(() => {
      let reassignments: { childId: string; newParentId: string | null }[] = [];
      let targetName: string | undefined;
      if (option === 'auto' && topSuggestion) {
        reassignments = directChildren.map((c) => ({ childId: c.id, newParentId: topSuggestion.id }));
        targetName = topSuggestion.name;
      } else if (option === 'none') {
        reassignments = directChildren.map((c) => ({ childId: c.id, newParentId: null }));
      }
      onConfirm(target.id, option, reassignments, targetName);
      setLoading(false);
    }, 700);
  };

  const suggestionChildrenCount = (u: NetworkUser) => getChildren(users, u.id).length;

  return (
    <div className="dn-backdrop dn-backdrop-center" onClick={onClose}>
      <div className="dn-modal dn-modal-deactivate" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header dn-modal-header-amber">
          <div>
            <div className="dn-modal-title">Deactivate {target.name}?</div>
            <div className="dn-modal-sub">{role} &middot; {target.phone}</div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="dn-modal-body">
          {!hasChildren ? (
            <div className="dn-impact-none">
              This user has no one reporting to them. They will simply lose access to MPOS.
            </div>
          ) : (
            <>
              <div className="dn-impact-amber">
                <div>
                  <strong>Deactivating {target.name} will affect {directChildren.length} {directChildren.length === 1 ? 'person' : 'people'} who currently report to them:</strong>
                  <ul className="dn-impact-list">
                    {directChildren.map((c) => (
                      <li key={c.id}>
                        {c.name} <span className="dn-impact-role">({deriveRole(users, c)})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="dn-impact-sub">
                    These users will lose their manager and won’t be able to sell until reassigned.
                  </div>
                </div>
              </div>

              {suggestions.length > 0 && (
                <>
                  <div className="dn-reassign-section-title">Suggested reassignments</div>
                  <div className="dn-reassign-grid">
                    {suggestions.map((s) => {
                      const selected = reassignTargetId === s.id;
                      const sRole = deriveRole(users, s);
                      return (
                        <label key={s.id} className={`dn-reassign-radio-card ${selected ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="reassign-target"
                            checked={selected}
                            onChange={() => {
                              setReassignTargetId(s.id);
                              setOption('auto');
                            }}
                          />
                          <div className="dn-reassign-card-body">
                            <div className="dn-reassign-card-top">
                              <div className="dn-user-name">{s.name}</div>
                              <span className={`dn-role-pill ${sRole === 'Dealer' ? 'role-dealer' : sRole === 'Sub-dealer' ? 'role-subdealer' : 'role-promoter'}`}>
                                {sRole}
                              </span>
                            </div>
                            <div className="dn-reassign-card-meta">
                              Currently manages {suggestionChildrenCount(s)} {suggestionChildrenCount(s) === 1 ? 'person' : 'people'}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}

              <div className="dn-reassign-section-title">Choose how to handle their reports</div>
              <div className="dn-deactivate-options">
                <label className={`dn-option-radio ${option === 'auto' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deactivate-option"
                    checked={option === 'auto'}
                    onChange={() => setOption('auto')}
                  />
                  <div>
                    <strong>Reassign {directChildren.map((c) => c.name).join(' and ')} to {topSuggestion?.name ?? 'top suggestion'}</strong>
                    <small>
                      They’ll continue reporting to a {topSuggestion ? deriveRole(users, topSuggestion) : 'peer'} under {target.name}’s manager.
                    </small>
                  </div>
                </label>

                <label className={`dn-option-radio ${option === 'manual' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deactivate-option"
                    checked={option === 'manual'}
                    onChange={() => setOption('manual')}
                  />
                  <div>
                    <strong>I’ll reassign them manually later</strong>
                    <small>They won’t be able to sell until you reassign them.</small>
                  </div>
                </label>

                <label className={`dn-option-radio dn-option-danger ${option === 'none' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="deactivate-option"
                    checked={option === 'none'}
                    onChange={() => setOption('none')}
                  />
                  <div>
                    <strong>Deactivate without reassigning</strong>
                    <small>Not recommended — creates orphaned users.</small>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        <div className="dn-modal-footer">
          <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="dn-btn-danger"
            onClick={confirm}
            disabled={loading || (hasChildren && !option)}
          >
            {loading ? <><Spinner size={14} /> Deactivating…</> : 'Confirm deactivation'}
          </button>
        </div>
      </div>
    </div>
  );
}
