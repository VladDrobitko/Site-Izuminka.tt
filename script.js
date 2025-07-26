// Простая карусель - полностью переписанная
(function() {
    let currentIndex = 0;
    let isAnimating = false;
    
    function initCarousel() {
        const carousel = document.querySelector('.portfolio-carousel');
        const slides = document.querySelectorAll('.portfolio-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (!carousel || !slides.length || !prevBtn || !nextBtn) {
            console.log('❌ Элементы карусели не найдены');
            return;
        }
        
        console.log('✅ Карусель найдена:', slides.length, 'слайдов');
        
        function getVisibleSlides() {
            const containerWidth = carousel.parentElement.offsetWidth;
            const slideWidth = 280 + 32; // ширина слайда + gap
            return Math.floor(containerWidth / slideWidth) || 1;
        }
        
        function getMaxIndex() {
            const visible = getVisibleSlides();
            return Math.max(0, slides.length - visible);
        }
        
        function updateCarousel() {
            const slideWidth = 280 + 32;
            const translateX = -currentIndex * slideWidth;
            carousel.style.transform = `translateX(${translateX}px)`;
            
            console.log(`📍 Позиция: ${currentIndex}, Transform: ${translateX}px`);
            updateButtons();
        }
        
        function updateButtons() {
            const maxIndex = getMaxIndex();
            
            // Кнопка назад
            if (currentIndex <= 0) {
                prevBtn.style.opacity = '0.4';
                prevBtn.style.pointerEvents = 'none';
                prevBtn.disabled = true;
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.pointerEvents = 'auto';
                prevBtn.disabled = false;
            }
            
            // Кнопка вперед
            if (currentIndex >= maxIndex) {
                nextBtn.style.opacity = '0.4';
                nextBtn.style.pointerEvents = 'none';
                nextBtn.disabled = true;
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.pointerEvents = 'auto';
                nextBtn.disabled = false;
            }
            
            console.log(`🔘 Кнопки: prev=${currentIndex <= 0 ? 'OFF' : 'ON'}, next=${currentIndex >= maxIndex ? 'OFF' : 'ON'}`);
        }
        
        function goToPrev() {
            if (isAnimating || currentIndex <= 0) return;
            
            console.log('⬅️ Движение назад');
            isAnimating = true;
            currentIndex--;
            updateCarousel();
            
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        }
        
        function goToNext() {
            const maxIndex = getMaxIndex();
            if (isAnimating || currentIndex >= maxIndex) return;
            
            console.log('➡️ Движение вперед');
            isAnimating = true;
            currentIndex++;
            updateCarousel();
            
            setTimeout(() => {
                isAnimating = false;
            }, 400);
        }
        
        // Привязка событий
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Клик НАЗАД');
            goToPrev();
        });
        
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Клик ВПЕРЕД');
            goToNext();
        });
        
        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('📱 Resize - пересчет');
                const maxIndex = getMaxIndex();
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
                updateCarousel();
            }, 100);
        });
        
        // Touch support
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', function(e) {
            const portfolioSection = document.getElementById('portfolio');
            if (!portfolioSection) return;
            
            const rect = portfolioSection.getBoundingClientRect();
            const inView = rect.top <= window.innerHeight && rect.bottom >= 0;
            
            if (inView) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goToPrev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goToNext();
                }
            }
        });
        
        // Инициализация
        updateCarousel();
        console.log('🚀 Карусель инициализирована!');
    }
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
})();

// Остальные функции сайта
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initHeaderScroll() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

function initFormHandling() {
    const form = document.querySelector('.booking-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const ageConsent = document.getElementById('age-consent').checked;
            const privacyConsent = document.getElementById('privacy-consent').checked;
            const clientAgreement = document.getElementById('client-agreement').checked;
            
            if (!ageConsent) {
                e.preventDefault();
                alert('Please confirm that you are 18 years or older.');
                return false;
            }
            
            if (!privacyConsent) {
                e.preventDefault();
                alert('Please accept the Privacy Policy to continue.');
                return false;
            }
            
            if (!clientAgreement) {
                e.preventDefault();
                alert('Please read and accept the Client Agreement to continue.');
                return false;
            }
            
            showSuccessMessage();
        });
        
        initRealTimeValidation();
    }
}

function initRealTimeValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';
    
    field.classList.remove('error');
    removeErrorMessage(field);
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    if (fieldType === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (fieldType === 'tel' && value) {
        const phonePattern = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phonePattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

function removeErrorMessage(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            border: 2px solid #d4af37;
        ">
            <h3 style="color: #1a1a1a; margin-bottom: 1rem; font-family: 'Cormorant Garamond', serif;">
                Booking Request Sent!
            </h3>
            <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.5;">
                Thank you for your booking request. I'll review your details and get back to you within 24 hours to discuss your tattoo design.
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #1a1a1a;
                color: white;
                border: none;
                padding: 0.75rem 2rem;
                border-radius: 50px;
                cursor: pointer;
                font-weight: 500;
            ">
                Close
            </button>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.remove();
        }
    }, 5000);
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.portfolio-slide, .detail-item, .contact-item');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initDynamicFormFields() {
    const tattooTypeSelect = document.getElementById('tattoo-type');
    const descriptionField = document.getElementById('description');
    
    if (tattooTypeSelect && descriptionField) {
        tattooTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            let placeholderText = "Describe your tattoo idea...";
            
            switch(selectedType) {
                case 'botanical':
                    placeholderText = "Describe your botanical design - which flowers, plants, or natural elements would you like? Any specific style preferences (realistic, minimalist, etc.)?";
                    break;
                case 'geometric':
                    placeholderText = "Describe your geometric design - what shapes, patterns, or abstract elements appeal to you? Any inspiration images?";
                    break;
                case 'script':
                    placeholderText = "What text would you like tattooed? Please include any specific font preferences, language, or styling details.";
                    break;
                case 'symbolic':
                    placeholderText = "What symbols or meaningful elements would you like included? Please share the personal significance behind your design.";
                    break;
                case 'custom':
                    placeholderText = "Describe your custom design idea in detail. Include any reference images, style preferences, and what makes this design special to you.";
                    break;
                case 'consultation':
                    placeholderText = "What would you like to discuss during the consultation? Any questions about the tattoo process, aftercare, or design ideas?";
                    break;
            }
            
            descriptionField.placeholder = placeholderText;
        });
    }
}

function initDatePicker() {
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
}

function initPortfolioInteractions() {
    const portfolioSlides = document.querySelectorAll('.portfolio-slide');
    
    portfolioSlides.forEach(slide => {
        slide.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            showPortfolioModal(title, description);
        });
    });
}

function showPortfolioModal(title, description) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10000;
            max-width: 500px;
            width: 90%;
        ">
            <h3 style="color: #1a1a1a; margin-bottom: 1rem; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem;">
                ${title}
            </h3>
            <p style="color: #666; margin-bottom: 1.5rem; line-height: 1.6;">
                ${description}
            </p>
            <p style="color: #999; margin-bottom: 1.5rem; font-size: 0.9rem;">
                See more work like this on my Instagram
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: #f5f5f5;
                    color: #666;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 500;
                ">
                    Close
                </button>
                <a href="https://instagram.com/izuminka.tt" target="_blank" style="
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    cursor: pointer;
                    font-weight: 500;
                    text-decoration: none;
                    display: inline-block;
                ">
                    View Instagram
                </a>
            </div>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 9999;
        " onclick="this.parentElement.remove()"></div>
    `;
    
    document.body.appendChild(modal);
}

function addErrorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #e74c3c;
            box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
        }
        
        .error-message {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Инициализация всего остального
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Инициализация сайта...');
    
    addErrorStyles();
    initSmoothScrolling();
    initHeaderScroll();
    initFormHandling();
    initScrollAnimations();
    initDynamicFormFields();
    initDatePicker();
    initPortfolioInteractions();
    
    console.log('✅ Сайт инициализирован');
});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    console.log('🎉 Страница полностью загружена');
});