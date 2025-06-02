import { Category, User, Product, Brand } from "./models/index.js";

// Helper function to build sort options from GraphQL enum
const buildSortOptions = (orderBy, columnMapping) => {
  if (!orderBy) return { createdAt: -1 }; // Default sort
  
  const [field, direction] = orderBy.split('_');
  const fieldName = columnMapping[field] || 'createdAt';
  const sortDirection = direction === 'ASC' ? 1 : -1;
  
  return { [fieldName]: sortDirection };
};

// Helper function to build query conditions
const buildQueryConditions = (condition) => {
  const query = {};
  
  if (!condition) return query;
  
  // Text search with regex (case insensitive)
  if (condition.name && condition.name.trim() !== '') {
    query.name = { $regex: condition.name.trim(), $options: 'i' };
  }
  
  if (condition.brand && condition.brand.trim() !== '') {
    query.brand = { $regex: condition.brand.trim(), $options: 'i' };
  }
  
  if (condition.country && condition.country.trim() !== '') {
    query.country = { $regex: condition.country.trim(), $options: 'i' };
  }
  
  // Exact matches
  if (condition.category) {
    query.category = condition.category;
  }
  
  if (condition.categories && condition.categories.length > 0) {
    query.categories = { $in: condition.categories };
  }
  
  if (condition.isActive !== undefined) {
    query.isActive = condition.isActive;
  }
  
  if (condition.isFeatured !== undefined) {
    query.isFeatured = condition.isFeatured;
  }
  
  // Range queries
  if (condition.price) {
    const priceQuery = {};
    if (condition.price.min !== undefined) {
      priceQuery.$gte = condition.price.min;
    }
    if (condition.price.max !== undefined) {
      priceQuery.$lte = condition.price.max;
    }
    if (Object.keys(priceQuery).length > 0) {
      query.price = priceQuery;
    }
  }
  
  if (condition.stock) {
    const stockQuery = {};
    if (condition.stock.min !== undefined) {
      stockQuery.$gte = condition.stock.min;
    }
    if (condition.stock.max !== undefined) {
      stockQuery.$lte = condition.stock.max;
    }
    if (Object.keys(stockQuery).length > 0) {
      query.stock = stockQuery;
    }
  }
  
  return query;
};

const db = {
  categories: {
    // New paginated method
    getAll: async ({ first = 10, offset = 0, orderBy = 'CREATED_DESC', condition } = {}) => {
      try {
        const columnMapping = {
          ID: '_id',
          NAME: 'name',
          CREATED: 'createdAt'
        };
        
        const query = buildQueryConditions(condition);
        const sortOptions = buildSortOptions(orderBy, columnMapping);
        
        console.log('Categories query:', query);
        console.log('Categories sort:', sortOptions);
        
        // Get total count
        const totalCount = await Category.countDocuments(query);
        
        // Ensure offset doesn't exceed total count
        const safeOffset = Math.min(offset, Math.max(0, totalCount - 1));
        
        // Get paginated items
        const items = await Category.find(query)
          .sort(sortOptions)
          .skip(safeOffset)
          .limit(first);
        
        return {
          items,
          totalCount
        };
      } catch (error) {
        console.error('Error in categories.getAll:', error);
        throw error;
      }
    },
    
    // Simple method for backward compatibility
    getAllSimple: async () => {
      return await Category.find({ isActive: true }).sort({ createdAt: -1 });
    },
    
    findById: async (id) => {
      return await Category.findById(id);
    },
    
    create: async (input) => {
      const category = new Category(input);
      return await category.save();
    },
    
    updateById: async (id, input) => {
      return await Category.findByIdAndUpdate(id, input, { new: true });
    },
    
    deleteById: async (id) => {
      const result = await Category.findByIdAndDelete(id);
      return result ? id : null;
    },
  },

  brands: {
    // New paginated method
    getAll: async ({ first = 10, offset = 0, orderBy = 'CREATED_DESC', condition } = {}) => {
      try {
        const columnMapping = {
          ID: '_id',
          NAME: 'name',
          FOUNDED: 'foundedYear',
          CREATED: 'createdAt'
        };
        
        const query = buildQueryConditions(condition);
        const sortOptions = buildSortOptions(orderBy, columnMapping);
        
        console.log('Brands query:', query);
        console.log('Brands sort:', sortOptions);
        
        // Get total count
        const totalCount = await Brand.countDocuments(query);
        
        // Ensure offset doesn't exceed total count
        const safeOffset = Math.min(offset, Math.max(0, totalCount - 1));
        
        // Get paginated items with population
        const items = await Brand.find(query)
          .populate('categories')
          .sort(sortOptions)
          .skip(safeOffset)
          .limit(first);
        
        return {
          items,
          totalCount
        };
      } catch (error) {
        console.error('Error in brands.getAll:', error);
        throw error;
      }
    },
    
    // Simple method for backward compatibility
    getAllSimple: async () => {
      return await Brand.find({ isActive: true })
        .populate('categories')
        .sort({ createdAt: -1 });
    },
    
    findById: async (id) => {
      return await Brand.findById(id).populate('categories');
    },
    
    findBySlug: async (slug) => {
      return await Brand.findOne({ slug }).populate('categories');
    },
    
    findByName: async (name) => {
      return await Brand.findOne({ name });
    },
    
    create: async (input) => {
      const brand = new Brand(input);
      const savedBrand = await brand.save();
      return await Brand.findById(savedBrand._id).populate('categories');
    },
    
    updateById: async (id, input) => {
      const updatedBrand = await Brand.findByIdAndUpdate(id, input, { new: true });
      return await Brand.findById(updatedBrand._id).populate('categories');
    },
    
    deleteById: async (id) => {
      const result = await Brand.findByIdAndDelete(id);
      return result ? id : null;
    },

    // Get featured brands
    getFeatured: async () => {
      return await Brand.find({ isFeatured: true, isActive: true })
        .populate('categories')
        .sort({ createdAt: -1 });
    },

    // Get brands by category
    getByCategory: async (categoryId) => {
      return await Brand.find({ categories: categoryId, isActive: true })
        .populate('categories')
        .sort({ name: 1 });
    },
  },

  products: {
    // New paginated method with filtering
    getAll: async ({ first = 10, offset = 0, orderBy = 'CREATED_DESC', condition } = {}) => {
      try {
        const columnMapping = {
          ID: '_id',
          NAME: 'name',
          PRICE: 'price',
          STOCK: 'stock',
          CREATED: 'createdAt'
        };
        
        const query = buildQueryConditions(condition);
        const sortOptions = buildSortOptions(orderBy, columnMapping);
        
        console.log('Products query:', query);
        console.log('Products sort:', sortOptions);
        
        // Get total count
        const totalCount = await Product.countDocuments(query);
        
        // Ensure offset doesn't exceed total count
        const safeOffset = Math.min(offset, Math.max(0, totalCount - 1));
        
        // Get paginated items with population
        const items = await Product.find(query)
          .populate('category')
          .populate('brand')
          .sort(sortOptions)
          .skip(safeOffset)
          .limit(first);
        
        return {
          items,
          totalCount
        };
      } catch (error) {
        console.error('Error in products.getAll:', error);
        throw error;
      }
    },
    
    // Search method
    search: async ({ query: searchQuery, first = 10, offset = 0, orderBy = 'CREATED_DESC' } = {}) => {
      try {
        const columnMapping = {
          ID: '_id',
          NAME: 'name',
          PRICE: 'price',
          STOCK: 'stock',
          CREATED: 'createdAt'
        };
        
        // Build search query
        const searchTerms = searchQuery.trim().split(/\s+/);
        const searchConditions = searchTerms.map(term => ({
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { description: { $regex: term, $options: 'i' } },
            { sku: { $regex: term, $options: 'i' } }
          ]
        }));
        
        const query = {
          $and: searchConditions,
          isActive: true // Only search active products
        };
        
        const sortOptions = buildSortOptions(orderBy, columnMapping);
        
        console.log('Search query:', JSON.stringify(query, null, 2));
        
        // Get total count
        const totalCount = await Product.countDocuments(query);
        
        // Ensure offset doesn't exceed total count
        const safeOffset = Math.min(offset, Math.max(0, totalCount - 1));
        
        // Get paginated items with population
        const items = await Product.find(query)
          .populate('category')
          .populate('brand')
          .sort(sortOptions)
          .skip(safeOffset)
          .limit(first);
        
        return {
          items,
          totalCount
        };
      } catch (error) {
        console.error('Error in products.search:', error);
        throw error;
      }
    },
    
    // Simple method for backward compatibility
    getAllSimple: async () => {
      return await Product.find({ isActive: true })
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 });
    },
    
    findById: async (id) => {
      return await Product.findById(id).populate('category').populate('brand');
    },
    
    create: async (input) => {
      const product = new Product(input);
      const savedProduct = await product.save();
      return await Product.findById(savedProduct._id).populate('category').populate('brand');
    },
    
    updateById: async (id, input) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true });
      return await Product.findById(updatedProduct._id).populate('category').populate('brand');
    },
    
    deleteById: async (id) => {
      const result = await Product.findByIdAndDelete(id);
      return result ? id : null;
    },

    // Get featured products
    getFeatured: async () => {
      return await Product.find({ isFeatured: true, isActive: true })
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 });
    },

    // Get products by category
    getByCategory: async (categoryId) => {
      return await Product.find({ category: categoryId, isActive: true })
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 });
    },

    // Get products by brand
    getByBrand: async (brandId) => {
      return await Product.find({ brand: brandId, isActive: true })
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 });
    },

    // Get products by brand and category
    getByBrandAndCategory: async (brandId, categoryId) => {
      return await Product.find({ 
        brand: brandId, 
        category: categoryId, 
        isActive: true 
      })
        .populate('category')
        .populate('brand')
        .sort({ createdAt: -1 });
    },

    // Add image to product
    addImage: async (productId, filename) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      
      const currentImages = product.images || [];
      const updatedImages = [...currentImages, filename];
      
      return await Product.findByIdAndUpdate(
        productId, 
        { images: updatedImages }, 
        { new: true }
      ).populate('category').populate('brand');
    },

    // Remove image from product
    removeImage: async (productId, filename) => {
      const product = await Product.findById(productId);
      if (!product) throw new Error('Product not found');
      
      const currentImages = product.images || [];
      const updatedImages = currentImages.filter(img => img !== filename);
      
      return await Product.findByIdAndUpdate(
        productId, 
        { images: updatedImages }, 
        { new: true }
      ).populate('category').populate('brand');
    }
  },

  users: {
    findOne: async (username) => {
      return await User.findOne({ username }).lean();
    },
    
    findById: async (id) => {
      return await User.findById(id).lean();
    },
    
    findByEmail: async (email) => {
      return await User.findOne({ email }).lean();
    },
    
    create: async (input) => {
      const user = new User(input);
      return await user.save();
    },
  },
};

export { db };