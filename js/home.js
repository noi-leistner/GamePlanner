const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let current = 0;

function showTestimonial(index) {
    testimonials[current].classList.remove('active');
    current = (index + testimonials.length) % testimonials.length;
    testimonials[current].classList.add('active');
}

prevBtn.addEventListener('click', () => showTestimonial(current - 1));
nextBtn.addEventListener('click', () => showTestimonial(current + 1));