'use client';

import React from 'react';
import { MaterialStats } from '@/lib/types';

interface StatsCardsProps {
  stats: MaterialStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Tổng vật liệu',
      value: stats.totalMaterials.toString(),
      color: 'bg-blue-500'
    },
    {
      title: 'Tổng giá trị',
      value: `$${stats.totalCost.toLocaleString()}`,
      color: 'bg-green-500'
    },
    {
      title: 'Đơn chờ xử lý',
      value: stats.pendingOrders.toString(),
      color: 'bg-yellow-500'
    },
    {
      title: 'Đã giao',
      value: stats.deliveredOrders.toString(),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className={`${card.color} rounded-full p-3 mr-4`}>
              <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}