import { Paper } from '@mui/material'
import { NextPage } from 'next/types'
import React from 'react'

type TProps = {}
const PageAdmin: NextPage<TProps> = () => {
  return (
    <div style={{ padding: 24 }}>
      <Paper>
        <h1>Welcome to Admin Dashboard</h1>
      </Paper>
    </div>
  )
}

export default PageAdmin
