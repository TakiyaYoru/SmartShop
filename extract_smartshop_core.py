#!/usr/bin/env python3
"""
SmartShop Core Code Extractor
Extract các file quan trọng nhất từ SmartShop project
"""

import os
from pathlib import Path

# Danh sách các file quan trọng cần extract
IMPORTANT_FILES = [
    # Backend - Core files
    "server/package.json",
    "server/index.js",
    "server/config.js",
    "server/permissions.js",
    
    # Backend - GraphQL
    "server/graphql/schema.js",
    "server/graphql/authentication.js",
    "server/graphql/products.js",
    "server/graphql/categories.js",
    "server/graphql/brands.js",
    "server/graphql/carts.js",
    "server/graphql/orders.js",
    "server/graphql/upload.js",
    
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
    "server/data/init.js",
    
    # Frontend - Core files
    "webfrontend/package.json",
    "webfrontend/vite.config.js",
    "webfrontend/tailwind.config.js",
    
    # Frontend - Main app
    "webfrontend/src/main.jsx",
    "webfrontend/src/App.jsx",
    "webfrontend/src/router.jsx",
    
    # Frontend - Contexts & Hooks
    "webfrontend/src/contexts/AuthContext.jsx",
    "webfrontend/src/hooks/useAuth.js",
    "webfrontend/src/hooks/useProducts.js",
    "webfrontend/src/hooks/useUpload.js",
    
    # Frontend - Apollo & GraphQL
    "webfrontend/src/lib/apollo.js",
    "webfrontend/src/graphql/auth.js",
    "webfrontend/src/graphql/products.js",
    "webfrontend/src/graphql/categories.js",
    "webfrontend/src/graphql/brands.js",
    "webfrontend/src/graphql/upload.js",
    "webfrontend/src/graphql/admin.js",
    
    # Frontend - Components
    "webfrontend/src/components/common/Layout.jsx",
    "webfrontend/src/components/common/Header.jsx",
    "webfrontend/src/components/common/Sidebar.jsx",
    "webfrontend/src/components/common/Footer.jsx",
    "webfrontend/src/components/auth/LoginForm.jsx",
    "webfrontend/src/components/auth/RegisterForm.jsx",
    "webfrontend/src/components/auth/ProtectedRoute.jsx",
    "webfrontend/src/components/products/ProductCard.jsx",
    "webfrontend/src/components/products/ProductList.jsx",
    "webfrontend/src/components/products/ProductFilter.jsx",
    "webfrontend/src/components/products/ProductSearch.jsx",
    "webfrontend/src/components/admin/AdminLayout.jsx",
    
    # Frontend - Pages
    "webfrontend/src/pages/HomePage.jsx",
    "webfrontend/src/pages/LoginPage.jsx",
    "webfrontend/src/pages/RegisterPage.jsx",
    "webfrontend/src/pages/ProductsPage.jsx",
    "webfrontend/src/pages/ProductDetailPage.jsx",
    "webfrontend/src/pages/CategoriesPage.jsx",
    "webfrontend/src/pages/BrandsPage.jsx",
    "webfrontend/src/pages/CartPage.jsx",
    "webfrontend/src/pages/NotFoundPage.jsx",
    
    # Frontend - Admin Pages
    "webfrontend/src/pages/admin/DashboardPage.jsx",
    "webfrontend/src/pages/admin/AdminProductsPage.jsx",
    "webfrontend/src/pages/admin/CreateProductPage.jsx",
    "webfrontend/src/pages/admin/EditProductPage.jsx",
    
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
    
    print("🚀 SmartShop Core Code Extractor")
    print("="*50)
    
    output_file = "smartshop_core_code.txt"
    
    # Tạo header
    header = f"""
{'='*100}
SMARTSHOP CORE CODE EXTRACTION
{'='*100}
Generated on: {os.popen('date').read().strip()}
Project: SmartShop E-commerce System
Description: Core files for backend (Node.js/GraphQL) and frontend (React/Vite)

{'='*100}
PROJECT OVERVIEW
{'='*100}
Backend: Node.js + Express + GraphQL + MongoDB
Frontend: React 18 + Vite + Tailwind CSS + Apollo Client
Authentication: JWT + bcrypt
File Upload: GraphQL Upload
Authorization: Role-based (admin/manager/customer)

{'='*100}
CORE FILES LIST
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
EXTRACTION SUMMARY
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
    footer += "SMARTSHOP PROJECT STRUCTURE\n"
    footer += f"{'='*100}\n"
    footer += """
SmartShop/
├── server/                 # Backend Node.js/GraphQL
│   ├── index.js           # Main server entry
│   ├── config.js          # Database configuration
│   ├── permissions.js     # Authorization middleware
│   ├── graphql/           # GraphQL schema & resolvers
│   │   ├── schema.js      # Main schema
│   │   ├── authentication.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── brands.js
│   │   ├── carts.js
│   │   ├── orders.js
│   │   └── upload.js
│   ├── data/              # Data layer
│   │   ├── models/        # Mongoose models
│   │   ├── mongoRepo.js   # Repository pattern
│   │   └── init.js        # Database initialization
│   └── img/               # Uploaded images
├── webfrontend/           # Frontend React/Vite
│   ├── src/
│   │   ├── main.jsx       # App entry point
│   │   ├── App.jsx        # Main app component
│   │   ├── router.jsx     # React Router setup
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── graphql/       # GraphQL queries/mutations
│   │   └── lib/           # Utilities
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
"""
    
    footer += f"\n{'='*100}\n"
    footer += "EXTRACTION COMPLETED\n"
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