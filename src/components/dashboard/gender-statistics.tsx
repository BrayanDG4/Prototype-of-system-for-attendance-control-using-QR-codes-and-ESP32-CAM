"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { name: 'Masculino', value: 540 },
  { name: 'Femenino', value: 620 },
  { name: 'Otro', value: 85 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export function GenderStatistics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

