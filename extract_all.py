import os
import fitz

root = r"C:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\public\products"
for dirpath, dirnames, filenames in os.walk(root):
    for filename in filenames:
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(dirpath, filename)
            
            try:
                doc = fitz.open(pdf_path)
                print(f"\nPDF: {filename} ({len(doc)} pages)")
                
                # We'll print a JS array structure to easily copy-paste
                js_array = "pages: [\n"
                
                for i in range(len(doc)):
                    png_name = f"{filename[:-4]}_page_{i+1}.png"
                    png_path = os.path.join(dirpath, png_name)
                    
                    if not os.path.exists(png_path):
                        page = doc.load_page(i)
                        pix = page.get_pixmap(dpi=150)
                        pix.save(png_path)
                    
                    # Compute relative path for website
                    rel_dir = dirpath.replace(root, "/products").replace("\\", "/")
                    js_array += f"  '{rel_dir}/{png_name}',\n"
                    
                js_array += "]"
                print(js_array)
                doc.close()
            except Exception as e:
                print(f"Error processing {filename}: {e}")
