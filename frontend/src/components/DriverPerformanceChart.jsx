import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DriverPerformanceChart = ({ data }) => {
  const chartData = data.map((driver) => ({
    name: driver.name,
    completed: driver.completedDeliveries,
    inProgress: driver.inProgressDeliveries,
    rate: parseFloat(driver.completionRate),
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
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
        <Bar dataKey="completed" fill="#10b981" radius={[0, 4, 4, 0]} name="Completed" />
        <Bar dataKey="inProgress" fill="#3b82f6" radius={[0, 4, 4, 0]} name="In Progress" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DriverPerformanceChart;
