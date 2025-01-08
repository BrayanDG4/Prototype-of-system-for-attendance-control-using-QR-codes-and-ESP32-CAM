"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Lun', asistencias: 120 },
  { name: 'Mar', asistencias: 130 },
  { name: 'Mié', asistencias: 125 },
  { name: 'Jue', asistencias: 135 },
  { name: 'Vie', asistencias: 140 },
]

export function AttendanceStatistics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="asistencias" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

