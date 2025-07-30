// cursor
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

// Trail effect variables
let trails = [];
const maxTrails = 15;

// Mouse position tracking
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Update mouse position
document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX - 10 + "px";
    cursor.style.top = mouseY - 10 + "px";

    createTrail(mouseX, mouseY);

    // Create particles on movement (reduced frequency)
    if (Math.random() < 0.1) {
        createParticle(mouseX, mouseY);
    }
});

// Smooth follower animation
function animateFollower() {
    const dx = mouseX - followerX;
    const dy = mouseY - followerY;

    followerX += dx * 0.1;
    followerY += dy * 0.1;

    cursorFollower.style.left = followerX - 20 + "px";
    cursorFollower.style.top = followerY - 20 + "px";

    requestAnimationFrame(animateFollower);
}
animateFollower();

// Create trail effect
function createTrail(x, y) {
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.left = x - 3 + "px";
    trail.style.top = y - 3 + "px";
    trail.style.opacity = "0.8";

    document.body.appendChild(trail);
    trails.push(trail);

    // Fade out trail
    setTimeout(() => {
        trail.style.opacity = "0";
    }, 50);

    // Remove trail after animation
    setTimeout(() => {
        if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
        }
        trails = trails.filter((t) => t !== trail);
    }, 300);

  // Limit number of trails
    if (trails.length > maxTrails) {
        const oldTrail = trails.shift();
        if (oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
        }
    }
    }

// Create particle effect
function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random position around cursor
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    particle.style.left = x + offsetX + "px";
    particle.style.top = y + offsetY + "px";

  // Random color variation
    const colors = ["var(--primary)", "var(--secondary)", "#ffffff"];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

// Hover effects for interactive elements
const interactiveElements = document.querySelectorAll(
    "a, button, .cube-loader"
);

interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        cursorFollower.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        cursorFollower.classList.remove("hover");
    });
});

// Click effect
document.addEventListener("mousedown", () => {
    cursor.classList.add("click");

    // Create burst particles on click
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
        createParticle(mouseX, mouseY);
        }, i * 50);
    }
});

document.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
});

// Hide cursor when leaving window
document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorFollower.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    cursorFollower.style.opacity = "0.5";
});

// Special effect for text selection
document.addEventListener("selectstart", () => {
    cursor.style.background = "var(--secondary)";
    setTimeout(() => {
        cursor.style.background = "var(--primary)";
    }, 200);
});

// Scroll effect - change cursor on scroll
let isScrolling = false;
window.addEventListener("scroll", () => {
    if (!isScrolling) {
        cursor.style.transform = "scale(0.7)";
        cursorFollower.style.transform = "scale(0.7)";
        isScrolling = true;
    }

    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(() => {
        cursor.style.transform = "scale(1)";
        cursorFollower.style.transform = "scale(1)";
        isScrolling = false;
    }, 150);
});
// cursor end

// Lanyard interaction
const lanyardContainer = document.querySelector('.lanyard-container');
const rope = document.querySelector('.rope');
const card = document.querySelector('.lanyard-card');
let isDragging = false;
let origin = { x: 0, y: 0 };
let dragOffset = { x: 0, y: 0 };
let animationFrame;

function getLanyardOrigin() {
    const rect = lanyardContainer.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top
    };
}

function startDragging(e) {
    isDragging = true;
    card.classList.add('dragging');
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    origin = getLanyardOrigin();
    dragOffset.x = clientX - origin.x;
    dragOffset.y = clientY - origin.y;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDragging);
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
    const dx = clientX - origin.x;
    const dy = clientY - origin.y;
    // Rope length and angle
    const length = Math.max(80, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dx, dy) * -1;
    rope.style.height = `${length}px`;
    rope.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
    rope.style.zIndex = 1;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle * 30 / Math.PI}deg)`;
    card.style.zIndex = 2;
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove('dragging');
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDragging);
    // Animate back to origin
    let dx = parseFloat(card.style.transform.split('(')[1]?.split(',')[0]) || 0;
    let dy = parseFloat(card.style.transform.split(',')[1]) || 0;
    function animateBack() {
        dx *= 0.85;
        dy *= 0.85;
        const length = Math.max(80, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dx, dy) * -1;
        rope.style.height = `${length}px`;
        rope.style.transform = `rotate(${angle * 180 / Math.PI}deg)`;
        rope.style.zIndex = 1;
        card.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle * 30 / Math.PI}deg)`;
        card.style.zIndex = 2;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            animationFrame = requestAnimationFrame(animateBack);
        } else {
            rope.style.height = `80px`;
            rope.style.transform = `rotate(0deg)`;
            card.style.transform = `translate(0, 0) rotate(0deg)`;
            rope.style.zIndex = 1;
            card.style.zIndex = 2;
        }
    }
    animateBack();
}

card.addEventListener('mousedown', startDragging);
card.addEventListener('touchstart', startDragging, { passive: false });

// Typing animation for about section
const typedText = document.querySelector('.typed-text');
if (typedText) {
    const roles = [
        "Frontend Developer",
        "Fotografer",
        "AI enthusiast",
        "DKV Students"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 80;
    let erasingDelay = 40;
    let nextDelay = 1200;

    function typeRole() {
        const currentRole = roles[roleIndex];
        if (!isDeleting) {
            typedText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex < currentRole.length) {
                setTimeout(typeRole, typingDelay);
            } else {
                isDeleting = true;
                setTimeout(typeRole, nextDelay);
            }
        } else {
            typedText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex > 0) {
                setTimeout(typeRole, erasingDelay);
            } else {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeRole, 600);
            }
        }
    }
    setTimeout(typeRole, 800);
}

// form
// Initialize Feather icons
        feather.replace();

        if (cursor && cursorFollower) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                setTimeout(() => {
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                }, 100);
            });

            // Add hover effects
            document.querySelectorAll('button, input, textarea, .toggle-option').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                    cursorFollower.classList.add('hover');
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('hover');
                    cursorFollower.classList.remove('hover');
                });
            });
        }

        // Create stars
        function createStars() {
            const starsContainer = document.querySelector('.stars-container');
            const numStars = 50;

            for (let i = 0; i < numStars; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                starsContainer.appendChild(star);
            }
        }

        createStars();

        // Form switching functionality
        const emailToggle = document.getElementById('emailToggle');
        const whatsappToggle = document.getElementById('whatsappToggle');
        const toggleSlider = document.getElementById('toggleSlider');
        const emailForm = document.getElementById('emailForm');
        const whatsappForm = document.getElementById('whatsappForm');
        const successMessage = document.getElementById('successMessage');

        function switchToEmail() {
            emailToggle.classList.add('active');
            whatsappToggle.classList.remove('active');
            toggleSlider.classList.remove('whatsapp');
            
            setTimeout(() => {
                emailForm.classList.add('active');
                whatsappForm.classList.remove('active');
            }, 200);
        }

        function switchToWhatsApp() {
            whatsappToggle.classList.add('active');
            emailToggle.classList.remove('active');
            toggleSlider.classList.add('whatsapp');
            
            setTimeout(() => {
                whatsappForm.classList.add('active');
                emailForm.classList.remove('active');
            }, 200);
        }

        emailToggle.addEventListener('click', switchToEmail);
        whatsappToggle.addEventListener('click', switchToWhatsApp);

        // Email form submission
        document.getElementById('emailContactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loading = document.getElementById('emailLoading');
            const buttonText = document.getElementById('emailButtonText');
            const submitBtn = e.target.querySelector('.submit-btn');
            
            // Show loading state
            loading.style.display = 'block';
            buttonText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:anggalord19@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Simulate sending delay
            setTimeout(() => {
                window.location.href = mailtoLink;
                
                // Reset form and show success
                loading.style.display = 'none';
                buttonText.textContent = 'Send Email';
                submitBtn.disabled = false;
                
                successMessage.classList.add('show');
                e.target.reset();
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 1500);
        });

        // WhatsApp form submission
        document.getElementById('whatsappContactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loading = document.getElementById('whatsappLoading');
            const buttonText = document.getElementById('whatsappButtonText');
            const submitBtn = e.target.querySelector('.submit-btn');
            
            // Show loading state
            loading.style.display = 'block';
            buttonText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Format WhatsApp message
            const whatsappMessage = `Hi Angga! 👋\n\nName: ${name}\nPhone: +62${phone}\n\nMessage:\n${message}`;
            const whatsappNumber = '6287776624014'; // Nomor WhatsApp yang sudah benar
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Simulate sending delay
            setTimeout(() => {
                window.open(whatsappLink, '_blank');
                
                // Reset form and show success
                loading.style.display = 'none';
                buttonText.textContent = 'Send via WhatsApp';
                submitBtn.disabled = false;
                
                successMessage.classList.add('show');
                e.target.reset();
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 5000);
            }, 1500);
        });

        // Phone number formatting dengan validasi yang lebih baik
        const phoneInput = document.getElementById('whatsappPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('0')) {
                    value = value.substring(1);
                }
                
                // Format: 812-3456-7890
                if (value.length >= 3) {
                    value = value.substring(0, 3) + '-' + value.substring(3);
                }
                if (value.length >= 8) {
                    value = value.substring(0, 8) + '-' + value.substring(8, 12);
                }
                
                e.target.value = value;
            });
        }

        // Add interactive animations
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
            });
        });