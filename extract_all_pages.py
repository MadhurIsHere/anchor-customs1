import fitz
import os

pdf_path = r"C:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\public\products\standing magazine\standing magazine.pdf"
dirpath = os.path.dirname(pdf_path)

try:
    doc = fitz.open(pdf_path)
    print(f"Total pages: {len(doc)}")
    for i in range(len(doc)):
        page = doc.load_page(i)
        pix = page.get_pixmap(dpi=150)
        png_path = os.path.join(dirpath, f"standing_magazine_page_{i+1}.png")
        pix.save(png_path)
        print(f"Saved {png_path}")
    doc.close()
except Exception as e:
    print(f"Error: {e}")
