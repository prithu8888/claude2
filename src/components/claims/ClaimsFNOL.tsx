import { useState } from 'react';
import { claims, sales, getProductById, getPlanById } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import type { Claim } from '../../types/mpos';
import FraudGate from '../agents/FraudGate';
import ClaimConcierge from '../agents/ClaimConcierge';
import './ClaimsFNOL.css';

type Step = 'lookup' | 'coverage' | 'incident' | 'success';

interface IncidentForm {
  type: Claim['type'];
  description: string;
  date: string;
  estimatedAmount: string;
}

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved':
    case 'settled':
      return 'badge badge-success';
    case 'submitted':
    case 'under-review':
      return 'badge badge-warning';
    case 'rejected':
      return 'badge badge-error';
    case 'draft':
      return 'badge badge-info';
    default:
      return 'badge';
  }
}

function generateClaimRef(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CLM-2026-${num}`;
}

export default function ClaimsFNOL() {
  const { activeVertical } = useAppStore();
  const isEV = activeVertical.startsWith('ev-');

  const [step, setStep] = useState<Step>('lookup');
  const [identifier, setIdentifier] = useState('');
  const [lookupError, setLookupError] = useState('');
  const [matchedSaleId, setMatchedSaleId] = useState<string | null>(null);
  const [claimRef, setClaimRef] = useState('');
  const [jobCardFile, setJobCardFile] = useState<string | null>(null);

  const [incidentForm, setIncidentForm] = useState<IncidentForm>({
    type: isEV ? 'accident' : 'damage',
    description: '',
    date: '',
    estimatedAmount: '',
  });

  const identifierLabel = isEV ? 'VIN' : 'IMEI';
  const identifierPlaceholder = isEV ? 'e.g. ME4AT450X0001234' : 'e.g. 356938035643809';

  const handleLookup = () => {
    setLookupError('');
    const found = sales.find(s => s.deviceIdentifier === identifier.trim() && s.status === 'completed');
    if (found) {
      setMatchedSaleId(found.id);
      setStep('coverage');
    } else {
      setLookupError(`No active policy found for ${identifierLabel}: ${identifier}`);
    }
  };

  const matchedSale = matchedSaleId ? sales.find(s => s.id === matchedSaleId) : null;
  const matchedProduct = matchedSale ? getProductById(matchedSale.productId) : null;
  const matchedPlan = matchedSale ? getPlanById(matchedSale.planId) : null;

  const handleFileClaim = () => {
    const ref = generateClaimRef();
    setClaimRef(ref);
    setStep('success');
  };

  const handleReset = () => {
    setStep('lookup');
    setIdentifier('');
    setLookupError('');
    setMatchedSaleId(null);
    setClaimRef('');
    setJobCardFile(null);
    setIncidentForm({
      type: isEV ? 'accident' : 'damage',
      description: '',
      date: '',
      estimatedAmount: '',
    });
  };

  const isIncidentValid =
    incidentForm.description.trim().length > 0 &&
    incidentForm.date.trim().length > 0 &&
    incidentForm.estimatedAmount.trim().length > 0;

  return (
    <div className="claims-page">
      <h2 className="claims-title">File a Claim (FNOL)</h2>

      {/* Stepper */}
      {step !== 'success' && (
        <div className="claims-stepper">
          <div className={`claims-step ${step === 'lookup' ? 'claims-step-active' : 'claims-step-done'}`}>
            <span className="claims-step-num">1</span>
            <span className="claims-step-label">Policy Lookup</span>
          </div>
          <div className="claims-step-line" />
          <div className={`claims-step ${step === 'coverage' ? 'claims-step-active' : step === 'incident' ? 'claims-step-done' : ''}`}>
            <span className="claims-step-num">2</span>
            <span className="claims-step-label">Coverage</span>
          </div>
          <div className="claims-step-line" />
          <div className={`claims-step ${step === 'incident' ? 'claims-step-active' : ''}`}>
            <span className="claims-step-num">3</span>
            <span className="claims-step-label">Incident</span>
          </div>
        </div>
      )}

      {/* Step 1: Lookup */}
      {step === 'lookup' && (
        <div className="claims-step-content card">
          <h3 className="claims-step-title">Policy Lookup by {identifierLabel}</h3>
          <p className="claims-step-desc">
            Enter the {isEV ? 'Vehicle Identification Number (VIN)' : 'IMEI number'} to find the associated policy.
          </p>
          <div className="claims-form-group">
            <label className="claims-label">{identifierLabel} Number</label>
            <input
              type="text"
              className="input-field"
              placeholder={identifierPlaceholder}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            {lookupError && <span className="claims-error">{lookupError}</span>}
          </div>
          <button
            className="btn-primary claims-action-btn"
            onClick={handleLookup}
            disabled={!identifier.trim()}
          >
            Look Up Policy
          </button>
        </div>
      )}

      {/* Step 2: Coverage */}
      {step === 'coverage' && matchedSale && matchedProduct && matchedPlan && (
        <div className="claims-step-content card">
          <h3 className="claims-step-title">Coverage Check</h3>
          <div className="claims-coverage-card">
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">Product</span>
              <span className="claims-coverage-value">{matchedProduct.name}</span>
            </div>
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">Plan</span>
              <span className="claims-coverage-value">{matchedPlan.name}</span>
            </div>
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">Tenure</span>
              <span className="claims-coverage-value">{matchedPlan.tenure}</span>
            </div>
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">Premium Paid</span>
              <span className="claims-coverage-value">{formatCurrency(matchedPlan.premium)}</span>
            </div>
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">{identifierLabel}</span>
              <span className="claims-coverage-value">{matchedSale.deviceIdentifier}</span>
            </div>
            <div className="claims-coverage-row">
              <span className="claims-coverage-label">Purchase Date</span>
              <span className="claims-coverage-value">{formatDate(matchedSale.date)}</span>
            </div>
            <div className="claims-coverage-section">
              <span className="claims-coverage-label">Coverage Includes</span>
              <ul className="claims-coverage-list">
                {matchedPlan.coverage.map((item, i) => (
                  <li key={i} className="claims-coverage-list-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--success)">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7 7a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.44l6.47-6.47a.75.75 0 011.06 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="claims-btn-group">
            <button className="btn-secondary" onClick={() => setStep('lookup')}>Back</button>
            <button className="btn-primary" onClick={() => setStep('incident')}>Continue</button>
          </div>
        </div>
      )}

      {/* Step 3: Incident Details */}
      {step === 'incident' && (
        <div className="claims-step-content card">
          <h3 className="claims-step-title">Incident Details</h3>

          <div className="claims-form-group">
            <label className="claims-label">Incident Type</label>
            <select
              className="select-field"
              value={incidentForm.type}
              onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value as Claim['type'] })}
            >
              {isEV ? (
                <>
                  <option value="accident">Accident</option>
                  <option value="theft">Theft</option>
                  <option value="damage">Damage</option>
                </>
              ) : (
                <>
                  <option value="damage">Damage</option>
                  <option value="malfunction">Malfunction</option>
                  <option value="theft">Theft</option>
                </>
              )}
            </select>
          </div>

          <div className="claims-form-group">
            <label className="claims-label">Date of Incident</label>
            <input
              type="date"
              className="input-field"
              value={incidentForm.date}
              onChange={(e) => setIncidentForm({ ...incidentForm, date: e.target.value })}
            />
          </div>

          <div className="claims-form-group">
            <label className="claims-label">Description</label>
            <textarea
              className="input-field claims-textarea"
              rows={4}
              placeholder="Describe the incident in detail..."
              value={incidentForm.description}
              onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
            />
          </div>

          <div className="claims-form-group">
            <label className="claims-label">Estimated Claim Amount ({'₹'})</label>
            <input
              type="number"
              className="input-field"
              placeholder="e.g. 12000"
              value={incidentForm.estimatedAmount}
              onChange={(e) => setIncidentForm({ ...incidentForm, estimatedAmount: e.target.value })}
            />
          </div>

          {isEV && (
            <div className="claims-form-group">
              <label className="claims-label">Job Card Upload</label>
              <div
                className={`claims-upload-zone ${jobCardFile ? 'claims-upload-zone-filled' : ''}`}
                onClick={() => setJobCardFile('job_card_' + Date.now() + '.pdf')}
              >
                {jobCardFile ? (
                  <div className="claims-upload-done">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--success)" stroke="var(--success)" strokeWidth="0">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{jobCardFile}</span>
                  </div>
                ) : (
                  <div className="claims-upload-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>Tap to upload job card (PDF/Image)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isIncidentValid && (
            <FraudGate
              claimAmount={Number(incidentForm.estimatedAmount) || 0}
              claimType={incidentForm.type}
            />
          )}

          <div className="claims-btn-group">
            <button className="btn-secondary" onClick={() => setStep('coverage')}>Back</button>
            <button
              className="btn-primary"
              onClick={handleFileClaim}
              disabled={!isIncidentValid}
            >
              File Claim
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {step === 'success' && (
        <div className="claims-success card">
          <div className="claims-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="claims-success-title">Claim Filed Successfully</h3>
          <p className="claims-success-ref">Reference: <strong>{claimRef}</strong></p>
          <p className="claims-success-desc">
            Your claim has been submitted and is under review. You will be notified once the claim is processed.
          </p>
          <ClaimConcierge claimRef={claimRef} />
          <button className="btn-primary" onClick={handleReset}>File Another Claim</button>
        </div>
      )}

      {/* Existing Claims */}
      <div className="claims-existing">
        <h3 className="claims-existing-title">Existing Claims</h3>
        <div className="claims-existing-list">
          {claims.map((cl: Claim) => (
            <div key={cl.id} className="claims-existing-row card">
              <div className="claims-existing-top">
                <span className="claims-existing-id">{cl.id.toUpperCase()}</span>
                <span className={getStatusBadgeClass(cl.status)}>{cl.status.replace('-', ' ')}</span>
              </div>
              <div className="claims-existing-body">
                <span className="claims-existing-type">{cl.type}</span>
                <span className="claims-existing-desc">{cl.description}</span>
              </div>
              <div className="claims-existing-footer">
                <span className="claims-existing-date">{formatDate(cl.date)}</span>
                {cl.amount && <span className="claims-existing-amount">{formatCurrency(cl.amount)}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
