#!/usr/bin/env python3
"""
Script per splittare il file CSS base.css in moduli organizzati
"""

import os
import re
from pathlib import Path

def split_css_file(input_file, output_dir):
    """Splitta il file CSS in moduli basati sui commenti di sezione"""

    # Leggi il file CSS originale
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Definisci le sezioni e i file di output corrispondenti
    sections = {
        'fonts.css': r'/\* Ottimizzazione font-display per caricamento non bloccante \*/[\s\S]*?(?=/\*|\Z)',
        'header.css': r'/\* Header e Navigazione \*/[\s\S]*?(?=/\*|\Z)',
        'navigation.css': r'/\* Hamburger Menu \*/[\s\S]*?(?=/\*|\Z)',
        'hero.css': r'/\* Hero Section \*/[\s\S]*?(?=/\*|\Z)',
        'sections.css': r'/\* Section Styling \*/[\s\S]*?(?=/\*|\Z)',
        'images.css': r'/\* Room Images \*/[\s\S]*?(?=/\*|\Z)',
        'lightbox.css': r'/\* Lightbox Styles \*/[\s\S]*?(?=/\*|\Z)',
        'forms.css': r'/\* Form Styles \*/[\s\S]*?(?=/\*|\Z)',
        'footer.css': r'/\* Footer \*/[\s\S]*?(?=/\*|\Z)',
        'utilities.css': r'/\* Utility Classes \*/[\s\S]*?(?=/\*|\Z)',
        'responsive.css': r'/\* Responsive Design \*/[\s\S]*?(?=/\*|\Z)',
    }

    # Crea la directory di output se non esiste
    os.makedirs(output_dir, exist_ok=True)

    # Estrai e salva ogni sezione
    for filename, pattern in sections.items():
        match = re.search(pattern, content)
        if match:
            section_content = match.group(0)
            output_path = os.path.join(output_dir, filename)

            # Aggiungi commento header al file
            header = f"/*\n * Secret Courtyard Milano - {filename.replace('.css', '').title()}\n * Modulo CSS estratto da base.css\n */\n\n"

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(header + section_content)

            print(f"[OK] Creato: {filename}")
        else:
            print(f"[NO] Sezione non trovata per: {filename}")

    print("\n[SUCCESS] Splitting CSS completato!")

if __name__ == "__main__":
    # Percorsi
    base_dir = Path(__file__).parent
    input_file = base_dir / "assets" / "css" / "base.css"
    output_dir = base_dir / "assets" / "css" / "modules"

    if input_file.exists():
        split_css_file(input_file, output_dir)
    else:
        print(f"Errore: File non trovato: {input_file}")