import type { Product, Plan, Sale, Commission, Claim, WalletTransaction, Invoice, DealerMetrics, BrandMetrics } from '../types/mpos';

// Products
export const products: Product[] = [
  {
    id: 'p1', name: 'Samsung Galaxy S24', category: 'Smartphone', vertical: 'electronics-retail', price: 79999,
    plans: [
      { id: 'pl1', name: 'Extended Warranty 1Y', type: 'EW', premium: 1999, tenure: '1 Year', coverage: ['Screen damage', 'Battery', 'Manufacturing defect'] },
      { id: 'pl2', name: 'Extended Warranty 2Y', type: 'EW', premium: 3499, tenure: '2 Years', coverage: ['Screen damage', 'Battery', 'Manufacturing defect', 'Water damage'] },
      { id: 'pl3', name: 'Accidental & Liquid Damage', type: 'ALD', premium: 2499, tenure: '1 Year', coverage: ['Accidental drops', 'Liquid damage', 'Screen crack'] },
    ],
  },
  {
    id: 'p2', name: 'Samsung Galaxy Tab S9', category: 'Tablet', vertical: 'electronics-retail', price: 74999,
    plans: [
      { id: 'pl4', name: 'Extended Warranty 1Y', type: 'EW', premium: 1799, tenure: '1 Year', coverage: ['Screen damage', 'Battery', 'Manufacturing defect'] },
      { id: 'pl5', name: 'Accidental & Liquid Damage', type: 'ALD', premium: 2299, tenure: '1 Year', coverage: ['Accidental drops', 'Liquid damage'] },
    ],
  },
  {
    id: 'p3', name: 'Xiaomi 14 Ultra', category: 'Smartphone', vertical: 'electronics-retail', price: 89999,
    plans: [
      { id: 'pl6', name: 'Extended Warranty 1Y', type: 'EW', premium: 2199, tenure: '1 Year', coverage: ['Screen damage', 'Battery', 'Manufacturing defect'] },
      { id: 'pl7', name: 'Extended Warranty 2Y', type: 'EW', premium: 3999, tenure: '2 Years', coverage: ['Screen damage', 'Battery', 'Manufacturing defect', 'Water damage'] },
    ],
  },
  {
    id: 'p4', name: 'Samsung Washing Machine', category: 'Home Appliance', vertical: 'electronics-asc', price: 34999,
    plans: [
      { id: 'pl8', name: 'Extended Warranty 2Y', type: 'EW', premium: 2999, tenure: '2 Years', coverage: ['Motor failure', 'PCB damage', 'Drum issues'] },
    ],
  },
  {
    id: 'p5', name: 'Ather 450X', category: 'Electric Scooter', vertical: 'ev-2w', price: 149999,
    plans: [
      { id: 'pl9', name: 'Comprehensive 1Y', type: 'comprehensive', premium: 5999, tenure: '1 Year', coverage: ['Accident', 'Theft', 'Natural calamity', 'Third-party'] },
      { id: 'pl10', name: 'Third Party 1Y', type: 'third-party', premium: 1999, tenure: '1 Year', coverage: ['Third-party liability'] },
      { id: 'pl11', name: 'Personal Accident', type: 'PA', premium: 999, tenure: '1 Year', coverage: ['Rider PA cover'] },
    ],
  },
  {
    id: 'p6', name: 'Ola S1 Pro', category: 'Electric Scooter', vertical: 'ev-2w', price: 129999,
    plans: [
      { id: 'pl12', name: 'Comprehensive 1Y', type: 'comprehensive', premium: 4999, tenure: '1 Year', coverage: ['Accident', 'Theft', 'Natural calamity', 'Third-party'] },
      { id: 'pl13', name: 'Third Party 1Y', type: 'third-party', premium: 1799, tenure: '1 Year', coverage: ['Third-party liability'] },
    ],
  },
  {
    id: 'p7', name: 'Bajaj Chetak', category: 'Electric Scooter', vertical: 'ev-2w', price: 149000,
    plans: [
      { id: 'pl14', name: 'Comprehensive 1Y', type: 'comprehensive', premium: 5499, tenure: '1 Year', coverage: ['Accident', 'Theft', 'Natural calamity'] },
    ],
  },
  {
    id: 'p8', name: 'Tata Nexon EV', category: 'Electric Car', vertical: 'ev-4w', price: 1499000,
    plans: [
      { id: 'pl15', name: 'Comprehensive 1Y', type: 'comprehensive', premium: 28999, tenure: '1 Year', coverage: ['Accident', 'Theft', 'Natural calamity', 'Third-party'] },
      { id: 'pl16', name: 'Third Party 1Y', type: 'third-party', premium: 6999, tenure: '1 Year', coverage: ['Third-party liability'] },
    ],
  },
];

// Sales
export const sales: Sale[] = [
  { id: 's1', productId: 'p1', planId: 'pl1', customerId: 'c1', sellerId: 'u1', deviceIdentifier: '356938035643809', date: '2026-03-05', status: 'completed', commission: 399 },
  { id: 's2', productId: 'p1', planId: 'pl3', customerId: 'c2', sellerId: 'u1', deviceIdentifier: '356938035643810', date: '2026-03-04', status: 'completed', commission: 499 },
  { id: 's3', productId: 'p5', planId: 'pl9', customerId: 'c3', sellerId: 'u2', deviceIdentifier: 'ME4AT450X0001234', date: '2026-03-03', status: 'completed', commission: 1199 },
  { id: 's4', productId: 'p3', planId: 'pl6', customerId: 'c4', sellerId: 'u1', deviceIdentifier: '356938035643811', date: '2026-03-02', status: 'pending', commission: 439 },
  { id: 's5', productId: 'p6', planId: 'pl12', customerId: 'c5', sellerId: 'u2', deviceIdentifier: 'ME4OL001P0005678', date: '2026-03-01', status: 'completed', commission: 999 },
  { id: 's6', productId: 'p2', planId: 'pl4', customerId: 'c6', sellerId: 'u1', deviceIdentifier: '356938035643812', date: '2026-02-28', status: 'completed', commission: 359 },
  { id: 's7', productId: 'p8', planId: 'pl15', customerId: 'c7', sellerId: 'u3', deviceIdentifier: 'MAT1NEXEV0009876', date: '2026-02-27', status: 'completed', commission: 5799 },
];

// Commissions
export const commissions: Commission[] = [
  { id: 'cm1', saleId: 's1', amount: 399, status: 'paid', date: '2026-03-05', paidDate: '2026-03-06' },
  { id: 'cm2', saleId: 's2', amount: 499, status: 'paid', date: '2026-03-04', paidDate: '2026-03-06' },
  { id: 'cm3', saleId: 's3', amount: 1199, status: 'approved', date: '2026-03-03' },
  { id: 'cm4', saleId: 's4', amount: 439, status: 'pending', date: '2026-03-02' },
  { id: 'cm5', saleId: 's5', amount: 999, status: 'paid', date: '2026-03-01', paidDate: '2026-03-02' },
  { id: 'cm6', saleId: 's6', amount: 359, status: 'disputed', date: '2026-02-28' },
  { id: 'cm7', saleId: 's7', amount: 5799, status: 'approved', date: '2026-02-27' },
];

// Claims
export const claims: Claim[] = [
  { id: 'cl1', policyId: 's1', type: 'damage', status: 'submitted', description: 'Screen cracked after accidental drop', date: '2026-03-06', amount: 12000, fraudFlag: 'clear' },
  { id: 'cl2', policyId: 's3', type: 'accident', status: 'under-review', description: 'Minor accident - front panel damage', date: '2026-03-05', amount: 8500, fraudFlag: 'clear' },
  { id: 'cl3', policyId: 's5', type: 'theft', status: 'approved', description: 'Vehicle stolen from parking', date: '2026-03-01', amount: 129999, fraudFlag: 'suspicious' },
  { id: 'cl4', policyId: 's2', type: 'malfunction', status: 'settled', description: 'Battery swelling issue', date: '2026-02-20', amount: 4500, fraudFlag: 'clear' },
  { id: 'cl5', policyId: 's7', type: 'accident', status: 'submitted', description: 'Rear bumper damage in parking lot', date: '2026-03-04', amount: 22000, fraudFlag: 'flagged' },
];

// Wallet transactions
export const walletTransactions: WalletTransaction[] = [
  { id: 'w1', type: 'credit', amount: 898, date: '2026-03-06', description: 'Commission - Samsung Galaxy S24 (2 plans)', status: 'completed' },
  { id: 'w2', type: 'credit', amount: 1199, date: '2026-03-03', description: 'Commission - Ather 450X Comprehensive', status: 'completed' },
  { id: 'w3', type: 'withdrawal', amount: 2000, date: '2026-03-02', description: 'Bank transfer to HDFC ***4521', status: 'completed' },
  { id: 'w4', type: 'credit', amount: 999, date: '2026-03-01', description: 'Commission - Ola S1 Pro Comprehensive', status: 'completed' },
  { id: 'w5', type: 'credit', amount: 359, date: '2026-02-28', description: 'Commission - Galaxy Tab S9 EW', status: 'pending' },
  { id: 'w6', type: 'withdrawal', amount: 1500, date: '2026-02-25', description: 'Bank transfer to HDFC ***4521', status: 'completed' },
  { id: 'w7', type: 'credit', amount: 5799, date: '2026-02-27', description: 'Commission - Tata Nexon EV Comprehensive', status: 'completed' },
];

// Invoices
export const invoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-2026-0341', date: '2026-03-06', amount: 898, gst: 161.64, total: 1059.64, status: 'issued', type: 'commission' },
  { id: 'inv2', invoiceNumber: 'INV-2026-0340', date: '2026-03-03', amount: 1199, gst: 215.82, total: 1414.82, status: 'paid', type: 'commission' },
  { id: 'inv3', invoiceNumber: 'INV-2026-0339', date: '2026-03-01', amount: 999, gst: 179.82, total: 1178.82, status: 'paid', type: 'commission' },
  { id: 'inv4', invoiceNumber: 'INV-2026-0338', date: '2026-02-28', amount: 359, gst: 64.62, total: 423.62, status: 'overdue', type: 'commission' },
];

export const dealerMetrics: DealerMetrics = {
  totalSales: 342,
  monthSales: 47,
  activePromoters: 12,
  totalCommission: 68400,
  pendingClaims: 3,
  renewalsDue: 8,
};

export const brandMetrics: BrandMetrics = {
  totalDealers: 156,
  activeDealers: 134,
  totalPolicies: 12847,
  monthPolicies: 1423,
  gwp: 4250000,
  claimsRatio: 12.4,
  avgActivationTime: 2.3,
};

// Mock dealer list
export const dealers = [
  { id: 'd1', name: 'Rajesh Electronics', city: 'Mumbai', status: 'active' as const, sales: 89, lastActive: '2026-03-07' },
  { id: 'd2', name: 'Kumar Mobile Hub', city: 'Delhi', status: 'active' as const, sales: 67, lastActive: '2026-03-06' },
  { id: 'd3', name: 'Southern Gadgets', city: 'Chennai', status: 'active' as const, sales: 45, lastActive: '2026-03-05' },
  { id: 'd4', name: 'EV World Bengaluru', city: 'Bengaluru', status: 'active' as const, sales: 112, lastActive: '2026-03-07' },
  { id: 'd5', name: 'Greenride Motors', city: 'Pune', status: 'inactive' as const, sales: 23, lastActive: '2026-02-15' },
  { id: 'd6', name: 'Techno Plaza', city: 'Hyderabad', status: 'active' as const, sales: 78, lastActive: '2026-03-07' },
  { id: 'd7', name: 'Digital Dreams', city: 'Kolkata', status: 'inactive' as const, sales: 12, lastActive: '2026-01-28' },
  { id: 'd8', name: 'SpeedEV Dealers', city: 'Ahmedabad', status: 'active' as const, sales: 56, lastActive: '2026-03-06' },
];

// Mock promoters
export const promoters = [
  { id: 'pr1', name: 'Amit Sharma', phone: '98765XXXXX', sales: 34, status: 'active' as const, lastSale: '2026-03-07' },
  { id: 'pr2', name: 'Priya Patel', phone: '98764XXXXX', sales: 28, status: 'active' as const, lastSale: '2026-03-06' },
  { id: 'pr3', name: 'Rahul Kumar', phone: '98763XXXXX', sales: 22, status: 'active' as const, lastSale: '2026-03-05' },
  { id: 'pr4', name: 'Sneha Reddy', phone: '98762XXXXX', sales: 15, status: 'inactive' as const, lastSale: '2026-02-10' },
  { id: 'pr5', name: 'Vijay Singh', phone: '98761XXXXX', sales: 41, status: 'active' as const, lastSale: '2026-03-07' },
];

// Mock users for RBAC
export const mockUsers = [
  { id: 'u1', name: 'Amit Sharma', phone: '9876500001', role: 'promoter' as const, vertical: 'electronics-retail' as const, brand: 'Samsung' as const, kycStatus: 'approved' as const, isActive: true },
  { id: 'u2', name: 'Priya Patel', phone: '9876500002', role: 'promoter' as const, vertical: 'ev-2w' as const, brand: 'Ather' as const, kycStatus: 'approved' as const, isActive: true },
  { id: 'u3', name: 'Rahul Kumar', phone: '9876500003', role: 'dealer' as const, vertical: 'ev-4w' as const, brand: 'Bajaj' as const, kycStatus: 'approved' as const, isActive: true },
  { id: 'u4', name: 'Sneha Reddy', phone: '9876500004', role: 'promoter' as const, vertical: 'electronics-retail' as const, brand: 'Xiaomi' as const, kycStatus: 'pending' as const, isActive: false },
  { id: 'u5', name: 'Vijay Singh', phone: '9876500005', role: 'distributor' as const, vertical: 'electronics-retail' as const, brand: 'Samsung' as const, kycStatus: 'approved' as const, isActive: true },
  { id: 'u6', name: 'Meena Kumari', phone: '9876500006', role: 'dealer' as const, vertical: 'ev-2w' as const, brand: 'Ola' as const, kycStatus: 'submitted' as const, isActive: false },
  { id: 'u7', name: 'Arjun Nair', phone: '9876500007', role: 'promoter' as const, vertical: 'electronics-asc' as const, brand: 'Samsung' as const, kycStatus: 'rejected' as const, isActive: false },
];

// Helper to get plan by ID
export function getPlanById(planId: string): Plan | undefined {
  for (const product of products) {
    const plan = product.plans.find(p => p.id === planId);
    if (plan) return plan;
  }
  return undefined;
}

// Helper to get product by ID
export function getProductById(productId: string): Product | undefined {
  return products.find(p => p.id === productId);
}
