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

    // ZMIANA (Wydajność): Dodajemy klasę do body TYLKO jeśli JS i kursor działają.
    // CSS będzie teraz ukrywał domyślny kursor tylko dla 'body.js-cursor-active'
    if (cursorDot && cursorOutline) {
         body.classList.add('js-cursor-active');
    }

    // ZMIANA (Wydajność): Zastępujemy 'mousemove' + '.animate()'
    // pętlą 'requestAnimationFrame' (rAF) dla płynnej i wydajnej animacji kursora.
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Funkcja pętli animacji
    const animateCursor = () => {
        // Aktualizacja kropki (natychmiast)
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Płynne podążanie obramowania (lerp - interpolacja liniowa)
        // Dostosuj '0.1' (0.1 = wolniej, 0.9 = szybciej) dla pożądanego efektu 'opóźnienia'
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    };
    
    // Uruchom pętlę animacji tylko raz
    requestAnimationFrame(animateCursor);
    // KONIEC ZMIANY (Wydajność Kursor)


    document.addEventListener('mouseenter', () => body.classList.add('cursor-visible'));
    document.addEventListener('mouseleave', () => body.classList.remove('cursor-visible'));

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .blog-card, .process-card, .faq-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => body.classList.add('cursor-interact'));
        el.addEventListener('mouseleave', () => body.classList.remove('cursor-interact'));
    });

    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.remove('light-theme');
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.add('light-theme');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-theme');
        const isLight = document.documentElement.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        lightIcon.classList.toggle('hidden', isLight);
        darkIcon.classList.toggle('hidden', !isLight);
    });

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
    
    // ZMIANA (WCAG): Zarządzanie atrybutami aria-expanded i aria-label dla menu mobilnego
    if (mobileMenuButton && mobileMenu) { // Dodano sprawdzenie
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

    // ZMIANA (Nowa logika): Obsługa rozwijanego menu Usługi w wersji mobilnej
    const mobileServicesToggle = document.getElementById('mobile-services-toggle');
    const mobileServicesLinks = document.getElementById('mobile-services-links');
    const mobileServicesArrow = document.getElementById('mobile-services-arrow');

    if (mobileServicesToggle && mobileServicesLinks && mobileServicesArrow) {
        // Domyślnie ukryj
        mobileServicesLinks.classList.remove('links-open');
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
        "figma", "blender", "adobe_photoshop", "w3_html5", 
        "w3_css", "javascript", "reactjs", "tailwindcss"
    ];
    const allLogos = [...logos, ...logos]; // Duplikujemy listę dla płynnego przewijania
    // Wyczyść istniejące loga, jeśli są
    if(sliderTrack) {
        sliderTrack.innerHTML = ''; 
        allLogos.forEach(logo => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            const img = document.createElement('img');
            // Używamy ikonek SVG dla lepszej jakości
            img.src = `https://cdn.simpleicons.org/${logo.replace('_','').replace('w3','')}`; 
            img.alt = logo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            img.title = logo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            img.className = 'tech-logo';
            // Dodaj obsługę błędów ładowania obrazka
            img.onerror = () => { img.style.display = 'none'; }; 
            slide.appendChild(img);
            sliderTrack.appendChild(slide);
        });
    }
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    // ZMIANA (WCAG): Logika FAQ zarządzająca atrybutami aria-expanded i aria-controls
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Unikalne ID dla powiązania pytania z odpowiedzią
        const answerId = `faq-answer-${index}`;
        if (answer) { // Sprawdź czy odpowiedź istnieje
            answer.setAttribute('id', answerId);
            question.setAttribute('aria-controls', answerId);
        }
        question.setAttribute('aria-expanded', 'false'); // Domyślnie zamknięte

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Najpierw zamknij wszystkie inne
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Otwórz kliknięty (jeśli nie był już otwarty)
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
    // KONIEC ZMIANY (WCAG FAQ)


    const contactForm = document.getElementById('contact-form'); // UWAGA: Ten ID nie istnieje w HTML
    const formWrapper = document.getElementById('contact-form-wrapper'); // UWAGA: Ten ID nie istnieje w HTML
    const successMessage = document.getElementById('success-message'); // Ten ID istnieje, ale w formularzu briefu
    
    // Upewnij się, że ten formularz istnieje, zanim dodasz listener
    if (contactForm && formWrapper && successMessage) { 
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Tu zazwyczaj byłby kod wysyłający formularz, np. przez fetch()
            // Na potrzeby demo, od razu pokazujemy komunikat sukcesu
            formWrapper.style.transition = 'opacity 0.5s ease';
            formWrapper.style.opacity = '0';
            setTimeout(() => {
                formWrapper.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successMessage.style.opacity = '1'; // Dodaj płynne pojawienie się
            }, 500);
        });
    }

    const progressBar = document.getElementById('scroll-progress-bar');
    
    // ZMIANA (Wydajność): Throttling zdarzenia 'scroll' za pomocą requestAnimationFrame
    let isScrolling = false; // Flaga do throttlingu
    
    window.addEventListener('scroll', () => {
        if (!isScrolling && progressBar) { // Dodano sprawdzenie
            window.requestAnimationFrame(() => {
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                
                if (scrollHeight > 0) {
                    const scrollPercent = (scrollTop / scrollHeight) * 100;
                    progressBar.style.width = `${scrollPercent}%`;
                } else {
                    progressBar.style.width = `0%`; // Resetuj pasek, jeśli nie ma przewijania
                }
                
                isScrolling = false; // Zezwól na kolejną klatkę
            });
            isScrolling = true; // Zablokuj do następnej klatki
        }
    });
    // KONIEC ZMIANY (Wydajność Scroll)


    const subtitles = [
        "Kreatywny Developer",
        "Grafik Komputerowy",
        "Specjalista SEO" // Zaktualizowano!
    ];
    let subtitleIndex = 0;
    const subtitleElement = document.getElementById('animated-subtitle');
    
    // ZMIANA (WCAG): Sprawdzenie preferencji użytkownika dot. redukcji ruchu
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (subtitleElement && !mediaQuery.matches) { // Uruchom animację TYLKO jeśli ruch NIE jest zredukowany
        const changeSubtitle = () => {
             subtitleIndex = (subtitleIndex + 1) % subtitles.length;
            subtitleElement.style.opacity = '0';
            setTimeout(() => {
                subtitleElement.textContent = subtitles[subtitleIndex];
                subtitleElement.style.opacity = '1';
            }, 400); // Czas na fade-out
        };
        // Uruchom od razu i potem co 3 sekundy
        changeSubtitle(); 
        setInterval(changeSubtitle, 3000); 
    } else if (subtitleElement) {
        // Jeśli ruch jest zredukowany, po prostu ustaw pierwszy (lub domyślny) podtytuł
        // subtitleElement.textContent = subtitles[0]; // Lub zostaw ten z HTML
        subtitleElement.style.opacity = '1'; // Upewnij się, że jest widoczny
    }
    // KONIEC ZMIANY (WCAG prefers-reduced-motion)


    // --- Inicjalizacja efektu 3D (Tilt) ---
    // ZMIANA: Inicjalizuj wszystkie elementy z tym ID, nie tylko pierwszy
    const tiltImages = document.querySelectorAll('#about-me-image'); 
    if(tiltImages.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) { // Sprawdź preferencje ruchu
        VanillaTilt.init(tiltImages, {
            max: 8, // Zmniejszono intensywność
            speed: 600, // Spowolniono
            glare: true,
            "max-glare": 0.3 // Zmniejszono blask
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
        // Dodano SameSite=Lax i Secure dla bezpieczeństwa i zgodności z przeglądarkami
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

    // Sprawdź czy banner istnieje zanim dodasz logikę
    if (cookieBanner && acceptCookiesBtn && declineCookiesBtn) {
        if (!getCookie('cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1500); // Szybsze pojawienie się banera
        }

        acceptCookiesBtn.addEventListener('click', () => {
            setCookie('cookie_consent', 'accepted', 365);
            cookieBanner.classList.remove('show');
            // Tutaj można dodać inicjalizację skryptów śledzących, jeśli zgoda została udzielona
            console.log("Cookies accepted."); 
        });

        declineCookiesBtn.addEventListener('click', () => {
            setCookie('cookie_consent', 'declined', 365); 
            cookieBanner.classList.remove('show');
            // Tutaj można dodać logikę blokującą skrypty śledzące
            console.log("Cookies declined.");
        });
    }
    
    // ZMIANA (Nowa logika): Zarządzanie formularzem wieloetapowym
    // Ta logika była całkowicie pominięta w oryginalnym pliku script.js
    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        const steps = multiStepForm.querySelectorAll('.form-step');
        const nextBtns = multiStepForm.querySelectorAll('.next-btn');
        const prevBtns = multiStepForm.querySelectorAll('.prev-btn');
        const progressBar = multiStepForm.querySelector('#progress-bar');
        const progressText = multiStepForm.querySelector('#progress-text');
        
        const briefFormWrapper = document.getElementById('brief-form-wrapper'); // Wrapper formularza briefu
        const successBriefMessage = briefFormWrapper ? briefFormWrapper.querySelector('#success-message') : null; // Komunikat sukcesu z briefu

        let currentStep = 0;
        const totalSteps = steps.length;

        const updateStepDisplay = () => {
            steps.forEach((step, index) => {
                step.classList.toggle('active-step', index === currentStep);
            });
            // Aktualizacja paska postępu
            const progress = ((currentStep + 1) / totalSteps) * 100;
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Krok ${currentStep + 1}/${totalSteps}`;
        };

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Prosta walidacja (upewnij się, że radio jest zaznaczone)
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
                    // Można tu dodać prostą informację o błędzie
                    // alert('Proszę wypełnić wymagane pola.'); // Zakomentowane, by nie irytować
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
            // Walidacja ostatniego kroku
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
                // Symulacja wysyłki
                console.log('Formularz wysłany:', new FormData(multiStepForm));
                
                // Pokaż komunikat sukcesu dla briefu
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
                 // alert('Proszę wypełnić wymagane pola i zaakceptować zgodę.'); // Zakomentowane
            }
        });

        // Pokaż pierwszy krok na starcie
        if(steps.length > 0) { // Upewnij się, że kroki istnieją
            updateStepDisplay();
        }
    }
    // KONIEC ZMIANY (Formularz wieloetapowy)


    // ZMIANA (Nowa logika): Inicjalizacja Swipera
    // Upewnij się, że Swiper jest zdefiniowany (załadowany z CDN)
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
                    // Kiedy szerokość okna >= 768px
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    // Kiedy szerokość okna >= 1024px
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
    // KONIEC ZMIANY (Swiper)

});