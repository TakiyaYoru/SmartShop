#!/usr/bin/env python3
"""
SmartShop Core Code Extractor - UPDATED VERSION
Extract các file quan trọng nhất từ SmartShop project
"""

import os
from pathlib import Path

# Danh sách các file quan trọng cần extract - UPDATED
IMPORTANT_FILES = [
    # Backend - Core files
    "server/package.json",
    "server/index.js",
    "server/config.js",
    "server/config/firebase.js",
    "server/permissions.js",
    "server/check-db.js",
    "server/migrate-mongo-config.js",
    "server/jest.config.json",
    
    # Backend - VNPay Integration (NEW)
    "server/services/vnpayService.js",
    "server/routes/vnpayRoutes.js",
    "server/test-vnpay-new.js",
    
    # Backend - GraphQL
    "server/graphql/schema.js",
    "server/graphql/hello.js",
    "server/graphql/authentication.js",
    "server/graphql/products.js",
    "server/graphql/categories.js",
    "server/graphql/brands.js",
    "server/graphql/carts.js",
    "server/graphql/orders.js",
    "server/graphql/upload.js",
    "server/graphql/upload_old.js",
    
    # Backend - Models
    "server/data/models/index.js",
    "server/data/models/user.js",
    "server/data/models/product.js",
    "server/data/models/category.js",
    "server/data/models/brand.js",
    "server/data/models/cart.js",
    "server/data/models/order.js",
    "server/data/models/orderItem.js",
    
    # Backend - Data layer
    "server/data/mongoRepo.js",
    "server/data/mockRepo.js",
    "server/data/init.js",
    
    # Backend - Utils & Services
    "server/utils/otpUtils.js",
    "server/utils/passwordReset.js",
    "server/utils/imageHelper.js",
    "server/services/emailService.js",
    "server/services/firebaseStorageService.js",
    
    # Backend - Migrations
    "server/migrations/20250601031152-initial_smartshop_data.js",
    "server/migrations/20250601032421-add_sample_images.js",
    
    # Backend - Tests
    "server/data/__tests__/categories.test.js",
    "server/data/__tests__/products.test.js",
    "server/test/globalSetup.js",
    "server/test/globalTeardown.js",
    "server/test/setupFileAfterEnv.js",
    "server/test-firebase.js",
    
    # Frontend - Core files
    "webfrontend/package.json",
    "webfrontend/vite.config.js",
    "webfrontend/tailwind.config.js",
    "webfrontend/postcss.config.js",
    "webfrontend/eslint.config.js",
    "webfrontend/index.html",
    "webfrontend/.gitignore",
    
    # Frontend - Main app
    "webfrontend/src/main.jsx",
    "webfrontend/src/App.jsx",
    "webfrontend/src/router.jsx",
    
    # Frontend - Contexts & Hooks
    "webfrontend/src/contexts/AuthContext.jsx",
    "webfrontend/src/contexts/CartContext.jsx",
    "webfrontend/src/hooks/useAuth.js",
    "webfrontend/src/hooks/useProducts.js",
    "webfrontend/src/hooks/useUpload.js",
    
    # Frontend - Apollo & GraphQL
    "webfrontend/src/lib/apollo.js",
    "webfrontend/src/graphql/auth.js",
    "webfrontend/src/graphql/products.js",
    "webfrontend/src/graphql/categories.js",
    "webfrontend/src/graphql/brands.js",
    "webfrontend/src/graphql/cart.js",
    "webfrontend/src/graphql/orders.js",
    "webfrontend/src/graphql/upload.js",
    "webfrontend/src/graphql/admin.js",
    "webfrontend/src/graphql/vnpay.js",
    
    # Frontend - Common Components
    "webfrontend/src/components/common/Layout.jsx",
    "webfrontend/src/components/common/Header.jsx",
    "webfrontend/src/components/common/Sidebar.jsx",
    "webfrontend/src/components/common/Footer.jsx",
    "webfrontend/src/components/common/LoadingSkeleton.jsx",
    
    # Frontend - Auth Components
    "webfrontend/src/components/auth/LoginForm.jsx",
    "webfrontend/src/components/auth/RegisterForm.jsx",
    "webfrontend/src/components/auth/ProtectedRoute.jsx",
    
    # Frontend - Product Components
    "webfrontend/src/components/products/ProductCard.jsx",
    "webfrontend/src/components/products/ProductList.jsx",
    "webfrontend/src/components/products/ProductFilter.jsx",
    "webfrontend/src/components/products/ProductSearch.jsx",
    
    # Frontend - Cart Components
    "webfrontend/src/components/cart/CartIcon.jsx",
    "webfrontend/src/components/cart/CartItem.jsx",
    "webfrontend/src/components/cart/CartSummary.jsx",
    "webfrontend/src/components/cart/AddToCartButton.jsx",
    
    # Frontend - Admin Components
    "webfrontend/src/components/admin/AdminLayout.jsx",
    
    # Frontend - Pages
    "webfrontend/src/pages/HomePage.jsx",
    "webfrontend/src/pages/LoginPage.jsx",
    "webfrontend/src/pages/RegisterPage.jsx",
    "webfrontend/src/pages/ForgotPasswordPage.jsx",
    "webfrontend/src/pages/ProductsPage.jsx",
    "webfrontend/src/pages/ProductDetailPage.jsx",
    "webfrontend/src/pages/CategoriesPage.jsx",
    "webfrontend/src/pages/BrandsPage.jsx",
    "webfrontend/src/pages/CartPage.jsx",
    "webfrontend/src/pages/CheckoutPage.jsx",
    "webfrontend/src/pages/OrdersPage.jsx",
    "webfrontend/src/pages/OrderDetailPage.jsx",
    "webfrontend/src/pages/OrderSuccessPage.jsx",
    "webfrontend/src/pages/VnpayReturnPage.jsx",
    "webfrontend/src/pages/NotFoundPage.jsx",
    
    # Frontend - Admin Pages
    "webfrontend/src/pages/admin/DashboardPage.jsx",
    "webfrontend/src/pages/admin/AdminProductsPage.jsx",
    "webfrontend/src/pages/admin/CreateProductPage.jsx",
    "webfrontend/src/pages/admin/EditProductPage.jsx",
    "webfrontend/src/pages/admin/AdminOrderDetailPage.jsx",
    "webfrontend/src/pages/admin/CreateOrderPage.jsx",
    "webfrontend/src/pages/admin/AdminOrdersPage.jsx",
    
    # Frontend - Admin Components
    "webfrontend/src/pages/admin/products/ProductTable.jsx",
    "webfrontend/src/pages/admin/products/ProductForm.jsx",
    "webfrontend/src/pages/admin/products/ProductFilter.jsx",
    "webfrontend/src/pages/admin/products/AdminProductFilter.jsx",
    "webfrontend/src/pages/admin/products/ImageUpload.jsx",
    
    # Frontend - Styles
    "webfrontend/src/index.css",
    "webfrontend/src/App.css",
    
    # Frontend - Utils
    "webfrontend/src/lib/utils.js",
    "webfrontend/src/utils/imageHelper.js",
    
    # Documentation
    "README.md",
]

def get_file_content(file_path):
    """Đọc nội dung file"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    except Exception as e:
        return f"[ERROR READING FILE: {str(e)}]"

def format_file_section(file_path, content):
    """Format section cho một file"""
    section = f"\n{'='*100}\n"
    section += f"FILE: {file_path}\n"
    section += f"{'='*100}\n\n"
    section += content
    section += f"\n{'='*100}\n"
    section += f"END OF FILE: {file_path}\n"
    section += f"{'='*100}\n\n"
    return section

def extract_smartshop_core():
    """Extract core files của SmartShop"""
    
    print("🚀 SmartShop Core Code Extractor - UPDATED VERSION")
    print("="*60)
    
    output_file = "smartshop_core_code_complete.txt"
    
    # Tạo header
    header = f"""
{'='*100}
SMARTSHOP CORE CODE EXTRACTION - COMPLETE VERSION
{'='*100}
Generated on: {os.popen('date').read().strip()}
Project: SmartShop E-commerce System
Description: Complete core files for backend (Node.js/GraphQL) and frontend (React/Vite)

{'='*100}
PROJECT OVERVIEW
{'='*100}
Backend: Node.js + Express + GraphQL + MongoDB
Frontend: React 18 + Vite + Tailwind CSS + Apollo Client
Authentication: JWT + bcrypt + OTP reset password
File Upload: GraphQL Upload with multiple images
Authorization: Role-based (admin/manager/customer)
Email Service: Nodemailer for password reset
Payment Gateway: VNPay integration with IPN and return URL handling
Testing: Jest + MongoDB Memory Server

{'='*100}
CORE FILES LIST - UPDATED
{'='*100}
"""
    
    # Thêm danh sách files vào header
    for i, file_path in enumerate(IMPORTANT_FILES, 1):
        header += f"{i:2d}. {file_path}\n"
    
    header += f"\n{'='*100}\n"
    header += f"TOTAL CORE FILES: {len(IMPORTANT_FILES)}\n"
    header += f"{'='*100}\n\n"
    
    # Ghi header
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header)
    
    # Process từng file
    processed_files = 0
    missing_files = []
    
    for file_path in IMPORTANT_FILES:
        if os.path.exists(file_path):
            print(f"✅ Processing: {file_path}")
            
            content = get_file_content(file_path)
            if not content.startswith('[ERROR'):
                section = format_file_section(file_path, content)
                
                with open(output_file, 'a', encoding='utf-8') as f:
                    f.write(section)
                
                processed_files += 1
            else:
                print(f"  ❌ Error: {content}")
                missing_files.append(file_path)
        else:
            print(f"❌ Missing: {file_path}")
            missing_files.append(file_path)
    
    # Thêm footer
    footer = f"""
{'='*100}
EXTRACTION SUMMARY - COMPLETE VERSION
{'='*100}
Total core files: {len(IMPORTANT_FILES)}
Successfully processed: {processed_files}
Missing files: {len(missing_files)}
Output file: {os.path.abspath(output_file)}

{'='*100}
MISSING FILES
{'='*100}
"""
    
    if missing_files:
        for file_path in missing_files:
            footer += f"- {file_path}\n"
    else:
        footer += "None - All files processed successfully!\n"
    
    footer += f"\n{'='*100}\n"
    footer += "SMARTSHOP PROJECT STRUCTURE - COMPLETE\n"
    footer += f"{'='*100}\n"
    footer += """
SmartShop/
├── server/                 # Backend Node.js/GraphQL
│   ├── index.js           # Main server entry
│   ├── config.js          # Database configuration
│   ├── permissions.js     # Authorization middleware
│   ├── check-db.js        # Database connection check
│   ├── migrate-mongo-config.js # Migration config
│   ├── jest.config.json   # Test configuration
│   ├── graphql/           # GraphQL schema & resolvers
│   │   ├── schema.js      # Main schema
│   │   ├── hello.js       # Hello resolver
│   │   ├── authentication.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── brands.js
│   │   ├── carts.js
│   │   ├── orders.js
│   │   └── upload.js
│   ├── data/              # Data layer
│   │   ├── models/        # Mongoose models
│   │   │   ├── index.js
│   │   │   ├── user.js
│   │   │   ├── product.js
│   │   │   ├── category.js
│   │   │   ├── brand.js
│   │   │   ├── cart.js
│   │   │   ├── order.js
│   │   │   └── orderItem.js
│   │   ├── mongoRepo.js   # Repository pattern
│   │   ├── mockRepo.js    # Mock repository for tests
│   │   ├── init.js        # Database initialization
│   │   └── __tests__/     # Data layer tests
│   │       ├── categories.test.js
│   │       └── products.test.js
│   ├── utils/             # Utility functions
│   │   ├── otpUtils.js    # OTP generation & validation
│   │   ├── passwordReset.js # Password reset utilities
│   │   └── imageHelper.js # Image processing utilities
│   ├── services/          # External services
│   │   ├── emailService.js # Email service for password reset
│   │   └── vnpayService.js # VNPay payment gateway service
│   ├── routes/            # Express routes
│   │   └── vnpayRoutes.js # VNPay payment routes
│   ├── migrations/        # Database migrations
│   │   ├── 20250601031152-initial_smartshop_data.js
│   │   └── 20250601032421-add_sample_images.js
│   ├── test/              # Test setup files
│   │   ├── globalSetup.js
│   │   ├── globalTeardown.js
│   │   └── setupFileAfterEnv.js
│   ├── test-vnpay-new.js  # VNPay integration test
│   └── img/               # Uploaded images
├── webfrontend/           # Frontend React/Vite
│   ├── index.html         # Main HTML file
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   ├── postcss.config.js  # PostCSS config
│   ├── eslint.config.js   # ESLint configuration
│   └── src/
│       ├── main.jsx       # App entry point
│       ├── App.jsx        # Main app component
│       ├── router.jsx     # React Router setup
│       ├── index.css      # Global styles
│       ├── App.css        # App-specific styles
│       ├── contexts/      # React contexts
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── hooks/         # Custom hooks
│       │   ├── useAuth.js
│       │   ├── useProducts.js
│       │   └── useUpload.js
│       ├── components/    # Reusable components
│       │   ├── common/    # Common components
│       │   │   ├── Layout.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── LoadingSkeleton.jsx
│       │   ├── auth/      # Authentication components
│       │   │   ├── LoginForm.jsx
│       │   │   ├── RegisterForm.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── products/  # Product components
│       │   │   ├── ProductCard.jsx
│       │   │   ├── ProductList.jsx
│       │   │   ├── ProductFilter.jsx
│       │   │   └── ProductSearch.jsx
│       │   ├── cart/      # Cart components
│       │   │   ├── CartIcon.jsx
│       │   │   ├── CartItem.jsx
│       │   │   ├── CartSummary.jsx
│       │   │   └── AddToCartButton.jsx
│       │   └── admin/     # Admin components
│       │       └── AdminLayout.jsx
│       ├── pages/         # Page components
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ForgotPasswordPage.jsx
│       │   ├── ProductsPage.jsx
│       │   ├── ProductDetailPage.jsx
│       │   ├── CategoriesPage.jsx
│       │   ├── BrandsPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── OrderDetailPage.jsx
│       │   ├── OrderSuccessPage.jsx
│       │   ├── VnpayReturnPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   └── admin/     # Admin pages
│       │       ├── DashboardPage.jsx
│       │       ├── AdminProductsPage.jsx
│       │       ├── CreateProductPage.jsx
│       │       ├── EditProductPage.jsx
│       │       ├── AdminOrderDetailPage.jsx
│       │       ├── CreateOrderPage.jsx
│       │       └── AdminOrdersPage.jsx
│       │           ├── ProductTable.jsx
│       │           ├── ProductForm.jsx
│       │           ├── ProductFilter.jsx
│       │           ├── AdminProductFilter.jsx
│       │           └── ImageUpload.jsx
│       ├── graphql/       # GraphQL queries/mutations
│       │   ├── auth.js
│       │   ├── products.js
│       │   ├── categories.js
│       │   ├── brands.js
│       │   ├── cart.js
│       │   ├── orders.js
│       │   ├── upload.js
│       │   ├── admin.js
│       │   └── vnpay.js
│       └── lib/           # Utilities
│           ├── apollo.js
│           └── utils.js
└── README.md
"""
    
    footer += f"\n{'='*100}\n"
    footer += "EXTRACTION COMPLETED - COMPLETE VERSION\n"
    footer += f"{'='*100}\n"
    
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(footer)
    
    print(f"\n✅ Extraction completed!")
    print(f"📁 Total core files: {len(IMPORTANT_FILES)}")
    print(f"✅ Successfully processed: {processed_files}")
    print(f"❌ Missing files: {len(missing_files)}")
    print(f"📄 Output file: {os.path.abspath(output_file)}")
    
    if missing_files:
        print(f"\n⚠️  Missing files:")
        for file_path in missing_files:
            print(f"   - {file_path}")

if __name__ == "__main__":
    extract_smartshop_core() 