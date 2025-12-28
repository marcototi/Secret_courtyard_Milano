// Booking page JavaScript for Secret Courtyard Milano
// Handles booking form functionality and URL parameter parsing

document.addEventListener('DOMContentLoaded', function() {
    console.log('Booking page JavaScript loaded');

    // Initialize booking page
    initializeBookingPage();
    initializeBookingForm();
});

function initializeBookingPage() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const checkin = urlParams.get('checkin');
    const checkout = urlParams.get('checkout');
    const nights = urlParams.get('nights');

    // Update booking summary if parameters exist
    if (checkin && checkout) {
        updateBookingSummary(checkin, checkout, nights);
        calculateAndDisplayPrice(nights);
    } else {
        // If no parameters, show message
        document.getElementById('checkin-date').textContent = 'Non selezionato';
        document.getElementById('checkout-date').textContent = 'Non selezionato';
        document.getElementById('nights-count').textContent = '0';
        document.getElementById('total-price').textContent = '€ -';
    }
}

function updateBookingSummary(checkin, checkout, nights) {
    // Format dates for display
    const checkinDate = formatDateForDisplay(checkin);
    const checkoutDate = formatDateForDisplay(checkout);

    // Update DOM elements
    document.getElementById('checkin-date').textContent = checkinDate;
    document.getElementById('checkout-date').textContent = checkoutDate;
    document.getElementById('nights-count').textContent = nights || calculateNights(checkin, checkout);

    // Store dates in hidden fields for form submission
    const form = document.getElementById('booking-form-element');
    
    // Rimuovi eventuali campi nascosti preesistenti per evitare duplicati
    form.querySelectorAll('input[type="hidden"]').forEach(el => el.remove());

    const hiddenCheckin = document.createElement('input');
    hiddenCheckin.type = 'hidden';
    hiddenCheckin.name = 'hidden_checkin';
    hiddenCheckin.value = checkin;

    const hiddenCheckout = document.createElement('input');
    hiddenCheckout.type = 'hidden';
    hiddenCheckout.name = 'hidden_checkout';
    hiddenCheckout.value = checkout;

    form.appendChild(hiddenCheckin);
    form.appendChild(hiddenCheckout);
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate - checkinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function calculateAndDisplayPrice(nights) {
    const nightlyRate = 120; // € per notte
    const touristTaxPerPersonPerNight = 9.5; // € tassa di soggiorno
    const totalNights = parseInt(nights) || 1;

    const basePrice = nightlyRate * totalNights;
    let finalPrice = basePrice;
    let discount = 0;

    if (totalNights >= 7) {
        discount = 0.10;
        finalPrice = basePrice * (1 - discount);
    }

    const touristTaxNote = `+ Tassa di soggiorno: €${touristTaxPerPersonPerNight.toFixed(2)} a testa a notte (esclusi minori di 18 anni)`;
    document.getElementById('total-price').textContent = `€ ${finalPrice.toFixed(2)}`;

    const taxNoteElement = document.createElement('small');
    taxNoteElement.className = 'tax-note';
    taxNoteElement.textContent = touristTaxNote;
    taxNoteElement.style.color = 'var(--text-light)';
    taxNoteElement.style.display = 'block';
    taxNoteElement.style.marginTop = '5px';
    taxNoteElement.style.fontSize = '0.85rem';

    const commissionNote = document.createElement('small');
    commissionNote.className = 'commission-note';
    commissionNote.textContent = 'Prenotando dal nostro sito risparmi le spese di commissione dei portali!';
    commissionNote.style.color = 'var(--secondary-color)';
    commissionNote.style.display = 'block';
    commissionNote.style.marginTop = '8px';
    commissionNote.style.fontSize = '0.85rem';
    commissionNote.style.fontWeight = '600';

    const priceContainer = document.querySelector('.summary-price');
    priceContainer.querySelectorAll('.tax-note, .commission-note, .discount-note').forEach(el => el.remove());

    priceContainer.appendChild(taxNoteElement);
    priceContainer.appendChild(commissionNote);

    if (discount > 0) {
        const discountNote = document.createElement('small');
        discountNote.className = 'discount-note';
        discountNote.textContent = `(Sconto ${(discount * 100)}% per soggiorni lunghi applicato)`;
        discountNote.style.color = 'var(--secondary-color)';
        discountNote.style.display = 'block';
        discountNote.style.marginTop = '5px';
        discountNote.style.fontSize = '0.85rem';
        priceContainer.appendChild(discountNote);
    }
}

function initializeBookingForm() {
    const form = document.getElementById('booking-form-element');
    const modal = document.getElementById('confirmation-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData(form);
        const bookingData = {
            nome: formData.get('name'),
            email: formData.get('email'),
            telefono: formData.get('phone'),
            lingua: formData.get('language'),
            ospiti: formData.get('guests'),
            messaggio: formData.get('message'),
            checkin: formData.get('hidden_checkin'),
            checkout: formData.get('hidden_checkout'),
            timestamp: new Date().toISOString()
        };

        // INVIO DATI ALLA WORKER (Sostituisce PHP)
        sendBookingData(bookingData);
    });

    // Modal Handlers
    const closeModal = () => modal.classList.remove('active');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    const phoneInput = document.getElementById('phone');
    if (phoneInput) phoneInput.addEventListener('input', (e) => formatPhoneNumber(e.target));
}

function validateForm() {
    const form = document.getElementById('booking-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.error-message').forEach(el => el.remove());

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldAsError(field, 'Questo campo è obbligatorio');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            markFieldAsError(field, 'Inserisci un indirizzo email valido');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            markFieldAsError(field, 'Inserisci un numero di telefono valido');
            isValid = false;
        }
    });

    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        markFieldAsError(termsCheckbox, 'Devi accettare i termini e condizioni');
        isValid = false;
    }

    return isValid;
}

function markFieldAsError(field, message) {
    field.classList.add('error');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#e53e3e';
    errorMessage.style.fontSize = '0.85rem';
    errorMessage.style.marginTop = '5px';
    field.parentNode.appendChild(errorMessage);
}

function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidPhone(phone) { return /^[\d\s\-\+\(\)]{10,20}$/.test(phone.replace(/\s/g, '')); }

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.startsWith('3') && value.length > 3) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    }
    input.value = value;
}

function showConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) modal.classList.add('active');
}

// --- FUNZIONE MODIFICATA PER CLOUDFLARE WORKER ---
function sendBookingData(bookingData) {
    const form = document.getElementById('booking-form-element');
    const submitButton = form.querySelector('button[type="submit"]');

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Invio in corso...';
    submitButton.disabled = true;

    // URL della tua Cloudflare Worker
    const workerUrl = "https://secret-courtyard-api.marco-81e.workers.dev"; 

    fetch(workerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Errore di rete');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showConfirmationModal();
            form.reset();
        } else {
            alert('Errore: ' + (data.error || 'Riprova più tardi.'));
        }
    })
    .catch(error => {
        console.error('Errore:', error);
        alert('Si è verificato un errore durante l\'invio. Controlla la connessione.');
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Basic error styling
const style = document.createElement('style');
style.textContent = `.error { border-color: #e53e3e !important; background-color: #fff5f5; }`;
document.head.appendChild(style);