from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from functools import wraps
import os

gestionale_bp = Blueprint('gestionale', __name__)

def login_required(f):
    """Decorator per proteggere le route private"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('private.login'))
        return f(*args, **kwargs)
    return decorated_function

@gestionale_bp.route('/gestionale')
@login_required
def gestionale():
    """Dashboard gestionale principale"""
    # Qui potresti caricare dati sulle prenotazioni, statistiche, etc.
    return render_template('private/gestionale.html',
                         page_title="Area Gestionale - Secret Courtyard Milano")

@gestionale_bp.route('/gestionale/prenotazioni')
@login_required
def prenotazioni():
    """Gestione prenotazioni"""
    return render_template('private/prenotazioni.html',
                         page_title="Prenotazioni - Area Gestionale")

@gestionale_bp.route('/gestionale/ospiti')
@login_required
def ospiti():
    """Gestione ospiti"""
    return render_template('private/ospiti.html',
                         page_title="Ospiti - Area Gestionale")