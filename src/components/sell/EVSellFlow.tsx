import { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { products } from '../../data/mockData';
import type { Product, Plan } from '../../types/mpos';
import './SellFlow.css';

const STEPS = ['Enter VIN', 'Vehicle Details', 'Select Plan', 'Confirm'];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function generatePolicyNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `POL-2026-${rand}`;
}

// Mock VIN lookup - returns vehicle details based on VIN prefix patterns
function lookupVIN(vin: string, matchedProduct: Product | null) {
  if (matchedProduct) {
    const yearMap: Record<string, number> = {
      'Ather 450X': 2026,
      'Ola S1 Pro': 2025,
      'Bajaj Chetak': 2026,
      'Tata Nexon EV': 2025,
    };
    const makeMap: Record<string, string> = {
      'Ather 450X': 'Ather Energy',
      'Ola S1 Pro': 'Ola Electric',
      'Bajaj Chetak': 'Bajaj Auto',
      'Tata Nexon EV': 'Tata Motors',
    };
    return {
      make: makeMap[matchedProduct.name] ?? 'Unknown',
      model: matchedProduct.name,
      year: yearMap[matchedProduct.name] ?? 2026,
      category: matchedProduct.category,
      vin,
    };
  }
  return {
    make: 'Unknown',
    model: 'Unknown EV',
    year: 2026,
    category: 'Electric Vehicle',
    vin,
  };
}

interface StepperProps {
  currentStep: number;
  steps: string[];
}

function StepperBar({ currentStep, steps }: StepperProps) {
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <div className="stepper-step" key={label}>
            {i > 0 && (
              <div className={`stepper-line${isCompleted || isActive ? ' completed' : ''}`} />
            )}
            <div className="stepper-node">
              <div
                className={`stepper-circle${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <span
                className={`stepper-label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EVSellFlow() {
  const { activeVertical } = useAppStore();

  const [step, setStep] = useState(1);
  const [vin, setVin] = useState('');
  const [vinError, setVinError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  const filteredProducts = useMemo(
    () => products.filter((p) => p.vertical === activeVertical),
    [activeVertical]
  );

  const vehicleDetails = useMemo(() => {
    if (vin.length === 17) {
      // Try to match to a product based on the first available one
      const matched = selectedProduct ?? filteredProducts[0] ?? null;
      return lookupVIN(vin, matched);
    }
    return null;
  }, [vin, selectedProduct, filteredProducts]);

  // Step 1 handlers
  const handleVinChange = (value: string) => {
    // VIN: alphanumeric, uppercase, 17 chars, no I/O/Q
    const cleaned = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    setVin(cleaned);
    setVinError('');
  };

  const handleStep1Next = () => {
    if (vin.length !== 17) {
      setVinError('VIN must be exactly 17 characters');
      return;
    }
    // Auto-select first product if only one
    if (filteredProducts.length === 1) {
      setSelectedProduct(filteredProducts[0]);
    }
    setStep(2);
  };

  // Step 2: show vehicle details + select product
  const handleStep2Next = () => {
    if (!selectedProduct) return;
    setStep(3);
  };

  // Step 3: select plan
  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  // Confirm
  const handleConfirm = () => {
    setPolicyNumber(generatePolicyNumber());
    setStep(5);
  };

  const handleNewSale = () => {
    setStep(1);
    setVin('');
    setVinError('');
    setSelectedProduct(null);
    setSelectedPlan(null);
    setOwnerName('');
    setOwnerPhone('');
    setOwnerEmail('');
    setPolicyNumber('');
  };

  // Success screen
  if (step === 5) {
    return (
      <div className="sell-flow">
        <div className="success-screen">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="success-title">Policy Issued!</h2>
          <p className="success-subtitle">
            The vehicle insurance policy has been successfully activated.
          </p>
          <div className="success-policy">
            <span className="success-policy-label">Policy No.</span>
            <span className="success-policy-number">{policyNumber}</span>
          </div>
          <div className="card" style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
            <div className="summary-title">Sale Summary</div>
            <div className="summary-row">
              <span className="summary-row-label">Vehicle</span>
              <span className="summary-row-value">{vehicleDetails?.model}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">VIN</span>
              <span className="summary-row-value">{vin}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Owner</span>
              <span className="summary-row-value">{ownerName}</span>
            </div>
            {selectedPlan && (
              <>
                <div className="summary-row">
                  <span className="summary-row-label">{selectedPlan.name}</span>
                  <span className="summary-row-value">
                    {formatCurrency(selectedPlan.premium)}
                  </span>
                </div>
                <div className="summary-row summary-total">
                  <span className="summary-row-label">Total Paid</span>
                  <span className="summary-row-value">
                    {formatCurrency(selectedPlan.premium)}
                  </span>
                </div>
              </>
            )}
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={handleNewSale}>
            Start New Sale
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sell-flow">
      <h1 className="sell-flow-title">New EV Insurance Sale</h1>
      <StepperBar currentStep={step} steps={STEPS} />

      {/* Step 1: Enter VIN */}
      {step === 1 && (
        <div className="step-content">
          <h2 className="step-heading">Enter Vehicle Identification Number</h2>
          <p className="step-subtext">
            Enter the 17-character VIN found on the vehicle registration certificate or chassis plate.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="vin-input">
              VIN Number
            </label>
            <input
              id="vin-input"
              className="input-field"
              type="text"
              placeholder="Enter 17-character VIN"
              value={vin}
              onChange={(e) => handleVinChange(e.target.value)}
              maxLength={17}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
            />
            <p className="form-hint">
              Format: 17 alphanumeric characters (e.g., ME4AT450X0001234A)
            </p>
            {vinError && <p className="form-error">{vinError}</p>}
          </div>
          <div className="step-actions">
            <button
              className="btn-primary"
              disabled={vin.length === 0}
              onClick={handleStep1Next}
            >
              Look Up Vehicle
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vehicle Details */}
      {step === 2 && (
        <div className="step-content">
          <h2 className="step-heading">Vehicle Details</h2>
          <p className="step-subtext">
            Confirm the vehicle details retrieved from VIN lookup.
          </p>

          {vehicleDetails && (
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="vehicle-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Make</span>
                  <span className="detail-value">{vehicleDetails.make}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Model</span>
                  <span className="detail-value">{vehicleDetails.model}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Year</span>
                  <span className="detail-value">{vehicleDetails.year}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{vehicleDetails.category}</span>
                </div>
                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="detail-label">VIN</span>
                  <span className="detail-value" style={{ fontFamily: 'monospace' }}>
                    {vehicleDetails.vin}
                  </span>
                </div>
              </div>
            </div>
          )}

          {filteredProducts.length > 1 && (
            <>
              <h3 className="step-heading" style={{ fontSize: 'var(--font-size-base)' }}>
                Select Vehicle
              </h3>
              <div className="product-list">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`card product-card${selectedProduct?.id === product.id ? ' selected' : ''}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="product-card-name">{product.name}</div>
                    <div className="product-card-meta">
                      <span>{product.category}</span>
                      <span className="product-card-price">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!selectedProduct}
              onClick={handleStep2Next}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Plan */}
      {step === 3 && selectedProduct && (
        <div className="step-content">
          <h2 className="step-heading">Select Insurance Plan</h2>
          <p className="step-subtext">
            Choose an insurance plan for {selectedProduct.name}.
          </p>
          <div className="plan-list">
            {selectedProduct.plans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`card plan-card${isSelected ? ' selected' : ''}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  <div className="plan-card-header">
                    <span className="plan-card-name">{plan.name}</span>
                    <span className="plan-card-premium">
                      {formatCurrency(plan.premium)}
                    </span>
                  </div>
                  <div className="plan-card-tenure">
                    <span className="badge badge-purple plan-type-badge">{plan.type}</span>
                    {' · '}
                    {plan.tenure}
                  </div>
                  <div className="plan-card-coverage">
                    {plan.coverage.map((item) => (
                      <span key={item} className="coverage-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!selectedPlan}
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Owner Details + Premium Summary + Confirm */}
      {step === 4 && selectedProduct && selectedPlan && (
        <div className="step-content">
          <h2 className="step-heading">Owner Details</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="owner-name">
              Full Name
            </label>
            <input
              id="owner-name"
              className="input-field"
              type="text"
              placeholder="Enter vehicle owner name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="owner-phone">
              Phone Number
            </label>
            <input
              id="owner-phone"
              className="input-field"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={ownerPhone}
              onChange={(e) =>
                setOwnerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="owner-email">
              Email (optional)
            </label>
            <input
              id="owner-email"
              className="input-field"
              type="email"
              placeholder="owner@example.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
            />
          </div>

          {/* Premium Summary */}
          <div className="card summary-card">
            <div className="summary-title">Premium Summary</div>
            <div className="summary-row">
              <span className="summary-row-label">Vehicle</span>
              <span className="summary-row-value">{selectedProduct.name}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">VIN</span>
              <span className="summary-row-value" style={{ fontFamily: 'monospace' }}>
                {vin}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">
                {selectedPlan.name}
                <span className="badge badge-purple" style={{ marginLeft: '8px' }}>
                  {selectedPlan.type}
                </span>
              </span>
              <span className="summary-row-value">
                {formatCurrency(selectedPlan.premium)}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Tenure</span>
              <span className="summary-row-value">{selectedPlan.tenure}</span>
            </div>
            <div className="summary-row summary-total">
              <span className="summary-row-label">Total Premium</span>
              <span className="summary-row-value">
                {formatCurrency(selectedPlan.premium)}
              </span>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep(3)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!ownerName.trim() || ownerPhone.length !== 10}
              onClick={handleConfirm}
            >
              Confirm & Issue Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
