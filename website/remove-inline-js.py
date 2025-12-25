#!/usr/bin/env python3
"""
Script per rimuovere JavaScript inline (onclick) dai file HTML
"""

import os
import re
from pathlib import Path

def remove_inline_js(directory):
    """Rimuove attributi onclick dai file HTML"""

    # Trova tutti i file HTML
    html_files = list(Path(directory).rglob("*.html"))

    for html_file in html_files:
        # Salta i file di backup
        if html_file.name.endswith('.backup'):
            continue

        print(f"Processing: {html_file}")

        # Leggi il contenuto
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Rimuovi onclick attributes per toggleTour
        # Pattern: onclick="toggleTour('tour-id')"
        pattern = r'onclick="toggleTour\(\'[^\']+\'\)"'

        # Conta quante occorrenze
        matches = list(re.finditer(pattern, content))

        if matches:
            # Rimuovi gli onclick
            new_content = re.sub(pattern, '', content)

            # Scrivi il file aggiornato
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"  -> Removed {len(matches)} onclick attributes")

    print(f"\n[SUCCESS] Processed {len(html_files)} HTML files")

if __name__ == "__main__":
    website_dir = Path(__file__).parent
    remove_inline_js(website_dir)