import os, shutil
import fitz

src_base = r'c:\Users\Karampreet Singh\OneDrive\Desktop\combos_extracted\COMBOS'
dst_base = r'c:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\public\products'

for i in [1, 2, 3]:
    c = f'COMBO {i}'
    src_dir = os.path.join(src_base, c)
    dst_dir = os.path.join(dst_base, c)
    os.makedirs(dst_dir, exist_ok=True)
    
    # Process files
    if os.path.exists(src_dir):
        for f in os.listdir(src_dir):
            if f.endswith('.png'):
                new_name = 'cover.png' if 'Design' in f else 'frame.png'
                if 'Copy of Untitled Design' in f and 'Design - ' not in f:
                    new_name = 'frame2.png'
                if 'frame' in f.lower() or 'a4' in f.lower():
                    new_name = 'frame.png'
                
                shutil.copy(os.path.join(src_dir, f), os.path.join(dst_dir, new_name))
            
            elif f.lower().endswith('.pdf'):
                pdf_path = os.path.join(src_dir, f)
                print(f"Extracting {pdf_path}")
                doc = fitz.open(pdf_path)
                num_pages = len(doc)
                for page_num in range(num_pages):
                    page = doc.load_page(page_num)
                    pix = page.get_pixmap(dpi=150)
                    jpg_path = os.path.join(dst_dir, f'magazine_page_{page_num + 1}.jpg')
                    pix.save(jpg_path)
                    page = None
                    pix = None
                doc.close()
                print(f"Done extracting {num_pages} pages from {c}")
