#!/usr/bin/env python3
"""
Script di ottimizzazione immagini per Secret Courtyard Milano
Approccio conservativo: mantiene qualità visiva riducendo dimensioni file
"""

import os
import sys
from pathlib import Path
from PIL import Image
import subprocess
import shutil
from datetime import datetime

# Configurazioni conservative per mantenere qualità professionale
CONFIG = {
    # Qualità compressione (85-95 mantiene qualità visiva ottima)
    'jpeg_quality': 90,
    'webp_quality': 85,
    'png_compression': 9,  # 0-9, 9=max compression

    # Dimensioni massime basate su uso
    'max_dimensions': {
        'hero': (1920, 1080),      # Immagini hero full-width
        'gallery': (1600, 1200),   # Galleria a dimensione piena
        'room': (1200, 900),       # Immagini stanze
        'thumbnail': (800, 600),    # Thumbnails
    },

    # Soglie per conversione formato
    'convert_to_webp_threshold_kb': 500,  # Converti se > 500KB
    'skip_extensions': ['.gif', '.svg'],   # Non processare questi formati
}

def get_image_category(filepath):
    """Determina la categoria dell'immagine basata sul percorso"""
    path_str = str(filepath).lower()

    if 'hero' in path_str:
        return 'hero'
    elif 'galleria' in path_str:
        return 'gallery'
    elif any(x in path_str for x in ['casa', 'soggiorno', 'camera', 'cucina', 'bagno']):
        return 'room'
    else:
        return 'thumbnail'

def optimize_image(input_path, output_path=None):
    """
    Ottimizza una singola immagine mantenendo qualità visiva
    """
    if output_path is None:
        output_path = input_path

    try:
        # Leggi immagine
        with Image.open(input_path) as img:
            original_format = img.format
            original_size = os.path.getsize(input_path)

            # Determina categoria e dimensioni target
            category = get_image_category(input_path)
            max_width, max_height = CONFIG['max_dimensions'][category]

            # Calcola nuove dimensioni mantenendo aspect ratio
            width, height = img.size
            if width > max_width or height > max_height:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"  Ridimensionata: {width}x{height} -> {new_width}x{new_height}")

            # Salva con ottimizzazione
            if original_format == 'JPEG':
                img.save(output_path, 'JPEG',
                        quality=CONFIG['jpeg_quality'],
                        optimize=True,
                        progressive=True)

                # Converti in WebP se l'immagine è grande
                if original_size > CONFIG['convert_to_webp_threshold_kb'] * 1024:
                    webp_path = output_path.with_suffix('.webp')
                    img.save(webp_path, 'WEBP', quality=CONFIG['webp_quality'])
                    print(f"  Creato anche WebP: {webp_path.name}")

            elif original_format == 'PNG':
                img.save(output_path, 'PNG',
                        optimize=True,
                        compress_level=CONFIG['png_compression'])
            else:
                # Per altri formati, salva normalmente
                img.save(output_path)

            new_size = os.path.getsize(output_path)
            reduction = ((original_size - new_size) / original_size) * 100

            print(f"  {input_path.name}: {original_size/1024/1024:.2f}MB → {new_size/1024/1024:.2f}MB (-{reduction:.1f}%)")

            return True, reduction

    except Exception as e:
        print(f"  ERRORE processando {input_path.name}: {e}")
        return False, 0

def backup_original(filepath):
    """Crea backup dell'originale in una sottocartella"""
    backup_dir = filepath.parent / 'original_backup'
    backup_dir.mkdir(exist_ok=True)
    backup_path = backup_dir / filepath.name
    shutil.copy2(filepath, backup_path)
    return backup_path

def main():
    print("=" * 60)
    print("OTTIMIZZAZIONE IMMAGINI - Secret Courtyard Milano")
    print("=" * 60)

    # Percorso immagini
    images_dir = Path("website/assets/images")

    if not images_dir.exists():
        print(f"ERRORE: Directory non trovata: {images_dir}")
        sys.exit(1)

    # Trova tutte le immagini
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
    image_files = []

    for ext in image_extensions:
        image_files.extend(images_dir.rglob(ext))

    print(f"Trovate {len(image_files)} immagini da ottimizzare")
    print(f"Directory: {images_dir}")
    print("-" * 60)

    # Statistiche
    total_original_size = 0
    total_new_size = 0
    processed_count = 0
    failed_count = 0

    # Processa ogni immagine
    for i, image_path in enumerate(image_files, 1):
        print(f"\n[{i}/{len(image_files)}] Processando: {image_path.relative_to(images_dir)}")

        # Salta estensioni non supportate
        if image_path.suffix.lower() in CONFIG['skip_extensions']:
            print(f"  Saltata (estensione non supportata)")
            continue

        # Crea backup
        backup_path = backup_original(image_path)
        print(f"  Backup creato: {backup_path.relative_to(images_dir)}")

        # Ottimizza
        original_size = os.path.getsize(image_path)
        total_original_size += original_size

        success, reduction = optimize_image(image_path)

        if success:
            new_size = os.path.getsize(image_path)
            total_new_size += new_size
            processed_count += 1
        else:
            failed_count += 1
            # Ripristina da backup in caso di errore
            shutil.copy2(backup_path, image_path)
            print(f"  Ripristinato originale per errore")

    # Statistiche finali
    print("\n" + "=" * 60)
    print("RIEPILOGO OTTIMIZZAZIONE")
    print("=" * 60)

    total_reduction = ((total_original_size - total_new_size) / total_original_size) * 100

    print(f"Immagini processate: {processed_count}")
    print(f"Immagini fallite: {failed_count}")
    print(f"Dimensione originale totale: {total_original_size/1024/1024:.2f} MB")
    print(f"Dimensione ottimizzata totale: {total_new_size/1024/1024:.2f} MB")
    print(f"Riduzione totale: {total_reduction:.1f}%")
    print(f"Spazio risparmiato: {(total_original_size - total_new_size)/1024/1024:.2f} MB")

    # Crea report dettagliato
    report_path = Path("image-optimization-report.txt")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(f"Report Ottimizzazione Immagini - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 60 + "\n")
        f.write(f"Immagini processate: {processed_count}\n")
        f.write(f"Immagini fallite: {failed_count}\n")
        f.write(f"Dimensione originale: {total_original_size/1024/1024:.2f} MB\n")
        f.write(f"Dimensione ottimizzata: {total_new_size/1024/1024:.2f} MB\n")
        f.write(f"Riduzione: {total_reduction:.1f}%\n")
        f.write(f"Spazio risparmiato: {(total_original_size - total_new_size)/1024/1024:.2f} MB\n")

    print(f"\nReport salvato in: {report_path}")

    if failed_count > 0:
        print("\n⚠️  ATTENZIONE: Alcune immagini non sono state ottimizzate.")
        print("   I backup originali sono in: website/assets/images/*/original_backup/")

    print("\n✅ Ottimizzazione completata!")

if __name__ == "__main__":
    main()