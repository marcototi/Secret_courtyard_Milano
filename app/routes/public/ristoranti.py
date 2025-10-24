from flask import Blueprint, render_template
import json
import os

ristoranti_bp = Blueprint('ristoranti', __name__)

@ristoranti_bp.route('/ristoranti')
def ristoranti():
    """Consigli su ristoranti e bar della zona"""
    # Dati di esempio sui ristoranti
    ristoranti_data = {
        'italiani': [
            {'nome': 'Trattoria Milanese', 'indirizzo': 'Via Santa Marta, 11', 'tipo': 'Tradizionale'},
            {'nome': 'Osteria del Binari', 'indirizzo': 'Via Tortona, 1', 'tipo': 'Moderno'}
        ],
        'internazionali': [
            {'nome': 'Wok to Walk', 'indirizzo': 'Corso di Porta Ticinese, 45', 'tipo': 'Asiatico'},
            {'nome': 'Burger King', 'indirizzo': 'Piazza Duomo, 1', 'tipo': 'Fast Food'}
        ],
        'bar': [
            {'nome': 'Caffè Napoli', 'indirizzo': 'Via Torino, 50', 'tipo': 'Caffetteria'},
            {'nome': 'Radetzky', 'indirizzo': 'Corso Garibaldi, 105', 'tipo': 'Cocktail Bar'}
        ]
    }

    return render_template('public/ristoranti.html',
                         page_title="Ristoranti e Bar - Secret Courtyard Milano",
                         ristoranti=ristoranti_data)