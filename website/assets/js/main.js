// Main JavaScript file for Secret Courtyard Milano
// Core functionality and initialization

document.addEventListener('DOMContentLoaded', function() {
    console.log('Secret Courtyard Milano - JavaScript loaded');

    // Initialize all components
    initializeLightbox();
    initializeGallery();
    initializeCalendar();
    initializeHamburgerMenu();


    // Check if we're on the mobility page and initialize tabs
    if (document.querySelector('.mobility-tabs-section')) {
        // Load mobility tabs functionality
        console.log('Initializing mobility tabs');
        // The mobility tabs are initialized by their own script
    }
});

// Function to initialize lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImage || !lightboxClose) {
        console.warn('Lightbox elements not found');
        return;
    }

    // Get all room images in the presentation section (index.html)
    const presentationImages = document.querySelectorAll('.presentation-images .room-image');

    // Get all courtyard images (la-casa.html)
    const courtyardImages = document.querySelectorAll('.courtyard-images .room-image');

    // Get all gallery images (la-ristrutturazione.html)
    const galleryImages = document.querySelectorAll('.gallery-grid .room-image');

    // Combine all sets of images
    const allImages = [...presentationImages, ...courtyardImages, ...galleryImages];

    // Add click event to each image
    allImages.forEach(image => {
        image.addEventListener('click', function() {
            const src = this.getAttribute('src');
            const alt = this.getAttribute('alt');

            lightboxImage.setAttribute('src', src);
            lightboxImage.setAttribute('alt', alt);
            if (lightboxCaption) {
                lightboxCaption.textContent = ''; // No caption in lightbox
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Function to initialize gallery
function initializeGallery() {
    const galleryIcon = document.getElementById('gallery-icon');
    const galleryButton = galleryIcon ? galleryIcon.querySelector('.gallery-button') : null;
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const galleryLightboxImage = document.getElementById('gallery-lightbox-image');
    const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
    const galleryLightboxPrev = document.getElementById('gallery-lightbox-prev');
    const galleryLightboxNext = document.getElementById('gallery-lightbox-next');
    const galleryLightboxCounter = document.getElementById('gallery-lightbox-counter');

    if (!galleryIcon || !galleryLightbox || !galleryLightboxImage) {
        console.warn('Gallery elements not found');
        return;
    }

    // Array of gallery images (0 to 33, excluding 2)
    const galleryImages = [];
    for (let i = 0; i <= 33; i++) {
        if (i !== 2) { // Skip image 2
            galleryImages.push(`assets/images/Galleria/${i}.jpg`);
        }
    }

    let currentGalleryIndex = 0;

    // Open gallery lightbox
    function openGallery() {
        currentGalleryIndex = 0;
        updateGalleryImage();
        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close gallery lightbox
    function closeGallery() {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update gallery image and counter
    function updateGalleryImage() {
        galleryLightboxImage.setAttribute('src', galleryImages[currentGalleryIndex]);
        if (galleryLightboxCounter) {
            galleryLightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
        }
    }

    // Next image
    function nextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateGalleryImage();
    }

    // Previous image
    function prevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateGalleryImage();
    }

    // Event listeners
    if (galleryButton) {
        galleryButton.addEventListener('click', openGallery);
    }

    if (galleryLightboxClose) {
        galleryLightboxClose.addEventListener('click', closeGallery);
    }

    if (galleryLightboxNext) {
        galleryLightboxNext.addEventListener('click', nextImage);
    }

    if (galleryLightboxPrev) {
        galleryLightboxPrev.addEventListener('click', prevImage);
    }

    // Close gallery when clicking outside the image
    galleryLightbox.addEventListener('click', function(e) {
        if (e.target === galleryLightbox) {
            closeGallery();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!galleryLightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    });
}

// Function to initialize calendar
function initializeCalendar() {
    const calendarContainer = document.getElementById('date-range-calendar');
    if (!calendarContainer) return;

    const dayNames = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    const monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    let currentDate = new Date();
    let startDate = null;
    let endDate = null;
    let isSelecting = false;

    // Date prenotazioni (esempio)
    const bookedDates = [
        { start: '2025-01-10', end: '2025-01-15' },
        { start: '2025-02-05', end: '2025-02-10' },
        { start: '2025-03-20', end: '2025-03-25' }
    ];

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function isDateBooked(date) {
        const dateStr = formatDate(date);
        return bookedDates.some(booking =>
            dateStr >= booking.start && dateStr <= booking.end
        );
    }

    function isDateInRange(date) {
        if (!startDate || !endDate) return false;
        const dateStr = formatDate(date);
        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);
        return dateStr >= startStr && dateStr <= endStr;
    }

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

        // Calcola primo giorno del mese
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        // Aggiusta per Lun=0, Dom=6
        const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

        // Crea header
        calendarContainer.innerHTML = `
            <div class="calendar-header-simple">
                <h3>${monthNames[month]} ${year}</h3>
                <div class="calendar-nav-simple">
                    <button class="calendar-nav-btn-simple prev-month">‹</button>
                    ${!isCurrentMonth ? `<button class="calendar-nav-btn-simple current-month" title="Torna al mese corrente">●</button>` : ''}
                    <button class="calendar-nav-btn-simple next-month">›</button>
                </div>
            </div>
            <div class="calendar-grid-simple">
                ${dayNames.map(day => `<div class="calendar-day-header">${day}</div>`).join('')}
            </div>
            ${startDate || endDate ? `
            <div class="date-selection-info">
                ${startDate ? `<p>Check-in: <strong>${startDate.toLocaleDateString('it-IT')}</strong></p>` : ''}
                ${endDate ? `<p>Check-out: <strong>${endDate.toLocaleDateString('it-IT')}</strong></p>` : ''}
                ${startDate && endDate ? `<p>Notti: <strong>${Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))}</strong></p>` : ''}
            </div>
            ` : ''}
        `;

        const gridContainer = calendarContainer.querySelector('.calendar-grid-simple');

        // Celle vuote all'inizio
        for (let i = 0; i < adjustedStartingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            gridContainer.appendChild(emptyCell);
        }

        // Giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = formatDate(date);

            // Controlla se è oggi
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Controlla se è prenotato
            if (isDateBooked(date)) {
                dayElement.classList.add('disabled');
            }

            // Controlla se è selezionato
            if (startDate && formatDate(date) === formatDate(startDate)) {
                dayElement.classList.add('selected');
            } else if (endDate && formatDate(date) === formatDate(endDate)) {
                dayElement.classList.add('selected');
            } else if (isDateInRange(date)) {
                dayElement.classList.add('in-range');
            }

            // Event listener per selezione
            if (!isDateBooked(date)) {
                dayElement.addEventListener('click', () => handleDateClick(date));
            }

            gridContainer.appendChild(dayElement);
        }

        // Aggiungi event listeners per navigazione
        calendarContainer.querySelector('.prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        calendarContainer.querySelector('.next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Aggiungi event listener per tornare al mese corrente
        const currentMonthBtn = calendarContainer.querySelector('.current-month');
        if (currentMonthBtn) {
            currentMonthBtn.addEventListener('click', () => {
                currentDate = new Date();
                renderCalendar();
            });
        }
    }

    function handleDateClick(date) {
        if (!startDate || (startDate && endDate)) {
            // Inizia nuova selezione
            startDate = date;
            endDate = null;
            isSelecting = true;
        } else if (isSelecting && date > startDate) {
            // Completa la selezione
            endDate = date;
            isSelecting = false;
        } else if (date < startDate) {
            // Se clicca una data precedente, resetta
            startDate = date;
            endDate = null;
        }

        renderCalendar();
    }

    // Inizializza calendario
    renderCalendar();
}

// Function to initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!hamburger || !navMenu) {
        console.warn('Hamburger menu elements not found');
        return;
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

