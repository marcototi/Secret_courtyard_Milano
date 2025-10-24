from functools import wraps
from flask import session, redirect, url_for, request
import hashlib
import os

def login_required(f):
    """Decorator per proteggere le route che richiedono autenticazione"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('private.login'))
        return f(*args, **kwargs)
    return decorated_function

def hash_password(password):
    """Hash della password per sicurezza"""
    return hashlib.sha256(password.encode()).hexdigest()

def check_credentials(username, password):
    """Verifica le credenziali di accesso"""
    # Qui puoi implementare una verifica più sofisticata
    # Per ora, usa credenziali hardcoded (cambia in produzione!)
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password_hash = os.environ.get('ADMIN_PASSWORD_HASH',
                                        hash_password('password'))

    return (username == admin_username and
            hash_password(password) == admin_password_hash)