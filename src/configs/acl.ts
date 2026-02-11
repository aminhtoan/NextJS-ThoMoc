import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'

export type AppAbility = MongoAbility<[Actions, Subjects]>

export type ACLObj = {
  action: Actions
  subject: string
}

export type UserPermission = {
  id: number
  path: string
  method: string
  module: string
}

/**
 * Map HTTP method to CASL action
 */
const mapMethodToAction = (method: string): Actions => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'READ'
    case 'POST':
      return 'CREATE'
    case 'PUT':
    case 'PATCH':
      return 'UPDATE'
    case 'DELETE':
      return 'DELETE'
    default:
      return 'READ'
  }
}

/**
 * Build CASL ability rules based on user's actual permissions from the server.
 * - ADMIN role: can manage all
 * - Other roles: check permissions array from user.role.permissions
 *   Each permission has { path, method, module }
 *   We map method (GET/POST/PUT/DELETE) to CASL actions (read/create/update/delete)
 *   And use the permission MODULE as the CASL subject (e.g. "MANAGE-PRODUCT", "ROLE", "ORDER")
 */

const defineRulesFor = (roleName: string, permissions: UserPermission[]) => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility as any)
  if (roleName === 'ADMIN') {
    can('manage', 'all')
  } else if (permissions && permissions.length > 0) {
    for (const perm of permissions) {
      const action = mapMethodToAction(perm.method)
      can(action, perm.module)
    }
  }

  return build()
}

/**
 * Build ability for a user
 * @param roleName - User's role name (ADMIN, CLIENT, SELLER, etc.)
 * @param permissions - User's actual permissions from role.permissions
 */
export const buildAbilityFor = (roleName: string, permissions: UserPermission[]): AppAbility => {
  return defineRulesFor(roleName, permissions)
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
