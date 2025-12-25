// Mobility tabs functionality for mobilita.html

function initializeMobilityTabs() {
    const tabsSection = document.querySelector('.mobility-tabs-section');
    const tabs = document.querySelectorAll('.mobility-tab');
    const sections = document.querySelectorAll('.subsection');

    if (!tabsSection || tabs.length === 0 || sections.length === 0) {
        console.warn('Mobility tabs elements not found');
        return;
    }

    // Assicurati che nessun tab sia attivo all'inizio
    tabs.forEach(tab => tab.classList.remove('active'));

    // Sticky menu con ombra
    const stickyObserver = new IntersectionObserver(
        ([e]) => e.target.classList.toggle('sticky', e.intersectionRatio < 1),
        {threshold: [1]}
    );

    stickyObserver.observe(tabsSection);

    // Active tab tracking
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeTab = document.querySelector(`.mobility-tab[href="#${id}"]`);

                    // Rimuovi active da tutti i tabs
                    tabs.forEach(tab => tab.classList.remove('active'));

                    // Aggiungi active al tab corrente
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                }
            });
        },
        {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0.2
        }
    );

    // Osserva tutte le sezioni
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Smooth scroll per i tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Rimuovi active da tutti i tabs
                tabs.forEach(t => t.classList.remove('active'));

                // Aggiungi active al tab cliccato
                this.classList.add('active');

                // Smooth scroll alla sezione
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Inizializza il primo tab come attivo se nessuna sezione è visibile
    const firstVisibleSection = Array.from(sections).find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.5;
    });

    if (!firstVisibleSection) {
        const firstTab = tabs[0];
        if (firstTab) {
            firstTab.classList.add('active');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobilityTabs();
});