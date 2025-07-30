function createStars() {
    const container = document.querySelector('.stars-container');
    const starCount = 10; // reduced from 20 to 10

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position and delay
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(star);
    }
}

function createStar() {
    const star = document.createElement("div");
    star.className = "star";

    // Random starting position
    star.style.left = Math.random() * window.innerWidth + "px";

    const container = document.querySelector(".stars-container");
    container.appendChild(star);

    // Remove star after animation completes
    star.addEventListener("animationend", () => {
        star.remove();
    });
}

// Scroll-triggered animation using Intersection Observer
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    elements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize effects
document.addEventListener("DOMContentLoaded", () => {
    createStars();
    setInterval(createStar, 800);
    initScrollAnimations();
});


