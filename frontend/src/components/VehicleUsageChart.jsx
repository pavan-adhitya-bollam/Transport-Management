import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const VehicleUsageChart = ({ data }) => {
  if (!data || !data.usageByType) {
    return <p className="text-gray-500 text-center py-8">No vehicle data available</p>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const chartData = data.usageByType.map((item) => ({
    name: item._id,
    value: item.count,
    available: item.available,
    inUse: item.inUse,
  }));

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Total: {data.value}</p>
          <p className="text-sm text-green-600">Available: {data.available}</p>
          <p className="text-sm text-blue-600">In Use: {data.inUse}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={renderCustomTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default VehicleUsageChart;
