<?php
// Script per l'invio email dei contatti
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configurazione
$to = "marcototi98@gmail.com";
$subject = "Nuovo Messaggio dal Sito - Secret Courtyard Milano";

// Ricevi i dati JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Nessun dato ricevuto']);
    exit;
}

// Estrai i dati
$name = htmlspecialchars($data['name'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');
$timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');

// Costruisci il corpo dell'email
$body = "NUOVO MESSAGGIO DAL SITO WEB\n";
$body .= "============================\n\n";
$body .= "DATI DEL MITTENTE:\n";
$body .= "Nome: $name\n";
$body .= "Email: $email\n\n";

$body .= "MESSAGGIO:\n";
$body .= $message . "\n\n";

$body .= "INVIATO IL: $timestamp\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Non disponibile') . "\n";
$body .= "PAGINA: " . ($data['page'] ?? 'Home - Contatti') . "\n";

// Intestazioni email
$headers = "From: Secret Courtyard Milano <noreply@secretcourtyardmilano.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Invia l'email
$mailSent = mail($to, $subject, $body, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Email inviata con successo']);
} else {
    echo json_encode(['success' => false, 'message' => 'Errore nell\'invio dell\'email']);
}
?>