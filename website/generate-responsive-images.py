#!/usr/bin/env python3
"""
Script per generare versioni responsive delle immagini per srcset/sizes.
Richiede: Pillow (pip install Pillow)

Utilizzo:
    python generate-responsive-images.py

Genera versioni multiple delle immagini principali:
    - Nome originale: image.jpg
    - Versione 2x: image@2x.jpg (doppia risoluzione)
    - Versione mobile: image-mobile.jpg (800x600)
    - Versione thumbnail: image-thumb.jpg (400x300)
"""

import os
import sys
from pathlib import Path
from PIL import Image

def create_responsive_images(image_path, output_dir=None):
    """Crea versioni responsive di un'immagine."""
    try:
        img = Image.open(image_path)
        original_width, original_height = img.size
        filename = Path(image_path).stem
        extension = Path(image_path).suffix
        parent_dir = Path(image_path).parent

        if output_dir:
            output_path = Path(output_dir)
            output_path.mkdir(parents=True, exist_ok=True)
        else:
            output_path = parent_dir

        # 1. Versione @2x per retina (doppia dimensione)
        if original_width * 2 <= 4000 and original_height * 2 <= 4000:  # Limite ragionevole
            img_2x = img.resize((original_width * 2, original_height * 2), Image.Resampling.LANCZOS)
            img_2x.save(output_path / f"{filename}@2x{extension}", quality=85, optimize=True)
            print(f"  Creato: {filename}@2x{extension}")

        # 2. Versione mobile (800x600 mantenendo aspect ratio)
        mobile_width = 800
        mobile_height = int((mobile_width / original_width) * original_height)
        if mobile_height > 600:
            mobile_height = 600
            mobile_width = int((mobile_height / original_height) * original_width)

        img_mobile = img.resize((mobile_width, mobile_height), Image.Resampling.LANCZOS)
        img_mobile.save(output_path / f"{filename}-mobile{extension}", quality=85, optimize=True)
        print(f"  Creato: {filename}-mobile{extension}")

        # 3. Versione thumbnail (400x300)
        thumb_width = 400
        thumb_height = int((thumb_width / original_width) * original_height)
        if thumb_height > 300:
            thumb_height = 300
            thumb_width = int((thumb_height / original_height) * original_width)

        img_thumb = img.resize((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        img_thumb.save(output_path / f"{filename}-thumb{extension}", quality=85, optimize=True)
        print(f"  Creato: {filename}-thumb{extension}")

        # 4. Versione webp se supportato
        try:
            img.save(output_path / f"{filename}.webp", 'WEBP', quality=85)
            print(f"  Creato: {filename}.webp (formato moderno)")
        except:
            print(f"  Nota: formato WEBP non supportato per {filename}")

        return True

    except Exception as e:
        print(f"  Errore elaborando {image_path}: {e}")
        return False

def find_main_images(website_root):
    """Trova le immagini principali del sito."""
    image_dirs = [
        "assets/images/Home",
        "assets/images/La casa",
        "assets/images/La ristrutturazione",
        "assets/images/Mobilità",
        "assets/images/Scopri Milano",
        "assets/images/QR code"
    ]

    main_images = []

    for img_dir in image_dirs:
        dir_path = Path(website_root) / img_dir
        if dir_path.exists():
            for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                for img_file in dir_path.glob(f'*{ext}'):
                    # Escludi già versioni generate
                    if not any(x in img_file.name for x in ['@2x', '-mobile', '-thumb', '.webp']):
                        main_images.append(img_file)

    return main_images

def main():
    print("=== Generatore Immagini Responsive per Secret Courtyard Milano ===")
    print("Questo script crea versioni multiple delle immagini per srcset/sizes.")
    print()

    website_root = Path(__file__).parent
    print(f"Directory sito: {website_root}")

    # Verifica Pillow
    try:
        from PIL import Image
        print("✓ Pillow installato")
    except ImportError:
        print("✗ Pillow non installato. Installa con: pip install Pillow")
        sys.exit(1)

    # Trova immagini principali
    print("\nCercando immagini principali...")
    main_images = find_main_images(website_root)

    if not main_images:
        print("Nessuna immagine trovata!")
        return

    print(f"Trovate {len(main_images)} immagini principali:")
    for img in main_images:
        print(f"  - {img.relative_to(website_root)}")

    print("\nGenerazione versioni responsive...")
    print("=" * 50)

    success_count = 0
    for img_path in main_images:
        print(f"\nElaborando: {img_path.name}")
        if create_responsive_images(img_path):
            success_count += 1

    print("\n" + "=" * 50)
    print(f"Completato: {success_count}/{len(main_images)} immagini elaborate")
    print("\nProssimi passi:")
    print("1. Aggiornare gli HTML con srcset/sizes appropriati")
    print("2. Per immagini background CSS, usare le classi .hero-* definite")
    print("3. Testare il caricamento su diversi dispositivi")
    print("\nEsempio srcset/sizes per immagini HTML:")
    print('''<img src="assets/images/Home/Hero.jpg"
         srcset="assets/images/Home/Hero-thumb.jpg 400w,
                 assets/images/Home/Hero-mobile.jpg 800w,
                 assets/images/Home/Hero.jpg 1200w,
                 assets/images/Home/Hero@2x.jpg 2400w"
         sizes="(max-width: 480px) 100vw,
                (max-width: 768px) 50vw,
                33vw"
         alt="Descrizione immagine">''')

if __name__ == "__main__":
    main()