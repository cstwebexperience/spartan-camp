/* ═══════════════════════════════════════════════════════════
   SPARTAN CAMP ADVENTURE ROMANIA — PREMIUM INTERACTIVE ENGINE
   Particles · Cinematic Animations · Dynamic Pricing
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initLogoTransparency();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initParticles();
    initScrollAnimations();
    initCounters();
    initGallery();
    initLightbox();
    initTicketing();
    initCheckoutModal();
    initContactForm();
    initParallax();
    initTiltCards();
    initMagneticButtons();
    initTextGlitch();
});

/* ═══════════════════════════════════════════════════════════
   LOGO TRANSPARENCY — Remove white background via Canvas
   ═══════════════════════════════════════════════════════════ */
function initLogoTransparency() {
    var img = document.querySelector('.logo-img');
    if (!img) return;

    function process() {
        try {
            var c = document.createElement('canvas');
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            var ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var d = ctx.getImageData(0, 0, c.width, c.height);
            var px = d.data;
            for (var i = 0; i < px.length; i += 4) {
                var r = px[i], g = px[i + 1], b = px[i + 2];
                if (r > 220 && g > 220 && b > 220) {
                    var brightness = (r + g + b) / 3;
                    px[i + 3] = Math.max(0, Math.round(255 - (brightness - 220) * 7.3));
                }
            }
            ctx.putImageData(d, 0, 0);
            img.src = c.toDataURL('image/png');
        } catch (e) { /* cross-origin fallback — skip silently */ }
    }

    if (img.complete && img.naturalWidth > 0) process();
    else img.addEventListener('load', process);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   PARTICLE SYSTEM — Floating embers / sparks
   ═══════════════════════════════════════════════════════════ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 3 + 0.5;
            this.speedY = -(Math.random() * 1.5 + 0.3);
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            
            // Orange/gold color variations
            const hue = 25 + Math.random() * 20; // 25-45 range
            const sat = 80 + Math.random() * 20;
            const light = 50 + Math.random() * 20;
            this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
        }

        update() {
            this.wobble += this.wobbleSpeed;
            this.x += this.speedX + Math.sin(this.wobble) * 0.3;
            this.y += this.speedY;
            this.opacity -= this.fadeSpeed;

            if (this.opacity <= 0 || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();

            // Add glow
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                ctx.fill();
            }
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new Particle();
            p.y = Math.random() * canvas.height; // spread initial positions
            particles.push(p);
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();

    // Pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    });
    observer.observe(canvas.parentElement);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS — Staggered Reveals
   ═══════════════════════════════════════════════════════════ */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || 0);
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   COUNTER ANIMATION — Smooth with easing
   ═══════════════════════════════════════════════════════════ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2500;
    const start = performance.now();

    function update(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // quartic ease out
        const current = Math.floor(eased * target);
        element.textContent = current.toLocaleString('ro-RO');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('ro-RO');
        }
    }
    requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════════
   GALLERY — Animated Filter with FLIP technique
   ═══════════════════════════════════════════════════════════ */
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, index * 80);
                } else {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.classList.add('hidden'), 300);
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX — Smooth open/close
   ═══════════════════════════════════════════════════════════ */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

/* ═══════════════════════════════════════════════════════════
   TICKETING — Dynamic 15% Discount
   ═══════════════════════════════════════════════════════════ */
const ticketPrices = { standard: 1200, premium: 1800, vip: 2500 };
const ticketLabels = { standard: 'STANDARD', premium: 'PREMIUM', vip: 'VIP SPARTAN' };

function initTicketing() {
    document.querySelectorAll('.own-transport-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const ticket = cb.getAttribute('data-ticket');
            const basePrice = parseInt(cb.getAttribute('data-base'));
            const priceElement = document.getElementById(`price${capitalize(ticket)}`);

            if (cb.checked) {
                const discounted = Math.round(basePrice * 0.85);
                
                // Animate price change
                priceElement.style.transition = 'all 0.3s ease';
                priceElement.style.transform = 'scale(0.8)';
                priceElement.style.opacity = '0';
                
                setTimeout(() => {
                    priceElement.textContent = discounted.toLocaleString('ro-RO');
                    priceElement.classList.add('discounted');
                    priceElement.style.transform = 'scale(1)';
                    priceElement.style.opacity = '1';
                }, 200);
            } else {
                priceElement.style.transition = 'all 0.3s ease';
                priceElement.style.transform = 'scale(0.8)';
                priceElement.style.opacity = '0';
                
                setTimeout(() => {
                    priceElement.textContent = basePrice.toLocaleString('ro-RO');
                    priceElement.classList.remove('discounted');
                    priceElement.style.transform = 'scale(1)';
                    priceElement.style.opacity = '1';
                }, 200);
            }
        });
    });
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

/* ═══════════════════════════════════════════════════════════
   CHECKOUT MODAL — Full Flow
   ═══════════════════════════════════════════════════════════ */
let currentTicketType = '';

function openCheckout(type) {
    currentTicketType = type;
    const ticketCheckbox = document.querySelector(`.own-transport-cb[data-ticket="${type}"]`);
    
    document.getElementById('ticketType').value = type;
    document.getElementById('checkoutOwnTransport').checked = ticketCheckbox ? ticketCheckbox.checked : false;
    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    updateCheckoutSummary();
}

function initCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const closeBtn = document.getElementById('modalClose');
    const form = document.getElementById('checkoutForm');
    const ownTransportCb = document.getElementById('checkoutOwnTransport');
    const qtyInput = document.getElementById('checkoutQty');

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    ownTransportCb.addEventListener('change', updateCheckoutSummary);
    qtyInput.addEventListener('input', updateCheckoutSummary);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.ownTransport = ownTransportCb.checked;
        console.log('Checkout data:', data);
        
        closeModal();
        showToast('🎫 Rezervare trimisă cu succes! Te contactăm în curând.');
        form.reset();
    });
}

function closeModal() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = '';
}

function updateCheckoutSummary() {
    const ownTransport = document.getElementById('checkoutOwnTransport').checked;
    const qty = parseInt(document.getElementById('checkoutQty').value) || 1;
    const basePrice = ticketPrices[currentTicketType] || 0;

    let unitPrice = basePrice;
    let discountAmount = 0;

    const discountRow = document.getElementById('summaryDiscountRow');

    if (ownTransport) {
        discountAmount = Math.round(basePrice * 0.15);
        unitPrice = basePrice - discountAmount;
        discountRow.style.display = 'flex';
        document.getElementById('summaryDiscount').textContent = `-${(discountAmount * qty).toLocaleString('ro-RO')} RON`;
    } else {
        discountRow.style.display = 'none';
    }

    document.getElementById('summaryTicketType').textContent = ticketLabels[currentTicketType] || '—';
    document.getElementById('summaryUnitPrice').textContent = `${basePrice.toLocaleString('ro-RO')} RON`;
    document.getElementById('summaryTotal').textContent = `${(unitPrice * qty).toLocaleString('ro-RO')} RON`;
}

window.openCheckout = openCheckout;

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════════ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        data.wantCallback = document.getElementById('callbackCheckbox').checked;
        console.log('Contact form:', data);
        
        showToast('📞 Mesajul a fost trimis! Echipa Spartan Camp te va contacta.');
        form.reset();
        document.getElementById('callbackCheckbox').checked = true;
    });
}

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ═══════════════════════════════════════════════════════════
   PARALLAX — Cinematic depth
   ═══════════════════════════════════════════════════════════ */
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        if (scrolled < heroHeight) {
            const progress = scrolled / heroHeight;
            const opacity = 1 - progress * 1.5;
            const translateY = scrolled * 0.4;
            const scale = 1 - progress * 0.1;

            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px) scale(${Math.max(0.9, scale)})`;
            
            if (scrollIndicator) {
                scrollIndicator.style.opacity = Math.max(0, 1 - progress * 3);
            }
        }
    }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   TILT CARDS — Mouse-follow 3D effect
   ═══════════════════════════════════════════════════════════ */
function initTiltCards() {
    const cards = document.querySelectorAll('.exp-card, .ticket-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS — Subtle pull toward cursor
   ═══════════════════════════════════════════════════════════ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-glow, .nav-cta');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   TEXT GLITCH — Military style on section tags
   ═══════════════════════════════════════════════════════════ */
function initTextGlitch() {
    const tags = document.querySelectorAll('.section-tag');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                let iterations = 0;
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
                
                const interval = setInterval(() => {
                    // Get only regular text nodes (skip ::before/::after pseudo elements)
                    const scrambled = text.split('').map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iterations) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');
                    
                    el.textContent = scrambled;
                    iterations += 1;
                    
                    if (iterations > text.length) {
                        clearInterval(interval);
                        el.textContent = text;
                    }
                }, 35);
                
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    tags.forEach(tag => observer.observe(tag));
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL — Offset for fixed navbar
   ═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

/* ═══════════════════════════════════════════════════════════
   CURSOR GLOW — Custom cursor trail on hero
   ═══════════════════════════════════════════════════════════ */
(function initCursorGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(232, 122, 30, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: 2;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    hero.appendChild(glow);

    hero.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
})();
