// Tour boxes functionality for scopri-milano.html

function toggleTour(tourId) {
    console.log('Cliccato su:', tourId);
    const tourContent = document.getElementById(tourId);

    if (!tourContent) {
        console.error('Elemento non trovato:', tourId);
        return;
    }

    const tourBox = tourContent.parentElement;
    const arrow = tourBox.querySelector('.tour-arrow');

    // Chiudi tutti gli altri tour aperti
    const allTourContents = document.querySelectorAll('.tour-content');
    const allArrows = document.querySelectorAll('.tour-arrow');

    allTourContents.forEach(content => {
        if (content.id !== tourId) {
            content.classList.remove('active');
        }
    });

    allArrows.forEach(arr => {
        if (arr !== arrow) {
            arr.classList.remove('active');
        }
    });

    // Toggle il tour cliccato
    const isActive = tourContent.classList.contains('active');
    tourContent.classList.toggle('active', !isActive);

    if (arrow) {
        arrow.classList.toggle('active', !isActive);
    }

    // Scrolla al tour aperto se si sta aprendo
    if (!isActive) {
        setTimeout(() => {
            tourBox.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }
}

// Initialize tour boxes when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all tour headers
    const tourHeaders = document.querySelectorAll('.tour-header');

    tourHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tourId = this.getAttribute('data-tour');
            if (tourId) {
                toggleTour(tourId);
            }
        });
    });

    // Add click event to all "Scopri di più" buttons
    const scopriButtons = document.querySelectorAll('.scopri-button');

    scopriButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tourId = this.getAttribute('data-tour');
            if (tourId) {
                toggleTour(tourId);
            }
        });
    });

    // Add click event to all tour-box elements
    const tourBoxes = document.querySelectorAll('.tour-box');

    tourBoxes.forEach(box => {
        // Try to find tourId from various sources
        let tourId = null;

        // 1. Check data-tour attribute
        if (box.hasAttribute('data-tour')) {
            tourId = box.getAttribute('data-tour');
        }
        // 2. Check onclick attribute (legacy)
        else if (box.hasAttribute('onclick')) {
            const onclickAttr = box.getAttribute('onclick');
            const match = onclickAttr.match(/toggleTour\('([^']+)'\)/);
            if (match && match[1]) {
                tourId = match[1];
                box.removeAttribute('onclick');
            }
        }
        // 3. Find tour-content inside the box
        else {
            const tourContent = box.querySelector('.tour-content');
            if (tourContent && tourContent.id) {
                tourId = tourContent.id;
            }
        }

        // If we found a tourId, add click event
        if (tourId) {
            // Add data-tour attribute for consistency
            box.setAttribute('data-tour', tourId);

            // Add click event listener
            box.addEventListener('click', function() {
                toggleTour(tourId);
            });
        }
    });
});