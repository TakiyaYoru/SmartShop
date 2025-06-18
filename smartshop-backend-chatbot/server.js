// server.js
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Claude API
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

// Enhanced products database
const phoneProducts = [
    // iPhone Series
    {
        id: 1, name: 'iPhone 15 Pro Max', brand: 'Apple', 
        price: 29990000, originalPrice: 32990000, discount: 9,
        specs: { ram: '8GB', storage: '256GB', screen: '6.7"', battery: '4422mAh', chip: 'A17 Pro' },
        features: ['camera chuyên nghiệp', 'titanium', 'action button', 'usb-c'],
        tags: ['iphone', 'apple', 'cao cấp', 'chụp ảnh đẹp', 'premium', 'gaming', 'video 4k'],
        rating: 4.8, reviews: 1250, inStock: true,
        images: ['iphone15promax-1.jpg', 'iphone15promax-2.jpg'],
        category: 'flagship'
    },
    {
        id: 2, name: 'iPhone 15 Pro', brand: 'Apple',
        price: 25990000, originalPrice: 28990000, discount: 10,
        specs: { ram: '8GB', storage: '128GB', screen: '6.1"', battery: '3274mAh', chip: 'A17 Pro' },
        features: ['camera chuyên nghiệp', 'titanium', 'action button', 'usb-c'],
        tags: ['iphone', 'apple', 'cao cấp', 'chụp ảnh đẹp', 'premium', 'gaming'],
        rating: 4.7, reviews: 980, inStock: true,
        images: ['iphone15pro-1.jpg'],
        category: 'flagship'
    },
    {
        id: 3, name: 'iPhone 15', brand: 'Apple',
        price: 19990000, originalPrice: 22990000, discount: 13,
        specs: { ram: '6GB', storage: '128GB', screen: '6.1"', battery: '3349mAh', chip: 'A16 Bionic' },
        features: ['dynamic island', 'usb-c', 'dual camera'],
        tags: ['iphone', 'apple', 'phổ thông', 'chụp ảnh đẹp', 'trung cấp'],
        rating: 4.5, reviews: 1580, inStock: true,
        images: ['iphone15-1.jpg'],
        category: 'mid-range'
    },
    {
        id: 4, name: 'iPhone 14', brand: 'Apple',
        price: 17990000, originalPrice: 20990000, discount: 14,
        specs: { ram: '6GB', storage: '128GB', screen: '6.1"', battery: '3279mAh', chip: 'A15 Bionic' },
        features: ['dual camera', 'face id', 'wireless charging'],
        tags: ['iphone', 'apple', 'giá tốt', 'chụp ảnh đẹp'],
        rating: 4.4, reviews: 2100, inStock: true,
        images: ['iphone14-1.jpg'],
        category: 'mid-range'
    },
    {
        id: 5, name: 'iPhone SE 2022', brand: 'Apple',
        price: 12990000, originalPrice: 14990000, discount: 13,
        specs: { ram: '4GB', storage: '64GB', screen: '4.7"', battery: '2018mAh', chip: 'A15 Bionic' },
        features: ['touch id', 'compact size', 'wireless charging'],
        tags: ['iphone', 'apple', 'giá rẻ', 'nhỏ gọn', 'cơ bản'],
        rating: 4.2, reviews: 850, inStock: true,
        images: ['iphonese-1.jpg'],
        category: 'budget'
    },

    // Samsung Galaxy Series
    {
        id: 6, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung',
        price: 28990000, originalPrice: 31990000, discount: 9,
        specs: { ram: '12GB', storage: '256GB', screen: '6.8"', battery: '5000mAh', chip: 'Snapdragon 8 Gen 3' },
        features: ['s pen', 'camera zoom 100x', 'ai features', 'gorilla glass'],
        tags: ['samsung', 'cao cấp', 'chụp ảnh đẹp', 'pin trâu', 'premium', 'gaming', 'zoom xa'],
        rating: 4.7, reviews: 920, inStock: true,
        images: ['s24ultra-1.jpg'],
        category: 'flagship'
    },
    {
        id: 7, name: 'Samsung Galaxy S24+', brand: 'Samsung',
        price: 22990000, originalPrice: 25990000, discount: 12,
        specs: { ram: '12GB', storage: '256GB', screen: '6.7"', battery: '4900mAh', chip: 'Snapdragon 8 Gen 3' },
        features: ['camera chuyên nghiệp', 'ai features', 'sạc nhanh 45w'],
        tags: ['samsung', 'cao cấp', 'chụp ảnh đẹp', 'pin khỏe', 'sạc nhanh'],
        rating: 4.6, reviews: 680, inStock: true,
        images: ['s24plus-1.jpg'],
        category: 'flagship'
    },
    {
        id: 8, name: 'Samsung Galaxy A55', brand: 'Samsung',
        price: 9990000, originalPrice: 10990000, discount: 9,
        specs: { ram: '8GB', storage: '128GB', screen: '6.5"', battery: '5000mAh', chip: 'Exynos 1480' },
        features: ['triple camera', 'super amoled', 'sạc nhanh 25w'],
        tags: ['samsung', 'tầm trung', 'pin trâu', 'giá tốt', 'màn hình đẹp'],
        rating: 4.3, reviews: 1200, inStock: true,
        images: ['a55-1.jpg'],
        category: 'mid-range'
    },
    {
        id: 9, name: 'Samsung Galaxy A35', brand: 'Samsung',
        price: 7990000, originalPrice: 8990000, discount: 11,
        specs: { ram: '8GB', storage: '128GB', screen: '6.6"', battery: '5000mAh', chip: 'Exynos 1380' },
        features: ['triple camera', 'super amoled', 'gorilla glass'],
        tags: ['samsung', 'giá rẻ', 'pin trâu', 'màn hình đẹp', 'học sinh sinh viên'],
        rating: 4.2, reviews: 1450, inStock: true,
        images: ['a35-1.jpg'],
        category: 'budget'
    },

    // Xiaomi Series
    {
        id: 10, name: 'Xiaomi 14 Ultra', brand: 'Xiaomi',
        price: 25990000, originalPrice: 28990000, discount: 10,
        specs: { ram: '16GB', storage: '512GB', screen: '6.73"', battery: '5300mAh', chip: 'Snapdragon 8 Gen 3' },
        features: ['camera leica', 'sạc nhanh 90w', 'sạc không dây 50w', 'ip68'],
        tags: ['xiaomi', 'cao cấp', 'chụp ảnh đẹp', 'pin trâu', 'sạc nhanh', 'camera pro'],
        rating: 4.6, reviews: 450, inStock: true,
        images: ['xiaomi14ultra-1.jpg'],
        category: 'flagship'
    },
    {
        id: 11, name: 'Xiaomi 14', brand: 'Xiaomi',
        price: 15990000, originalPrice: 17990000, discount: 11,
        specs: { ram: '12GB', storage: '256GB', screen: '6.36"', battery: '4610mAh', chip: 'Snapdragon 8 Gen 3' },
        features: ['camera leica', 'sạc nhanh 90w', 'màn hình 120hz'],
        tags: ['xiaomi', 'cao cấp', 'chụp ảnh đẹp', 'pin khỏe', 'sạc nhanh', 'gaming'],
        rating: 4.5, reviews: 780, inStock: true,
        images: ['xiaomi14-1.jpg'],
        category: 'flagship'
    },
    {
        id: 12, name: 'Xiaomi Redmi Note 13 Pro', brand: 'Xiaomi',
        price: 7990000, originalPrice: 8990000, discount: 11,
        specs: { ram: '8GB', storage: '128GB', screen: '6.67"', battery: '5100mAh', chip: 'Snapdragon 7s Gen 2' },
        features: ['camera 200mp', 'sạc nhanh 67w', 'ip54'],
        tags: ['xiaomi', 'giá rẻ', 'pin trâu', 'sạc nhanh', 'camera cao'],
        rating: 4.4, reviews: 1650, inStock: true,
        images: ['note13pro-1.jpg'],
        category: 'budget'
    },
    {
        id: 13, name: 'Xiaomi Redmi 13C', brand: 'Xiaomi',
        price: 3290000, originalPrice: 3690000, discount: 11,
        specs: { ram: '4GB', storage: '128GB', screen: '6.74"', battery: '5000mAh', chip: 'Helio G85' },
        features: ['triple camera', 'pin lớn', 'giá sinh viên'],
        tags: ['xiaomi', 'giá rẻ', 'pin trâu', 'cơ bản', 'học sinh sinh viên', 'người già'],
        rating: 4.0, reviews: 2100, inStock: true,
        images: ['redmi13c-1.jpg'],
        category: 'budget'
    },

    // OPPO Series  
    {
        id: 14, name: 'OPPO Find X7 Ultra', brand: 'OPPO',
        price: 24990000, originalPrice: 27990000, discount: 11,
        specs: { ram: '16GB', storage: '512GB', screen: '6.82"', battery: '5400mAh', chip: 'Snapdragon 8 Gen 3' },
        features: ['camera hasselblad', 'sạc nhanh 100w', 'sạc không dây 50w'],
        tags: ['oppo', 'cao cấp', 'chụp ảnh đẹp', 'pin trâu', 'sạc nhanh', 'camera pro'],
        rating: 4.5, reviews: 320, inStock: true,
        images: ['findx7ultra-1.jpg'],
        category: 'flagship'
    },
    {
        id: 15, name: 'OPPO Reno11 F', brand: 'OPPO',
        price: 8990000, originalPrice: 9990000, discount: 10,
        specs: { ram: '8GB', storage: '256GB', screen: '6.7"', battery: '5000mAh', chip: 'Snapdragon 685' },
        features: ['selfie 32mp', 'sạc nhanh 67w', 'thiết kế mỏng'],
        tags: ['oppo', 'tầm trung', 'selfie đẹp', 'pin khỏe', 'sạc nhanh', 'thiết kế đẹp'],
        rating: 4.2, reviews: 890, inStock: true,
        images: ['reno11f-1.jpg'],
        category: 'mid-range'
    },

    // Vivo Series
    {
        id: 16, name: 'Vivo V30e', brand: 'Vivo',
        price: 8490000, originalPrice: 9490000, discount: 11,
        specs: { ram: '8GB', storage: '256GB', screen: '6.78"', battery: '5500mAh', chip: 'Snapdragon 6 Gen 1' },
        features: ['selfie 50mp', 'thiết kế mỏng 7.69mm', 'sạc nhanh 44w'],
        tags: ['vivo', 'tầm trung', 'selfie đẹp', 'pin trâu', 'thiết kế đẹp', 'màn hình cong'],
        rating: 4.1, reviews: 560, inStock: true,
        images: ['v30e-1.jpg'],
        category: 'mid-range'
    },
    {
        id: 17, name: 'Vivo Y36', brand: 'Vivo',
        price: 5990000, originalPrice: 6490000, discount: 8,
        specs: { ram: '8GB', storage: '128GB', screen: '6.64"', battery: '5000mAh', chip: 'Snapdragon 680' },
        features: ['dual camera', 'sạc nhanh 44w', 'thiết kế trẻ trung'],
        tags: ['vivo', 'giá rẻ', 'pin khỏe', 'học sinh sinh viên', 'cơ bản'],
        rating: 4.0, reviews: 1200, inStock: false,
        images: ['y36-1.jpg'],
        category: 'budget'
    }
];

// Enhanced prompt for Claude API
const createAnalysisPrompt = (message) => {
    return `Bạn là chuyên gia tư vấn điện thoại thông minh của SmartShop. Hãy phân tích yêu cầu khách hàng và trả về JSON chính xác.

NGÔN NGỮ: Trả lời bằng tiếng Việt thân thiện, tự nhiên.

YÊU CẦU KHÁCH HÀNG: "${message}"

Hãy phân tích và trích xuất thông tin:

1. THƯƠNG HIỆU: Apple, Samsung, Xiaomi, OPPO, Vivo
2. GIÁ TIỀN: Tìm số tiền VNĐ (triệu = 1,000,000)
3. TÍNH NĂNG: camera, pin, gaming, selfie, sạc nhanh, v.v.
4. ĐỐI TƯỢNG: học sinh sinh viên, người lớn tuổi, chuyên nghiệp
5. PHÂN KHÚC: giá rẻ (<8tr), tầm trung (8-20tr), cao cấp (>20tr)

QUAN TRỌNG - Format JSON trả về:
{
  "analysis": {
    "brand": "tên_thương_hiệu_hoặc_null",
    "maxPrice": số_tiền_tối_đa_VND_hoặc_null,
    "minPrice": số_tiền_tối_thiểu_VND_hoặc_null,
    "features": ["danh_sách_tính_năng_cụ_thể"],
    "priceRange": "budget/mid-range/flagship/null",
    "targetUser": "học sinh sinh viên/người lớn tuổi/chuyên nghiệp/null",
    "keywords": ["từ_khóa_tìm_kiếm"]
  },
  "response": "câu_trả_lời_thân_thiện_tự_nhiên_cho_khách_hàng",
  "suggestions": ["gợi_ý_thêm_nếu_cần"]
}

VÍ DỤ PHÂN TÍCH:
- "iPhone 20 triệu" → maxPrice: 20000000, brand: "Apple"
- "Điện thoại chụp ảnh đẹp dưới 15tr" → maxPrice: 15000000, features: ["chụp ảnh đẹp"]
- "Samsung gaming" → brand: "Samsung", features: ["gaming"]
- "Điện thoại cho học sinh" → targetUser: "học sinh sinh viên", priceRange: "budget"

CHỈ trả về JSON, không thêm text khác.`;
};

// Enhanced query analysis with Claude
async function analyzeUserQuery(message) {
    try {
        console.log('🤖 Analyzing query with Claude:', message);
        
        const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 1500,
            temperature: 0.1,
            messages: [{
                role: 'user',
                content: createAnalysisPrompt(message)
            }]
        });

        const aiResponse = response.content[0].text;
        console.log('🔍 Claude raw response:', aiResponse);

        // Extract JSON from response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log('✅ Analysis successful:', parsed);
            return parsed;
        } else {
            throw new Error('No valid JSON found in Claude response');
        }

    } catch (error) {
        console.warn('⚠️ Claude analysis failed, using fallback:', error.message);
        return {
            analysis: fallbackParseQuery(message),
            response: `Tôi đã phân tích yêu cầu "${message}" của bạn. Đây là những sản phẩm phù hợp:`,
            suggestions: []
        };
    }
}

// Enhanced fallback parsing with better Vietnamese processing
function fallbackParseQuery(query) {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    console.log('🔄 Using enhanced fallback for:', query);
    
    // Brand detection
    let brand = null;
    if (q.includes('iphone') || q.includes('apple')) brand = 'Apple';
    else if (q.includes('samsung') || q.includes('sam sung')) brand = 'Samsung';
    else if (q.includes('xiaomi') || q.includes('redmi') || q.includes('mi')) brand = 'Xiaomi';
    else if (q.includes('oppo')) brand = 'OPPO';
    else if (q.includes('vivo')) brand = 'Vivo';
    
    // Enhanced price extraction
    let maxPrice = null, minPrice = null, priceRange = null;
    
    // Extract numbers with "triệu", "tr", "k"
    const priceMatches = q.match(/(\d+(?:[.,]\d+)?)\s*(?:triệu|tr|k)/gi);
    if (priceMatches) {
        const prices = priceMatches.map(match => {
            const num = parseFloat(match.replace(/[^\d.,]/g, '').replace(',', '.'));
            if (match.toLowerCase().includes('k')) return num * 1000;
            return num * 1000000;
        });
        
        if (q.includes('duoi') || q.includes('dưới') || q.includes('tối đa') || q.includes('có')) {
            maxPrice = Math.max(...prices);
        } else if (q.includes('trên') || q.includes('từ') || q.includes('tối thiểu')) {
            minPrice = Math.min(...prices);
        } else if (q.includes('tầm') || q.includes('khoảng') || q.includes('từ') && q.includes('đến')) {
            if (prices.length >= 2) {
                minPrice = Math.min(...prices);
                maxPrice = Math.max(...prices);
            } else {
                const basePrice = prices[0];
                minPrice = basePrice * 0.8;
                maxPrice = basePrice * 1.2;
            }
        } else if (prices.length === 1) {
            maxPrice = prices[0] * 1.1; // 10% buffer
            minPrice = prices[0] * 0.9;
        }
        
        // Determine price range
        const avgPrice = maxPrice || minPrice || (prices.length > 0 ? prices[0] : 0);
        if (avgPrice < 8000000) priceRange = 'budget';
        else if (avgPrice <= 20000000) priceRange = 'mid-range';  
        else priceRange = 'flagship';
    }
    
    // Price range keywords
    if (q.includes('giá rẻ') || q.includes('rẻ') || q.includes('sinh viên') || q.includes('học sinh')) {
        priceRange = 'budget';
        if (!maxPrice) maxPrice = 8000000;
    }
    if (q.includes('tầm trung') || q.includes('trung cấp')) {
        priceRange = 'mid-range';
        if (!minPrice) minPrice = 8000000;
        if (!maxPrice) maxPrice = 20000000;
    }
    if (q.includes('cao cấp') || q.includes('premium') || q.includes('flagship')) {
        priceRange = 'flagship';
        if (!minPrice) minPrice = 20000000;
    }
    
    // Feature extraction
    const features = [];
    const keywords = [];
    
    if (q.includes('chụp ảnh') || q.includes('camera')) {
        features.push('chụp ảnh đẹp');
        keywords.push('camera');
    }
    if (q.includes('selfie') || q.includes('tự sướng')) {
        features.push('selfie đẹp');
        keywords.push('selfie');
    }
    if (q.includes('pin') && (q.includes('trâu') || q.includes('lâu') || q.includes('khỏe'))) {
        features.push('pin trâu');
        keywords.push('pin');
    }
    if (q.includes('sạc nhanh') || q.includes('fast charge')) {
        features.push('sạc nhanh');
        keywords.push('sạc nhanh');
    }
    if (q.includes('gaming') || q.includes('chơi game') || q.includes('game')) {
        features.push('gaming');
        keywords.push('gaming');
    }
    if (q.includes('zoom') || q.includes('tele')) {
        features.push('zoom xa');
        keywords.push('zoom');
    }
    
    // Target user detection
    let targetUser = null;
    if (q.includes('học sinh') || q.includes('sinh viên') || q.includes('hs') || q.includes('sv')) {
        targetUser = 'học sinh sinh viên';
    }
    if (q.includes('người già') || q.includes('bố mẹ') || q.includes('ông bà')) {
        targetUser = 'người lớn tuổi';
    }
    if (q.includes('doanh nhân') || q.includes('công việc') || q.includes('văn phòng')) {
        targetUser = 'chuyên nghiệp';
    }
    
    return {
        brand, maxPrice, minPrice, features, priceRange, targetUser, keywords
    };
}

// Advanced product filtering
function filterProducts(analysis) {
    let filtered = phoneProducts.filter(product => {
        // Brand filter
        if (analysis.brand && product.brand !== analysis.brand) {
            return false;
        }
        
        // Price filters
        if (analysis.maxPrice && product.price > analysis.maxPrice) {
            return false;
        }
        if (analysis.minPrice && product.price < analysis.minPrice) {
            return false;
        }
        
        // Price range filter
        if (analysis.priceRange && product.category !== analysis.priceRange) {
            return false;
        }
        
        // Features filter
        if (analysis.features && analysis.features.length > 0) {
            const productText = `${product.name} ${product.tags.join(' ')} ${product.features.join(' ')}`.toLowerCase();
            const hasFeature = analysis.features.some(feature => {
                const featureLower = feature.toLowerCase();
                return productText.includes(featureLower) ||
                       productText.includes(featureLower.replace('đẹp', '')) ||
                       (featureLower.includes('pin') && productText.includes('pin')) ||
                       (featureLower.includes('camera') && productText.includes('camera')) ||
                       (featureLower.includes('gaming') && (product.price > 15000000 || productText.includes('gaming')));
            });
            if (!hasFeature) return false;
        }
        
        // Target user filter
        if (analysis.targetUser) {
            const productText = product.tags.join(' ').toLowerCase();
            if (analysis.targetUser === 'học sinh sinh viên' && !productText.includes('học sinh sinh viên') && product.price > 12000000) {
                return false;
            }
            if (analysis.targetUser === 'người lớn tuổi' && !productText.includes('người già') && product.specs.screen.includes('6.7')) {
                return false; // Too big screen for elderly
            }
        }
        
        // Keywords search
        if (analysis.keywords && analysis.keywords.length > 0) {
            const productText = `${product.name} ${product.tags.join(' ')} ${product.features.join(' ')}`.toLowerCase();
            const hasKeyword = analysis.keywords.some(keyword => 
                productText.includes(keyword.toLowerCase())
            );
            if (!hasKeyword) return false;
        }
        
        return true;
    });
    
    // Sort by relevance: price match, rating, reviews
    filtered.sort((a, b) => {
        // Prioritize in-stock items
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        
        // Then by rating and reviews
        const scoreA = a.rating * Math.log(a.reviews + 1);
        const scoreB = b.rating * Math.log(b.reviews + 1);
        return scoreB - scoreA;
    });
    
    return filtered;
}

// Generate product suggestions
function generateSuggestions(analysis, products) {
    const suggestions = [];
    
    if (products.length === 0) {
        suggestions.push('Thử tăng ngân sách hoặc xem các thương hiệu khác');
        suggestions.push('Liên hệ tư vấn viên để được hỗ trợ tốt nhất');
    } else if (products.length > 10) {
        suggestions.push('Có nhiều lựa chọn phù hợp, hãy lọc thêm theo tính năng');
        if (!analysis.brand) suggestions.push('Chọn thương hiệu yêu thích để thu hẹp kết quả');
    } else if (products.length < 3) {
        suggestions.push('Thử mở rộng ngân sách để có nhiều lựa chọn hơn');
        if (analysis.brand) suggestions.push(`Xem thêm các dòng ${analysis.brand} khác`);
    }
    
    return suggestions;
}

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ 
        status: 'SmartShop Server Running!', 
        timestamp: new Date().toISOString(),
        apiKeyConfigured: !!process.env.CLAUDE_API_KEY,
        totalProducts: phoneProducts.length,
        brands: [...new Set(phoneProducts.map(p => p.brand))],
        priceRange: {
            min: Math.min(...phoneProducts.map(p => p.price)),
            max: Math.max(...phoneProducts.map(p => p.price))
        }
    });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const startTime = Date.now();
        console.log('📨 New chat request:', req.body);
        
        const { message, filters = {} } = req.body;
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Message is required',
                response: 'Vui lòng nhập yêu cầu tìm kiếm điện thoại.',
                products: [],
                suggestions: ['Ví dụ: "iPhone dưới 20 triệu"', '"Samsung pin trâu"', '"Điện thoại chụp ảnh đẹp"']
            });
        }

        // Analyze user query with Claude
        const aiResult = await analyzeUserQuery(message);
        
        // Apply additional filters if provided
        const finalAnalysis = { ...aiResult.analysis, ...filters };
        
        // Filter products
        const products = filterProducts(finalAnalysis);
        
        // Generate suggestions
        const suggestions = aiResult.suggestions || generateSuggestions(finalAnalysis, products);
        
        // Prepare response
        const result = {
            query: message,
            analysis: finalAnalysis,
            response: aiResult.response || `Tìm thấy ${products.length} sản phẩm phù hợp với yêu cầu của bạn.`,
            products: products.slice(0, 20), // Limit to 20 products
            totalResults: products.length,
            suggestions: suggestions,
            processingTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
        };

        console.log(`✅ Request processed in ${result.processingTime}ms`);
        console.log(`📊 Found ${products.length} products matching criteria`);

        res.json(result);

    } catch (error) {
        console.error('❌ Server error:', error);
        
        // Enhanced fallback response
        const fallbackAnalysis = fallbackParseQuery(req.body.message || '');
        const fallbackProducts = filterProducts(fallbackAnalysis);
        
        res.status(200).json({
            query: req.body.message,
            analysis: fallbackAnalysis,
            response: 'Hệ thống đang bận, nhưng tôi vẫn tìm được một số sản phẩm phù hợp cho bạn.',
            products: fallbackProducts.slice(0, 10),
            totalResults: fallbackProducts.length,
            suggestions: ['Thử lại sau ít phút', 'Liên hệ hỗ trợ nếu vấn đề tiếp tục'],
            error: error.message,
            processingTime: 0,
            timestamp: new Date().toISOString()
        });
    }
});

// Get product details endpoint
app.get('/api/product/:id', (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = phoneProducts.find(p => p.id === productId);
        
        if (!product) {
            return res.status(404).json({
                error: 'Product not found',
                message: 'Không tìm thấy sản phẩm này.'
            });
        }
        
        // Add related products
        const relatedProducts = phoneProducts
            .filter(p => p.id !== productId && 
                    (p.brand === product.brand || 
                     Math.abs(p.price - product.price) < 5000000))
            .slice(0, 4);
        
        res.json({
            product,
            relatedProducts,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error getting product details:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Lỗi khi lấy thông tin sản phẩm.'
        });
    }
});

// Get all brands endpoint
app.get('/api/brands', (req, res) => {
    try {
        const brands = [...new Set(phoneProducts.map(p => p.brand))].map(brand => {
            const brandProducts = phoneProducts.filter(p => p.brand === brand);
            return {
                name: brand,
                productCount: brandProducts.length,
                priceRange: {
                    min: Math.min(...brandProducts.map(p => p.price)),
                    max: Math.max(...brandProducts.map(p => p.price))
                },
                avgRating: (brandProducts.reduce((sum, p) => sum + p.rating, 0) / brandProducts.length).toFixed(1)
            };
        });
        
        res.json({
            brands,
            totalBrands: brands.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error getting brands:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Lỗi khi lấy danh sách thương hiệu.'
        });
    }
});

// Search products with filters endpoint
app.post('/api/search', (req, res) => {
    try {
        const { 
            brand, 
            minPrice, 
            maxPrice, 
            features = [], 
            category, 
            inStock = true,
            sortBy = 'rating',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.body;
        
        let filtered = phoneProducts.filter(product => {
            if (brand && product.brand !== brand) return false;
            if (minPrice && product.price < minPrice) return false;
            if (maxPrice && product.price > maxPrice) return false;
            if (category && product.category !== category) return false;
            if (inStock && !product.inStock) return false;
            
            if (features.length > 0) {
                const productText = `${product.tags.join(' ')} ${product.features.join(' ')}`.toLowerCase();
                const hasFeature = features.some(feature => 
                    productText.includes(feature.toLowerCase())
                );
                if (!hasFeature) return false;
            }
            
            return true;
        });
        
        // Sorting
        filtered.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'price':
                    valueA = a.price;
                    valueB = b.price;
                    break;
                case 'rating':
                    valueA = a.rating;
                    valueB = b.rating;
                    break;
                case 'reviews':
                    valueA = a.reviews;
                    valueB = b.reviews;
                    break;
                case 'discount':
                    valueA = a.discount;
                    valueB = b.discount;
                    break;
                default:
                    valueA = a.rating;
                    valueB = b.rating;
            }
            
            return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
        });
        
        // Pagination
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filtered.slice(startIndex, startIndex + limit);
        
        res.json({
            products: paginatedProducts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filtered.length / limit),
                totalResults: filtered.length,
                hasNext: startIndex + limit < filtered.length,
                hasPrev: page > 1
            },
            filters: { brand, minPrice, maxPrice, features, category, inStock },
            sorting: { sortBy, sortOrder },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error in search:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Lỗi khi tìm kiếm sản phẩm.'
        });
    }
});

// Compare products endpoint
app.post('/api/compare', (req, res) => {
    try {
        const { productIds } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
            return res.status(400).json({
                error: 'At least 2 product IDs required',
                message: 'Cần ít nhất 2 sản phẩm để so sánh.'
            });
        }
        
        if (productIds.length > 4) {
            return res.status(400).json({
                error: 'Maximum 4 products for comparison',
                message: 'Chỉ có thể so sánh tối đa 4 sản phẩm.'
            });
        }
        
        const products = productIds.map(id => {
            const product = phoneProducts.find(p => p.id === parseInt(id));
            if (!product) {
                throw new Error(`Product with ID ${id} not found`);
            }
            return product;
        });
        
        // Generate comparison insights
        const insights = {
            cheapest: products.reduce((min, p) => p.price < min.price ? p : min),
            mostExpensive: products.reduce((max, p) => p.price > max.price ? p : max),
            highestRated: products.reduce((max, p) => p.rating > max.rating ? p : max),
            bestValue: products.reduce((best, p) => {
                const valueScore = p.rating / (p.price / 1000000);
                const bestScore = best.rating / (best.price / 1000000);
                return valueScore > bestScore ? p : best;
            }),
            largestBattery: products.reduce((max, p) => {
                const batteryA = parseInt(p.specs.battery.replace('mAh', ''));
                const batteryB = parseInt(max.specs.battery.replace('mAh', ''));
                return batteryA > batteryB ? p : max;
            })
        };
        
        res.json({
            products,
            insights,
            comparisonCount: products.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error in compare:', error);
        res.status(400).json({
            error: error.message,
            message: 'Lỗi khi so sánh sản phẩm.'
        });
    }
});

// Get recommendations based on user behavior
app.post('/api/recommendations', (req, res) => {
    try {
        const { 
            viewedProducts = [], 
            budget, 
            preferredBrand, 
            userProfile = 'general' 
        } = req.body;
        
        let recommendations = [];
        
        if (viewedProducts.length > 0) {
            // Find similar products based on viewed items
            const viewedCategories = viewedProducts.map(id => {
                const product = phoneProducts.find(p => p.id === id);
                return product ? product.category : null;
            }).filter(Boolean);
            
            const preferredCategory = viewedCategories.length > 0 ? 
                viewedCategories[Math.floor(Math.random() * viewedCategories.length)] : null;
            
            recommendations = phoneProducts.filter(product => {
                if (viewedProducts.includes(product.id)) return false;
                if (budget && product.price > budget) return false;
                if (preferredBrand && product.brand !== preferredBrand) return false;
                if (preferredCategory && product.category !== preferredCategory) return false;
                return true;
            });
        } else {
            // Default recommendations based on user profile
            switch (userProfile) {
                case 'student':
                    recommendations = phoneProducts.filter(p => 
                        p.price < 12000000 && p.tags.includes('học sinh sinh viên')
                    );
                    break;
                case 'professional':
                    recommendations = phoneProducts.filter(p => 
                        p.price > 15000000 && (p.tags.includes('cao cấp') || p.tags.includes('premium'))
                    );
                    break;
                case 'photographer':
                    recommendations = phoneProducts.filter(p => 
                        p.tags.includes('chụp ảnh đẹp') || p.features.some(f => f.includes('camera'))
                    );
                    break;
                default:
                    recommendations = phoneProducts.filter(p => p.rating >= 4.2);
            }
            
            if (budget) {
                recommendations = recommendations.filter(p => p.price <= budget);
            }
            if (preferredBrand) {
                recommendations = recommendations.filter(p => p.brand === preferredBrand);
            }
        }
        
        // Sort by rating and limit results
        recommendations.sort((a, b) => b.rating - a.rating);
        recommendations = recommendations.slice(0, 8);
        
        res.json({
            recommendations,
            totalRecommendations: recommendations.length,
            criteria: { budget, preferredBrand, userProfile },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error getting recommendations:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Lỗi khi lấy gợi ý sản phẩm.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        version: '2.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('💥 Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'API endpoint không tồn tại.',
        requestedPath: req.path,
        method: req.method,
        availableEndpoints: [
            'POST /api/chat',
            'GET /api/product/:id',
            'GET /api/brands', 
            'POST /api/search',
            'POST /api/compare',
            'POST /api/recommendations',
            'GET /test',
            'GET /health'
        ]
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`
🚀 SmartShop Chatbot Server v2.0
🌐 Server: http://localhost:${port}
📋 Test: http://localhost:${port}/test
💬 Chat API: http://localhost:${port}/api/chat
🔑 Claude API: ${!!process.env.CLAUDE_API_KEY ? '✅ Configured' : '❌ Missing'}
📱 Products: ${phoneProducts.length} phones loaded
🏷️ Brands: ${[...new Set(phoneProducts.map(p => p.brand))].join(', ')}
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Export for testing
module.exports = { app, phoneProducts, filterProducts, analyzeUserQuery };