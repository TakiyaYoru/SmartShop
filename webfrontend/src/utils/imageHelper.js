// ==========================================
// FILE: webfrontend/src/utils/imageHelper.js - NO JSX SYNTAX
// ==========================================

import React, { useState } from 'react';

// ✅ DEFAULT PLACEHOLDER - SVG Data URL (không cần HTTP request)
const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Kiểm tra xem string có phải là Firebase URL không
 * @param {string} url 
 * @returns {boolean}
 */
export const isFirebaseUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('firebasestorage.googleapis.com') || 
         url.includes('firebaseapp.com') ||
         (url.startsWith('https://') && url.includes('firebase'));
};

/**
 * Kiểm tra xem string có phải là filename (không phải full URL) không
 * @param {string} imageString 
 * @returns {boolean}
 */
export const isFilename = (imageString) => {
  if (!imageString || typeof imageString !== 'string') return false;
  // Nếu không phải URL và có extension thì là filename
  return !imageString.startsWith('http') && 
         !imageString.startsWith('/') && 
         /\.(jpg|jpeg|png|gif|webp)$/i.test(imageString);
};

/**
 * Chuyển đổi image string thành URL có thể hiển thị
 * @param {string} imageString - Có thể là filename hoặc full Firebase URL
 * @param {string} fallback - URL fallback nếu không tìm thấy ảnh
 * @returns {string} - Full URL để hiển thị
 */
export const getImageUrl = (imageString, fallback = DEFAULT_PLACEHOLDER) => {
  // Nếu không có imageString
  if (!imageString) {
    return fallback;
  }

  // ✅ Nếu đã là data URL, return nguyên
  if (imageString.startsWith('data:')) {
    return imageString;
  }

  // Nếu đã là Firebase URL hoặc full URL, return nguyên
  if (isFirebaseUrl(imageString)) {
    return imageString;
  }

  // ✅ Nếu là full HTTP URL, return nguyên
  if (imageString.startsWith('http://') || imageString.startsWith('https://')) {
    return imageString;
  }

  // Nếu là filename (legacy từ local storage), tạo local URL
  if (isFilename(imageString)) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${apiUrl}/img/${imageString}`;
  }

  // Nếu đã là relative path (/img/filename.jpg)
  if (imageString.startsWith('/img/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${apiUrl}${imageString}`;
  }

  // ✅ Nếu chỉ là relative path khác
  if (imageString.startsWith('/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${apiUrl}${imageString}`;
  }

  // Default fallback
  return fallback;
};

/**
 * Lấy URL của ảnh đầu tiên từ array images
 * @param {string[]} images - Array các image strings
 * @param {string} fallback - URL fallback
 * @returns {string}
 */
export const getFirstImageUrl = (images, fallback = DEFAULT_PLACEHOLDER) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return fallback;
  }
  
  return getImageUrl(images[0], fallback);
};

/**
 * Lấy tất cả URLs từ array images
 * @param {string[]} images - Array các image strings
 * @returns {string[]} - Array các URLs
 */
export const getAllImageUrls = (images) => {
  if (!images || !Array.isArray(images)) {
    return [];
  }
  
  return images
    .map(image => getImageUrl(image))
    .filter(url => url && url !== DEFAULT_PLACEHOLDER);
};

/**
 * Kiểm tra xem image có load được không
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    // ✅ Nếu là data URL, luôn resolve true
    if (url.startsWith('data:')) {
      resolve(true);
      return;
    }

    const img = new Image();
    
    // ✅ Timeout để tránh hang
    const timeout = setTimeout(() => {
      resolve(false);
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    
    img.src = url;
  });
};

/**
 * ✅ Component để hiển thị ảnh với fallback tự động - NO JSX
 */
export const SmartImage = ({ 
  src, 
  alt = 'Product image', 
  className = '', 
  fallback = DEFAULT_PLACEHOLDER,
  style = {},
  onClick,
  loading = "lazy",
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(() => getImageUrl(src, fallback));
  const [hasError, setHasError] = useState(false);

  // ✅ Update src khi prop thay đổi
  React.useEffect(() => {
    if (src !== imageSrc && !hasError) {
      const newSrc = getImageUrl(src, fallback);
      setImageSrc(newSrc);
    }
  }, [src, fallback, imageSrc, hasError]);

  const handleError = (e) => {
    console.warn('Image failed to load:', e.target.src);
    
    // ✅ Chỉ fallback nếu chưa là fallback
    if (e.target.src !== fallback && e.target.src !== DEFAULT_PLACEHOLDER) {
      setImageSrc(fallback);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    // ✅ Reset error state khi load thành công
    if (hasError) {
      setHasError(false);
    }
  };

  // ✅ Sử dụng React.createElement thay vì JSX
  return React.createElement('img', {
    src: imageSrc,
    alt: alt,
    className: className,
    style: style,
    onError: handleError,
    onLoad: handleLoad,
    onClick: onClick,
    loading: loading,
    decoding: "async",
    ...props
  });
};

/**
 * Hook để quản lý multiple images với preview
 * @param {string[]} initialImages - Ảnh ban đầu
 * @returns {Object} - Object chứa images, previews và handlers
 */
export const useImageManager = (initialImages = []) => {
  const [images, setImages] = useState(initialImages);
  const [previews, setPreviews] = useState([]);

  const addImages = (newImages) => {
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const reorderImages = (fromIndex, toIndex) => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  const clearImages = () => {
    setImages([]);
    setPreviews([]);
  };

  return {
    images,
    previews,
    setImages,
    setPreviews,
    addImages,
    removeImage,
    reorderImages,
    clearImages,
    imageUrls: getAllImageUrls(images)
  };
};

/**
 * ✅ Preload images utility
 * @param {string[]} urls - Array of image URLs to preload
 * @returns {Promise<string[]>} - Promise resolving to successfully loaded URLs
 */
export const preloadImages = async (urls) => {
  if (!urls || !Array.isArray(urls)) return [];
  
  const promises = urls.map(async (url) => {
    try {
      const exists = await checkImageExists(url);
      return exists ? url : null;
    } catch {
      return null;
    }
  });
  
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

/**
 * ✅ Generate responsive image URLs for different sizes
 * @param {string} baseUrl - Base image URL
 * @param {number[]} sizes - Array of widths
 * @returns {Object} - Object with size keys and URLs
 */
export const generateResponsiveUrls = (baseUrl, sizes = [150, 300, 600, 1200]) => {
  if (!baseUrl) return {};
  
  const urls = {};
  sizes.forEach(size => {
    // For Firebase Storage, you can add size parameters
    if (isFirebaseUrl(baseUrl)) {
      urls[size] = `${baseUrl}?w=${size}&h=${size}&c=fill`;
    } else {
      urls[size] = baseUrl; // Fallback to original
    }
  });
  
  return urls;
};

// ✅ Export default object với tất cả utilities
export default {
  isFirebaseUrl,
  isFilename,
  getImageUrl,
  getFirstImageUrl,
  getAllImageUrls,
  checkImageExists,
  SmartImage,
  useImageManager,
  preloadImages,
  generateResponsiveUrls,
  DEFAULT_PLACEHOLDER
};