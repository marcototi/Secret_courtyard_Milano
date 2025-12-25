#!/usr/bin/env python3
"""
Test per verificare che la pagina La Ristrutturazione sia corretta
"""

import re
from pathlib import Path

def test_ristrutturazione_page():
    """Testa la pagina La Ristrutturazione"""

    file_path = Path(__file__).parent / "pages" / "la-ristrutturazione.html"

    print("=" * 60)
    print("TEST PAGINA LA RISTRUTTURAZIONE")
    print("=" * 60)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Conta immagini totali
    all_images = re.findall(r'<img[^>]*>', content)
    print(f"\n1. IMMAGINI TOTALI: {len(all_images)}")

    # 2. Conta immagini con classe room-image
    room_images = re.findall(r'<img[^>]*class="[^"]*room-image[^"]*"[^>]*>', content)
    print(f"2. IMMAGINI CON CLASSE 'room-image': {len(room_images)}")

    # 3. Verifica che nessuna immagine abbia classe 'clickable'
    clickable_images = re.findall(r'<img[^>]*class="[^"]*clickable[^"]*"[^>]*>', content)
    print(f"3. IMMAGINI CON CLASSE 'clickable': {len(clickable_images)} [OK se 0]")

    # 4. Verifica che non ci siano overlay 'clicca per ingrandire'
    overlays = re.findall(r'clickable-overlay|Clicca per ingrandire', content, re.IGNORECASE)
    print(f"4. OVERLAY 'CLICCA PER INGRANDIRE' TROVATI: {len(overlays)} [OK se 0]")

    # 5. Verifica che le immagini siano dentro gallery-grid
    gallery_grid_sections = content.count('class="gallery-grid"')
    print(f"5. SEZIONI 'gallery-grid': {gallery_grid_sections}")

    # 6. Verifica lazy loading
    lazy_images = re.findall(r'loading="lazy"', content)
    print(f"6. IMMAGINI CON LAZY LOADING: {len(lazy_images)}/{len(all_images)}")

    # 7. Verifica che le immagini abbiano alt text
    images_with_alt = re.findall(r'<img[^>]*alt="[^"]+"[^>]*>', content)
    print(f"7. IMMAGINI CON ALT TEXT: {len(images_with_alt)}/{len(all_images)}")

    print("\n" + "=" * 60)
    print("RIEPILOGO TEST")
    print("=" * 60)

    # Test critici
    tests_passed = 0
    total_tests = 4

    # Test 1: Nessuna immagine con classe clickable
    if len(clickable_images) == 0:
        print("✅ TEST 1: Nessuna immagine con classe 'clickable'")
        tests_passed += 1
    else:
        print("❌ TEST 1: Trovate immagini con classe 'clickable'")

    # Test 2: Nessun overlay 'clicca per ingrandire'
    if len(overlays) == 0:
        print("✅ TEST 2: Nessun overlay 'Clicca per ingrandire'")
        tests_passed += 1
    else:
        print("❌ TEST 2: Trovati overlay 'Clicca per ingrandire'")

    # Test 3: Tutte le immagini hanno classe room-image
    if len(room_images) == len(all_images):
        print("✅ TEST 3: Tutte le immagini hanno classe 'room-image'")
        tests_passed += 1
    else:
        print(f"❌ TEST 3: Solo {len(room_images)}/{len(all_images)} immagini hanno 'room-image'")

    # Test 4: Tutte le immagini hanno alt text
    if len(images_with_alt) == len(all_images):
        print("✅ TEST 4: Tutte le immagini hanno alt text")
        tests_passed += 1
    else:
        print(f"❌ TEST 4: Solo {len(images_with_alt)}/{len(all_images)} immagini hanno alt text")

    print(f"\n📊 RISULTATO: {tests_passed}/{total_tests} test passati")

    if tests_passed == total_tests:
        print("\n🎉 LA PAGINA È CORRETTA! Le immagini:")
        print("   • Non hanno overlay 'Clicca per ingrandire'")
        print("   • Hanno classe 'room-image' per la lightbox")
        print("   • Hanno alt text per accessibilità")
        print("   • Sono cliccabili per ingrandire (senza overlay)")
        return True
    else:
        print("\n⚠️  CI SONO PROBLEMI DA RISOLVERE")
        return False

if __name__ == "__main__":
    test_ristrutturazione_page()