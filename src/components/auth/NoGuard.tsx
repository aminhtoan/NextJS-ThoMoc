// =============================
//  AclGuard - Component kiểm tra quyền truy cập (Access Control)
//  - Sử dụng cho các route cần phân quyền
//  - Sử dụng các hooks: useAuth, useRouter
//  - Import các thành phần liên quan đến quyền (Ability, ACLObj, etc.)
//  - Nếu không đủ quyền sẽ render trang 401 hoặc layout trắng
// =============================

/* eslint-disable @typescript-eslint/no-unused-vars */

// ** Next Import: Dùng để điều hướng route

// ** React Imports: Định nghĩa kiểu cho props.children
import { ReactElement, ReactNode } from 'react'

// ** Hooks: Lấy thông tin user đăng nhập
import { useAuth } from 'src/hooks/useAuth'

// Interface định nghĩa props cho AclGuard
interface AclGuardProps {
  children: ReactNode // Component con sẽ được bảo vệ quyền
  fallback: ReactElement | null // Component hiển thị khi không cần kiểm tra quyền
}

const NoGuard = (props: AclGuardProps) => {
  // ** Props: Lấy các props truyền vào
  const { fallback, children } = props
  const auth = useAuth() // Lấy thông tin user hiện tại

  // Nếu user có đủ quyền thì truyền ability xuống context và render children
  if (auth.loading) {
    return fallback
  }

  // Nếu không đủ quyền thì render trang 401 trong layout trắng
  return <>{children}</>
}

export default NoGuard
