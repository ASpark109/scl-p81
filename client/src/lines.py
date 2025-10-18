import os

def count_lines_in_folder(folder_path):
    total_lines = 0
    allowed_extensions = {'.js', '.css', '.json', '.jsx'}

    for root, _, files in os.walk(folder_path):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext.lower() in allowed_extensions:
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = sum(1 for _ in f)
                        total_lines += lines
                except Exception as e:
                    print(f"Не вдалося прочитати {file_path}: {e}")

    return total_lines


if __name__ == "__main__":
    folder = input("Введіть шлях до папки: ").strip()
    total = count_lines_in_folder(folder)
    print(f"\nЗагальна кількість рядків у *.js, *.css і *.json файлах: {total}")