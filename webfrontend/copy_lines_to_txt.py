import os

def copy_folder_to_txt(folder_path, output_path):
    try:
        with open(output_path, 'w', encoding='utf-8') as output_file:
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)

                # Bỏ qua thư mục con
                if os.path.isfile(file_path):
                    output_file.write(f"\n===== {filename} =====\n")
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as input_file:
                        output_file.writelines(input_file.readlines())

        print(f"✅ Đã sao chép toàn bộ nội dung từ folder '{folder_path}' sang '{output_path}'.")
    except Exception as e:
        print(f"❌ Lỗi xảy ra: {e}")


# Ví dụ sử dụng
if __name__ == "__main__":
    folder_path = "lay_data"       # Đổi thành thư mục chứa các file bạn muốn copy
    output_path = "frontend.txt"
    copy_folder_to_txt(folder_path, output_path)
