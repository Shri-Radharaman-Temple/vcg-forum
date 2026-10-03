import type { Permission, Role, User } from '@/types'

/**
 * RBAC (spec §20).
 *
 * Nothing in the UI branches on a role name. Components ask `can(user, perm)`
 * and the permission set is what actually gates the feature, so an admin can
 * define a new role later without a code change.
 */

export const ALL_PERMISSIONS: Permission[] = [
  'sadhna.view',
  'sadhna.create',
  'sadhna.edit',
  'sadhna.delete',
  'feed.view',
  'feed.create',
  'feed.comment',
  'feed.like',
  'feed.save',
  'feed.report',
  'feed.moderate',
  'chat.view',
  'chat.dm',
  'chat.group.view',
  'chat.group.create',
  'chat.group.manage',
  'resource.view',
  'resource.create',
  'resource.edit',
  'resource.delete',
  'event.view',
  'event.create',
  'event.edit',
  'event.delete',
  'admin.users.approve',
  'admin.users.suspend',
  'admin.reports.manage',
  'admin.roles.manage',
]

const DEVOTEE_PERMISSIONS: Permission[] = [
  'sadhna.view',
  'sadhna.create',
  'sadhna.edit',
  'sadhna.delete',
  'feed.view',
  'feed.create',
  'feed.comment',
  'feed.like',
  'feed.save',
  'feed.report',
  'chat.view',
  'chat.dm',
  'chat.group.view',
  'resource.view',
  'event.view',
]

const MODERATOR_PERMISSIONS: Permission[] = [
  ...DEVOTEE_PERMISSIONS,
  'feed.moderate',
  'admin.reports.manage',
  'chat.group.manage',
]

const ADMIN_PERMISSIONS: Permission[] = [
  ...MODERATOR_PERMISSIONS,
  'chat.group.create',
  'resource.create',
  'resource.edit',
  'resource.delete',
  'event.create',
  'event.edit',
  'event.delete',
  'admin.users.approve',
  'admin.users.suspend',
]

export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full access to the entire system, including roles and settings.',
    permissions: ALL_PERMISSIONS,
    system: true,
    memberCount: 2,
  },
  {
    id: 'admin',
    name: 'Admin',
    description:
      'Operational administrator — approvals, moderation, resources, events.',
    permissions: ADMIN_PERMISSIONS,
    system: true,
    memberCount: 5,
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Community moderation — reports, hiding content, locking threads.',
    permissions: MODERATOR_PERMISSIONS,
    system: true,
    memberCount: 9,
  },
  {
    id: 'devotee',
    name: 'Initiated Devotee',
    description: 'The primary application user.',
    permissions: DEVOTEE_PERMISSIONS,
    system: true,
    memberCount: 814,
  },
  {
    id: 'content_curator',
    name: 'Content Curator',
    description:
      'Volunteer responsible for books, audio, video and educational content.',
    permissions: [
      ...DEVOTEE_PERMISSIONS,
      'resource.create',
      'resource.edit',
      'event.create',
    ],
    system: false,
    memberCount: 4,
  },
]

export function permissionsForRoles(roleIds: string[]): Permission[] {
  const set = new Set<Permission>()
  for (const id of roleIds) {
    const role = ROLES.find((r) => r.id === id)
    role?.permissions.forEach((p) => set.add(p))
  }
  return [...set]
}

/** The single gate. Suspended or unapproved accounts hold no permissions. */
export function can(
  user: Pick<User, 'permissions' | 'status'> | null | undefined,
  permission: Permission,
): boolean {
  if (!user) return false
  if (user.status !== 'ACTIVE' && user.status !== 'APPROVED') return false
  return user.permissions.includes(permission)
}

export function canAny(
  user: Pick<User, 'permissions' | 'status'> | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => can(user, p))
}

/** Whether the devotee should see the application at all, or the waiting screen. */
export function hasAppAccess(user: Pick<User, 'status'> | null | undefined) {
  return user?.status === 'ACTIVE' || user?.status === 'APPROVED'
}

/** Anything under /admin requires at least one administrative permission. */
export const ADMIN_PERMISSIONS_ANY: Permission[] = [
  'admin.users.approve',
  'admin.users.suspend',
  'admin.reports.manage',
  'admin.roles.manage',
  'feed.moderate',
  'resource.create',
  'event.create',
]
