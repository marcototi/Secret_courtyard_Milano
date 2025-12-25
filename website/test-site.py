#!/usr/bin/env python3
"""
Test semplice per verificare che il sito funzioni correttamente
"""

import os
import re
from pathlib import Path

def test_site(directory):
    """Esegue test base sul sito"""

    print("=" * 60)
    print("TEST SITO SECRET COURTYARD MILANO")
    print("=" * 60)

    # 1. Verifica file essenziali
    essential_files = [
        "index.html",
        "assets/css/base.css",
        "assets/js/main.js",
    ]

    print("\n1. VERIFICA FILE ESSENZIALI:")
    for file in essential_files:
        file_path = Path(directory) / file
        if file_path.exists():
            print(f"   [OK] {file}")
        else:
            print(f"   [ERR] {file} - MANCANTE!")

    # 2. Verifica pagine HTML
    html_files = list(Path(directory).rglob("*.html"))
    html_files = [f for f in html_files if not f.name.endswith('.backup')]

    print(f"\n2. PAGINE HTML TROVATE: {len(html_files)}")
    for html_file in html_files:
        print(f"   • {html_file.relative_to(directory)}")

    # 3. Verifica CSS nelle pagine
    print("\n3. VERIFICA CSS NELLE PAGINE:")
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Cerca link CSS
        css_matches = re.findall(r'<link[^>]*href="([^"]*\.css)"', content)
        valid_css = any('base.css' in css for css in css_matches)

        if valid_css:
            print(f"   [OK] {html_file.name} - CSS corretto")
        else:
            print(f"   [ERR] {html_file.name} - CSS mancante o errato")

    # 4. Verifica JavaScript
    print("\n4. VERIFICA JAVASCRIPT:")
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Cerca script
        script_matches = re.findall(r'<script[^>]*src="([^"]*\.js)"', content)

        if script_matches:
            print(f"   [OK] {html_file.name} - {len(script_matches)} script")
        else:
            print(f"   [-] {html_file.name} - Nessuno script (può essere normale)")

    # 5. Verifica immagini lazy loading
    print("\n5. VERIFICA LAZY LOADING IMMAGINI:")
    image_counts = {}
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Conta immagini totali e con lazy loading
        total_imgs = len(re.findall(r'<img[^>]*>', content))
        lazy_imgs = len(re.findall(r'<img[^>]*loading="lazy"[^>]*>', content))

        if total_imgs > 0:
            percentage = (lazy_imgs / total_imgs) * 100
            print(f"   • {html_file.name}: {lazy_imgs}/{total_imgs} ({percentage:.0f}%) lazy")
            image_counts[html_file.name] = (total_imgs, lazy_imgs)

    # 6. Verifica Google Fonts
    print("\n6. VERIFICA GOOGLE FONTS:")
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        has_fonts = 'fonts.googleapis.com' in content
        has_preconnect = 'preconnect' in content

        if has_fonts and has_preconnect:
            print(f"   [OK] {html_file.name} - Fonts ottimizzati")
        elif has_fonts:
            print(f"   [WARN] {html_file.name} - Fonts presenti ma non ottimizzati")
        else:
            print(f"   [-] {html_file.name} - Nessun font esterno")

    print("\n" + "=" * 60)
    print("TEST COMPLETATO")
    print("=" * 60)

    # Riepilogo
    print("\nRIEPILOGO:")
    print(f"- File HTML: {len(html_files)}")
    print(f"- CSS base.css: {'PRESENTE' if (Path(directory) / 'assets/css/base.css').exists() else 'MANCANTE'}")
    print(f"- JS main.js: {'PRESENTE' if (Path(directory) / 'assets/js/main.js').exists() else 'MANCANTE'}")

    return True

if __name__ == "__main__":
    website_dir = Path(__file__).parent
    test_site(website_dir)