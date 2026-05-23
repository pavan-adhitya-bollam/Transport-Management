import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MonthlyStatsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar dataKey="Pending" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Pending" />
        <Bar dataKey="Scheduled" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Scheduled" />
        <Bar dataKey="In Transit" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="In Transit" />
        <Bar dataKey="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyStatsChart;
