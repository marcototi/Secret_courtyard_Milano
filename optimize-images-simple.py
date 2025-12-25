#!/usr/bin/env python3
"""
Script semplificato di ottimizzazione immagini per Windows
"""

import os
import sys
from pathlib import Path
from PIL import Image
import shutil

def optimize_image_simple(input_path):
    """Ottimizza una singola immagine"""
    try:
        with Image.open(input_path) as img:
            original_size = os.path.getsize(input_path)
            original_format = img.format

            # Dimensioni massime ragionevoli
            max_width = 1600
            max_height = 1200

            # Ridimensiona se necessario
            width, height = img.size
            if width > max_width or height > max_height:
                ratio = min(max_width / width, max_height / height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                print(f"  Resized: {width}x{height} to {new_width}x{new_height}")

            # Salva con ottimizzazione
            if original_format == 'JPEG':
                img.save(input_path, 'JPEG', quality=85, optimize=True, progressive=True)
            elif original_format == 'PNG':
                img.save(input_path, 'PNG', optimize=True, compress_level=9)

            new_size = os.path.getsize(input_path)
            reduction = ((original_size - new_size) / original_size) * 100

            print(f"  {input_path.name}: {original_size/1024/1024:.1f}MB -> {new_size/1024/1024:.1f}MB (-{reduction:.0f}%)")
            return True, reduction

    except Exception as e:
        print(f"  Error: {e}")
        return False, 0

def main():
    print("Image Optimization - Secret Courtyard Milano")
    print("=" * 50)

    images_dir = Path("website/assets/images")

    # Estensioni da processare
    extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']

    # Trova immagini
    image_files = []
    for ext in extensions:
        image_files.extend(images_dir.rglob(f"*{ext}"))

    print(f"Found {len(image_files)} images")
    print("-" * 50)

    # Crea backup directory
    backup_dir = images_dir / "backup_original"
    backup_dir.mkdir(exist_ok=True)

    total_original = 0
    total_new = 0
    processed = 0

    for i, img_path in enumerate(image_files, 1):
        print(f"\n[{i}/{len(image_files)}] {img_path.relative_to(images_dir)}")

        # Crea backup
        backup_path = backup_dir / img_path.relative_to(images_dir)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(img_path, backup_path)

        # Ottimizza
        original_size = os.path.getsize(img_path)
        total_original += original_size

        success, reduction = optimize_image_simple(img_path)

        if success:
            new_size = os.path.getsize(img_path)
            total_new += new_size
            processed += 1
        else:
            # Ripristina se errore
            shutil.copy2(backup_path, img_path)

    # Statistiche
    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    print(f"Processed: {processed}/{len(image_files)}")
    print(f"Original size: {total_original/1024/1024:.1f} MB")
    print(f"Optimized size: {total_new/1024/1024:.1f} MB")

    if total_original > 0:
        reduction = ((total_original - total_new) / total_original) * 100
        print(f"Reduction: {reduction:.1f}%")
        print(f"Space saved: {(total_original - total_new)/1024/1024:.1f} MB")

    print(f"\nBackup saved in: {backup_dir}")
    print("Done!")

if __name__ == "__main__":
    main()