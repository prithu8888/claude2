export type Role = 'promoter' | 'dealer' | 'distributor' | 'brand-admin' | 'acko-super-admin';

export type Vertical = 'electronics-retail' | 'electronics-asc' | 'ev-2w' | 'ev-4w';

export type Brand = 'Samsung' | 'Xiaomi' | 'Ather' | 'Ola' | 'Bajaj' | 'TVS';

export type KYCStatus = 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  vertical: Vertical;
  brand: Brand;
  kycStatus: KYCStatus;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  vertical: Vertical;
  price: number;
  plans: Plan[];
}

export interface Plan {
  id: string;
  name: string;
  type: 'EW' | 'ALD' | 'PA' | 'comprehensive' | 'third-party';
  premium: number;
  tenure: string;
  coverage: string[];
}

export interface Sale {
  id: string;
  productId: string;
  planId: string;
  customerId: string;
  sellerId: string;
  deviceIdentifier: string; // IMEI or VIN
  date: string;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
  commission: number;
}

export interface Commission {
  id: string;
  saleId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  date: string;
  paidDate?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  type: 'damage' | 'theft' | 'malfunction' | 'accident';
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'settled';
  description: string;
  date: string;
  amount?: number;
  fraudFlag?: 'clear' | 'suspicious' | 'flagged';
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface DealerMetrics {
  totalSales: number;
  monthSales: number;
  activePromoters: number;
  totalCommission: number;
  pendingClaims: number;
  renewalsDue: number;
}

export interface BrandMetrics {
  totalDealers: number;
  activeDealers: number;
  totalPolicies: number;
  monthPolicies: number;
  gwp: number;
  claimsRatio: number;
  avgActivationTime: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  gst: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  type: 'commission' | 'premium' | 'service';
}
