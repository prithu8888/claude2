export type ConfigType = 'flat' | 'percentage' | 'slab';
export type ConfigLevel = 'partner' | 'state' | 'dealer' | 'agent';
export type Kyc = 'verified' | 'expired' | 'not_done';
export type WStatus = 'pending_approval' | 'processing' | 'completed' | 'failed' | 'rejected';

export interface Slab { from: number; to: number | null; rate: number }
export interface Cfg { id: string; name: string; level: ConfigLevel; scope: string; type: ConfigType; flatRate?: number; percentRate?: number; slabs?: Slab[]; effectiveFrom: string; effectiveTo?: string | null; status: 'draft' | 'active' | 'expired' }
export interface Agent { id: string; name: string; phone: string; region: string; dealerName: string; kyc: Kyc; kycExpiresAt?: string; monthPolicies: number; monthEarned: number; balance: number; totalEarned?: number; totalWithdrawn?: number; activeConfigId: string; fraudFlag?: boolean; fraudReason?: string }
export interface Txn { id: string; date: string; kind: 'earning' | 'withdrawal'; policyId?: string; amount: number; configRate?: number; method?: string }
export interface WReq { id: string; agentId: string; agentName: string; agentPhone: string; region: string; amount: number; methodLabel: string; requestedAt: string; kyc: Kyc; status: WStatus; balanceAfter: number; approvedBy?: string; processedAt?: string; rejectionReason?: string }

export const ME = 'a1';

export const cfgs: Cfg[] = [
  { id: 'c1', name: 'Oppo India — Base', level: 'partner', scope: 'Oppo India', type: 'flat', flatRate: 40, effectiveFrom: '2026-01-01', effectiveTo: null, status: 'active' },
  { id: 'c2', name: 'Karnataka Slab', level: 'state', scope: 'Karnataka', type: 'slab', slabs: [{ from: 1, to: 10, rate: 40 }, { from: 11, to: 25, rate: 60 }, { from: 26, to: null, rate: 80 }], effectiveFrom: '2026-03-01', effectiveTo: null, status: 'active' },
  { id: 'c3', name: 'Tamil Nadu Flat', level: 'state', scope: 'Tamil Nadu', type: 'flat', flatRate: 50, effectiveFrom: '2026-02-15', effectiveTo: null, status: 'active' },
  { id: 'c4', name: 'Rajesh Kumar Override', level: 'agent', scope: 'Rajesh Kumar', type: 'slab', slabs: [{ from: 1, to: 10, rate: 50 }, { from: 11, to: 25, rate: 75 }, { from: 26, to: null, rate: 100 }], effectiveFrom: '2026-04-01', effectiveTo: null, status: 'active' },
  { id: 'c5', name: 'Diwali Boost 2025', level: 'state', scope: 'Karnataka', type: 'slab', slabs: [{ from: 1, to: 10, rate: 50 }, { from: 11, to: 25, rate: 80 }, { from: 26, to: null, rate: 120 }], effectiveFrom: '2025-10-20', effectiveTo: '2025-10-27', status: 'expired' },
  { id: 'c6', name: 'Q1 Pilot Karnataka', level: 'state', scope: 'Karnataka', type: 'percentage', percentRate: 12, effectiveFrom: '2026-01-01', effectiveTo: '2026-02-28', status: 'expired' },
];

export const agents: Agent[] = [
  { id: 'a1', name: 'Rajesh Kumar', phone: '9876543210', region: 'Karnataka', dealerName: 'Mohammed Ali', kyc: 'verified', kycExpiresAt: '2027-04-01', monthPolicies: 14, monthEarned: 840, balance: 2340, totalEarned: 18750, totalWithdrawn: 16410, activeConfigId: 'c4', fraudFlag: true, fraudReason: 'AI flagged: 8 policies sold within 2 hours on 10 Apr.' },
  { id: 'a2', name: 'Priya S', phone: '9845671234', region: 'Karnataka', dealerName: 'Mohammed Ali', kyc: 'verified', monthPolicies: 31, monthEarned: 2480, balance: 1080, totalEarned: 12400, totalWithdrawn: 11320, activeConfigId: 'c2' },
  { id: 'a3', name: 'Mohammed R', phone: '9834562345', region: 'Tamil Nadu', dealerName: 'Priya Nair', kyc: 'not_done', monthPolicies: 28, monthEarned: 1400, balance: 800, totalEarned: 4200, totalWithdrawn: 3400, activeConfigId: 'c3' },
  { id: 'a4', name: 'Anand T', phone: '9823453456', region: 'Karnataka', dealerName: 'Mohammed Ali', kyc: 'expired', kycExpiresAt: '2026-02-10', monthPolicies: 11, monthEarned: 660, balance: 660, totalEarned: 5200, totalWithdrawn: 4540, activeConfigId: 'c2' },
  { id: 'a5', name: 'Sunita B', phone: '9812344567', region: 'Tamil Nadu', dealerName: 'Priya Nair', kyc: 'verified', monthPolicies: 9, monthEarned: 450, balance: 340, totalEarned: 2900, totalWithdrawn: 2560, activeConfigId: 'c3' },
];

export const meTxns: Txn[] = [
  { id: 't1', date: '2026-04-12', kind: 'earning', policyId: 'ACK8823', amount: 75, configRate: 75 },
  { id: 't2', date: '2026-04-11', kind: 'earning', policyId: 'ACK8801', amount: 75, configRate: 75 },
  { id: 't3', date: '2026-04-11', kind: 'earning', policyId: 'ACK8799', amount: 75, configRate: 75 },
  { id: 't4', date: '2026-04-10', kind: 'earning', policyId: 'ACK8756', amount: 75, configRate: 75 },
  { id: 't5', date: '2026-04-09', kind: 'earning', policyId: 'ACK8712', amount: 75, configRate: 75 },
  { id: 't6', date: '2026-04-09', kind: 'withdrawal', amount: 1200, method: 'Bank SBI ****3421' },
  { id: 't7', date: '2026-04-08', kind: 'earning', policyId: 'ACK8698', amount: 75, configRate: 75 },
  { id: 't8', date: '2026-04-07', kind: 'earning', policyId: 'ACK8645', amount: 75, configRate: 75 },
  { id: 't9', date: '2026-04-06', kind: 'earning', policyId: 'ACK8601', amount: 75, configRate: 75 },
  { id: 't10', date: '2026-04-05', kind: 'earning', policyId: 'ACK8589', amount: 50, configRate: 50 },
];

export const pendingReqs: WReq[] = [
  { id: 'w1', agentId: 'a1', agentName: 'Rajesh Kumar', agentPhone: '9876543210', region: 'Karnataka', amount: 1200, methodLabel: 'Bank SBI ****3421', requestedAt: '2026-04-09 14:14', kyc: 'verified', status: 'pending_approval', balanceAfter: 1140 },
  { id: 'w2', agentId: 'a2', agentName: 'Priya S', agentPhone: '9845671234', region: 'Karnataka', amount: 800, methodLabel: 'UPI priya@okaxis', requestedAt: '2026-04-11 10:30', kyc: 'verified', status: 'pending_approval', balanceAfter: 280 },
  { id: 'w3', agentId: 'a3', agentName: 'Mohammed R', agentPhone: '9834562345', region: 'Tamil Nadu', amount: 500, methodLabel: 'Bank HDFC ****7823', requestedAt: '2026-04-10 17:00', kyc: 'not_done', status: 'pending_approval', balanceAfter: 300 },
];

export const meWithdrawals: WReq[] = [
  { id: 'mw1', agentId: 'a1', agentName: 'Rajesh Kumar', agentPhone: '9876543210', region: 'Karnataka', amount: 1200, methodLabel: 'Bank SBI ****3421', requestedAt: '2026-04-09 14:14', kyc: 'verified', status: 'completed', balanceAfter: 1140, approvedBy: 'Meera (Finance)', processedAt: '2026-04-09 15:52' },
  { id: 'mw2', agentId: 'a1', agentName: 'Rajesh Kumar', agentPhone: '9876543210', region: 'Karnataka', amount: 800, methodLabel: 'UPI rajesh@okicici', requestedAt: '2026-03-28 11:10', kyc: 'verified', status: 'completed', balanceAfter: 0, approvedBy: 'Auto', processedAt: '2026-03-28 11:12' },
  { id: 'mw3', agentId: 'a1', agentName: 'Rajesh Kumar', agentPhone: '9876543210', region: 'Karnataka', amount: 600, methodLabel: 'Bank SBI ****3421', requestedAt: '2026-03-15 09:05', kyc: 'verified', status: 'completed', balanceAfter: 0, approvedBy: 'Meera (Finance)', processedAt: '2026-03-15 11:18' },
  { id: 'mw4', agentId: 'a1', agentName: 'Rajesh Kumar', agentPhone: '9876543210', region: 'Karnataka', amount: 400, methodLabel: 'UPI rajesh@okicici', requestedAt: '2026-03-02 14:22', kyc: 'verified', status: 'rejected', balanceAfter: 400, rejectionReason: 'Bank account mismatch. Please update your details and retry.' },
];

export const meMethods = [
  { id: 'pm1', kind: 'bank' as const, label: 'SBI Savings Account', details: 'Rajesh Kumar · ****3421', ifsc: 'SBIN0001234', verified: true },
  { id: 'pm2', kind: 'upi' as const, label: 'UPI', details: 'rajesh@okicici', verified: true },
];

export const aiSuggestions = [
  { id: 's1', badge: 'Seasonal opportunity', headline: 'Diwali is in 18 days — Karnataka agents could 3x output', body: 'Last Diwali, Karnataka sales spiked 3.2x. Current slab tops out at Rs.80/policy. Adding Slab 4 (36+) at Rs.120/policy for Oct 20–27 could push top agents to 40+ policies.', impact: ['Estimated additional policies: 180–240', 'Estimated additional payout: Rs.18,000–28,000', 'Estimated premium uplift: Rs.8–10L'] },
  { id: 's2', badge: 'Regional gap', headline: 'Tamil Nadu agents are 23% below Karnataka in attach rate', body: 'Tamil Nadu is on flat Rs.50/policy. Karnataka agents on slab earn up to Rs.80/policy and show 23% higher attach rates. Converting Tamil Nadu to slab or increasing flat to Rs.65 could close the gap.', impact: ['If attach rate matches Karnataka: +Rs.4,200/month in agent payouts', '+Rs.18L/month in premium'] },
];

export const aiHistory = [
  { id: 'h1', headline: 'Diwali boost 2025 — Karnataka', outcome: 'Applied. Karnataka agents averaged 34 policies that week vs 11 the prior week.', appliedDate: '2025-10-19' },
  { id: 'h2', headline: 'Pongal incentive — Tamil Nadu Jan 2026', outcome: 'Dismissed — budget constraints.', appliedDate: '2026-01-08' },
];

export const monthlyReport = [
  { month: 'Apr 2026', policies: 93, earned: 5830, withdrawn: 2500, pending: 2500, liability: 8030 },
  { month: 'Mar 2026', policies: 87, earned: 5220, withdrawn: 4100, pending: 0, liability: 1120 },
  { month: 'Feb 2026', policies: 72, earned: 3900, withdrawn: 3600, pending: 0, liability: 300 },
  { month: 'Jan 2026', policies: 68, earned: 3400, withdrawn: 3100, pending: 0, liability: 300 },
  { month: 'Dec 2025', policies: 81, earned: 4860, withdrawn: 4500, pending: 0, liability: 360 },
  { month: 'Nov 2025', policies: 94, earned: 5100, withdrawn: 4900, pending: 0, liability: 200 },
];

export const meConfigHistory = [
  { name: 'Rajesh Kumar Override', level: 'agent', from: '2026-04-01', to: 'ongoing', earned: 840 },
  { name: 'Karnataka Slab', level: 'state', from: '2026-03-01', to: '2026-03-31', earned: 1200 },
  { name: 'Oppo India Base', level: 'partner', from: '2026-01-01', to: '2026-02-28', earned: 3600 },
];

export function calc(policies: number, cfg: Cfg): { total: number; rows: { label: string; active?: boolean }[] } {
  if (cfg.type === 'flat') {
    const t = policies * (cfg.flatRate ?? 0);
    return { total: t, rows: [{ label: `${policies} × Rs.${cfg.flatRate} = Rs.${t}` }] };
  }
  if (cfg.type === 'percentage') {
    const avg = 600;
    const t = Math.round(policies * avg * (cfg.percentRate ?? 0) / 100);
    return { total: t, rows: [{ label: `${policies} × Rs.${avg} × ${cfg.percentRate}% = Rs.${t}` }] };
  }
  let rem = policies, total = 0;
  const rows: { label: string; active?: boolean }[] = [];
  for (const s of cfg.slabs ?? []) {
    const cap = s.to === null ? rem : s.to - s.from + 1;
    const chunk = Math.max(0, Math.min(rem, cap));
    const amt = chunk * s.rate;
    rows.push({ label: `Slab ${s.from}–${s.to ?? '+'}: ${chunk} × Rs.${s.rate} = Rs.${amt}`, active: policies >= s.from && (s.to === null || policies <= s.to) });
    total += amt;
    rem -= chunk;
    if (rem <= 0) break;
  }
  return { total, rows };
}

export function slabIdx(policies: number, cfg: Cfg): number {
  if (cfg.type !== 'slab' || !cfg.slabs) return -1;
  for (let i = 0; i < cfg.slabs.length; i++) {
    const s = cfg.slabs[i];
    if (policies >= s.from && (s.to === null || policies <= s.to)) return i;
  }
  return cfg.slabs.length - 1;
}

export const cfgById = (id: string) => cfgs.find((c) => c.id === id);
