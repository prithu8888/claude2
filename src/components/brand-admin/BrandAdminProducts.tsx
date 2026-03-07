import { useState } from 'react';
import { products } from '../../data/mockData';
import './BrandAdmin.css';

export default function BrandAdminProducts() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function formatPrice(price: number): string {
    return `Rs.${price.toLocaleString('en-IN')}`;
  }

  return (
    <div className="ba-page">
      <div className="ba-page-header">
        <h1>Products & Plans</h1>
        <div className="ba-page-header-actions">
          <button className="btn-primary">+ Add Product</button>
        </div>
      </div>

      {products.map((product) => {
        const isExpanded = expandedId === product.id;
        return (
          <div key={product.id} className="ba-product-item">
            <div className="ba-product-header" onClick={() => toggleExpand(product.id)}>
              <div className="ba-product-info">
                <div className="ba-product-name">{product.name}</div>
                <div className="ba-product-meta">
                  <span>{product.category}</span>
                  <span>{formatPrice(product.price)}</span>
                  <span>{product.plans.length} plan{product.plans.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <span className={`ba-product-expand-icon ${isExpanded ? 'open' : ''}`}>
                {'\u25BC'}
              </span>
            </div>

            {isExpanded && (
              <div className="ba-product-plans">
                {product.plans.map((plan) => (
                  <div key={plan.id} className="ba-plan-card">
                    <div className="ba-plan-card-header">
                      <span className="ba-plan-card-name">{plan.name}</span>
                      <span className="badge badge-purple">{plan.type}</span>
                    </div>
                    <div className="ba-plan-card-details">
                      <span>Premium: {formatPrice(plan.premium)}</span>
                      <span>Tenure: {plan.tenure}</span>
                    </div>
                    <div className="ba-plan-card-coverage">
                      {plan.coverage.map((c) => (
                        <span key={c} className="badge badge-info">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
