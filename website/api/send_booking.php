<?php
// Script per l'invio email delle prenotazioni
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configurazione
$to = "marcototi98@gmail.com";
$subject = "Nuova Richiesta di Prenotazione - Secret Courtyard Milano";

// Ricevi i dati JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Nessun dato ricevuto']);
    exit;
}

// Estrai i dati
$name = htmlspecialchars($data['name'] ?? '');
$email = htmlspecialchars($data['email'] ?? '');
$phone = htmlspecialchars($data['phone'] ?? '');
$language = htmlspecialchars($data['language'] ?? '');
$guests = htmlspecialchars($data['guests'] ?? '');
$message = htmlspecialchars($data['message'] ?? '');
$checkin = htmlspecialchars($data['checkin'] ?? '');
$checkout = htmlspecialchars($data['checkout'] ?? '');
$terms = $data['terms'] ? 'Accettati' : 'Non accettati';
$newsletter = $data['newsletter'] ? 'Iscritto' : 'Non iscritto';
$timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');

// Costruisci il corpo dell'email
$body = "NUOVA RICHIESTA DI PRENOTAZIONE\n";
$body .= "===============================\n\n";
$body .= "DATI PERSONALI:\n";
$body .= "Nome: $name\n";
$body .= "Email: $email\n";
$body .= "Telefono: $phone\n";
$body .= "Lingua preferita: $language\n";
$body .= "Numero ospiti: $guests\n\n";

$body .= "PERIODO DI SOGGIORNO:\n";
$body .= "Check-in: $checkin\n";
$body .= "Check-out: $checkout\n\n";

$body .= "MESSAGGIO AGGIUNTIVO:\n";
$body .= ($message ? $message : "Nessun messaggio aggiuntivo") . "\n\n";

$body .= "INFORMAZIONI AGGIUNTIVE:\n";
$body .= "Termini e condizioni: $terms\n";
$body .= "Newsletter: $newsletter\n\n";

$body .= "INVIATO IL: $timestamp\n";
$body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Non disponibile') . "\n";

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