import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCarousel from '../../components/customer/ProductCarousel';
import { ShoppingCart, Heart, Share, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ProductGrid from '../../components/customer/ProductGrid';

// Sample data - will be replaced with API calls
const sampleProducts = [
  {
    _id: '1',
    name: 'iPhone 13 Pro Max',
    description: 'The iPhone 13 Pro Max features a 6.7-inch Super Retina XDR display with ProMotion technology for faster, more responsive performance. The A15 Bionic chip powers incredible experiences in photography, video and gaming, with up to 22 hours of battery life.\n\n- 6.7-inch Super Retina XDR display with ProMotion\n- A15 Bionic chip with 6-core CPU and 5-core GPU\n- Pro 12MP camera system with telephoto, wide and ultra-wide cameras\n- Cinematic mode in 1080p at 30fps\n- Up to 28 hours video playback\n- Face ID facial recognition',
    price: 1099,
    originalPrice: 1299,
    images: [
      'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
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
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    // Simulate API call to get product details
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would be an API call
        setTimeout(() => {
          const foundProduct = sampleProducts.find(p => p._id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Get related products from the same category
            const related = sampleProducts
              .filter(p => p.category === foundProduct.category && p._id !== foundProduct._id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error loading product:', error);
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/5 bg-gray-100 rounded-lg animate-pulse h-[400px]"></div>
          <div className="w-full lg:w-3/5">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  // Format description with paragraphs
  const formattedDescription = product.description?.split('\n\n').map((paragraph, i) => (
    <p key={i} className="mb-4">
      {paragraph.includes('\n') ? (
        paragraph.split('\n').map((line, j) => (
          <React.Fragment key={j}>
            {line}
            {j < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))
      ) : (
        paragraph
      )}
    </p>
  ));

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container-custom">
          <nav className="text-sm">
            <ol className="list-none p-0 flex flex-wrap">
              <li className="flex items-center">
                <Link to="/" className="text-gray-500 hover:text-blue-600">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-blue-600">
                  {product.category === '1' ? 'Smartphones' : 
                   product.category === '2' ? 'Laptops' :
                   product.category === '3' ? 'Smart Home' :
                   product.category === '4' ? 'Wearables' : 'Accessories'}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 truncate max-w-[200px] sm:max-w-none">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Product detail section */}
      <section className="py-8">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product images */}
            <div className="w-full lg:w-2/5">
              <div className="bg-white rounded-lg p-4 h-[400px] md:h-[500px] border">
                <ProductCarousel images={product.images} />
              </div>
            </div>
            
            {/* Product info */}
            <div className="w-full lg:w-3/5">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">{product.name}</h1>
              
              <div className="flex items-center text-sm mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      size={16} 
                      className={star <= 4 ? "fill-current" : ""} 
                    />
                  ))}
                </div>
                <span className="text-gray-500">4.0 (24 reviews)</span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500">SKU: {product.sku}</span>
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="ml-3 bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded">
                        Save {discountPercentage}%
                      </span>
                    )}
                  </>
                )}
              </div>
              
              <div className="mb-6 text-sm text-gray-700 leading-relaxed">
                <p>{product.description?.split('\n\n')[0]}</p>
              </div>
              
              {/* Stock status */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 10
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 10
                    ? 'In Stock'
                    : product.stock > 0
                    ? `Low Stock (${product.stock} left)`
                    : 'Out of Stock'}
                </span>
              </div>
              
              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.stock}
                      className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-0 focus:border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`btn-primary py-3 px-8 text-base flex-1 ${
                    product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  className="btn-secondary py-3 px-4"
                >
                  <Heart size={20} />
                </button>
                <button
                  className="btn-secondary py-3 px-4"
                >
                  <Share size={20} />
                </button>
              </div>
              
              {/* Product features */}
              <div className="border-t border-b py-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Truck size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Free Delivery</p>
                    <p className="text-xs text-gray-500">Orders over $50</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <ShieldCheck size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">2 Year Warranty</p>
                    <p className="text-xs text-gray-500">Full coverage</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <RotateCcw size={20} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">30 Day Returns</p>
                    <p className="text-xs text-gray-500">Hassle-free returns</p>
                  </div>
                </div>
              </div>
              
              {/* Brand and category info */}
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Brand:</span>{' '}
                  <Link to={`/search?brand=${product.brand}`} className="text-blue-600 hover:underline">
                    {product.brand}
                  </Link>
                </p>
                <p>
                  <span className="font-medium">Category:</span>{' '}
                  <Link to={`/category/${product.category}`} className="text-blue-600 hover:underline">
                    {product.category === '1' ? 'Smartphones' : 
                     product.category === '2' ? 'Laptops' :
                     product.category === '3' ? 'Smart Home' :
                     product.category === '4' ? 'Wearables' : 'Accessories'}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product details tabs */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button className="text-blue-600 border-b-2 border-blue-600 py-4 px-6 font-medium">
                  Description
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-6 font-medium">
                  Specifications
                </button>
                <button className="text-gray-500 hover:text-gray-700 py-4 px-6 font-medium">
                  Reviews
                </button>
              </nav>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed">
                {formattedDescription}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related products */}
      <section className="py-12">
        <div className="container-custom">
          <ProductGrid 
            products={relatedProducts} 
            title="You might also like"
          />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;