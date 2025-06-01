import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../../components/customer/ProductGrid';
import { ChevronRight } from 'lucide-react';

// Sample data - will be replaced with API calls
const sampleProducts = [
  {
    _id: '1',
    name: 'iPhone 13 Pro Max',
    description: 'Apple\'s latest flagship phone with ProMotion display and A15 Bionic chip.',
    price: 1099,
    originalPrice: 1299,
    images: ['https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    brand: 'Apple',
    sku: 'IP13PM256',
    stock: 15,
    isFeatured: true
  },
  {
    _id: '2',
    name: 'Samsung Galaxy S21',
    description: 'Flagship Android phone with excellent camera and performance.',
    price: 799,
    originalPrice: 999,
    images: ['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    brand: 'Samsung',
    sku: 'SGS21-128',
    stock: 20
  },
  {
    _id: '3',
    name: 'MacBook Pro 14"',
    description: 'Powerful laptop with M1 Pro chip and amazing battery life.',
    price: 1999,
    originalPrice: 2199,
    images: ['https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '2',
    brand: 'Apple',
    sku: 'MBP14-512',
    stock: 5,
    isFeatured: true
  },
  {
    _id: '4',
    name: 'Google Nest Hub',
    description: 'Smart home assistant with display for your connected home.',
    price: 99,
    originalPrice: 129,
    images: ['https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '3',
    brand: 'Google',
    sku: 'GNH-001',
    stock: 50
  },
  {
    _id: '5',
    name: 'Apple Watch Series 7',
    description: 'Advanced health tracking and connectivity on your wrist.',
    price: 399,
    originalPrice: 429,
    images: ['https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '4',
    brand: 'Apple',
    sku: 'AWS7-41',
    stock: 30,
    isFeatured: true
  },
  {
    _id: '6',
    name: 'Sony WH-1000XM4',
    description: 'Industry-leading noise cancellation headphones with exceptional sound quality.',
    price: 349,
    originalPrice: 399,
    images: ['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '5',
    brand: 'Sony',
    sku: 'SWXM4-BLK',
    stock: 25
  },
  {
    _id: '7',
    name: 'Dell XPS 13',
    description: 'Compact yet powerful Windows laptop with InfinityEdge display.',
    price: 1299,
    originalPrice: 1499,
    images: ['https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '2',
    brand: 'Dell',
    sku: 'DXPS13-512',
    stock: 12
  },
  {
    _id: '8',
    name: 'Amazon Echo Dot',
    description: 'Compact smart speaker with Alexa voice assistant.',
    price: 49.99,
    originalPrice: 59.99,
    images: ['https://images.pexels.com/photos/4790253/pexels-photo-4790253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '3',
    brand: 'Amazon',
    sku: 'AED4-BLK',
    stock: 100
  },
  {
    _id: '9',
    name: 'Logitech MX Master 3',
    description: 'Advanced wireless mouse for productivity and creative work.',
    price: 99.99,
    originalPrice: 119.99,
    images: ['https://images.pexels.com/photos/3937174/pexels-photo-3937174.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '5',
    brand: 'Logitech',
    sku: 'LMM3-GRY',
    stock: 40
  },
  {
    _id: '10',
    name: 'iPad Air',
    description: 'Powerful tablet with A14 Bionic chip and beautiful display.',
    price: 599,
    originalPrice: 649,
    images: ['https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'],
    category: '1',
    brand: 'Apple',
    sku: 'IPA-64-GRY',
    stock: 25
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    const loadData = async () => {
      try {
        // In a real implementation, these would be API calls
        setTimeout(() => {
          setFeaturedProducts(sampleProducts.filter(p => p.isFeatured));
          setNewArrivals(sampleProducts.slice(0, 5));
          setBestSellers(sampleProducts.slice(5, 10));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 md:py-24">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Find Your Perfect Smart Device
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Explore our collection of the latest smartphones, laptops, and smart home gadgets.
              </p>
              <div className="space-x-4">
                <Link 
                  to="/category/1" 
                  className="btn-primary bg-white text-blue-700 hover:bg-blue-50"
                >
                  Shop Now
                </Link>
                <Link 
                  to="/category/3" 
                  className="btn-secondary bg-transparent text-white border border-white hover:bg-white/10"
                >
                  Smart Home
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Latest tech gadgets" 
                className="max-w-full rounded-lg shadow-lg transform md:scale-110 md:translate-x-6"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-semibold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link to="/category/1" className="group">
              <div className="bg-gray-100 p-4 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  <img
                    src="https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Smartphones"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium">Smartphones</h3>
              </div>
            </Link>
            <Link to="/category/2" className="group">
              <div className="bg-gray-100 p-4 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  <img
                    src="https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Laptops"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium">Laptops</h3>
              </div>
            </Link>
            <Link to="/category/3" className="group">
              <div className="bg-gray-100 p-4 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  <img
                    src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Smart Home"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium">Smart Home</h3>
              </div>
            </Link>
            <Link to="/category/4" className="group">
              <div className="bg-gray-100 p-4 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  <img
                    src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Wearables"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium">Wearables</h3>
              </div>
            </Link>
            <Link to="/category/5" className="group">
              <div className="bg-gray-100 p-4 rounded-lg text-center transition-all duration-300 hover:shadow-md hover:bg-blue-50">
                <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                  <img
                    src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Accessories"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-sm font-medium">Accessories</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <Link to="/category/featured" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">New Arrivals</h2>
            <Link to="/category/new" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <ProductGrid products={newArrivals} loading={loading} />
        </div>
      </section>
      
      {/* Banner */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Special Offers on Smart Home Devices</h2>
              <p className="text-gray-300 mb-6">
                Transform your home with our smart devices. Get up to 30% off this month only.
              </p>
              <Link to="/category/3" className="btn-primary">Shop Smart Home</Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.pexels.com/photos/4219537/pexels-photo-4219537.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Smart Home Devices" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Best Sellers</h2>
            <Link to="/category/best" className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} />
        </div>
      </section>
      
      {/* Brands */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-semibold mb-8 text-center">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8">
            {['Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'Logitech'].map((brand, index) => (
              <Link 
                key={index}
                to={`/search?brand=${brand}`}
                className="flex items-center justify-center p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-lg font-medium">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;