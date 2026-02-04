// =============================
//  AclGuard - Component kiểm tra quyền truy cập (Access Control)
//  - Sử dụng cho các route cần phân quyền
//  - Sử dụng các hooks: useAuth, useRouter
//  - Import các thành phần liên quan đến quyền (Ability, ACLObj, etc.)
//  - Nếu không đủ quyền sẽ render trang 401 hoặc layout trắng
// =============================

/* eslint-disable @typescript-eslint/no-unused-vars */

// ** Next Import: Dùng để điều hướng route
import { useRouter } from 'next/router'

// ** React Imports: Định nghĩa kiểu cho props.children
import { ReactNode } from 'react'

// ** Types: Import các kiểu và hàm xây dựng quyền
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'

// ** Hooks: Lấy thông tin user đăng nhập
import { useAuth } from 'src/hooks/useAuth'

// ** Pages: Trang lỗi 401 khi không đủ quyền
import Error401 from 'src/pages/401'

// ** Layouts: Layout trắng cho các trang không cần layout chính
import BlankLayout from 'src/views/layouts/BlankLayout'

// ** ACL Context: Context để truyền quyền xuống các component con
import { AbilityContext } from '../acl/Can'

// Interface định nghĩa props cho AclGuard
interface AclGuardProps {
  children: ReactNode // Component con sẽ được bảo vệ quyền
  authGuard?: boolean // Có cần kiểm tra đăng nhập không
  guestGuard?: boolean // Chỉ cho phép guest truy cập
  aclAbilities: ACLObj // Đối tượng quyền truy cập
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props: Lấy các props truyền vào
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props
  const auth = useAuth() // Lấy thông tin user hiện tại
  const router = useRouter() // Dùng để điều hướng

  let ability: AppAbility // Biến lưu quyền của user

  // Nếu đã đăng nhập và chưa có ability thì build ability cho user
  if (auth.user && !ability) {
    // Xây dựng ability dựa trên role của user và subject được truyền vào
    ability = buildAbilityFor(auth.user.role.name, aclAbilities.subject)
  }

  // Nếu là guest hoặc route đặc biệt hoặc không cần authGuard
  if (guestGuard || router.route === '/500' || router.route === '/404' || !authGuard) {
    // Nếu đã có user và ability thì truyền ability xuống context
    if (auth.user && !ability) {
      return <AbilityContext.Provider value={ability!}>{children}</AbilityContext.Provider>
    } else {
      // Nếu không thì render children bình thường

      return <>{children}</>
    }
  }

  // Nếu user có đủ quyền thì truyền ability xuống context và render children
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability!}>{children}</AbilityContext.Provider>
  }
  
  // Nếu không đủ quyền thì render trang 401 trong layout trắng
  return (
    <BlankLayout>
      <Error401 />
    </BlankLayout>
  )
}

export default AclGuard
