'use strict';

/* ============================================
   1) IntersectionObserver — activate slides
   ============================================ */
const slides = document.querySelectorAll('[data-slide]');
const dots = document.querySelectorAll('[data-dot]');
const scrollHint = document.querySelector('.scroll-hint');
const scroller = document.querySelector('[data-scroller]');

let currentIndex = 0;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');

            const idx = [...slides].indexOf(entry.target);
            if (idx !== -1) {
                currentIndex = idx;
                updateDots(idx);
                animateSkills(entry.target);
            }

            if (scrollHint) {
                scrollHint.classList.toggle('hidden', idx > 0);
            }
        } else {
            entry.target.classList.remove('in-view');
        }
    });
}, {
    root: scroller,
    threshold: 0.5
});

slides.forEach(slide => observer.observe(slide));

/* ============================================
   2) Side dots
   ============================================ */
function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const i = parseInt(dot.dataset.dot, 10);
        slides[i]?.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ============================================
   3) "View work" button
   ============================================ */
document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const i = parseInt(btn.dataset.scrollTo, 10);
        slides[i]?.scrollIntoView({ behavior: 'smooth' });
    });
});

/* ============================================
   4) Skill bars animation
   ============================================ */
function animateSkills(slide) {
    const fills = slide.querySelectorAll('.skill-fill');
    if (!fills.length) return;

    fills.forEach(f => { f.style.width = '0'; });

    requestAnimationFrame(() => {
        setTimeout(() => {
            fills.forEach(f => {
                f.style.width = f.dataset.fill + '%';
            });
        }, 300);
    });
}

/* ============================================
   5) Contact form validation
   ============================================ */
const form = document.querySelector('[data-form]');
const inputs = document.querySelectorAll('[data-input]');
const submitBtn = document.querySelector('[data-submit]');

if (form) {
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            submitBtn.disabled = !form.checkValidity();
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        submitBtn.textContent = 'Sent ✓';
        submitBtn.disabled = true;
        setTimeout(() => {
            form.reset();
            submitBtn.textContent = 'Send message';
            submitBtn.disabled = true;
        }, 1800);
    });
}

/* ============================================
   6) Keyboard navigation
   ============================================ */
document.addEventListener('keydown', e => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (currentIndex < slides.length - 1) {
            e.preventDefault();
            currentIndex++;
            slides[currentIndex].scrollIntoView({ behavior: 'smooth' });
        }
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (currentIndex > 0) {
            e.preventDefault();
            currentIndex--;
            slides[currentIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }
});

/* ============================================
   7) First slide visible on load
   ============================================ */
window.addEventListener('load', () => {
    slides[0]?.classList.add('in-view');
});