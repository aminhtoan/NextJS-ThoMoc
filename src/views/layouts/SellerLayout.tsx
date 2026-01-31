import React from 'react'

const SellerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f7fa' }}>
      <div style={{ padding: 24, textAlign: 'center', fontWeight: 'bold', fontSize: 24 }}>Seller Page</div>
      <main>{children}</main>
    </div>
  )
}

export default SellerLayout
