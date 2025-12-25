#!/usr/bin/env python3
"""
Script per correggere i percorsi CSS nelle pagine
"""

import os
import re
from pathlib import Path

def fix_css_paths(directory):
    """Corregge i percorsi CSS nelle pagine HTML"""

    # Trova tutti i file HTML nelle pagine
    html_files = list(Path(directory).rglob("pages/*.html"))

    for html_file in html_files:
        # Salta i file di backup
        if html_file.name.endswith('.backup'):
            continue

        print(f"Processing: {html_file}")

        # Leggi il contenuto
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Pattern da correggere
        patterns = [
            (r'href="assets/css/base\.css"', 'href="../assets/css/base.css"'),
            (r'href="\./assets/css/base\.css"', 'href="../assets/css/base.css"'),
        ]

        updated = False
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                updated = True

        # Se sono state fatte modifiche, scrivi il file
        if updated:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  -> Fixed CSS path")

    print(f"\n[SUCCESS] Fixed {len(html_files)} HTML files in pages directory")

if __name__ == "__main__":
    website_dir = Path(__file__).parent
    fix_css_paths(website_dir)