import React from 'react';

// Loading skeleton component for table rows
export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: colIndex === 0 ? '60%' : '80%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// Loading skeleton component for cards
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mb-4" />
      <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2" />
    </div>
  );
};

// Loading skeleton component for analytics cards
export const AnalyticsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

// Loading skeleton component for delivery list
export const DeliveryListSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <TableSkeleton rows={5} columns={6} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Full page loading skeleton
export const PageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <AnalyticsCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  );
};

export default TableSkeleton;
