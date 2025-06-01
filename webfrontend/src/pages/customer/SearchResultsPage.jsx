import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/customer/ProductGrid';
import { Filter, SlidersHorizontal, LayoutGrid, LayoutList } from 'lucide-react';

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
  }
];

// Sample categories - will be replaced with API calls
const sampleCategories = [
  { _id: '1', name: 'Smartphones' },
  { _id: '2', name: 'Laptops' },
  { _id: '3', name: 'Smart Home' },
  { _id: '4', name: 'Wearables' },
  { _id: '5', name: 'Accessories' }
];

// Sample brands - will be replaced with API calls
const sampleBrands = [
  'Apple', 'Samsung', 'Google', 'Sony', 'Dell', 'Logitech'
];

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  
  const query = searchParams.get('q') || '';
  const brand = searchParams.get('brand') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    // If brand is specified in URL, add it to selected brands
    if (brand && !selectedBrands.includes(brand)) {
      setSelectedBrands([...selectedBrands, brand]);
    }
    
    // If category is specified in URL, add it to selected categories
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  }, [brand, category]);

  useEffect(() => {
    // Simulate API call to search products
    const searchProducts = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call with filters
        setTimeout(() => {
          let filtered = [...sampleProducts];
          
          // Apply search query filter
          if (query) {
            filtered = filtered.filter(product => 
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.description.toLowerCase().includes(query.toLowerCase())
            );
          }
          
          // Apply brand filter
          if (selectedBrands.length > 0) {
            filtered = filtered.filter(product => 
              selectedBrands.includes(product.brand)
            );
          }
          
          // Apply category filter
          if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => 
              selectedCategories.includes(product.category)
            );
          }
          
          // Apply price range filter
          filtered = filtered.filter(product => 
            product.price >= priceRange[0] && product.price <= priceRange[1]
          );
          
          setProducts(filtered);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error searching products:', error);
        setLoading(false);
      }
    };

    searchProducts();
  }, [query, selectedBrands, selectedCategories, priceRange]);

  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(updatedBrands);
  };

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(c => c !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
  };

  const handlePriceChange = (event, index) => {
    const value = parseInt(event.target.value);
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
  };
  
  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 2000]);
    setSearchParams({ q: query });
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold mb-8">
          {query 
            ? `Search Results for "${query}"` 
            : category 
              ? `${sampleCategories.find(c => c._id === category)?.name || 'Category'} Products` 
              : brand 
                ? `${brand} Products` 
                : 'All Products'}
        </h1>
        
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
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-white rounded border border-gray-300">
                <LayoutGrid size={16} />
              </button>
              <button className="p-2 rounded border border-transparent">
                <LayoutList size={16} />
              </button>
            </div>
          </div>
          
          {/* Filters sidebar */}
          <div className={`lg:w-1/4 pr-8 ${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear All
                </button>
              </div>
              
              {/* Categories filter */}
              <div className="py-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  {sampleCategories.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        id={`category-${category._id}`}
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`category-${category._id}`} 
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Brands filter */}
              <div className="py-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Brands</h4>
                <div className="space-y-2">
                  {sampleBrands.map((brand) => (
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
                Showing <span className="font-semibold">{products.length}</span> results
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
                <select 
                  id="sort" 
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
            
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;