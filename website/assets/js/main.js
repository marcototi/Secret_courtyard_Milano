// Main JavaScript file for Secret Courtyard Milano
// Core functionality and initialization

document.addEventListener('DOMContentLoaded', function() {
    console.log('Secret Courtyard Milano - JavaScript loaded');

    // Initialize all components
    initializeLightbox();
    initializeGallery();
    initializeCalendar();
    initializeHamburgerMenu();
    initializeContactForm();
    initializeLanguageSelector();

    // Check if we're on the mobility page and initialize tabs
    if (document.querySelector('.mobility-tabs-section')) {
        console.log('Initializing mobility tabs');
    }
});

// --- LIGHTBOX ---
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImage || !lightboxClose) return;

    const presentationImages = document.querySelectorAll('.presentation-images .room-image');
    const courtyardImages = document.querySelectorAll('.courtyard-images .room-image');
    const galleryImages = document.querySelectorAll('.gallery-grid .room-image');
    const allImages = [...presentationImages, ...courtyardImages, ...galleryImages];

    allImages.forEach(image => {
        image.addEventListener('click', function() {
            const src = this.getAttribute('src');
            const alt = this.getAttribute('alt');
            lightboxImage.setAttribute('src', src);
            lightboxImage.setAttribute('alt', alt);
            if (lightboxCaption) lightboxCaption.textContent = '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
}

// --- GALLERY ---
function initializeGallery() {
    const galleryIcon = document.getElementById('gallery-icon');
    const galleryButton = galleryIcon ? galleryIcon.querySelector('.gallery-button') : null;
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
    const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
    const galleryLightboxPrev = document.getElementById('gallery-lightbox-prev');
    const galleryLightboxNext = document.getElementById('gallery-lightbox-next');
    const galleryLightboxCounter = document.getElementById('gallery-lightbox-counter');

    if (!galleryIcon || !galleryLightbox || !galleryLightboxImage) return;

    const galleryImages = [];
    for (let i = 0; i <= 33; i++) { if (i !== 2) galleryImages.push(`assets/images/Galleria/${i}.jpg`); }

    let currentGalleryIndex = 0;

    const updateGalleryImage = () => {
        galleryLightboxImage.setAttribute('src', galleryImages[currentGalleryIndex]);
        if (galleryLightboxCounter) galleryLightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
    };

    const openGallery = () => {
        currentGalleryIndex = 0;
        updateGalleryImage();
        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeGallery = () => {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (galleryButton) galleryButton.addEventListener('click', openGallery);
    if (galleryLightboxClose) galleryLightboxClose.addEventListener('click', closeGallery);
    if (galleryLightboxNext) galleryLightboxNext.addEventListener('click', () => { currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length; updateGalleryImage(); });
    if (galleryLightboxPrev) galleryLightboxPrev.addEventListener('click', () => { currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length; updateGalleryImage(); });

    galleryLightbox.addEventListener('click', (e) => { if (e.target === galleryLightbox) closeGallery(); });
    document.addEventListener('keydown', (e) => {
        if (!galleryLightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowRight') { currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length; updateGalleryImage(); }
        if (e.key === 'ArrowLeft') { currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length; updateGalleryImage(); }
    });
}

// --- CALENDAR ---
function initializeCalendar() {
    const calendarContainer = document.getElementById('date-range-calendar');
    if (!calendarContainer) return;

    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    let currentDate = new Date();
    let startDate = null;
    let endDate = null;
    let isSelecting = false;

    const bookedDates = [
        { start: '2025-01-10', end: '2025-01-15' },
        { start: '2025-02-05', end: '2025-02-10' },
        { start: '2025-03-20', end: '2025-03-25' }
    ];

    const formatDate = (date) => date.toISOString().split('T')[0];
    const isDateBooked = (date) => bookedDates.some(b => formatDate(date) >= b.start && formatDate(date) <= b.end);
    const isDateInPast = (date) => { const t = new Date(); t.setHours(0,0,0,0); return date < t; };

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const adjustedStartingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarContainer.innerHTML = `
            <div class="calendar-header-simple">
                <h3>${monthNames[month]} ${year}</h3>
                <div class="calendar-nav-simple">
                    <button class="calendar-nav-btn-simple prev-month">‹</button>
                    <button class="calendar-nav-btn-simple next-month">›</button>
                </div>
            </div>
            <div class="calendar-grid-simple">${dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('')}</div>
            ${startDate && endDate ? `
                <div class="date-selection-info">
                    <p>Notti: <strong>${Math.ceil((endDate - startDate) / 86400000)}</strong></p>
                    <div class="booking-action"><a href="./pages/prenotazione.html?checkin=${formatDate(startDate)}&checkout=${formatDate(endDate)}&nights=${Math.ceil((endDate - startDate) / 86400000)}" class="booking-button">Prenota</a></div>
                </div>` : ''}`;

        const grid = calendarContainer.querySelector('.calendar-grid-simple');
        for (let i = 0; i < adjustedStartingDay; i++) { const cell = document.createElement('div'); cell.className = 'calendar-day empty'; grid.appendChild(cell); }
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const el = document.createElement('div');
            el.className = 'calendar-day' + (isDateBooked(date) || isDateInPast(date) ? ' disabled' : '');
            el.textContent = d;
            if (startDate && formatDate(date) === formatDate(startDate)) el.classList.add('selected');
            if (endDate && formatDate(date) === formatDate(endDate)) el.classList.add('selected');
            if (startDate && endDate && formatDate(date) > formatDate(startDate) && formatDate(date) < formatDate(endDate)) el.classList.add('in-range');
            
            if (!el.classList.contains('disabled')) {
                el.addEventListener('click', () => {
                    if (!startDate || (startDate && endDate)) { startDate = date; endDate = null; isSelecting = true; }
                    else if (isSelecting && date > startDate) { endDate = date; isSelecting = false; }
                    else { startDate = date; endDate = null; }
                    renderCalendar();
                });
            }
            grid.appendChild(el);
        }

        calendarContainer.querySelector('.prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        calendarContainer.querySelector('.next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
    }
    renderCalendar();
}

// --- HAMBURGER MENU ---
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        const active = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', active);
        document.body.style.overflow = active ? 'hidden' : '';

        // Aggiungi/rimuovi classe per animazione hamburger
        if (active) {
            hamburger.classList.add('active');
        } else {
            hamburger.classList.remove('active');
        }
    };

    // Usa event listener per touch e click
    hamburger.addEventListener('click', function(e) {
        toggleMenu();
    });

    // Chiudi il menu quando si clicca su un link (solo su mobile)
    const navLinks = document.querySelectorAll('.nav-menu a:not(.language-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Chiudi il menu quando si clicca fuori (solo su mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // Chiudi il menu con tasto ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// --- CONTACT FORM LOGIC (QUESTA È LA PARTE CHE TI MANCAVA) ---
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        
        const contactData = {
            nome: formData.get('name'),
            email: formData.get('email'),
            messaggio: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Chiamata alla funzione di invio
        sendContactData(contactData);
    });

    const modal = document.getElementById('contact-confirmation-modal');
    const closeBtn = document.getElementById('contact-modal-close');
    const closeBtn2 = document.getElementById('contact-modal-close-btn');
    const closeModal = () => modal.classList.remove('active');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
}

// QUESTA È LA FUNZIONE DA VERIFICARE
function sendContactData(contactData) {
    const form = document.getElementById('contact-form');
    const modal = document.getElementById('contact-confirmation-modal');
    const submitButton = form.querySelector('button[type="submit"]');

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Invio in corso...';
    submitButton.disabled = true;

    // URL della tua Cloudflare Worker
    const workerUrl = "https://secret-courtyard-api.marco-81e.workers.dev";

    fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Errore server');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            modal.classList.add('active');
            form.reset();
        } else {
            alert('Errore nell\'invio del messaggio.');
        }
    })
    .catch((error) => {
        console.error('Errore di invio:', error);
        alert('Errore di connessione alla Worker.');
    })
    .finally(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Funzione per cambiare lingua
function changeLanguage(lang) {
    // Salva la preferenza nel browser
    localStorage.setItem('preferredLanguage', lang);

    // Cambia i testi nel sito
    try {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            try {
                const key = element.getAttribute('data-i18n');
                if (!key) return;

                let translation = null;

                // Cerca la traduzione nella lingua corrente
                if (translations[lang] && translations[lang][key]) {
                    translation = translations[lang][key];
                }
                // Fallback: per chiavi automatiche, mantieni il testo originale
                else if (key.startsWith('auto_')) {
                    // Per chiavi automatiche, mantieni il testo originale come fallback
                    translation = element.textContent || element.innerHTML;
                }

                if (translation) {
                    // Usa innerHTML se il testo contiene HTML, altrimenti textContent
                    if (translation.includes('<') && translation.includes('>')) {
                        element.innerHTML = translation;
                    } else {
                        element.textContent = translation;
                    }
                }
            } catch (elementError) {
                console.warn('Errore nella traduzione elemento:', element, elementError);
                // Continua con gli altri elementi
            }
        });
    } catch (error) {
        console.error('Errore nel cambio lingua:', error);
    }

    // Aggiorna l'attributo lang del documento HTML
    document.documentElement.lang = lang;

    // Aggiorna il testo corrente nel selettore lingua
    const currentLangElement = document.querySelector('.language-current');
    if (currentLangElement && translations[lang] && translations[lang]['language_' + lang]) {
        currentLangElement.textContent = translations[lang]['language_' + lang];
    }

    // Aggiorna la bandiera nel selettore
    const flagElement = document.querySelector('.language-flag');
    if (flagElement) {
        if (lang === 'it') flagElement.textContent = '🇮🇹';
        else if (lang === 'en') flagElement.textContent = '🇬🇧';
        else if (lang === 'es') flagElement.textContent = '🇪🇸';
    }
}

// Funzione per aiutare ad applicare attributi data-i18n automaticamente
function autoApplyI18nAttributes() {
    // Elementi comuni che dovrebbero essere tradotti
    const selectors = [
        'h1:not([data-i18n])',
        'h2:not([data-i18n])',
        'h3:not([data-i18n])',
        'h4:not([data-i18n])',
        '.section-title:not([data-i18n])',
        '.hero-subtitle:not([data-i18n])',
        '.cta-button:not([data-i18n])',
        'p:not([data-i18n])',
        'li:not([data-i18n])',
        '.card-title:not([data-i18n])',
        '.card-text:not([data-i18n])'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Crea una chiave basata sul testo e sulla posizione
            const text = element.textContent.trim();
            if (text && text.length > 0 && text.length < 100) {
                // Crea una chiave semplice dal testo
                const key = text.toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '_')
                    .substring(0, 50);

                if (key && key.length > 3) {
                    element.setAttribute('data-i18n', 'auto_' + key);
                }
            }
        });
    });
}

// Funzione per inizializzare il selettore lingua
function initializeLanguageSelector() {
    // Applica attributi i18n automaticamente agli elementi comuni PRIMA di cambiare lingua
    // DISABILITATO TEMPORANEAMENTE PER RISOLVERE PROBLEMI
    // autoApplyI18nAttributes();

    // Aggiungi event listener ai pulsanti di selezione lingua
    document.querySelectorAll('.language-option').forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);

            // Chiudi il dropdown dopo la selezione (su mobile)
            const dropdown = this.closest('.language-options');
            if (dropdown && window.innerWidth <= 768) {
                dropdown.style.display = 'none';
            }
        });
    });

    // Gestione apertura/chiusura dropdown su mobile
    const languageToggle = document.querySelector('.language-toggle');
    const languageOptions = document.querySelector('.language-options');

    if (languageToggle && languageOptions) {
        languageToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.stopPropagation();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                languageOptions.style.display = isExpanded ? 'none' : 'block';
            }
        });

        // Chiudi dropdown quando si clicca fuori (solo mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 &&
                !languageToggle.contains(e.target) &&
                !languageOptions.contains(e.target)) {
                languageToggle.setAttribute('aria-expanded', 'false');
                languageOptions.style.display = 'none';
            }
        });
    }

    // Al caricamento, controlla se c'è una lingua salvata o usa l'italiano
    const savedLang = localStorage.getItem('preferredLanguage') || 'it';
    changeLanguage(savedLang);
}

// Aggiungi initializeLanguageSelector alla lista delle inizializzazioni
document.addEventListener('DOMContentLoaded', function() {
    console.log('Secret Courtyard Milano - JavaScript loaded');

    // Initialize all components
    initializeLightbox();
    initializeGallery();
    initializeCalendar();
    initializeHamburgerMenu();
    initializeContactForm();
    initializeLanguageSelector(); // Aggiunto qui

    // Check if we're on the mobility page and initialize tabs
    if (document.querySelector('.mobility-tabs-section')) {
        // Load mobility tabs functionality
        console.log('Initializing mobility tabs');
        // The mobility tabs are initialized by their own script
    }
});