#!/usr/bin/env python3
"""
Script để extract tất cả code quan trọng từ SmartShop project
Tạo file txt để dễ dàng gửi cho AI
"""

import os
import glob
from pathlib import Path

def should_include_file(file_path):
    """Kiểm tra xem file có nên được include không"""
    # Các file cần loại trừ
    exclude_patterns = [
        'node_modules',
        '.git',
        '__pycache__',
        '.vscode',
        'dist',
        'build',
        'coverage',
        '.next',
        '.nuxt',
        'package-lock.json',
        'yarn.lock',
        '.env',
        '.env.local',
        '.DS_Store',
        '*.log',
        '*.tmp',
        '*.cache',
        '*.min.js',
        '*.min.css',
        '*.map',
        '*.webp',
        '*.jpg',
        '*.jpeg',
        '*.png',
        '*.gif',
        '*.svg',
        '*.ico',
        '*.woff',
        '*.woff2',
        '*.ttf',
        '*.eot'
    ]
    
    file_path_str = str(file_path).lower()
    
    for pattern in exclude_patterns:
        if pattern in file_path_str:
            return False
    
    return True

def get_file_extension(file_path):
    """Lấy extension của file"""
    return Path(file_path).suffix.lower()

def should_include_by_extension(file_path):
    """Kiểm tra file theo extension"""
    extensions = [
        '.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.md', '.txt',
        '.html', '.css', '.scss', '.sass', '.less', '.vue', '.php',
        '.java', '.cpp', '.c', '.h', '.hpp', '.cs', '.go', '.rs',
        '.rb', '.php', '.swift', '.kt', '.scala', '.r', '.m', '.mm'
    ]
    
    return get_file_extension(file_path) in extensions

def get_file_content(file_path, max_size_mb=1):
    """Đọc nội dung file với giới hạn kích thước"""
    try:
        # Kiểm tra kích thước file
        file_size = os.path.getsize(file_path)
        if file_size > max_size_mb * 1024 * 1024:  # Giới hạn 1MB
            return f"[FILE TOO LARGE - {file_size} bytes]"
        
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            return content
    except Exception as e:
        return f"[ERROR READING FILE: {str(e)}]"

def format_file_section(file_path, content):
    """Format section cho một file"""
    relative_path = str(file_path)
    
    # Thêm comment dựa trên extension
    extension = get_file_extension(file_path)
    comment_map = {
        '.js': '//',
        '.jsx': '//',
        '.ts': '//',
        '.tsx': '//',
        '.py': '#',
        '.json': '//',
        '.md': '<!--',
        '.html': '<!--',
        '.css': '/*',
        '.scss': '//',
        '.sass': '//',
        '.less': '//',
        '.vue': '<!--',
        '.php': '//',
        '.java': '//',
        '.cpp': '//',
        '.c': '//',
        '.h': '//',
        '.hpp': '//',
        '.cs': '//',
        '.go': '//',
        '.rs': '//',
        '.rb': '#',
        '.swift': '//',
        '.kt': '//',
        '.scala': '//',
        '.r': '#',
        '.m': '//',
        '.mm': '//'
    }
    
    comment = comment_map.get(extension, '//')
    
    section = f"\n{comment} {'='*80}\n"
    section += f"{comment} FILE: {relative_path}\n"
    section += f"{comment} {'='*80}\n\n"
    section += content
    section += f"\n{comment} {'='*80}\n"
    section += f"{comment} END OF FILE: {relative_path}\n"
    section += f"{comment} {'='*80}\n\n"
    
    return section

def extract_project_code(project_path, output_file):
    """Extract tất cả code từ project"""
    
    # Tạo header cho file output
    header = f"""
{'='*100}
SMARTSHOP PROJECT CODE EXTRACTION
{'='*100}
Generated on: {os.popen('date').read().strip()}
Project path: {os.path.abspath(project_path)}
Total files processed: 0

{'='*100}
PROJECT STRUCTURE
{'='*100}
"""
    
    # Tạo project structure
    structure = []
    total_files = 0
    
    for root, dirs, files in os.walk(project_path):
        # Loại bỏ các thư mục không cần thiết
        dirs[:] = [d for d in dirs if should_include_file(os.path.join(root, d))]
        
        for file in files:
            file_path = os.path.join(root, file)
            if should_include_file(file_path) and should_include_by_extension(file_path):
                relative_path = os.path.relpath(file_path, project_path)
                structure.append(relative_path)
                total_files += 1
    
    # Sắp xếp files theo thứ tự logic
    structure.sort()
    
    # Thêm structure vào header
    for file_path in structure:
        header += f"{file_path}\n"
    
    header += f"\n{'='*100}\n"
    header += f"TOTAL FILES: {total_files}\n"
    header += f"{'='*100}\n\n"
    
    # Ghi header vào file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(header)
    
    # Process từng file
    processed_files = 0
    
    for file_path in structure:
        full_path = os.path.join(project_path, file_path)
        
        print(f"Processing: {file_path}")
        
        try:
            content = get_file_content(full_path)
            if content and not content.startswith('[ERROR') and not content.startswith('[FILE TOO LARGE'):
                section = format_file_section(file_path, content)
                
                with open(output_file, 'a', encoding='utf-8') as f:
                    f.write(section)
                
                processed_files += 1
            else:
                print(f"  Skipped: {content}")
        except Exception as e:
            print(f"  Error processing {file_path}: {str(e)}")
    
    # Thêm footer
    footer = f"""
{'='*100}
EXTRACTION COMPLETED
{'='*100}
Total files found: {total_files}
Files successfully processed: {processed_files}
Output file: {os.path.abspath(output_file)}
{'='*100}
"""
    
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(footer)
    
    print(f"\n✅ Extraction completed!")
    print(f"📁 Total files found: {total_files}")
    print(f"✅ Files processed: {processed_files}")
    print(f"📄 Output file: {os.path.abspath(output_file)}")

def main():
    """Main function"""
    print("🚀 SmartShop Code Extractor")
    print("="*50)
    
    # Đường dẫn project (có thể thay đổi)
    project_path = "."  # Current directory
    
    # Tên file output
    output_file = "smartshop_code_extraction.txt"
    
    # Kiểm tra xem có phải là SmartShop project không
    if not os.path.exists("server") or not os.path.exists("webfrontend"):
        print("❌ Error: Không tìm thấy thư mục 'server' hoặc 'webfrontend'")
        print("   Hãy chạy script này từ thư mục gốc của SmartShop project")
        return
    
    print(f"📂 Project path: {os.path.abspath(project_path)}")
    print(f"📄 Output file: {output_file}")
    print("\n🔄 Starting extraction...")
    
    # Thực hiện extraction
    extract_project_code(project_path, output_file)
    
    print(f"\n🎉 Hoàn thành! File {output_file} đã được tạo.")
    print("💡 Bạn có thể sử dụng file này để gửi cho AI.")

if __name__ == "__main__":
    main() 