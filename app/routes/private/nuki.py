from flask import Blueprint, render_template, request, jsonify, session
from functools import wraps
from app.utils.nuki_api import NukiAPI
import logging

nuki_bp = Blueprint('nuki', __name__)

# Configurazione logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def login_required(f):
    """Decorator per proteggere le route private"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return jsonify({'error': 'Accesso richiesto'}), 401
        return f(*args, **kwargs)
    return decorated_function

@nuki_bp.route('/nuki')
@login_required
def nuki_dashboard():
    """Dashboard controllo serratura NUKI"""
    nuki_api = NukiAPI()

    try:
        # Ottieni stato della serratura
        lock_state = nuki_api.get_lock_state()
        return render_template('private/nuki.html',
                             page_title="Controllo Serratura NUKI",
                             lock_state=lock_state)
    except Exception as e:
        logger.error(f"Errore nel recupero stato serratura: {e}")
        return render_template('private/nuki.html',
                             page_title="Controllo Serratura NUKI",
                             error="Errore nel collegamento con NUKI")

@nuki_bp.route('/nuki/unlock', methods=['POST'])
@login_required
def unlock():
    """Apri la serratura"""
    nuki_api = NukiAPI()

    try:
        result = nuki_api.unlock()
        return jsonify({'success': True, 'message': 'Serratura aperta'})
    except Exception as e:
        logger.error(f"Errore nell'apertura serratura: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@nuki_bp.route('/nuki/lock', methods=['POST'])
@login_required
def lock():
    """Chiudi la serratura"""
    nuki_api = NukiAPI()

    try:
        result = nuki_api.lock()
        return jsonify({'success': True, 'message': 'Serratura chiusa'})
    except Exception as e:
        logger.error(f"Errore nella chiusura serratura: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500