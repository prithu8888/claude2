import { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { products } from '../../data/mockData';
import type { Product, Plan } from '../../types/mpos';
import './SellFlow.css';

const STEPS = ['Scan IMEI', 'Select Product', 'Select Plans', 'Confirm'];

function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

function generatePolicyNumber(): string {
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `POL-2026-${rand}`;
}

interface Stepper {
  currentStep: number;
  steps: string[];
}

function StepperBar({ currentStep, steps }: Stepper) {
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

export default function ElectronicsSellFlow() {
  const { activeVertical } = useAppStore();

  const [step, setStep] = useState(1);
  const [imei, setImei] = useState('');
  const [imeiError, setImeiError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');

  const filteredProducts = useMemo(
    () => products.filter((p) => p.vertical === activeVertical),
    [activeVertical]
  );

  const totalPremium = useMemo(
    () => selectedPlans.reduce((sum, plan) => sum + plan.premium, 0),
    [selectedPlans]
  );

  // Step 1 handlers
  const validateImei = (value: string) => {
    setImei(value.replace(/\D/g, '').slice(0, 15));
    setImeiError('');
  };

  const handleStep1Next = () => {
    if (imei.length !== 15) {
      setImeiError('IMEI must be exactly 15 digits');
      return;
    }
    setStep(2);
  };

  // Step 2 handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedPlans([]);
  };

  // Step 3 handlers
  const togglePlan = (plan: Plan) => {
    setSelectedPlans((prev) =>
      prev.find((p) => p.id === plan.id)
        ? prev.filter((p) => p.id !== plan.id)
        : [...prev, plan]
    );
  };

  // Confirm
  const handleConfirm = () => {
    setPolicyNumber(generatePolicyNumber());
    setStep(5);
  };

  const handleNewSale = () => {
    setStep(1);
    setImei('');
    setImeiError('');
    setSelectedProduct(null);
    setSelectedPlans([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
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
            The protection plan has been successfully activated.
          </p>
          <div className="success-policy">
            <span className="success-policy-label">Policy No.</span>
            <span className="success-policy-number">{policyNumber}</span>
          </div>
          <div className="card" style={{ width: '100%', marginBottom: 'var(--space-4)' }}>
            <div className="summary-title">Sale Summary</div>
            <div className="summary-row">
              <span className="summary-row-label">Product</span>
              <span className="summary-row-value">{selectedProduct?.name}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">IMEI</span>
              <span className="summary-row-value">{imei}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">Customer</span>
              <span className="summary-row-value">{customerName}</span>
            </div>
            {selectedPlans.map((plan) => (
              <div className="summary-row" key={plan.id}>
                <span className="summary-row-label">{plan.name}</span>
                <span className="summary-row-value">{formatCurrency(plan.premium)}</span>
              </div>
            ))}
            <div className="summary-row summary-total">
              <span className="summary-row-label">Total Paid</span>
              <span className="summary-row-value">{formatCurrency(totalPremium)}</span>
            </div>
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
      <h1 className="sell-flow-title">New Electronics Sale</h1>
      <StepperBar currentStep={step} steps={STEPS} />

      {/* Step 1: Scan/Enter IMEI */}
      {step === 1 && (
        <div className="step-content">
          <h2 className="step-heading">Scan or Enter IMEI</h2>
          <p className="step-subtext">
            Enter the 15-digit IMEI number found on the device packaging or by dialing *#06#.
          </p>
          <div className="form-group">
            <label className="form-label" htmlFor="imei-input">
              IMEI Number
            </label>
            <input
              id="imei-input"
              className="input-field"
              type="text"
              inputMode="numeric"
              placeholder="Enter 15-digit IMEI"
              value={imei}
              onChange={(e) => validateImei(e.target.value)}
              maxLength={15}
            />
            <p className="form-hint">Format: 15 digits (e.g., 356938035643809)</p>
            {imeiError && <p className="form-error">{imeiError}</p>}
          </div>
          <div className="step-actions">
            <button
              className="btn-primary"
              disabled={imei.length === 0}
              onClick={handleStep1Next}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Product */}
      {step === 2 && (
        <div className="step-content">
          <h2 className="step-heading">Select Product</h2>
          <p className="step-subtext">
            Choose the product associated with IMEI {imei}.
          </p>
          {filteredProducts.length === 0 ? (
            <div className="empty-products">
              No products available for this vertical.
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`card product-card${selectedProduct?.id === product.id ? ' selected' : ''}`}
                  onClick={() => handleSelectProduct(product)}
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
          )}
          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!selectedProduct}
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Plans */}
      {step === 3 && selectedProduct && (
        <div className="step-content">
          <h2 className="step-heading">Select Protection Plans</h2>
          <p className="step-subtext">
            Choose one or more plans for {selectedProduct.name}.
          </p>
          <div className="plan-list">
            {selectedProduct.plans.map((plan) => {
              const isSelected = selectedPlans.some((p) => p.id === plan.id);
              return (
                <div
                  key={plan.id}
                  className={`card plan-card${isSelected ? ' selected' : ''}`}
                  onClick={() => togglePlan(plan)}
                >
                  <div className="plan-card-header">
                    <div className="plan-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePlan(plan)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="plan-card-name">{plan.name}</span>
                    </div>
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
              disabled={selectedPlans.length === 0}
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Customer Details + Payment Summary + Confirm */}
      {step === 4 && selectedProduct && (
        <div className="step-content">
          <h2 className="step-heading">Customer Details</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-name">
              Full Name
            </label>
            <input
              id="cust-name"
              className="input-field"
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-phone">
              Phone Number
            </label>
            <input
              id="cust-phone"
              className="input-field"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
              }
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cust-email">
              Email (optional)
            </label>
            <input
              id="cust-email"
              className="input-field"
              type="email"
              placeholder="customer@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          {/* Payment Summary */}
          <div className="card summary-card">
            <div className="summary-title">Payment Summary</div>
            <div className="summary-row">
              <span className="summary-row-label">Product</span>
              <span className="summary-row-value">{selectedProduct.name}</span>
            </div>
            <div className="summary-row">
              <span className="summary-row-label">IMEI</span>
              <span className="summary-row-value">{imei}</span>
            </div>
            {selectedPlans.map((plan) => (
              <div className="summary-row" key={plan.id}>
                <span className="summary-row-label">
                  {plan.name} ({plan.type})
                </span>
                <span className="summary-row-value">
                  {formatCurrency(plan.premium)}
                </span>
              </div>
            ))}
            <div className="summary-row summary-total">
              <span className="summary-row-label">Total Premium</span>
              <span className="summary-row-value">
                {formatCurrency(totalPremium)}
              </span>
            </div>
          </div>

          <div className="step-actions">
            <button className="btn-secondary" onClick={() => setStep(3)}>
              Back
            </button>
            <button
              className="btn-primary"
              disabled={!customerName.trim() || customerPhone.length !== 10}
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
