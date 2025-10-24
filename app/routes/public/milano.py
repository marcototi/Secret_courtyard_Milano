from flask import Blueprint, render_template
import json
import os

milano_bp = Blueprint('milano', __name__)

@milano_bp.route('/milano')
def milano():
    """Guida su come muoversi a Milano"""
    # Carica dati sui trasporti (se disponibili)
    trasporti_data = {
        'metro': [
            {'linea': 'M1', 'colore': 'rosso', 'fermate': ['Duomo', 'Cordusio', 'Cadorna']},
            {'linea': 'M2', 'colore': 'verde', 'fermate': ['Cadorna', 'Lanza', 'Garibaldi']},
            {'linea': 'M3', 'colore': 'giallo', 'fermate': ['Duomo', 'Missori', 'Porta Romana']}
        ],
        'tram': [
            {'linea': '1', 'descrizione': 'Centro storico e Castello Sforzesco'},
            {'linea': '2', 'descrizione': 'Stazione Centrale e Corso Buenos Aires'}
        ],
        'bus': [
            {'linea': '94', 'descrizione': 'Collegamento con zona Navigli'}
        ]
    }

    return render_template('public/milano.html',
                         page_title="Come muoversi a Milano - Secret Courtyard Milano",
                         trasporti=trasporti_data)