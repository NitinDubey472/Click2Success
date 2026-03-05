document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. Scroll Progress Bar
    // =========================================================================
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // =========================================================================
    // 2. Header Scroll State & Mobile Menu
    // =========================================================================
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Header background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // =========================================================================
    // 3. Intersection Observer for Scroll Animations
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');

                // If the element is a counter, trigger the counting animation
                const counterElement = entry.target.querySelector('.counter');
                if (counterElement && !counterElement.classList.contains('counted')) {
                    startCounter(counterElement);
                    counterElement.classList.add('counted');
                }

                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Handle Hero initial reveal sequentially without scroll
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('#hero .reveal');
        heroReveals.forEach(el => el.classList.add('active'));
    }, 100);

    // =========================================================================
    // 4. Counter Animation logic
    // =========================================================================
    function startCounter(counter) {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        let maxSteps = 60; // assume 60fps
        let stepCount = 0;

        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = target * easeProgress;

            // Format to 1 decimal place if it's a float target like 3.5, else integer
            if (target % 1 !== 0) {
                counter.innerText = currentVal.toFixed(1);
            } else {
                counter.innerText = Math.floor(currentVal);
            }

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.innerText = target; // Ensure exact final value
            }
        };

        window.requestAnimationFrame(step);
    }

    // =========================================================================
    // 5. Testimonial Slider logic (Basic)
    // =========================================================================
    const testCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // In mobile view or when wrapping, we can simulate slider by auto-scroll or CSS transform.
    // Since we used wrap layout for <1024px, we just implement a basic highlight or scroll.
    // Let's implement a simple scroll behavior if container overflows.
    const sliderContainer = document.querySelector('.testimonials-slider');

    if (prevBtn && nextBtn && sliderContainer) {
        nextBtn.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            sliderContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    // =========================================================================
    // 6. Form Validation & CTA Alerts
    // =========================================================================
    const newsletterForm = document.getElementById('newsletterForm');
    const formMessage = document.getElementById('formMessage');
    const emailInput = document.getElementById('emailInput');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            // Basic regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                formMessage.textContent = "Success! You are now subscribed.";
                formMessage.className = "form-message success";
                newsletterForm.reset();
                setTimeout(() => { formMessage.textContent = ""; }, 4000);
            } else {
                formMessage.textContent = "Please enter a valid email address.";
                formMessage.className = "form-message error";
            }
        });
    }


});
