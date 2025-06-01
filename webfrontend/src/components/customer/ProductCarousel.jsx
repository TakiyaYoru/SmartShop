import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const defaultImage = 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  const imageList = images && images.length > 0 ? images : [defaultImage];

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageList.length) % imageList.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (imageList.length <= 1) return;
    
    const interval = setInterval(() => {
      goToNext();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [imageList.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (diff > 50) { // Swipe left, go next
      goToNext();
    } else if (diff < -50) { // Swipe right, go previous
      goToPrevious();
    }
    
    setTouchStartX(null);
  };

  return (
    <div className="relative w-full h-full">
      <div 
        className="relative overflow-hidden h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageList.map((src, index) => (
            <div 
              key={index} 
              className="w-full h-full flex-shrink-0"
            >
              <img
                src={src.startsWith('product_') ? `/img/${src}` : src}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      {imageList.length > 1 && (
        <>
          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
            onClick={goToPrevious}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white transition-colors"
            onClick={goToNext}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
      
      {/* Indicators */}
      {imageList.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {imageList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Thumbnail navigation */}
      {imageList.length > 1 && (
        <div className="flex mt-4 space-x-2 overflow-x-auto py-2">
          {imageList.map((src, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-16 h-16 flex-shrink-0 border-2 rounded ${
                currentIndex === index 
                  ? 'border-blue-600' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img 
                src={src.startsWith('product_') ? `/img/${src}` : src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;