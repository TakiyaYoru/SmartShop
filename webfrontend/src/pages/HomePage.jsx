// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/common/Layout';
import { 
  CubeIcon, 
  ShoppingCartIcon, 
  ChartBarIcon,
  TagIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      name: 'Sản phẩm',
      description: 'Khám phá hàng nghìn sản phẩm chất lượng cao',
      icon: CubeIcon,
      href: '/products',
      color: 'blue'
    },
    {
      name: 'Danh mục',
      description: 'Duyệt theo các danh mục sản phẩm',
      icon: TagIcon,
      href: '/categories',
      color: 'purple'
    },
    {
      name: 'Thương hiệu',
      description: 'Các thương hiệu uy tín hàng đầu',
      icon: BuildingStorefrontIcon,
      href: '/brands',
      color: 'green'
    },
    {
      name: 'Giỏ hàng',
      description: 'Quản lý giỏ hàng của bạn',
      icon: ShoppingCartIcon,
      href: '/cart',
      color: 'yellow'
    },
    {
      name: 'Yêu thích',
      description: 'Sản phẩm bạn đã lưu',
      icon: HeartIcon,
      href: '/wishlist',
      color: 'pink'
    },
    {
      name: 'Đơn hàng',
      description: 'Theo dõi trạng thái đơn hàng',
      icon: TruckIcon,
      href: '/orders',
      color: 'indigo'
    }
  ];

  const benefits = [
    {
      title: 'Miễn phí vận chuyển',
      description: 'Cho đơn hàng trên 500,000đ',
      icon: '🚚'
    },
    {
      title: 'Bảo hành chính hãng',
      description: 'Cam kết 100% hàng chính hãng',
      icon: '🛡️'
    },
    {
      title: 'Đổi trả dễ dàng',
      description: 'Trong vòng 30 ngày',
      icon: '🔄'
    },
    {
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn mọi lúc mọi nơi',
      icon: '💬'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
      pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chào mừng đến với <span className="text-yellow-300">SmartShop</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Nền tảng thương mại điện tử hiện đại với hàng triệu sản phẩm chất lượng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* User Welcome */}
      {user && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Xin chào, {user.firstName}! 👋
                  </h2>
                  <p className="text-gray-600">
                    Sẵn sàng khám phá những sản phẩm mới hôm nay?
                  </p>
                </div>
                {(user.role === 'admin' || user.role === 'manager') && (
                  <Link
                    to="/admin"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    🚀 Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá đầy đủ các tính năng của SmartShop để có trải nghiệm mua sắm tuyệt vời nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                to={feature.href}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${getColorClasses(feature.color)}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Xem ngay
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn SmartShop?
            </h2>
            <p className="text-gray-600">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bắt đầu mua sắm ngay hôm nay!
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng triệu khách hàng đã tin tưởng SmartShop. 
            Đăng ký ngay để nhận ưu đãi đặc biệt cho thành viên mới.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
            {!user && (
              <Link
                to="/register"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Đăng ký miễn phí
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;