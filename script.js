document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
    
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const body = document.querySelector('body');

    // ZMIANA (Mobile UX): Sprawdzamy, czy urządzenie NIE jest dotykowe (ma precyzyjny wskaźnik)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (cursorDot && cursorOutline && !isTouchDevice) {
        
        // Aktywuj ukrywanie kursora systemowego TYLKO na desktopie
        body.classList.add('js-cursor-active');

        // Logika wydajnej animacji kursora (rAF)
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        };
        
        requestAnimationFrame(animateCursor); // Uruchom animację

        // Listenery 'interact' i 'visibility' również opakowujemy w warunek
        document.addEventListener('mouseenter', () => body.classList.add('cursor-visible'));
        document.addEventListener('mouseleave', () => body.classList.remove('cursor-visible'));

        const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .blog-card, .process-card, .faq-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => body.classList.add('cursor-interact'));
            el.addEventListener('mouseleave', () => body.classList.remove('cursor-interact'));
        });

    } 
    // KONIEC ZMIANY (Mobile UX Kursor)
    

    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if(themeToggleBtn) { // Sprawdzenie
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.remove('light-theme');
            if(lightIcon) lightIcon.classList.remove('hidden');
            if(darkIcon) darkIcon.classList.add('hidden');
        } else {
            document.documentElement.classList.add('light-theme');
            if(lightIcon) lightIcon.classList.add('hidden');
            if(darkIcon) darkIcon.classList.remove('hidden');
        }

        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-theme');
            const isLight = document.documentElement.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            if(lightIcon) lightIcon.classList.toggle('hidden', isLight);
            if(darkIcon) darkIcon.classList.toggle('hidden', !isLight);
        });
    }

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    animatedElements.forEach(element => observer.observe(element));

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            if (isHidden) {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.setAttribute('aria-label', 'Otwórz menu nawigacyjne');
            } else {
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                mobileMenuButton.setAttribute('aria-label', 'Zamknij menu nawigacyjne');
            }
        });
    }

    const mobileServicesToggle = document.getElementById('mobile-services-toggle');
    const mobileServicesLinks = document.getElementById('mobile-services-links');
    const mobileServicesArrow = document.getElementById('mobile-services-arrow');

    if (mobileServicesToggle && mobileServicesLinks && mobileServicesArrow) {
        mobileServicesLinks.classList.remove('links-open'); // Domyślnie zamknięte
        mobileServicesToggle.setAttribute('aria-expanded', 'false');

        mobileServicesToggle.addEventListener('click', () => {
            mobileServicesLinks.classList.toggle('links-open');
            mobileServicesArrow.classList.toggle('rotate-180');
            const isExpanded = mobileServicesLinks.classList.contains('links-open');
            mobileServicesToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }


    const sliderTrack = document.getElementById('slider-track');
    const logos = [
    "html5", "css", "javascript", "react", "tailwindcss", "nextdotjs", "git", "github", "wordpress", "woocommerce", "php", "typescript",
    ];
    const allLogos = [...logos, ...logos]; 
    if(sliderTrack) {
        sliderTrack.innerHTML = ''; 
        allLogos.forEach(logo => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            const img = document.createElement('img');
            img.src = `https://cdn.simpleicons.org/${logo.replace('_','').replace('w3','')}`; 
            img.alt = logo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            img.title = logo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            img.className = 'tech-logo';
            img.onerror = () => { img.style.display = 'none'; }; 
            slide.appendChild(img);
            sliderTrack.appendChild(slide);
        });
    }
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        const answerId = `faq-answer-${index}`;
        if (answer) { 
            answer.setAttribute('id', answerId);
            question.setAttribute('aria-controls', answerId);
        }
        question.setAttribute('aria-expanded', 'false'); 

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });


    const contactForm = document.getElementById('contact-form'); 
    const formWrapper = document.getElementById('contact-form-wrapper'); 
    const successMessage = document.getElementById('success-message'); 
    
    if (contactForm && formWrapper && successMessage) { 
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formWrapper.style.transition = 'opacity 0.5s ease';
            formWrapper.style.opacity = '0';
            setTimeout(() => {
                formWrapper.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successMessage.style.opacity = '1'; 
            }, 500);
        });
    }

    const progressBar = document.getElementById('scroll-progress-bar');
    let isScrolling = false; 
    
    window.addEventListener('scroll', () => {
        if (!isScrolling && progressBar) { 
            window.requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                
                if (scrollHeight > 0) {
                    const scrollPercent = (scrollTop / scrollHeight) * 100;
                    progressBar.style.width = `${scrollPercent}%`;
                } else {
                    progressBar.style.width = `0%`; 
                }
                
                isScrolling = false; 
            });
            isScrolling = true; 
        }
    });


    const subtitles = [
        "Kreatywny Developer",
        "Grafik Komputerowy",
        "Specjalista SEO" 
    ];
    let subtitleIndex = 0;
    const subtitleElement = document.getElementById('animated-subtitle');
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (subtitleElement && !mediaQuery.matches) { 
        const changeSubtitle = () => {
             subtitleIndex = (subtitleIndex + 1) % subtitles.length;
            subtitleElement.style.opacity = '0';
            setTimeout(() => {
                subtitleElement.textContent = subtitles[subtitleIndex];
                subtitleElement.style.opacity = '1';
            }, 400); 
        };
        changeSubtitle(); 
        setInterval(changeSubtitle, 3000); 
    } else if (subtitleElement) {
        subtitleElement.style.opacity = '1'; 
    }


    const tiltImages = document.querySelectorAll('#about-me-image'); 
    if(tiltImages.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { 
        VanillaTilt.init(tiltImages, {
            max: 8, 
            speed: 600, 
            glare: true,
            "max-glare": 0.3 
        });
    }

    // --- Logika dla banneru Cookie ---
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');

    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax; Secure"; 
    };

    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    if (cookieBanner && acceptCookiesBtn && declineCookiesBtn) {
        if (!getCookie('cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500); 
        }

        acceptCookiesBtn.addEventListener('click', () => {
            setCookie('cookie_consent', 'accepted', 365);
            cookieBanner.classList.remove('show');
            console.log("Cookies accepted."); 
        });

        declineCookiesBtn.addEventListener('click', () => {
            setCookie('cookie_consent', 'declined', 365); 
            cookieBanner.classList.remove('show');
            console.log("Cookies declined.");
        });
    }
    
    // --- Logika formularza wieloetapowego ---
    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        const steps = multiStepForm.querySelectorAll('.form-step');
        const nextBtns = multiStepForm.querySelectorAll('.next-btn');
        const prevBtns = multiStepForm.querySelectorAll('.prev-btn');
        const progressBar = multiStepForm.querySelector('#progress-bar');
        const progressText = multiStepForm.querySelector('#progress-text');
        
        const briefFormWrapper = document.getElementById('brief-form-wrapper'); 
        const successBriefMessage = briefFormWrapper ? briefFormWrapper.querySelector('#success-message') : null; 

        let currentStep = 0;
        const totalSteps = steps.length;

        const updateStepDisplay = () => {
            steps.forEach((step, index) => {
                step.classList.toggle('active-step', index === currentStep);
            });
            const progress = ((currentStep + 1) / totalSteps) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Krok ${currentStep + 1}/${totalSteps}`;
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const inputs = steps[currentStep].querySelectorAll('[required]');
                let isValid = true;
                inputs.forEach(input => {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        const groupName = input.name;
                        if (!multiStepForm.querySelector(`input[name="${groupName}"]:checked`)) {
                            isValid = false;
                        }
                    } else if (!input.value) {
                        isValid = false;
                    }
                });

                if (isValid && currentStep < totalSteps - 1) {
                    currentStep++;
                    updateStepDisplay();
                } else if (!isValid) {
                    // alert('Proszę wypełnić wymagane pola.'); 
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateStepDisplay();
                }
            });
        });

        multiStepForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = steps[currentStep].querySelectorAll('[required]');
            let isValid = true;
            inputs.forEach(input => {
                if (input.type === 'checkbox' && !input.checked) {
                    isValid = false;
                } else if (input.type !== 'checkbox' && !input.value) {
                    isValid = false;
                }
            });

            if (isValid) {
                console.log('Formularz wysłany:', new FormData(multiStepForm));
                
                if (briefFormWrapper && successBriefMessage) {
                    multiStepForm.style.transition = 'opacity 0.5s ease';
                    multiStepForm.style.opacity = '0';
                    setTimeout(() => {
                        multiStepForm.classList.add('hidden');
                        successBriefMessage.classList.remove('hidden');
                        successBriefMessage.style.opacity = '1';
                    }, 500);
                }
            } else {
                 // alert('Proszę wypełnić wymagane pola i zaakceptować zgodę.');
            }
        });

        if(steps.length > 0) { 
            updateStepDisplay();
        }
    }

    // --- Inicjalizacja Swipera ---
    if (typeof Swiper !== 'undefined') {
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            new Swiper('.testimonial-slider', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 30,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    }
                }
            });
        }
    } else {
        console.warn('Swiper JS nie został załadowany.');
    }


});
