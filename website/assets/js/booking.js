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
    const hiddenCheckin = document.createElement('input');
    hiddenCheckin.type = 'hidden';
    hiddenCheckin.name = 'hidden_checkin';
    hiddenCheckin.value = checkin;

    const hiddenCheckout = document.createElement('input');
    hiddenCheckout.type = 'hidden';
    hiddenCheckout.name = 'hidden_checkout';
    hiddenCheckout.value = checkout;

    const form = document.getElementById('booking-form-element');
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
    const nightlyRate = 120; // € per notte (prezzo di esempio)
    const touristTaxPerPersonPerNight = 9.5; // € tassa di soggiorno a testa a notte
    const totalNights = parseInt(nights) || 1;

    // Calcolo prezzo base
    const basePrice = nightlyRate * totalNights;

    // Applica sconto solo per soggiorni lunghi (7+ notti)
    let finalPrice = basePrice;
    let discount = 0;

    if (totalNights >= 7) {
        discount = 0.10; // 10% discount for 7+ nights
        finalPrice = basePrice * (1 - discount);
    }

    // Aggiungi informazione tassa di soggiorno (calcolata separatamente)
    const touristTaxNote = `+ Tassa di soggiorno: €${touristTaxPerPersonPerNight.toFixed(2)} a testa a notte (esclusi minori di 18 anni)`;

    // Format price for display
    document.getElementById('total-price').textContent = `€ ${finalPrice.toFixed(2)}`;

    // Aggiungi note per tassa di soggiorno
    const taxNoteElement = document.createElement('small');
    taxNoteElement.className = 'tax-note';
    taxNoteElement.textContent = touristTaxNote;
    taxNoteElement.style.color = 'var(--text-light)';
    taxNoteElement.style.display = 'block';
    taxNoteElement.style.marginTop = '5px';
    taxNoteElement.style.fontSize = '0.85rem';

    // Aggiungi nota sconto commissioni portali
    const commissionNote = document.createElement('small');
    commissionNote.className = 'commission-note';
    commissionNote.textContent = 'Prenotando dal nostro sito risparmi le spese di commissione dei portali!';
    commissionNote.style.color = 'var(--secondary-color)';
    commissionNote.style.display = 'block';
    commissionNote.style.marginTop = '8px';
    commissionNote.style.fontSize = '0.85rem';
    commissionNote.style.fontWeight = '600';

    const priceContainer = document.querySelector('.summary-price');

    // Rimuovi note precedenti se esistono
    const existingTaxNote = priceContainer.querySelector('.tax-note');
    const existingCommissionNote = priceContainer.querySelector('.commission-note');
    const existingDiscountNote = priceContainer.querySelector('.discount-note');

    if (existingTaxNote) existingTaxNote.remove();
    if (existingCommissionNote) existingCommissionNote.remove();
    if (existingDiscountNote) existingDiscountNote.remove();

    // Aggiungi nuove note
    priceContainer.appendChild(taxNoteElement);
    priceContainer.appendChild(commissionNote);

    // Aggiungi nota sconto se applicabile
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

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const bookingData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            language: formData.get('language'),
            guests: formData.get('guests'),
            message: formData.get('message'),
            checkin: formData.get('hidden_checkin'),
            checkout: formData.get('hidden_checkout'),
            terms: formData.get('terms') === 'on',
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString()
        };

        // In a real application, you would send this data to a server
        console.log('Booking data:', bookingData);

        // Show confirmation modal
        showConfirmationModal(bookingData);

        // Reset form (optional)
        // form.reset();
    });

    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            formatPhoneNumber(e.target);
        });
    }
}

function validateForm() {
    const form = document.getElementById('booking-form-element');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Reset previous error states
    form.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    form.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });

    // Validate each required field
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

    // Validate terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        markFieldAsError(termsCheckbox, 'Devi accettare i termini e condizioni');
        isValid = false;
    }

    return isValid;
}

function markFieldAsError(field, message) {
    field.classList.add('error');

    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = '#e53e3e';
    errorMessage.style.fontSize = '0.85rem';
    errorMessage.style.marginTop = '5px';

    field.parentNode.appendChild(errorMessage);

    // Scroll to first error
    if (!window.scrolledToError) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.scrolledToError = true;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic phone validation - allows international formats
    const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
        // Format as Italian phone number if starts with 3
        if (value.startsWith('3')) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.replace(/(\d{3})(\d+)/, '$1 $2');
            } else if (value.length <= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
            } else {
                value = value.replace(/(\d{3})(\d{3})(\d{4})(\d+)/, '$1 $2 $3 $4');
            }
        }
        // Add + for international numbers
        if (!value.startsWith('+') && value.length > 10) {
            value = '+' + value;
        }
    }

    input.value = value;
}

function showConfirmationModal(bookingData) {
    const modal = document.getElementById('confirmation-modal');
    if (!modal) return;

    // Update modal with booking details (optional)
    const messageElement = modal.querySelector('.modal-message');
    if (messageElement && bookingData.checkin && bookingData.checkout) {
        const checkinDate = formatDateForDisplay(bookingData.checkin);
        const checkoutDate = formatDateForDisplay(bookingData.checkout);

        messageElement.innerHTML = `
            Grazie <strong>${bookingData.name}</strong> per la tua richiesta di prenotazione!<br><br>
            <strong>Periodo:</strong> ${checkinDate} - ${checkoutDate}<br>
            <strong>Ospiti:</strong> ${bookingData.guests}<br>
            <strong>Lingua preferita:</strong> ${bookingData.language}<br><br>
            Ti contatteremo all'indirizzo <strong>${bookingData.email}</strong> entro 3 ore per confermare la disponibilità e procedere con il pagamento.
        `;
    }

    // Show modal
    modal.classList.add('active');

    // Reset error scroll flag
    window.scrolledToError = false;

    // In a real application, you would send the data to a server here
    // Example: sendBookingToServer(bookingData);
}

// Function to send booking data to server (example)
function sendBookingToServer(bookingData) {
    // This is where you would make an API call to your server
    // Example using fetch:
    /*
    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Booking saved:', data);
    })
    .catch(error => {
        console.error('Error saving booking:', error);
    });
    */
}

// Add some basic error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #e53e3e !important;
        background-color: #fff5f5;
    }

    .error:focus {
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
    }
`;
document.head.appendChild(style);