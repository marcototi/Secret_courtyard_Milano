#!/usr/bin/env python3
"""
Converti immagini PNG in WebP per ulteriore ottimizzazione
"""

import os
from pathlib import Path
from PIL import Image
import shutil

def convert_png_to_webp(input_path):
    """Converti PNG in WebP"""
    try:
        with Image.open(input_path) as img:
            # Converti in RGB se ha trasparenza
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

            webp_path = input_path.with_suffix('.webp')
            img.save(webp_path, 'WEBP', quality=85, method=6)

            original_size = os.path.getsize(input_path)
            new_size = os.path.getsize(webp_path)
            reduction = ((original_size - new_size) / original_size) * 100

            print(f"  {input_path.name}: {original_size/1024/1024:.2f}MB -> {new_size/1024/1024:.2f}MB (-{reduction:.1f}%)")
            return webp_path, reduction

    except Exception as e:
        print(f"  Error converting {input_path.name}: {e}")
        return None, 0

def main():
    print("PNG to WebP Conversion")
    print("=" * 50)

    images_dir = Path("website/assets/images")

    # Trova tutte le PNG
    png_files = list(images_dir.rglob("*.png"))

    print(f"Found {len(png_files)} PNG files")
    print("-" * 50)

    total_original = 0
    total_new = 0
    converted = 0

    conversion_map = {}  # Mappa PNG -> WebP per aggiornare HTML

    for i, png_path in enumerate(png_files, 1):
        print(f"\n[{i}/{len(png_files)}] {png_path.relative_to(images_dir)}")

        original_size = os.path.getsize(png_path)
        total_original += original_size

        webp_path, reduction = convert_png_to_webp(png_path)

        if webp_path:
            new_size = os.path.getsize(webp_path)
            total_new += new_size
            converted += 1
            conversion_map[str(png_path.relative_to(images_dir.parent.parent))] = str(webp_path.relative_to(images_dir.parent.parent))

    # Statistiche
    print("\n" + "=" * 50)
    print("CONVERSION SUMMARY")
    print("=" * 50)
    print(f"Converted: {converted}/{len(png_files)}")
    print(f"Original PNG size: {total_original/1024/1024:.1f} MB")
    print(f"New WebP size: {total_new/1024/1024:.1f} MB")

    if total_original > 0:
        reduction = ((total_original - total_new) / total_original) * 100
        print(f"Reduction: {reduction:.1f}%")
        print(f"Space saved: {(total_original - total_new)/1024/1024:.1f} MB")

    # Salva mappa conversioni per aggiornare HTML
    if conversion_map:
        map_file = Path("png-to-webp-map.txt")
        with open(map_file, 'w', encoding='utf-8') as f:
            for png, webp in conversion_map.items():
                f.write(f"{png}|{webp}\n")
        print(f"\nConversion map saved to: {map_file}")

    print("\nDone!")

if __name__ == "__main__":
    main()