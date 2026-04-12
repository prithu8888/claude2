import { useMemo, useState } from 'react';
import { countDescendants, getChildren, type NetworkUser } from './mockUsers';
import Spinner from '../shared/Spinner';

interface Props {
  users: NetworkUser[];
  target: NetworkUser;
  onClose: () => void;
  onConfirm: (userId: string, reassignments: { childId: string; newParentId: string | null }[]) => void;
}

type Option = 'auto' | 'manual' | 'none';

export default function DeactivateModal({ users, target, onClose, onConfirm }: Props) {
  const [stage, setStage] = useState<'review' | 'confirming'>('review');
  const [chosenOption, setChosenOption] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);

  const directChildren = getChildren(users, target.id);
  const impact = countDescendants(users, target.id);

  // Suggest 3 other active dealers as potential reassignment targets
  const suggestions = useMemo(() => {
    return users
      .filter((u) => u.group === target.group && u.id !== target.id && u.status === 'Active')
      .slice(0, 3)
      .map((u) => ({
        user: u,
        currentChildren: getChildren(users, u.id).length,
      }));
  }, [users, target]);

  const topSuggestion = suggestions[0];

  const confirm = () => {
    setLoading(true);
    setTimeout(() => {
      let reassignments: { childId: string; newParentId: string | null }[] = [];
      if (chosenOption === 'auto' && topSuggestion) {
        reassignments = directChildren.map((c) => ({ childId: c.id, newParentId: topSuggestion.user.id }));
      } else if (chosenOption === 'none') {
        reassignments = directChildren.map((c) => ({ childId: c.id, newParentId: null }));
      }
      // 'manual' leaves the children where they are (orphaned pointer to inactive parent, operator will handle)
      onConfirm(target.id, reassignments);
      setLoading(false);
    }, 800);
  };

  const reassignToCard = (targetUser: NetworkUser) => {
    setLoading(true);
    setTimeout(() => {
      const reassignments = directChildren.map((c) => ({ childId: c.id, newParentId: targetUser.id }));
      onConfirm(target.id, reassignments);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="dn-backdrop dn-backdrop-center" onClick={onClose}>
      <div className="dn-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dn-modal-header">
          <div>
            <div className="dn-modal-title">Review impact before deactivating</div>
            <div className="dn-modal-sub">{target.name} \u00b7 {target.group}</div>
          </div>
          <button className="dn-close" onClick={onClose} aria-label="Close">\u2715</button>
        </div>

        <div className="dn-modal-body">
          {stage === 'review' && (
            <>
              <div className="dn-warn-banner">
                <span>\u26A0</span>
                <div>
                  <strong>This change affects other users in your network.</strong>
                  <div style={{ marginTop: 4 }}>
                    Deactivating <strong>{target.name}</strong> will affect{' '}
                    <strong>{impact.subDealers} sub-dealer{impact.subDealers !== 1 ? 's' : ''}</strong> and{' '}
                    <strong>{impact.promoters} promoter{impact.promoters !== 1 ? 's' : ''}</strong> who currently report to them.
                  </div>
                </div>
              </div>

              <div className="dn-impact-box">
                Pick how you\u2019d like to handle their downstream users. You can auto-reassign all of them to another active {target.group.toLowerCase()}, handle it manually later, or deactivate without reassignment.
                <div className="dn-impact-stats">
                  <div className="dn-impact-stat">
                    <strong>{directChildren.length}</strong>
                    <span>Direct reports</span>
                  </div>
                  <div className="dn-impact-stat">
                    <strong>{impact.subDealers}</strong>
                    <span>Sub-dealers</span>
                  </div>
                  <div className="dn-impact-stat">
                    <strong>{impact.promoters}</strong>
                    <span>Promoters</span>
                  </div>
                </div>
              </div>

              <div className="dn-reassign-section-title">Suggested reassignments</div>
              <div className="dn-reassign-grid">
                {suggestions.map((s, i) => (
                  <div key={s.user.id} className={`dn-reassign-card ${i === 0 ? 'recommended' : ''}`}>
                    <div className="dn-reassign-card-left">
                      <div className="dn-user-avatar">{s.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
                      <div>
                        <div className="dn-user-name">{s.user.name}</div>
                        <div className="dn-user-sub">
                          {s.user.phone} \u00b7 {s.currentChildren} direct report{s.currentChildren !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="dn-reassign-card-right">
                      {i === 0 && <span className="dn-recommended-chip">Recommended</span>}
                      <button className="dn-btn-secondary" onClick={() => reassignToCard(s.user)} disabled={loading}>
                        Reassign all here
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dn-deactivate-options">
                <button
                  className="dn-option-btn primary"
                  onClick={() => { setChosenOption('auto'); setStage('confirming'); }}
                  disabled={!topSuggestion}
                >
                  <div>
                    Auto-reassign to {topSuggestion?.user.name ?? 'top suggestion'}
                    <small>Moves all {directChildren.length} direct report{directChildren.length !== 1 ? 's' : ''} to the recommended dealer</small>
                  </div>
                  <span>\u2192</span>
                </button>
                <button
                  className="dn-option-btn"
                  onClick={() => { setChosenOption('manual'); setStage('confirming'); }}
                >
                  <div>
                    I\u2019ll handle reassignment manually
                    <small>Children keep their current parent; you can reassign them one-by-one</small>
                  </div>
                  <span>\u2192</span>
                </button>
                <button
                  className="dn-option-btn danger"
                  onClick={() => { setChosenOption('none'); setStage('confirming'); }}
                >
                  <div>
                    Deactivate without reassigning
                    <small>Not recommended \u2014 downstream users will have no active parent</small>
                  </div>
                  <span>\u2192</span>
                </button>
              </div>
            </>
          )}

          {stage === 'confirming' && (
            <div>
              <div className="dn-warn-banner">
                <span>\u26A0</span>
                <div>
                  <strong>Confirm deactivation</strong>
                  <div style={{ marginTop: 4 }}>
                    {chosenOption === 'auto' && (
                      <>
                        Deactivate <strong>{target.name}</strong> and move their {directChildren.length} direct report{directChildren.length !== 1 ? 's' : ''} to <strong>{topSuggestion?.user.name}</strong>.
                      </>
                    )}
                    {chosenOption === 'manual' && (
                      <>
                        Deactivate <strong>{target.name}</strong>. You\u2019ll handle the {directChildren.length} affected user{directChildren.length !== 1 ? 's' : ''} manually.
                      </>
                    )}
                    {chosenOption === 'none' && (
                      <>
                        Deactivate <strong>{target.name}</strong> and leave {directChildren.length} user{directChildren.length !== 1 ? 's' : ''} without an active parent. Sales to these users will be blocked.
                      </>
                    )}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--dn-text-secondary)', marginTop: 'var(--space-4)' }}>
                This action can be reversed \u2014 reactivating the user will restore all current hierarchy links.
              </p>
            </div>
          )}
        </div>

        <div className="dn-modal-footer">
          {stage === 'review' ? (
            <button className="dn-btn-ghost" onClick={onClose}>Cancel</button>
          ) : (
            <>
              <button className="dn-btn-ghost" onClick={() => setStage('review')} disabled={loading}>Back</button>
              <button className="dn-btn-danger" onClick={confirm} disabled={loading}>
                {loading ? <><Spinner size={14} /> Deactivating\u2026</> : `Confirm & deactivate`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
