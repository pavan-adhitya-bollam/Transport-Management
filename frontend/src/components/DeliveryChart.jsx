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
  LineChart,
  Line,
} from 'recharts';

const DeliveryChart = () => {
  // Dummy data for the chart
  const data = [
    { name: 'Mon', delivered: 45, pending: 12 },
    { name: 'Tue', delivered: 52, pending: 18 },
    { name: 'Wed', delivered: 48, pending: 15 },
    { name: 'Thu', delivered: 61, pending: 22 },
    { name: 'Fri', delivered: 55, pending: 19 },
    { name: 'Sat', delivered: 38, pending: 10 },
    { name: 'Sun', delivered: 42, pending: 8 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
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
        <Bar dataKey="delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Delivered" />
        <Bar dataKey="pending" fill="#f97316" radius={[4, 4, 0, 0]} name="Pending" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DeliveryChart;
