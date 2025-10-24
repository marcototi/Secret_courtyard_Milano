import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configurazione base dell'applicazione"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

    # Database
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///secret_courtyard.db'

    # Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'app', 'static', 'uploads')

    # NUKI API
    NUKI_API_TOKEN = os.environ.get('NUKI_API_TOKEN')
    NUKI_API_URL = 'https://api.nuki.io'

class DevelopmentConfig(Config):
    """Configurazione per sviluppo"""
    DEBUG = True

class ProductionConfig(Config):
    """Configurazione per produzione"""
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}