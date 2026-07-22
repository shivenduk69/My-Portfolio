document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const header = document.getElementById('header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const typingTextElement = document.getElementById('typing-text');
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit-btn');
    const formSuccessAlert = document.getElementById('form-success-alert');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const skillBars = document.querySelectorAll('.skill-bar');

    // ==========================================================================
    // THEME CONFIGURATION (LIGHT / DARK MODE)
    // ==========================================================================
    // Retrieve theme preference from localStorage or fallback to default 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (theme === 'dark') {
            newTheme = 'light';
        }
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // STICKY HEADER SCROLL EFFECT
    // ==========================================================================
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Call immediately on page load to check initial position

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER TOGGLE
    // ==========================================================================
    const toggleMobileMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation links (primarily for mobile viewports)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    });

    // ==========================================================================
    // DYNAMIC TYPING EFFECT
    // ==========================================================================
    const professions = [
        'Data Science & ML',
        'Machine Learning Models',
        'Interactive Dashboards',
        'Data Analytics',
        'Algorithms & DSA'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentWord = professions[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster than writing
        } else {
            // Add character
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // State: Word is completely typed
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at end of completed word
            isDeleting = true;
        } 
        // State: Word is completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % professions.length; // Rotate index
            typingSpeed = 500; // Small pause before beginning next word
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingTextElement) {
        setTimeout(typeEffect, 1000); // Start typing loop after brief startup delay
    }

    // ==========================================================================
    // ACTIVE NAVIGATION LINK IN-VIEWPORT TRACKER
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const trackActiveNavLink = () => {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 120; // Include header padding offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', trackActiveNavLink);
    trackActiveNavLink();

    // ==========================================================================
    // REVEAL ON SCROLL & PROGRESS BAR FILL ANIMATIONS
    // ==========================================================================
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If this is the about section / skills wrapper, trigger skills bars fill
                if (entry.target.classList.contains('skills-wrapper') || entry.target.querySelector('.skill-bar')) {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Trigger once per load
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Also observe the skills wrapper container directly
    const skillsContainer = document.querySelector('.skills-wrapper');
    if (skillsContainer) {
        animationObserver.observe(skillsContainer);
    }

    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const progressWidth = bar.getAttribute('data-progress');
            bar.style.width = progressWidth;
        });
    };

    // ==========================================================================
    // CONTACT FORM INTERACTION & VALIDATION
    // ==========================================================================
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload on submit

            // Retrieve form values
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            // Reset error displays
            const errors = document.querySelectorAll('.error-msg');
            errors.forEach(err => err.style.display = 'none');
            
            // Validation states
            let isValid = true;

            // Name validation
            if (!nameInput.value.trim()) {
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }

            // Subject validation
            if (!subjectInput.value.trim()) {
                document.getElementById('subject-error').style.display = 'block';
                isValid = false;
            }

            // Message validation (min 10 characters)
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Change submit button to loading state
                const originalBtnContent = formSubmitBtn.innerHTML;
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = `
                    <span>Sending...</span>
                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                `;

                // Send form data to FormSubmit.co AJAX API
                fetch("https://formsubmit.co/ajax/shivenduk69@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        name: nameInput.value.trim(),
                        email: emailInput.value.trim(),
                        subject: subjectInput.value.trim(),
                        message: messageInput.value.trim(),
                        _captcha: "false" // Disable captcha for a cleaner flow
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    // Reset form and show completion success alert container
                    contactForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = originalBtnContent;
                    
                    formSuccessAlert.classList.remove('hidden');

                    // Automatically hide success alert after 6 seconds
                    setTimeout(() => {
                        formSuccessAlert.classList.add('hidden');
                    }, 6000);
                })
                .catch(error => {
                    console.warn("AJAX submission failed, falling back to native submission (usually due to running from a local file:/// context):", error);
                    
                    // Create and append a hidden input to disable captcha for the fallback flow
                    if (!contactForm.querySelector('input[name="_captcha"]')) {
                        const captchaInput = document.createElement("input");
                        captchaInput.type = "hidden";
                        captchaInput.name = "_captcha";
                        captchaInput.value = "false";
                        contactForm.appendChild(captchaInput);
                    }
                    
                    // Trigger a standard page-redirect post to FormSubmit
                    contactForm.action = "https://formsubmit.co/shivenduk69@gmail.com";
                    contactForm.method = "POST";
                    
                    // Reset button state just before unload/redirect
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = originalBtnContent;
                    
                    contactForm.submit();
                });
            }
        });
    }

    // ==========================================================================
    // DYNAMIC PROJECT FILTERING SYSTEM
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-categories') || '';
                    const categoriesList = cardCategories.split(' ');

                    if (filterValue === 'all' || categoriesList.includes(filterValue)) {
                        card.classList.remove('hidden-filter');
                        card.classList.add('filter-show');
                    } else {
                        card.classList.add('hidden-filter');
                        card.classList.remove('filter-show');
                    }
                });
            });
        });
    }
});
