#!/usr/bin/env python3
"""
Script per ripristinare le referenze CSS da main.css a base.css
"""

import os
import re
from pathlib import Path

def restore_css_references(directory):
    """Ripristina le referenze CSS in tutti i file HTML"""

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

        # Sostituisci main.css con base.css
        # Cerca pattern come href="assets/css/main.css" o href="../assets/css/main.css"
        old_patterns = [
            r'href="assets/css/main\.css"',
            r'href="\.\./assets/css/main\.css"',
            r'href="\./assets/css/main\.css"',
        ]

        updated = False
        for pattern in old_patterns:
            if re.search(pattern, content):
                # Determina il percorso relativo corretto
                if '..' in pattern:
                    new_href = 'href="../assets/css/base.css"'
                else:
                    new_href = 'href="assets/css/base.css"'

                content = re.sub(pattern, new_href, content)
                updated = True

        # Se sono state fatte modifiche, scrivi il file
        if updated:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  -> Restored CSS reference to base.css")

    print(f"\n[SUCCESS] Updated {len(html_files)} HTML files")

if __name__ == "__main__":
    website_dir = Path(__file__).parent
    restore_css_references(website_dir)