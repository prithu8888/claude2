// Dealer network mock data — v3
// Partner admin is the root of the hierarchy. Role ("group") is NEVER
// assigned directly — it's derived from parent_phone:
//   parent = Partner Admin → Dealer
//   parent = Dealer        → Sub-dealer
//   parent = Sub-dealer    → Promoter

export type NetworkGroup = 'Partner Admin' | 'Dealer' | 'Sub-dealer' | 'Promoter';

export interface NetworkUser {
  id: string;
  name: string;
  phone: string;
  parentId: string | null;
  pincode?: string;
  email?: string;
  status: 'Active' | 'Inactive';
}

// Mock dataset per spec — 15 users including the partner admin root
export const networkUsers: NetworkUser[] = [
  { id: 'root', name: 'Oppo India Admin', phone: '9800000000', parentId: null, status: 'Active' },

  // Dealers (parent = root)
  { id: 'd1', name: 'Mohammed Ali', phone: '9856789012', parentId: 'root', status: 'Active' },
  { id: 'd2', name: 'Priya Nair', phone: '9845678901', parentId: 'root', status: 'Active' },
  { id: 'd3', name: 'Arjun Sharma', phone: '9867890123', parentId: 'root', status: 'Active' },

  // Sub-dealers (parent = a Dealer)
  { id: 'sd1', name: 'Amit Singh', phone: '9812345678', parentId: 'd1', status: 'Active' },
  { id: 'sd2', name: 'Kavya M', phone: '9834567890', parentId: 'd1', status: 'Active' },
  { id: 'sd3', name: 'Rajan Kumar', phone: '9789012345', parentId: 'd2', status: 'Active' },
  { id: 'sd4', name: 'Meera S', phone: '9823456789', parentId: 'd2', status: 'Active' },

  // Promoters (parent = a Sub-dealer)
  { id: 'p1', name: 'Suresh R', phone: '9801234567', parentId: 'sd1', status: 'Active' },
  { id: 'p2', name: 'Deepa T', phone: '9890123456', parentId: 'sd1', status: 'Active' },
  { id: 'p3', name: 'Vijay S', phone: '9879012345', parentId: 'sd2', status: 'Active' },
  { id: 'p4', name: 'Rahul D', phone: '9868012345', parentId: 'sd2', status: 'Active' },
  { id: 'p5', name: 'Anand P', phone: '9857901234', parentId: 'sd3', status: 'Active' },
  { id: 'p6', name: 'Sunita B', phone: '9846890123', parentId: 'sd4', status: 'Active' },
  { id: 'p7', name: 'Kiran V', phone: '9835789012', parentId: 'sd4', status: 'Inactive' },
];

// ----- Hierarchy helpers -----

export function getParent(users: NetworkUser[], parentId: string | null): NetworkUser | undefined {
  if (!parentId) return undefined;
  return users.find((u) => u.id === parentId);
}

export function getParentName(users: NetworkUser[], parentId: string | null): string {
  if (!parentId) return '\u2014';
  return users.find((u) => u.id === parentId)?.name ?? 'Unknown';
}

export function getChildren(users: NetworkUser[], userId: string): NetworkUser[] {
  return users.filter((u) => u.parentId === userId);
}

/** Derive the role of a user by walking up the hierarchy to the root. */
export function deriveRole(users: NetworkUser[], user: NetworkUser): NetworkGroup {
  if (!user.parentId) return 'Partner Admin';
  const parent = getParent(users, user.parentId);
  if (!parent) return 'Partner Admin';
  if (!parent.parentId) return 'Dealer';           // parent is root
  const grandparent = getParent(users, parent.parentId);
  if (!grandparent || !grandparent.parentId) return 'Sub-dealer'; // parent is a Dealer
  return 'Promoter';                                 // parent is a Sub-dealer
}

/** What role will a new user get if added under this parent? */
export function deriveRoleForParent(users: NetworkUser[], parentId: string): NetworkGroup {
  const parent = getParent(users, parentId);
  if (!parent) return 'Dealer';
  if (!parent.parentId) return 'Dealer';
  const grand = getParent(users, parent.parentId);
  if (!grand || !grand.parentId) return 'Sub-dealer';
  return 'Promoter';
}

export function countDescendants(users: NetworkUser[], userId: string): { subDealers: number; promoters: number } {
  const direct = getChildren(users, userId);
  let subDealers = 0;
  let promoters = 0;
  for (const child of direct) {
    const role = deriveRole(users, child);
    if (role === 'Sub-dealer') {
      subDealers += 1;
      promoters += getChildren(users, child.id).filter((g) => deriveRole(users, g) === 'Promoter').length;
    } else if (role === 'Promoter') {
      promoters += 1;
    }
  }
  return { subDealers, promoters };
}

/**
 * Users who are valid parents for a *new* person. Everyone is valid except
 * Promoters (can't have reports) and Inactive users.
 */
export function validParentsForNew(users: NetworkUser[]): NetworkUser[] {
  return users.filter((u) => {
    if (u.status !== 'Active') return false;
    return deriveRole(users, u) !== 'Promoter';
  });
}

/**
 * Valid *horizontal* reassignment targets when moving a user. The user's role
 * must stay the same, so the new parent must be at the same level as the
 * current parent. We also exclude the current parent and any inactive users.
 */
export function validHorizontalParents(users: NetworkUser[], user: NetworkUser): NetworkUser[] {
  if (!user.parentId) return [];
  const currentParent = getParent(users, user.parentId);
  if (!currentParent) return [];
  const parentRole = deriveRole(users, currentParent);
  return users.filter((u) => {
    if (u.id === currentParent.id) return false;
    if (u.status !== 'Active') return false;
    return deriveRole(users, u) === parentRole;
  });
}

/** Whether a user can be moved horizontally. Partner Admin, Dealers and
 * Inactive users cannot be moved. */
export function canMove(users: NetworkUser[], user: NetworkUser): { allowed: boolean; reason?: string } {
  const role = deriveRole(users, user);
  if (role === 'Partner Admin') return { allowed: false, reason: 'Partner admin cannot be moved.' };
  if (role === 'Dealer') {
    return { allowed: false, reason: 'Dealers report directly to the partner admin and cannot be moved.' };
  }
  if (user.status !== 'Active') {
    return { allowed: false, reason: 'Inactive users must be reactivated first.' };
  }
  return { allowed: true };
}

/** Suggest up to N active peers (same role level) who could take over a
 * deactivated user's direct reports. */
export function suggestReassignments(users: NetworkUser[], user: NetworkUser, n = 2): NetworkUser[] {
  const role = deriveRole(users, user);
  return users
    .filter((u) => u.id !== user.id && u.status === 'Active' && deriveRole(users, u) === role)
    .slice(0, n);
}
