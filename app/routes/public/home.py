from flask import Blueprint, render_template
from datetime import datetime

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    """Homepage del sito"""
    current_year = datetime.now().year
    return render_template('public/home.html',
                         current_year=current_year,
                         page_title="Secret Courtyard Milano - Casa Vacanze Centro Milano")

@home_bp.route('/contatti')
def contatti():
    """Pagina contatti"""
    return render_template('public/contatti.html',
                         page_title="Contatti - Secret Courtyard Milano")