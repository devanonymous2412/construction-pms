'use client';

import React from 'react';
import { Material } from '@/lib/types';

interface MaterialTableProps {
  materials: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<Material['status'], string> = {
  pending: 'Chờ xử lý',
  in_transit: 'Đang vận chuyển',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy'
};

const statusColors: Record<Material['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_transit: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function MaterialTable({ materials, onEdit, onDelete }: MaterialTableProps) {
  if (materials.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-gray-500">
        Chưa có vật liệu nào
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhà cung cấp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {materials.map((material) => (
            <tr key={material.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.quantity} {material.unit}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${material.unitPrice.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${material.totalCost.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[material.status]}`}>
                  {statusLabels[material.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.supplier}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button onClick={() => onEdit(material)} className="text-blue-600 hover:text-blue-800 mr-3">Sửa</button>
                <button onClick={() => onDelete(material.id)} className="text-red-600 hover:text-red-800">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}