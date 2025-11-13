export type UserRole = 'admin' | 'partner' | 'user';

export const roleHierarchy: Record<UserRole, number> = {
  admin: 3,
  partner: 2,
  user: 1,
};

export const hasRequiredRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'partner':
      return '/dashboard/partner';
    case 'user':
    default:
      return '/dashboard/public';
  }
};

export const getAccessLevelFromRole = (role: UserRole): 'admin' | 'partner' | 'public' => {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'partner':
      return 'partner';
    case 'user':
    default:
      return 'public';
  }
};
