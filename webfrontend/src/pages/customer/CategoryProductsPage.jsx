import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../../components/customer/ProductGrid';
import { Filter } from 'lucide-react';

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
  }
];

const sampleCategories = [
  { _id: '1', name: 'Smartphones', description: 'Latest mobile phones and smartphones from all brands' },
  { _id: '2', name: 'Laptops', description: 'Powerful laptops for work, gaming and creative professionals' },
  { _id: '3', name: 'Smart Home', description: 'Devices to make your home smarter and more efficient' },
  { _id: '4', name: 'Wearables', description: 'Smartwatches, fitness trackers and wearable tech' },
  { _id: '5', name: 'Accessories', description: 'Headphones, chargers, cases and other accessories' },
];

const CategoryProductsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    // Simulate API call to get category details and products
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, these would be API calls
        setTimeout(() => {
          // Find category
          const foundCategory = sampleCategories.find(c => c._id === id);
          if (foundCategory) {
            setCategory(foundCategory);
          }
          
          // Filter products by category
          const filtered = sampleProducts.filter(product => product.category === id);
          
          // Sort products based on selected option
          const sorted = [...filtered].sort((a, b) => {
            switch (sortOption) {
              case 'price-asc':
                return a.price - b.price;
              case 'price-desc':
                return b.price - a.price;
              case 'name-asc':
                return a.name.localeCompare(b.name);
              case 'name-desc':
                return b.name.localeCompare(a.name);
              case 'newest':
              default:
                return 0;
            }
          });
          
          setProducts(sorted);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching category and products:', error);
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCategoryAndProducts();
    }
  }, [id, sortOption]);

  // Extract all unique brands from products
  const availableBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev];
      newRange[index] = value;
      return newRange;
    });
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category header */}
      <div className="bg-gray-900 text-white py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-bold">{category?.name || 'Loading...'}</h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            {category?.description || ''}
          </p>
        </div>
      </div>
      
      {/* Products section */}
      <div className="container-custom py-8">
        <div className="lg:flex">
          {/* Mobile filter button */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <button 
              onClick={toggleMobileFilters}
              className="flex items-center text-gray-700 text-sm font-medium"
            >
              <Filter size={18} className="mr-1" />
              Filters
            </button>
            <div>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
          
          {/* Filters sidebar */}
          <div className={`lg:w-1/4 pr-8 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([0, 2000]);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>
              
              {/* Brands filter */}
              {availableBrands.length > 0 && (
                <div className="py-4 border-t">
                  <h4 className="text-sm font-semibold mb-3">Brands</h4>
                  <div className="space-y-2">
                    {availableBrands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <input
                          id={`brand-${brand}`}
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`brand-${brand}`} 
                          className="ml-2 text-sm text-gray-700"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Price range filter */}
              <div className="py-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Price Range</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">${priceRange[0]}</span>
                  <span className="text-sm text-gray-600">${priceRange[1]}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full"
                  />
                </div>
                <div className="flex mt-4">
                  <div className="w-1/2 pr-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      min="0"
                      max={priceRange[1]}
                      className="w-full p-2 text-sm border border-gray-300 rounded"
                      placeholder="Min"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      min={priceRange[0]}
                      className="w-full p-2 text-sm border border-gray-300 rounded"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
              
              {/* Only show on mobile */}
              <div className="mt-4 lg:hidden">
                <button 
                  onClick={toggleMobileFilters}
                  className="w-full btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className={`lg:w-3/4 ${mobileFiltersOpen ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-semibold">{products.length}</span> products
              </p>
              <div className="hidden lg:block">
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
            
            <ProductGrid 
              products={products
                .filter(p => selectedBrands.length === 0 || selectedBrands.includes(p.brand))
                .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
              } 
              loading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;