import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const AnalyticsCard = ({ title, value, icon: Icon, change, changeType, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const bgColor = colorClasses[color] || 'bg-blue-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          {change && (
            <div className="flex items-center mt-2">
              {changeType === 'increase' ? (
                <FiArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <FiArrowDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${bgColor} bg-opacity-10 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${bgColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
