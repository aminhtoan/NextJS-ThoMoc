import { NextPage } from 'next/types'
import React from 'react'

type TProps = {}
const AdminPage: NextPage<TProps> = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Welcome to Admin Dashboard</h1>
    </div>
  )
}

export default AdminPage
