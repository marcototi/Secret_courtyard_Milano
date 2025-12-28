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

    // Check if we're on the mobility page and initialize tabs
    if (document.querySelector('.mobility-tabs-section')) {
        console.log('Initializing mobility tabs');
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

// Function to initialize calendar
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

        calendarContainer.querySelector('.prev-month').addEventListener('click', () => { currentDate.set