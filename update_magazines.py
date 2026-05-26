import os
import fitz

desktop_dir = r"C:\Users\Karampreet Singh\OneDrive\Desktop"
output_dir = r"C:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\public\products\MAGAZINE TEMPLATES"

pdfs = [
    ("rozana template .pdf", "ROZANA-WEBSITE_page_"),
    ("shayarana template.pdf", "SHAYARANA-WEBSITE_page_"),
    ("tera mera rishta .pdf", "TERA MERA RISHTA-WEBSITE_page_")
]

for pdf_name, prefix in pdfs:
    pdf_path = os.path.join(desktop_dir, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
        
    print(f"Processing {pdf_name}...")
    try:
        doc = fitz.open(pdf_path)
        num_pages = len(doc)
        print(f"Total pages: {num_pages}")
        
        for i in range(num_pages):
            page = doc.load_page(i)
            pix = page.get_pixmap(dpi=150)
            
            # 1-indexed page number
            out_name = f"{prefix}{i+1}.jpg"
            out_path = os.path.join(output_dir, out_name)
            
            pix.save(out_path)
            
        print(f"Successfully saved {num_pages} images for {pdf_name} with prefix {prefix}")
        doc.close()
    except Exception as e:
        print(f"Error processing {pdf_name}: {e}")
