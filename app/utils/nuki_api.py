import requests
import logging
from config.nuki_config import nuki_config

logger = logging.getLogger(__name__)

class NukiAPI:
    """Classe per interagire con l'API NUKI Smart Lock"""

    def __init__(self):
        self.base_url = nuki_config.API_BASE_URL
        self.headers = nuki_config.headers
        self.lock_id = nuki_config.LOCK_ID

    def get_lock_state(self):
        """Ottieni lo stato corrente della serratura"""
        try:
            url = f"{self.base_url}/smartlock/{self.lock_id}"
            response = requests.get(url, headers=self.headers)

            if response.status_code == 200:
                data = response.json()
                return {
                    'state': data.get('state'),
                    'stateName': data.get('stateName'),
                    'batteryCritical': data.get('batteryCritical', False),
                    'success': True
                }
            else:
                logger.error(f"Errore API NUKI: {response.status_code} - {response.text}")
                return {'success': False, 'error': f"Errore API: {response.status_code}"}

        except requests.exceptions.RequestException as e:
            logger.error(f"Errore di connessione NUKI: {e}")
            return {'success': False, 'error': 'Errore di connessione'}

    def unlock(self):
        """Apri la serratura"""
        return self._send_lock_action(nuki_config.ACTION_UNLOCK)

    def lock(self):
        """Chiudi la serratura"""
        return self._send_lock_action(nuki_config.ACTION_LOCK)

    def unlatch(self):
        """Sgancia la serratura (apri senza chiudere)"""
        return self._send_lock_action(nuki_config.ACTION_UNLATCH)

    def _send_lock_action(self, action):
        """Invia comando alla serratura"""
        try:
            url = nuki_config.get_lock_url()
            payload = {'action': action}

            response = requests.post(url, json=payload, headers=self.headers)

            if response.status_code == 204:
                logger.info(f"Comando NUKI inviato con successo: {action}")
                return {'success': True}
            else:
                logger.error(f"Errore comando NUKI: {response.status_code} - {response.text}")
                return {'success': False, 'error': f"Errore API: {response.status_code}"}

        except requests.exceptions.RequestException as e:
            logger.error(f"Errore di connessione NUKI: {e}")
            return {'success': False, 'error': 'Errore di connessione'}