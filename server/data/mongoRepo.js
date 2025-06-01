import { Category, User, Product } from "./models/index.js";

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
  
  // Exact matches
  if (condition.category) {
    query.category = condition.category;
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
            { brand: { $regex: term, $options: 'i' } },
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
        .sort({ createdAt: -1 });
    },
    
    findById: async (id) => {
      return await Product.findById(id).populate('category');
    },
    
    create: async (input) => {
      const product = new Product(input);
      const savedProduct = await product.save();
      return await Product.findById(savedProduct._id).populate('category');
    },
    
    updateById: async (id, input) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true });
      return await Product.findById(updatedProduct._id).populate('category');
    },
    
    deleteById: async (id) => {
      const result = await Product.findByIdAndDelete(id);
      return result ? id : null;
    },

    // Get featured products
    getFeatured: async () => {
      return await Product.find({ isFeatured: true, isActive: true })
        .populate('category')
        .sort({ createdAt: -1 });
    },

    // Get products by category
    getByCategory: async (categoryId) => {
      return await Product.find({ category: categoryId, isActive: true })
        .populate('category')
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
      ).populate('category');
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
      ).populate('category');
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