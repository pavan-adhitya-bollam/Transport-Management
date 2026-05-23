import React from 'react';
import { FiBox, FiPackage, FiUsers, FiTruck, FiCalendar } from 'react-icons/fi';

const EmptyState = ({ 
  icon = FiBox, 
  title = 'No data found', 
  description = 'There is no data to display at the moment.',
  actionText,
  onAction
}) => {
  const Icon = icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

// Pre-configured empty states for different contexts
export const EmptyDeliveries = ({ onAction }) => (
  <EmptyState
    icon={FiPackage}
    title="No deliveries found"
    description="There are no deliveries to display. Create your first delivery to get started."
    actionText="Add Delivery"
    onAction={onAction}
  />
);

export const EmptyDrivers = ({ onAction }) => (
  <EmptyState
    icon={FiUsers}
    title="No drivers found"
    description="There are no drivers registered yet. Add drivers to start managing your team."
    actionText="Add Driver"
    onAction={onAction}
  />
);

export const EmptyVehicles = ({ onAction }) => (
  <EmptyState
    icon={FiTruck}
    title="No vehicles found"
    description="There are no vehicles registered yet. Add vehicles to your fleet to get started."
    actionText="Add Vehicle"
    onAction={onAction}
  />
);

export const EmptySchedule = () => (
  <EmptyState
    icon={FiCalendar}
    title="No scheduled deliveries"
    description="There are no deliveries scheduled for this time period."
  />
);

export default EmptyState;
