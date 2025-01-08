"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Semana 1', fallas: 4 },
  { name: 'Semana 2', fallas: 3 },
  { name: 'Semana 3', fallas: 2 },
  { name: 'Semana 4', fallas: 5 },
]

export function FailureStatistics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="fallas" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

