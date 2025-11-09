// ============================================
// RXT Agency - Main JavaScript
// ============================================

// Global modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Save current scroll position
        const scrollY = window.scrollY;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Restore scroll position
        const scrollY = document.body.style.top;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ============================================
    // Smooth Scroll
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // Animated Counter for Stats
    // ============================================
    let countersAnimated = false;
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Trigger animation on page load
    setTimeout(() => {
        if (!countersAnimated) {
            countersAnimated = true;
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                if (target) {
                    animateCounter(stat, target);
                }
            });
        }
    }, 800);
    
    // ============================================
    // Portfolio Filter
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filterValue = btn.dataset.filter;
                
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.classList.remove('hidden');
                        item.style.display = 'grid';
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
                
                // Reset slider to first visible item
                currentSlide = 0;
                updateSlider();
            });
        });
    }
    
    // ============================================
    // Portfolio Slider
    // ============================================
    const sliderTrack = document.querySelector('.portfolio-track');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const portfolioPrevBtn = document.getElementById('portfolioPrev');
    const portfolioNextBtn = document.getElementById('portfolioNext');
    let currentSlide = 0;
    
    function getVisibleItems() {
        return Array.from(portfolioItems).filter(item => !item.classList.contains('hidden'));
    }
    
    function updateSlider() {
        if (!sliderTrack) return;
        
        const visibleItems = getVisibleItems();
        
        // Calculate offset based on actual element width + gap
        if (visibleItems.length > 0) {
            const firstItem = visibleItems[0];
            const containerWidth = sliderTrack.parentElement.offsetWidth;
            const gap = parseFloat(getComputedStyle(sliderTrack).gap) || 0;
            
            // Each slide takes 100% of container + gap
            const slideOffset = containerWidth + gap;
            const translateValue = currentSlide * slideOffset;
            
            sliderTrack.style.transform = `translateX(-${translateValue}px)`;
        }
        
        // Update all button states
        const buttons = [
            { prev: prevBtn, next: nextBtn },
            { prev: portfolioPrevBtn, next: portfolioNextBtn }
        ];
        
        buttons.forEach(btnPair => {
            if (btnPair.prev && btnPair.next) {
                btnPair.prev.disabled = currentSlide === 0;
                btnPair.next.disabled = currentSlide >= visibleItems.length - 1;
                
                btnPair.prev.style.opacity = currentSlide === 0 ? '0.5' : '1';
                btnPair.next.style.opacity = currentSlide >= visibleItems.length - 1 ? '0.5' : '1';
            }
        });
    }
    
    function goToPrevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    function goToNextSlide() {
        const visibleItems = getVisibleItems();
        if (currentSlide < visibleItems.length - 1) {
            currentSlide++;
            updateSlider();
        }
    }
    
    if (sliderTrack) {
        // Attach listeners to all navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        if (portfolioPrevBtn) portfolioPrevBtn.addEventListener('click', goToPrevSlide);
        if (portfolioNextBtn) portfolioNextBtn.addEventListener('click', goToNextSlide);
        
        // Initialize slider
        updateSlider();
        
        // Update slider on window resize
        window.addEventListener('resize', updateSlider);
        
        // Touch swipe for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderTrack.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderTrack.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left
                goToNextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right
                goToPrevSlide();
            }
        }
    }
    
    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // ============================================
    // Form Validation & Submission
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Phone mask
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('7')) {
                    value = value.substring(1);
                } else if (value.startsWith('8')) {
                    value = value.substring(1);
                }
                
                let formatted = '+7 ';
                if (value.length > 0) {
                    formatted += '(' + value.substring(0, 3);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.substring(8, 10);
                }
                
                e.target.value = formatted;
            });
        }
        
        // Form validation
        function validateField(field) {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            // Remove previous error
            formGroup.classList.remove('error');
            if (errorMessage) errorMessage.textContent = '';
            
            // Check if field is required
            if (field.hasAttribute('required') && !field.value.trim()) {
                formGroup.classList.add('error');
                if (errorMessage) errorMessage.textContent = 'Это поле обязательно для заполнения';
                return false;
            }
            
            // Validate email
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Введите корректный email';
                    return false;
                }
            }
            
            // Validate phone
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/;
                if (!phoneRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Введите корректный телефон';
                    return false;
                }
            }
            
            return true;
        }
        
        // Real-time validation
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
        
        // Form submission
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            formFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            try {
                // Simulate API call (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success modal
                showModal('successModal');
                
                // Reset form
                contactForm.reset();
                
                // Log data (for development)
                console.log('Form submitted:', data);
                
            } catch (error) {
                alert('Произошла ошибка при отправке формы. Попробуйте позже.');
                console.error('Form submission error:', error);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // ============================================
    // Modal
    // ============================================
    
    // Service details data
    const serviceDetails = {
        site: {
            title: 'Сайт под ключ',
            price: 'от 40 000₽',
            duration: '1,5-3 недели',
            features: [
                { title: 'Домен и хостинг в подарок!', description: 'Мы не берем дополнительные средства за домен, хостинг и их подключение!', highlight: true },
                { title: 'Защита для сайта', description: 'Мы шифруем все сайты с помощью SSL сертификата и добавляем HTTPS на сайт!' },
                { title: 'Очень быстрая загрузка!', description: 'Все наши сайты загружаются очень быстро, используя CDN и оптимизированные изображения!' },
                { title: 'Адаптивны на телефон', description: 'Все сайты мы адаптируем на телефон и это уже входит в цену!' },
                { title: 'SEO-оптимизация и структура под Google', description: 'Мы настраиваем базовое SEO: теги, структура, sitemap — чтобы сайт сразу индексировался и начинал приносить трафик.' },
                { title: 'Настройка аналитики и целей', description: 'Подключаем Google Analytics и Pixel — вы сможете видеть, сколько заявок и звонков приходит с сайта.' },
                { title: 'Формы лидов и интеграция с WhatsApp / Telegram', description: 'Все заявки с сайта идут сразу к вам в мессенджер или CRM — без потери ни одного лида.' },
                { title: 'Уникальный дизайн под ваш бизнес', description: 'Мы не используем шаблоны — каждый сайт создаётся индивидуально под ваш стиль и задачи.' },
                { title: 'Правильные тексты, которые продают', description: 'Пишем тексты, которые объясняют вашу услугу простыми словами и повышают доверие клиентов.' },
                { title: 'Техническая поддержка 30 дней', description: 'После запуска мы остаёмся на связи — исправим, подскажем, обновим.' },
                { title: 'Договор и юридическая чистота', description: 'Заключаем официальный договор с каждой компанией. Все работы проводятся на прозрачной, безопасной юридической основе.'},
            ]
        },
        brand: {
            title: 'Бренд под ключ',
            price: 'от 90 000₽',
            duration: '3-4 недели',
            features: [
                { title: 'Фирменный стиль и айдентика', description: 'Разработка уникального визуального образа бренда с учетом целевой аудитории и рынка.' },
                { title: 'Логотип и брендбук', description: 'Создание логотипа и полного руководства по использованию фирменного стиля.' },
                { title: 'Позиционирование на рынке', description: 'Стратегическое определение места бренда на рынке и в сознании потребителей.' },
                { title: 'Премиум-сайт', description: 'Разработка высококачественного сайта с уникальным дизайном и функционалом.' },
                { title: 'Контент-стратегия', description: 'План создания и публикации контента для достижения бизнес-целей.' },
                { title: 'Полный пакет бренда', description: 'Все включено — от концепции до реализации бренда под ключ.' }
            ]
        }
    };
    
    // Open modal from buttons with data-modal attribute
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.dataset.modal;
            const service = btn.dataset.service;
            const serviceType = btn.dataset.serviceType;
            
            // Handle service details modal
            if (modalId === 'serviceDetailsModal' && serviceType) {
                const details = serviceDetails[serviceType];
                const contentDiv = document.getElementById('serviceDetailsContent');
                
                if (details && contentDiv) {
                    let featuresHTML = details.features.map(feature => `
                        <div class="modal-detail-item${feature.highlight ? ' highlight' : ''}">
                            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <div>
                                <h4>${feature.title}</h4>
                                <p>${feature.description}</p>
                            </div>
                        </div>
                    `).join('');
                    
                    contentDiv.innerHTML = `
                        <h2>${details.title}</h2>
                        <div class="service-info">
                            <div class="price-info">${details.price}</div>
                            <div class="duration-info">Срок: ${details.duration}</div>
                        </div>
                        <div class="modal-details-list">
                            ${featuresHTML}
                        </div>
                        <button class="btn btn-primary btn-full" onclick="closeModal('serviceDetailsModal'); setTimeout(() => showModal('orderModal'), 300);">
                            Заказать
                        </button>
                    `;
                }
            }
            
            // Pre-fill service if data-service is provided
            if (service && modalId === 'orderModal') {
                const serviceSelect = document.getElementById('modal-service');
                if (serviceSelect) {
                    const option = Array.from(serviceSelect.options).find(opt => 
                        opt.text.includes(service)
                    );
                    if (option) {
                        serviceSelect.value = option.value;
                    }
                }
            }
            
            showModal(modalId);
        });
    });
    
    // Close modal on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            const modal = overlay.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    // ============================================
    // Modal Order Form Validation & Submission
    // ============================================
    const modalOrderForm = document.getElementById('modalOrderForm');
    
    if (modalOrderForm) {
        // Phone mask for modal
        const modalPhoneInput = document.getElementById('modal-phone');
        if (modalPhoneInput) {
            modalPhoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.startsWith('7')) {
                    value = value.substring(1);
                } else if (value.startsWith('8')) {
                    value = value.substring(1);
                }
                
                let formatted = '+7 ';
                if (value.length > 0) {
                    formatted += '(' + value.substring(0, 3);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.substring(8, 10);
                }
                
                e.target.value = formatted;
            });
        }
        
        // Form validation function (reuse from main form)
        function validateModalField(field) {
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            formGroup.classList.remove('error');
            if (errorMessage) errorMessage.textContent = '';
            
            if (field.hasAttribute('required') && !field.value.trim()) {
                formGroup.classList.add('error');
                if (errorMessage) errorMessage.textContent = 'Это поле обязательно для заполнения';
                return false;
            }
            
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Введите корректный email';
                    return false;
                }
            }
            
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/;
                if (!phoneRegex.test(field.value)) {
                    formGroup.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Введите корректный телефон';
                    return false;
                }
            }
            
            return true;
        }
        
        // Real-time validation for modal form
        const modalFormFields = modalOrderForm.querySelectorAll('input, select, textarea');
        modalFormFields.forEach(field => {
            field.addEventListener('blur', () => validateModalField(field));
            field.addEventListener('input', () => {
                const formGroup = field.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    validateModalField(field);
                }
            });
        });
        
        // Modal form submission
        modalOrderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            modalFormFields.forEach(field => {
                if (!validateModalField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            // Collect form data
            const formData = new FormData(modalOrderForm);
            const data = Object.fromEntries(formData);
            
            // Disable submit button
            const submitBtn = modalOrderForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Close order modal
                closeModal('orderModal');
                
                // Show success modal
                setTimeout(() => {
                    showModal('successModal');
                }, 300);
                
                // Reset form
                modalOrderForm.reset();
                
                console.log('Modal form submitted:', data);
                
            } catch (error) {
                alert('Произошла ошибка при отправке формы. Попробуйте позже.');
                console.error('Form submission error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // ============================================
    // Social Widget Toggle
    // ============================================
    const socialWidget = document.querySelector('.social-widget');
    const socialToggle = document.querySelector('.social-widget-toggle');
    
    if (socialToggle) {
        socialToggle.addEventListener('click', () => {
            socialWidget.classList.toggle('active');
        });
        
        // Close widget when clicking outside
        document.addEventListener('click', (e) => {
            if (!socialWidget.contains(e.target)) {
                socialWidget.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // Scroll Reveal Animation
    // ============================================
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
    
    // Add scroll-reveal class to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('scroll-reveal');
        observer.observe(section);
    });
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('scroll-reveal');
        observer.observe(card);
    });
    
    // Observe process steps
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.1}s`;
        step.classList.add('scroll-reveal');
        observer.observe(step);
    });
    
    // Observe review cards
    const allReviewCards = document.querySelectorAll('.review-card');
    allReviewCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        card.classList.add('scroll-reveal');
        observer.observe(card);
    });
    
    // ============================================
    // Lazy Loading Images
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ============================================
    // Performance: Debounce scroll events
    // ============================================
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debounce to scroll-heavy functions
    const debouncedScroll = debounce(() => {
        // Any scroll-dependent updates can go here
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
    
    // ============================================
    // Reviews Slider
    // ============================================
    const reviewsTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewsPrev = document.querySelector('.reviews-prev');
    const reviewsNext = document.querySelector('.reviews-next');
    const reviewsDots = document.querySelector('.reviews-dots');
    
    let currentReviewSlide = 0;
    const reviewsPerView = window.innerWidth > 768 ? 2 : 1;
    const totalReviewSlides = Math.ceil(reviewCards.length / reviewsPerView);
    
    // Create dots
    if (reviewsDots) {
        for (let i = 0; i < totalReviewSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('review-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentReviewSlide = i;
                updateReviewsSlider();
            });
            reviewsDots.appendChild(dot);
        }
    }
    
    function updateReviewsSlider() {
        if (!reviewsTrack || reviewCards.length === 0) return;
        
        const cardWidth = reviewCards[0].offsetWidth;
        const gap = 32; // var(--spacing-lg)
        const slideWidth = cardWidth + gap;
        const offset = currentReviewSlide * slideWidth * reviewsPerView;
        reviewsTrack.style.transform = `translateX(-${offset}px)`;
        
        // Update dots
        const dots = document.querySelectorAll('.review-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentReviewSlide);
        });
        
        // Update button states
        if (reviewsPrev) {
            reviewsPrev.disabled = currentReviewSlide === 0;
            reviewsPrev.style.opacity = currentReviewSlide === 0 ? '0.5' : '1';
        }
        if (reviewsNext) {
            reviewsNext.disabled = currentReviewSlide >= totalReviewSlides - 1;
            reviewsNext.style.opacity = currentReviewSlide >= totalReviewSlides - 1 ? '0.5' : '1';
        }
    }
    
    if (reviewsPrev) {
        reviewsPrev.addEventListener('click', () => {
            if (currentReviewSlide > 0) {
                currentReviewSlide--;
                updateReviewsSlider();
            }
        });
    }
    
    if (reviewsNext) {
        reviewsNext.addEventListener('click', () => {
            if (currentReviewSlide < totalReviewSlides - 1) {
                currentReviewSlide++;
                updateReviewsSlider();
            }
        });
    }
    
    // Touch swipe for reviews
    let reviewTouchStartX = 0;
    let reviewTouchEndX = 0;
    
    if (reviewsTrack) {
        reviewsTrack.addEventListener('touchstart', e => {
            reviewTouchStartX = e.changedTouches[0].screenX;
        });
        
        reviewsTrack.addEventListener('touchend', e => {
            reviewTouchEndX = e.changedTouches[0].screenX;
            handleReviewSwipe();
        });
        
        function handleReviewSwipe() {
            if (reviewTouchEndX < reviewTouchStartX - 50) {
                // Swipe left
                if (currentReviewSlide < totalReviewSlides - 1) {
                    currentReviewSlide++;
                    updateReviewsSlider();
                }
            }
            if (reviewTouchEndX > reviewTouchStartX + 50) {
                // Swipe right
                if (currentReviewSlide > 0) {
                    currentReviewSlide--;
                    updateReviewsSlider();
                }
            }
        }
    }
    
    // ============================================
    // Console message
    // ============================================
    console.log('%c🚀 RXT Agency', 'font-size: 20px; font-weight: bold; color: #a129f3;');
    console.log('%cСайт разработан RXT Agency', 'font-size: 12px; color: #999;');    
});
