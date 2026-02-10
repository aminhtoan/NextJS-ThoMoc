import { Box, Typography } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import React from 'react'

interface RoleChartProps {
  data: { name: string; value: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FD0', '#FF5C8D']

const RoleChart: React.FC<RoleChartProps> = ({ data }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography variant='h6' sx={{ mb: 2 }}>
        Tỷ lệ người dùng theo vai trò
      </Typography>
      <ResponsiveContainer width='100%' height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            nameKey='name'
            cx='50%'
            cy='50%'
            outerRadius={80}
            fill='#8884d8'
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default RoleChart
