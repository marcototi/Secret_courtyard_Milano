#!/usr/bin/env python3
"""
Script per aggiungere loading="lazy" alle immagini mancanti
"""

import re
from pathlib import Path

def add_lazy_loading(file_path):
    """Aggiunge loading="lazy" alle immagini senza l'attributo"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Trova tutte le immagini senza loading="lazy"
    # Pattern: <img ...> senza loading="lazy"
    img_pattern = r'<img([^>]*)>'

    def add_lazy(match):
        img_tag = match.group(0)
        img_attrs = match.group(1)

        # Se già ha loading="lazy", non fare nulla
        if 'loading="lazy"' in img_tag:
            return img_tag

        # Se ha loading="eager" o altro, non modificare
        if 'loading="' in img_tag:
            return img_tag

        # Aggiungi loading="lazy" prima della chiusura >
        new_tag = img_tag.replace('>', ' loading="lazy">')
        return new_tag

    new_content = re.sub(img_pattern, add_lazy, content)

    # Conta modifiche
    old_imgs = len(re.findall(img_pattern, content))
    new_imgs = len(re.findall(img_pattern, new_content))
    lazy_imgs = len(re.findall(r'loading="lazy"', new_content))

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"  -> Aggiunto lazy loading: {lazy_imgs}/{new_imgs} immagini")
        return True

    return False

if __name__ == "__main__":
    files_to_fix = [
        "pages/la-ristrutturazione.html",
        "pages/mobilita.html",
        "pages/scopri-milano.html"
    ]

    print("Aggiunta lazy loading alle immagini...")

    for file in files_to_fix:
        file_path = Path(__file__).parent / file
        if file_path.exists():
            print(f"\nProcessing: {file}")
            add_lazy_loading(file_path)

    print("\n[SUCCESS] Lazy loading aggiunto con successo!")