// =============================
//  AclGuard - Component kiểm tra quyền truy cập (Access Control)
//  - Kiểm tra permission thực tế từ user.role.permissions
//  - Nếu page có set permission (VD: 'admin/products') thì check user có GET permission cho path đó không
//  - Nếu không có quyền → hiển thị 401
//  - /admin (dashboard) mặc định cho phép nếu đã đăng nhập
// =============================

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRouter } from 'next/router'
import { ReactNode } from 'react'

import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'
import { useAuth } from 'src/hooks/useAuth'
import Error401 from 'src/pages/401'
import BlankLayout from 'src/views/layouts/BlankLayout'
import { AbilityContext } from '../acl/Can'
import { METHOD_MAP } from 'src/configs/method'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
  permission?: string // Path quyền cần kiểm tra (VD: 'admin/products')
}

const AclGuard = (props: AclGuardProps) => {
  const { aclAbilities, children, guestGuard = false, authGuard = true, permission = '' } = props
  const auth = useAuth()
  const router = useRouter()

  // Nếu là guest route, route đặc biệt, hoặc không cần authGuard → cho qua
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    return <>{children}</>
  }

  // Chưa đăng nhập → không render gì (AuthGuard sẽ redirect)
  if (!auth.user) {
    return <>{children}</>
  }

  const roleName = auth.user.role.name
  const userPermissions = auth.user.role.permissions || []

  // Build ability từ permissions thực tế
  const ability: AppAbility = buildAbilityFor(roleName, userPermissions)

  // Kiểm tra role match với path root: /admin/* cần ADMIN, /seller/* cần SELLER
  if (router.pathname.startsWith('/admin') && !roleName.includes('ADMIN')) {
    return (
      <BlankLayout>
        <Error401 />
      </BlankLayout>
    )
  }

  if (router.pathname.startsWith('/seller') && !roleName.includes('SELLER')) {
    return (
      <BlankLayout>
        <Error401 />
      </BlankLayout>
    )
  }

  // ADMIN → có toàn quyền
  if (roleName === 'ADMIN') {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Nếu page không set permission (permission rỗng) → cho phép (VD: /admin dashboard)
  if (!permission) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Kiểm tra user có quyền READ (GET) cho page này không
  if (ability.can(METHOD_MAP.GET, permission)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Không có quyền → 401
  return (
    <BlankLayout>
      <Error401 />
    </BlankLayout>
  )
}

export default AclGuard
