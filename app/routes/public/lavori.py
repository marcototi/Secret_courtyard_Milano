from flask import Blueprint, render_template

lavori_bp = Blueprint('lavori', __name__)

@lavori_bp.route('/lavori')
def lavori():
    """Galleria fotografica prima e post lavori"""
    # Qui potresti caricare le immagini dalla cartella static/images/lavori/
    immagini_prima = [
        'prima_1.jpg',
        'prima_2.jpg',
        'prima_3.jpg'
    ]

    immagini_dopo = [
        'dopo_1.jpg',
        'dopo_2.jpg',
        'dopo_3.jpg'
    ]

    return render_template('public/lavori.html',
                         page_title="Prima e Dopo - Secret Courtyard Milano",
                         immagini_prima=immagini_prima,
                         immagini_dopo=immagini_dopo)