import os
import fitz
from PIL import Image

def process_single_pdf(pdf_path, base_web_path, max_size=1200, quality=80):
    if not os.path.exists(pdf_path):
        print(f"Error: Could not find the PDF file at {pdf_path}")
        return

    dirpath = os.path.dirname(pdf_path)
    filename = os.path.basename(pdf_path)
    
    try:
        doc = fitz.open(pdf_path)
        print(f"Processing: {filename} ({len(doc)} pages)")
        
        js_array = "pages: [\n"
        
        for i in range(len(doc)):
            page = doc.load_page(i)
            pix = page.get_pixmap(dpi=150)
            
            # Convert PyMuPDF pixmap to PIL Image
            mode = "RGBA" if pix.alpha else "RGB"
            img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
            
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            if max(img.size) > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
            # Save directly as JPEG (this will overwrite old ones automatically)
            jpg_name = f"{filename[:-4]}_page_{i+1}.jpg"
            jpg_path = os.path.join(dirpath, jpg_name)
            img.save(jpg_path, "JPEG", quality=quality, optimize=True)
            print(f"  Saved: {jpg_name}")
            
            # Append to JS Array
            js_array += f"  '{base_web_path}/{jpg_name}',\n"
            
        js_array += "]"
        print("\nYour updated frontend code:")
        print(js_array)
        
        doc.close()
        
    except Exception as e:
        print(f"Error processing PDF: {e}")

if __name__ == "__main__":
    # Path to just the single PDF you want to update
    target_pdf = r"D:\Freelancing\anchor-customs\public\products\MAGAZINE TEMPLATES\NORMAL TEMPLATE-WEBSITE.pdf"
    
    # Frontend public path mapping
    frontend_path = "/products/MAGAZINE TEMPLATES"
    
    process_single_pdf(target_pdf, frontend_path)