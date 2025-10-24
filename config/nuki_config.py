import os
from dotenv import load_dotenv

load_dotenv()

class NukiConfig:
    """Configurazione specifica per NUKI Smart Lock"""

    # API Configuration
    API_TOKEN = os.environ.get('NUKI_API_TOKEN')
    API_BASE_URL = 'https://api.nuki.io'

    # Smart Lock settings
    LOCK_ID = os.environ.get('NUKI_LOCK_ID')

    # Action types
    ACTION_UNLOCK = 1
    ACTION_LOCK = 2
    ACTION_UNLATCH = 3

    # Headers for API requests
    @property
    def headers(self):
        return {
            'Authorization': f'Bearer {self.API_TOKEN}',
            'Content-Type': 'application/json'
        }

    def get_lock_url(self):
        """Get URL for lock operations"""
        return f"{self.API_BASE_URL}/smartlock/{self.LOCK_ID}/action"

nuki_config = NukiConfig()