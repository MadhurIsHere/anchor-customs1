import os, zipfile
import xml.etree.ElementTree as ET

base = r'c:\Users\Karampreet Singh\OneDrive\Desktop\combos_extracted\COMBOS'
out_path = r'c:\Users\Karampreet Singh\OneDrive\Desktop\anchor customs\combo_info.txt'
with open(out_path, 'w', encoding='utf-8') as f:
    for i in [1, 2, 3]:
        c = f'COMBO {i}'
        p = os.path.join(base, c, 'Untitled document.docx')
        if os.path.exists(p):
            with zipfile.ZipFile(p) as z:
                xml_content = z.read('word/document.xml')
                tree = ET.fromstring(xml_content)
                texts = [''.join(node.itertext()) for node in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')]
                f.write(f'\n--- {c} ---\n')
                f.write('\n'.join(t for t in texts if t.strip()) + '\n')
