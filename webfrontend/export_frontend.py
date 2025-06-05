import os
import glob

def should_skip_file(file_path):
    # Các file và thư mục cần bỏ qua
    skip_patterns = [
        'node_modules',
        'backend.txt',
        'copy_lines_to_txt.py',
        '.env',
        '.gitignore',
        'export_frontend.py',
        '__pycache__',
        '.git',
        'dist',
        'build'
    ]
    
    # Kiểm tra xem file có nằm trong danh sách bỏ qua không
    for pattern in skip_patterns:
        if pattern in file_path:
            return True
            
    # Bỏ qua các file không phải code
    skip_extensions = ['.log', '.lock', '.md', '.txt']
    file_ext = os.path.splitext(file_path)[1]
    if file_ext in skip_extensions:
        return True
        
    return False

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            return content
    except Exception as e:
        return f"Error reading file {file_path}: {str(e)}"

def export_frontend_code():
    # Tạo file output
    output_file = 'frontend_code.txt'
    
    with open(output_file, 'w', encoding='utf-8') as out:
        # Duyệt qua tất cả các file trong thư mục hiện tại và thư mục con
        for root, dirs, files in os.walk('.'):
            # Bỏ qua các thư mục không cần thiết
            dirs[:] = [d for d in dirs if not should_skip_file(d)]
            
            for file in files:
                file_path = os.path.join(root, file)
                
                # Kiểm tra xem có nên bỏ qua file này không
                if should_skip_file(file_path):
                    continue
                
                # Ghi đường dẫn file
                out.write(f"\n{'='*50}\n")
                out.write(f"File: {file_path}\n")
                out.write(f"{'='*50}\n\n")
                
                # Đọc và ghi nội dung file
                content = read_file_content(file_path)
                out.write(content)
                out.write('\n')

if __name__ == '__main__':
    print("Bắt đầu xuất code frontend...")
    export_frontend_code()
    print("Đã xuất code frontend vào file frontend_code.txt") 