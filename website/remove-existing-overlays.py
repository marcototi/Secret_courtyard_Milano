#!/usr/bin/env python3
"""
Script per rimuovere eventuali overlay 'clicca per ingrandire' già presenti
nella pagina la-ristrutturazione.html
"""

import re
from pathlib import Path

def remove_existing_overlays(file_path):
    """Rimuove overlay esistenti dalla pagina HTML"""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern per trovare div con classe clickable-overlay
    overlay_pattern = r'<div class="clickable-overlay"[^>]*>.*?</div>'

    # Rimuovi tutti gli overlay
    new_content = re.sub(overlay_pattern, '', content, flags=re.DOTALL)

    # Rimuovi anche eventuali attributi style="position: relative" aggiunti dai container
    # ma solo se non sono necessari per altri elementi
    style_pattern = r'style="position: relative;"'
    new_content = re.sub(style_pattern, '', new_content)

    # Rimuovi la classe 'clickable' dalle immagini room-image
    clickable_pattern = r'class="room-image clickable"'
    new_content = re.sub(clickable_pattern, 'class="room-image"', new_content)

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Rimossi overlay esistenti da {file_path.name}")
        return True

    return False

if __name__ == "__main__":
    file_path = Path(__file__).parent / "pages" / "la-ristrutturazione.html"

    if file_path.exists():
        print("Rimozione overlay 'Clicca per ingrandire' dalla pagina La Ristrutturazione...")
        if remove_existing_overlays(file_path):
            print("[SUCCESS] Overlay rimossi con successo!")
        else:
            print("[INFO] Nessun overlay trovato nella pagina (già pulita)")
    else:
        print(f"[ERROR] File non trovato: {file_path}")