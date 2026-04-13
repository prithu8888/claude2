import { useState } from 'react';
import { cfgs as seedCfgs, cfgById, calc, agents, ME, meConfigHistory, type Cfg, type ConfigLevel, type ConfigType, type Slab } from './data';

export default function AdminConfig({ initialPrefill, onToast }: { initialPrefill?: Partial<Cfg>; onToast: (msg: string) => void }) {
  const [cfgs, setCfgs] = useState(seedCfgs);
  const [tab, setTab] = useState<'create' | 'history'>('create');
  const [filter, setFilter] = useState<ConfigLevel | 'all'>('all');
  const [edit, setEdit] = useState<Partial<Cfg> | null>(initialPrefill ?? null);

  const filtered = cfgs.filter((c) => filter === 'all' || c.level === filter);

  const save = () => {
    if (!edit?.name) { onToast('Config needs a name'); return; }
    const id = edit.id ?? `c${Date.now()}`;
    const final: Cfg = {
      id, name: edit.name, level: edit.level ?? 'partner', scope: edit.scope ?? 'Oppo India',
      type: edit.type ?? 'flat', flatRate: edit.flatRate, percentRate: edit.percentRate, slabs: edit.slabs,
      effectiveFrom: edit.effectiveFrom ?? new Date().toISOString().slice(0, 10),
      effectiveTo: edit.effectiveTo ?? null, status: edit.status ?? 'draft',
    };
    setCfgs((p) => p.find((x) => x.id === id) ? p.map((x) => x.id === id ? final : x) : [final, ...p]);
    onToast(`Config "${final.name}" ${final.status === 'active' ? 'activated' : 'saved as draft'}`);
    setEdit(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="ii-h1" style={{ margin: 0 }}>Incentive configs</h1>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 3, borderRadius: 6 }}>
          <button className={`ii-seg-btn ${tab === 'create' ? 'active' : ''}`} onClick={() => setTab('create')}>Create / Edit</button>
          <button className={`ii-seg-btn ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
        </div>
      </div>

      {tab === 'create' && (
        <div className="ii-cfg-grid">
          <div>
            <div className="ii-filter">
              {(['all', 'partner', 'state', 'dealer', 'agent'] as const).map((l) => (
                <button key={l} className={`ii-chip ${filter === l ? 'active' : ''}`} onClick={() => setFilter(l)}>
                  {l === 'all' ? 'All levels' : l[0].toUpperCase() + l.slice(1)}
                </button>
              ))}
              <button className="ii-btn ii-btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setEdit({ name: '', level: 'partner', type: 'flat', status: 'draft' })}>+ Create new</button>
            </div>
            {filtered.map((c) => (
              <div key={c.id} className="ii-cfg-card">
                <div className="ii-cfg-top">
                  <div>
                    <div className="ii-strong">{c.name}</div>
                    <div className="ii-muted">{c.scope}</div>
                  </div>
                  <div>
                    <span className={`ii-pill ${c.level}`}>{c.level}</span>
                    <span className={`ii-pill ${c.type}`}>{c.type}</span>
                    <span className={`ii-pill ${c.status}`}>{c.status}</span>
                  </div>
                </div>
                <div className="ii-cfg-body">
                  {c.type === 'flat' && `Rs.${c.flatRate} per policy`}
                  {c.type === 'percentage' && `${c.percentRate}% of premium`}
                  {c.type === 'slab' && c.slabs?.map((s) => `${s.from}-${s.to ?? '+'}: Rs.${s.rate}`).join(' · ')}
                </div>
                <div className="ii-cfg-foot">
                  <span>Effective {c.effectiveFrom} → {c.effectiveTo ?? 'ongoing'}</span>
                  <div>
                    <button className="ii-link" onClick={() => setEdit(c)}>Edit</button>
                    <button className="ii-link" onClick={() => setEdit({ ...c, id: undefined, name: `${c.name} (copy)`, status: 'draft' })}>Duplicate</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="ii-card" style={{ position: 'sticky', top: 80 }}>
            {!edit ? (
              <>
                <h3>Select or create a config</h3>
                <p className="ii-muted" style={{ fontSize: 12 }}>Pick a config on the left or click "Create new" to start.</p>
              </>
            ) : (
              <ConfigForm config={edit} onChange={setEdit} onSave={save} onCancel={() => setEdit(null)} />
            )}
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="ii-card">
          <h3>Rajesh Kumar — config history</h3>
          <table className="ii-tbl">
            <thead><tr><th>Config</th><th>Level</th><th>From</th><th>To</th><th>Earned</th></tr></thead>
            <tbody>
              {meConfigHistory.map((h, i) => (
                <tr key={i}>
                  <td>{h.name}</td>
                  <td><span className={`ii-pill ${h.level}`}>{h.level}</span></td>
                  <td>{h.from}</td>
                  <td>{h.to}</td>
                  <td>Rs.{h.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ConfigForm({ config, onChange, onSave, onCancel }: { config: Partial<Cfg>; onChange: (c: Partial<Cfg>) => void; onSave: () => void; onCancel: () => void }) {
  const set = <K extends keyof Cfg>(k: K, v: Cfg[K]) => onChange({ ...config, [k]: v });
  const type = config.type ?? 'flat';
  const slabs: Slab[] = config.slabs ?? [{ from: 1, to: 10, rate: 40 }];
  const me = agents.find((a) => a.id === ME)!;
  const currentCfg = cfgById(me.activeConfigId)!;
  const currentEarn = calc(me.monthPolicies, currentCfg).total;
  const previewEarn = config.type ? calc(me.monthPolicies, { ...currentCfg, ...(config as Cfg) }).total : 0;

  return (
    <div className="ii-form">
      <h3 style={{ margin: 0 }}>{config.id ? 'Edit config' : 'Create config'}</h3>
      <div className="ii-fld"><label>Config name</label><input className="ii-input" value={config.name ?? ''} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="ii-fld">
        <label>Level</label>
        <select className="ii-select" value={config.level ?? 'partner'} onChange={(e) => set('level', e.target.value as ConfigLevel)}>
          <option value="partner">Partner</option><option value="state">State</option><option value="dealer">Dealer</option><option value="agent">Agent</option>
        </select>
      </div>
      <div className="ii-fld"><label>Scope</label><input className="ii-input" value={config.scope ?? ''} onChange={(e) => set('scope', e.target.value)} placeholder={config.level === 'agent' ? 'Agent name or phone' : config.level === 'dealer' ? 'Dealer name' : 'Oppo India'} /></div>
      <div className="ii-fld">
        <label>Incentive type</label>
        <div className="ii-radio-row">
          {(['flat', 'percentage', 'slab'] as ConfigType[]).map((t) => (
            <label key={t} className={`ii-radio ${type === t ? 'active' : ''}`}>
              <input type="radio" checked={type === t} onChange={() => set('type', t)} /> {t}
            </label>
          ))}
        </div>
      </div>
      {type === 'flat' && <div className="ii-fld"><label>Rs. per policy</label><input className="ii-input" type="number" value={config.flatRate ?? ''} onChange={(e) => set('flatRate', parseInt(e.target.value, 10) || 0)} /></div>}
      {type === 'percentage' && <div className="ii-fld"><label>% of premium</label><input className="ii-input" type="number" step="0.1" value={config.percentRate ?? ''} onChange={(e) => set('percentRate', parseFloat(e.target.value) || 0)} /></div>}
      {type === 'slab' && (
        <div className="ii-fld">
          <label>Slabs</label>
          <div className="ii-slab-rows">
            {slabs.map((s, i) => (
              <div key={i} className="ii-slab-row">
                <input className="ii-input" type="number" placeholder="From" value={s.from} onChange={(e) => { const n = [...slabs]; n[i] = { ...s, from: parseInt(e.target.value, 10) || 0 }; set('slabs', n); }} />
                <input className="ii-input" type="number" placeholder="To" value={s.to ?? ''} onChange={(e) => { const n = [...slabs]; n[i] = { ...s, to: e.target.value ? parseInt(e.target.value, 10) : null }; set('slabs', n); }} />
                <input className="ii-input" type="number" placeholder="Rate" value={s.rate} onChange={(e) => { const n = [...slabs]; n[i] = { ...s, rate: parseInt(e.target.value, 10) || 0 }; set('slabs', n); }} />
                <button className="ii-link" onClick={() => set('slabs', slabs.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            <button className="ii-link" onClick={() => set('slabs', [...slabs, { from: (slabs[slabs.length - 1]?.to ?? 0) + 1, to: null, rate: 0 }])}>+ Add slab</button>
          </div>
        </div>
      )}
      <div className="ii-row2">
        <div className="ii-fld"><label>Effective from</label><input className="ii-input" type="date" value={config.effectiveFrom ?? ''} onChange={(e) => set('effectiveFrom', e.target.value)} /></div>
        <div className="ii-fld"><label>Effective to</label><input className="ii-input" type="date" value={config.effectiveTo ?? ''} onChange={(e) => set('effectiveTo', e.target.value || null)} /></div>
      </div>
      <div className="ii-fld">
        <label>Status</label>
        <div className="ii-radio-row">
          <label className={`ii-radio ${config.status === 'draft' ? 'active' : ''}`}><input type="radio" checked={config.status === 'draft'} onChange={() => set('status', 'draft')} /> Save as draft</label>
          <label className={`ii-radio ${config.status === 'active' ? 'active' : ''}`}><input type="radio" checked={config.status === 'active'} onChange={() => set('status', 'active')} /> Activate immediately</label>
        </div>
      </div>
      <div className="ii-preview">
        <strong>How this applies to Rajesh Kumar right now:</strong>
        <div className="ii-preview-row"><span>Current ({currentCfg.name})</span><strong>Rs.{currentEarn}</strong></div>
        <div className="ii-preview-row"><span>This config at {me.monthPolicies} policies</span><strong style={{ color: 'var(--blue)' }}>Rs.{previewEarn}</strong></div>
        {config.status === 'active' && <div style={{ fontSize: 11, color: 'var(--grey)', marginTop: 6 }}>This will become Rajesh's active config from {config.effectiveFrom || 'today'}.</div>}
      </div>
      <div className="ii-form-actions">
        <button className="ii-btn ii-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="ii-btn ii-btn-primary" onClick={onSave}>Save config</button>
      </div>
    </div>
  );
}
