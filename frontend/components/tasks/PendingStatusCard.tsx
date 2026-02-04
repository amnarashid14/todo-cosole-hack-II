'use client';

import React from 'react';
import { StatusCardProps } from '../../types/tasks';

const PendingStatusCard: React.FC<StatusCardProps> = ({ title, count, onClick }) => {
  return (
    <div className="h-full flex flex-col cursor-pointer" onClick={onClick}>
      <h3 className="text-lg font-semibold text-black mb-4 flex-grow">{title}</h3>
      <p className="text-3xl font-bold text-black text-center mb-4">{count}</p>
      <div className="text-sm text-gray-600">
        Pending tasks
      </div>
    </div>
  );
};

export default PendingStatusCard;