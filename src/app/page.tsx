'use client';

import React, { useState, useEffect } from 'react';
import MaterialTable from '@/components/MaterialTable';
import MaterialForm from '@/components/MaterialForm';
import StatsCards from '@/components/StatsCards';
import { Material, MaterialStats } from '@/lib/types';

const API_URL = '/api/materials';

export default function Home() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stats, setStats] = useState<MaterialStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      const [materialsRes, statsRes] = await Promise.all([
        fetch(API_URL),
        fetch(`${API_URL}?stats=true`)
      ]);
      
      const materialsData = await materialsRes.json();
      const statsData = await statsRes.json();
      
      setMaterials(materialsData);
      setStats(statsData);
    } catch (error) {
      setNotification({ message: 'Không thể tải dữ liệu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingMaterial 
        ? `${API_URL}?id=${editingMaterial.id}`
        : API_URL;
      
      const method = editingMaterial ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed');
      
      setNotification({ 
        message: editingMaterial ? 'Cập nhật thành công' : 'Thêm mới thành công', 
        type: 'success' 
      });
      
      setShowForm(false);
      setEditingMaterial(null);
      fetchData();
    } catch (error) {
      setNotification({ message: 'Có lỗi xảy ra', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa vật liệu này?')) return;
    
    try {
      const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      
      if (!response.ok) throw new Error('Failed');
      
      setNotification({ message: 'Xóa thành công', type: 'success' });
      fetchData();
    } catch (error) {
      setNotification({ message: 'Không thể xóa', type: 'error' });
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🏗️ Construction Material Tracker
          </h1>
          <button
            onClick={() => {
              setEditingMaterial(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Thêm vật liệu
          </button>
        </div>

        {notification && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        {stats && <StatsCards stats={stats} />}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingMaterial ? 'Chỉnh sửa vật liệu' : 'Thêm vật liệu mới'}
              </h2>
              <MaterialForm
                initialData={editingMaterial}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMaterial(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Danh sách vật liệu</h2>
          </div>
          <MaterialTable
            materials={materials}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}