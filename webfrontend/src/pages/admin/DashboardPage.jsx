// src/pages/admin/DashboardPage.jsx
import React from 'react';
import {
  CubeIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

import ProductTable from './products/ProductTable';
import ProductFilter from './products/ProductFilter';

const DashboardPage = () => {
  // Mock data - sẽ được thay thế bằng real data sau
  const stats = [
    {
      name: 'Tổng sản phẩm',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: CubeIcon,
      color: 'blue'
    },
    {
      name: 'Đơn hàng mới',
      value: '56',
      change: '+8%',
      changeType: 'positive',
      icon: ShoppingCartIcon,
      color: 'green'
    },
    {
      name: 'Khách hàng',
      value: '2,345',
      change: '+15%',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'purple'
    },
    {
      name: 'Doanh thu',
      value: '₫234M',
      change: '-2%',
      changeType: 'negative',
      icon: ChartBarIcon,
      color: 'red'
    }
  ];

  const getColorClasses = (color, type = 'bg') => {
    const colors = {
      blue: type === 'bg' ? 'bg-blue-500' : 'text-blue-600',
      green: type === 'bg' ? 'bg-green-500' : 'text-green-600',
      purple: type === 'bg' ? 'bg-purple-500' : 'text-purple-600',
      red: type === 'bg' ? 'bg-red-500' : 'text-red-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại! 👋
        </h1>
        <p className="text-blue-100">
          Đây là tổng quan về hoạt động kinh doanh của SmartShop
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} từ tháng trước
                </p>
              </div>
              <div className={`w-12 h-12 ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <ShoppingCartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tính năng đang phát triển</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Thao tác nhanh</h3>
          </div>
          <div className="p-6 space-y-3">
            <button className="w-full btn btn-primary justify-start">
              <CubeIcon className="h-5 w-5 mr-3" />
              Thêm sản phẩm mới
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <TagIcon className="h-5 w-5 mr-3" />
              Quản lý danh mục
            </button>
            <button className="w-full btn btn-secondary justify-start">
              <BuildingStorefrontIcon className="h-5 w-5 mr-3" />
              Quản lý thương hiệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;