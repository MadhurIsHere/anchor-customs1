import os
import fitz

root = r"C:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\public\products"
for dirpath, dirnames, filenames in os.walk(root):
    for filename in filenames:
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(dirpath, filename)
            png_path = os.path.join(dirpath, filename[:-4] + ".png")
            if not os.path.exists(png_path):
                print(f"Converting {pdf_path}")
                try:
                    doc = fitz.open(pdf_path)
                    page = doc.load_page(0)
                    pix = page.get_pixmap(dpi=150)
                    pix.save(png_path)
                    doc.close()
                except Exception as e:
                    print(f"Error converting {pdf_path}: {e}")
