from flask import Flask
from config.config import config

def create_app():
    app = Flask(__name__)

    # Configurazione
    app.config.from_object(config['default'])

    # Registra blueprint pubblici
    from .routes.public.home import home_bp
    from .routes.public.lavori import lavori_bp
    from .routes.public.milano import milano_bp
    from .routes.public.ristoranti import ristoranti_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(lavori_bp, url_prefix='/lavori')
    app.register_blueprint(milano_bp, url_prefix='/milano')
    app.register_blueprint(ristoranti_bp, url_prefix='/ristoranti')

    # Registra blueprint privati
    from .routes.private.gestionale import gestionale_bp
    from .routes.private.nuki import nuki_bp

    app.register_blueprint(gestionale_bp, url_prefix='/private')
    app.register_blueprint(nuki_bp, url_prefix='/private')

    return app

