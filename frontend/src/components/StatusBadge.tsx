import React from 'react';
import { OrderStatus, PaymentStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyles = () => {
    switch (status) {
      case 'PLACED':
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PREPARING':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse';
      case 'READY':
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'COLLECTED':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'CANCELLED':
      case 'FAILED':
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider ${getStyles()} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {status.replace('_', ' ')}
    </span>
  );
};
