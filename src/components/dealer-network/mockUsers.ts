// Dealer network mock data — 3 Dealers, 5 Sub-dealers, 7 Promoters (15 total)
// One inactive user for the demo.

export type NetworkGroup = 'Dealer' | 'Sub-dealer' | 'Promoter';

export interface NetworkUser {
  id: string;
  name: string;
  phone: string;
  group: NetworkGroup;
  parentId: string | null;
  pincode: string;
  email?: string;
  status: 'Active' | 'Inactive';
  partnerId?: string;
}

export const networkUsers: NetworkUser[] = [
  // --- Dealers (no parent) ---
  { id: 'u1', name: 'Ramesh Agarwal', phone: '9840100001', group: 'Dealer', parentId: null, pincode: '560095', email: 'ramesh@croma.com', status: 'Active', partnerId: 'XMIN-D-4401' },
  { id: 'u2', name: 'Priya Krishnan', phone: '9840100002', group: 'Dealer', parentId: null, pincode: '600001', email: 'priya@sangeetha.in', status: 'Active', partnerId: 'XMIN-D-4402' },
  { id: 'u3', name: 'Vikram Sinha', phone: '9840100003', group: 'Dealer', parentId: null, pincode: '400001', email: 'vikram@vijaysales.com', status: 'Active', partnerId: 'XMIN-D-4403' },

  // --- Sub-dealers (parent = a Dealer) ---
  { id: 'u4', name: 'Anjali Desai', phone: '9840100004', group: 'Sub-dealer', parentId: 'u1', pincode: '560034', email: 'anjali.d@croma.com', status: 'Active', partnerId: 'XMIN-SD-4411' },
  { id: 'u5', name: 'Karan Mehta', phone: '9840100005', group: 'Sub-dealer', parentId: 'u1', pincode: '560076', email: 'karan.m@croma.com', status: 'Active', partnerId: 'XMIN-SD-4412' },
  { id: 'u6', name: 'Deepa Rao', phone: '9840100006', group: 'Sub-dealer', parentId: 'u1', pincode: '560100', email: 'deepa.r@croma.com', status: 'Active', partnerId: 'XMIN-SD-4413' },
  { id: 'u7', name: 'Sanjay Iyer', phone: '9840100007', group: 'Sub-dealer', parentId: 'u2', pincode: '600028', email: 'sanjay@sangeetha.in', status: 'Inactive', partnerId: 'XMIN-SD-4414' },
  { id: 'u8', name: 'Neha Patel', phone: '9840100008', group: 'Sub-dealer', parentId: 'u3', pincode: '400012', email: 'neha@vijaysales.com', status: 'Active', partnerId: 'XMIN-SD-4415' },

  // --- Promoters (parent = a Sub-dealer) ---
  { id: 'u9', name: 'Rahul Sharma', phone: '9840100009', group: 'Promoter', parentId: 'u4', pincode: '560034', email: 'rahul.s@xiaomi.in', status: 'Active', partnerId: 'XMIN-P-4421' },
  { id: 'u10', name: 'Amit Kumar', phone: '9840100010', group: 'Promoter', parentId: 'u4', pincode: '560034', status: 'Active', partnerId: 'XMIN-P-4422' },
  { id: 'u11', name: 'Sneha Reddy', phone: '9840100011', group: 'Promoter', parentId: 'u5', pincode: '560076', email: 'sneha@xiaomi.in', status: 'Active', partnerId: 'XMIN-P-4423' },
  { id: 'u12', name: 'Vijay Singh', phone: '9840100012', group: 'Promoter', parentId: 'u5', pincode: '560076', status: 'Active', partnerId: 'XMIN-P-4424' },
  { id: 'u13', name: 'Meera Joshi', phone: '9840100013', group: 'Promoter', parentId: 'u6', pincode: '560100', email: 'meera@xiaomi.in', status: 'Active', partnerId: 'XMIN-P-4425' },
  { id: 'u14', name: 'Arjun Nair', phone: '9840100014', group: 'Promoter', parentId: 'u7', pincode: '600028', status: 'Active', partnerId: 'XMIN-P-4426' },
  { id: 'u15', name: 'Kiran Shetty', phone: '9840100015', group: 'Promoter', parentId: 'u8', pincode: '400012', email: 'kiran@xiaomi.in', status: 'Active', partnerId: 'XMIN-P-4427' },
];

// Helper maps
export function getParentName(users: NetworkUser[], parentId: string | null): string {
  if (!parentId) return '\u2014';
  return users.find((u) => u.id === parentId)?.name ?? 'Unknown';
}

export function getChildren(users: NetworkUser[], userId: string): NetworkUser[] {
  return users.filter((u) => u.parentId === userId);
}

export function countDescendants(users: NetworkUser[], userId: string): { subDealers: number; promoters: number } {
  const direct = getChildren(users, userId);
  let subDealers = 0;
  let promoters = 0;
  for (const child of direct) {
    if (child.group === 'Sub-dealer') {
      subDealers += 1;
      promoters += getChildren(users, child.id).filter((g) => g.group === 'Promoter').length;
    } else if (child.group === 'Promoter') {
      promoters += 1;
    }
  }
  return { subDealers, promoters };
}

export function validParentsFor(users: NetworkUser[], group: NetworkGroup): NetworkUser[] {
  if (group === 'Dealer') return [];
  if (group === 'Sub-dealer') return users.filter((u) => u.group === 'Dealer' && u.status === 'Active');
  return users.filter((u) => u.group === 'Sub-dealer' && u.status === 'Active');
}
