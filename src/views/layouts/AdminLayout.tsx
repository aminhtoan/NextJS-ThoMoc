import React from 'react'

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ padding: 24, textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>Admin Page</div>
      <main>{children}</main>
    </div>
  )
}

export default AdminLayout
