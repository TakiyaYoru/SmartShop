// src/components/common/Sidebar.jsx - Complete updated version
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  CubeIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ 
  isOpen = true, 
  onToggle, 
  type = 'admin'
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  // Admin Navigation - Updated
  const adminNavigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      current: location.pathname === '/admin'
    },
    {
      name: 'Sản phẩm',
      icon: CubeIcon,
      children: [
        { name: 'Quản lý sản phẩm', href: '/admin/products' },
        { name: 'Thêm sản phẩm', href: '/admin/products/create' },
        { name: 'Quản lý kho', href: '/admin/inventory' },
        { name: 'Import/Export', href: '/admin/products/import' },
      ]
    },
    {
      name: 'Danh mục',
      icon: TagIcon,
      children: [
        { name: 'Tất cả danh mục', href: '/admin/categories' },
        { name: 'Thêm danh mục', href: '/admin/categories/create' },
      ]
    },
    {
      name: 'Thương hiệu',
      icon: BuildingStorefrontIcon,
      children: [
        { name: 'Tất cả thương hiệu', href: '/admin/brands' },
        { name: 'Thêm thương hiệu', href: '/admin/brands/create' },
      ]
    },
    {
      name: 'Đơn hàng',
      href: '/admin/orders',
      icon: ShoppingCartIcon,
      current: location.pathname.startsWith('/admin/orders')
    },
    {
      name: 'Người dùng',
      href: '/admin/users',
      icon: UserGroupIcon,
      current: location.pathname.startsWith('/admin/users')
    },
    {
      name: 'Báo cáo',
      icon: ChartBarIcon,
      children: [
        { name: 'Doanh thu', href: '/admin/reports/revenue' },
        { name: 'Sản phẩm bán chạy', href: '/admin/reports/bestsellers' },
        { name: 'Khách hàng', href: '/admin/reports/customers' },
        { name: 'Tồn kho', href: '/admin/reports/inventory' },
      ]
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
      current: location.pathname.startsWith('/admin/settings')
    },
  ];

  // Filter Sidebar (cho trang products)
  const FilterSidebar = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Bộ lọc</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Khoảng giá</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Dưới 1 triệu</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">1 - 5 triệu</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">5 - 10 triệu</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Trên 10 triệu</span>
          </label>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Danh mục</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Điện thoại</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Laptop</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Tablet</span>
          </label>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Thương hiệu</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Apple</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Samsung</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">Xiaomi</span>
          </label>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Đánh giá</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">⭐⭐⭐⭐⭐ 5 sao</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">⭐⭐⭐⭐ 4 sao trở lên</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-600">⭐⭐⭐ 3 sao trở lên</span>
          </label>
        </div>
      </div>

      <button className="w-full btn btn-primary">
        Áp dụng bộ lọc
      </button>
    </div>
  );

  // Admin Sidebar
  const AdminSidebar = () => (
    <div className={`${isOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-xs text-gray-500">SmartShop</p>
              </div>
            </div>
          )}
          
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <ChevronLeftIcon className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {adminNavigation.map((item) => {
            if (item.children) {
              const isExpanded = expandedMenus[item.name];
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isExpanded 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      {isOpen && <span>{item.name}</span>}
                    </div>
                    {isOpen && (
                      isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )
                    )}
                  </button>
                  
                  {isOpen && isExpanded && (
                    <div className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`block px-6 py-2 text-sm rounded-lg transition-colors ${
                            location.pathname === child.href
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            SmartShop Admin v1.0.0
          </div>
        </div>
      )}
    </div>
  );

  // Render based on type
  switch (type) {
    case 'filter':
      return <FilterSidebar />;
    case 'admin':
      return <AdminSidebar />;
    default:
      return <AdminSidebar />;
  }
};

export default Sidebar;