// Smooth scrolling for navigation
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

// Scroll to contact function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Animals Carousel functionality
let currentSlide = 0;
let carouselInterval;

function initAnimalsCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    // Handle image loading errors
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('error', function() {
                // Create fallback SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', '0 0 400 400');
                svg.style.width = '100%';
                svg.style.height = '100%';
                
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('width', '400');
                rect.setAttribute('height', '400');
                rect.setAttribute('fill', '#f3f4f6');
                
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', '200');
                text.setAttribute('y', '200');
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('fill', '#6b7280');
                text.setAttribute('font-family', 'Arial');
                text.setAttribute('font-size', '24');
                text.textContent = '🖼️';
                
                svg.appendChild(rect);
                svg.appendChild(text);
                
                // Replace broken image with SVG
                img.style.display = 'none';
                slide.appendChild(svg);
            });
        }
    });
    
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
        
        // Reset and start progress bar for new slide
        resetProgressBar();
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function previousSlide() {
        const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
        showSlide(prevIndex);
    }
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetCarouselTimer();
        });
    });
    
    // Auto-advance slides every 4 seconds
    function startCarouselTimer() {
        carouselInterval = setInterval(nextSlide, 4000);
        animateProgressBar();
    }
    
    function resetCarouselTimer() {
        clearInterval(carouselInterval);
        startCarouselTimer();
    }
    
    function resetProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.transition = 'width 4s linear';
                progressBar.style.width = '100%';
            }, 50);
        }
    }
    
    function animateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'width 4s linear';
            progressBar.style.width = '100%';
        }
    }
    
    // Add hover pause functionality
    const carousel = document.querySelector('.animals-carousel');
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
        // Pause progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'none';
        }
    });
    
    carousel.addEventListener('mouseleave', () => {
        startCarouselTimer();
    });
    
    // Initialize first slide and start timer
    showSlide(0);
    startCarouselTimer();
    
    // Make functions globally available
    window.nextSlide = nextSlide;
    window.previousSlide = previousSlide;
    window.startCarouselTimer = startCarouselTimer;
}



// Add event listeners for buttons
function addButtonEventListeners() {
    // CTA button for scrolling to contact
    const ctaButton = document.querySelector('[data-action="scroll-to-contact"]');
    if (ctaButton) {
        ctaButton.addEventListener('click', scrollToContact);
    }
    
    // Carousel navigation buttons
    const prevBtn = document.querySelector('[data-action="previous-slide"]');
    const nextBtn = document.querySelector('[data-action="next-slide"]');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (window.previousSlide) {
                window.previousSlide();
                // Reset timer when manually navigating
                const carousel = document.querySelector('.animals-carousel');
                if (carousel) {
                    clearInterval(carouselInterval);
                    setTimeout(() => {
                        if (window.startCarouselTimer) window.startCarouselTimer();
                    }, 100);
                }
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (window.nextSlide) {
                window.nextSlide();
                // Reset timer when manually navigating
                const carousel = document.querySelector('.animals-carousel');
                if (carousel) {
                    clearInterval(carouselInterval);
                    setTimeout(() => {
                        if (window.startCarouselTimer) window.startCarouselTimer();
                    }, 100);
                }
            }
        });
    }
}

// Show message function
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert before form
    appointmentForm.insertBefore(message, appointmentForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and other elements
document.addEventListener('DOMContentLoaded', function() {
    // Observe elements for animations
    document.querySelectorAll('.service-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
    
    // Add event listeners for buttons
    addButtonEventListeners();
    
    // Initialize appointment modal
    initAppointmentModal();
    
    // Initialize animals carousel
    initAnimalsCarousel();
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover effects to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Utility function for smooth animations
function animateElement(element, animation, duration = 1000) {
    element.style.animation = `${animation} ${duration}ms ease-out`;
    setTimeout(() => {
        element.style.animation = '';
    }, duration);
}

// Add loading states to form
function setFormLoading(loading) {
    const submitBtn = document.querySelector('#appointmentModalForm .submit-btn');
    if (submitBtn) {
        if (loading) {
            submitBtn.innerHTML = '<span class="loading"></span> Отправка...';
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
            submitBtn.disabled = false;
        }
    }
}

// Модальное окно записи на прием
function initAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    const openModalBtn = document.querySelector('.cta-button');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('appointmentModalForm');
    const phoneDisplay = document.getElementById('phoneDisplay');
    
    // Открытие модального окна
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку
        });
    }
    
    // Закрытие модального окна
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Возвращаем прокрутку
            // Сбрасываем форму и скрываем номер телефона
            form.reset();
            phoneDisplay.style.display = 'none';
            form.style.display = 'block';
        });
    }
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            form.reset();
            phoneDisplay.style.display = 'none';
            form.style.display = 'block';
        }
    });
    
    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                petName: formData.get('petName'),
                petType: formData.get('petType'),
                message: formData.get('message')
            };
            
            try {
                // Временно сохраняем данные в localStorage для демонстрации
                // В реальном проекте здесь будет API вызов
                const clients = JSON.parse(localStorage.getItem('clients') || '[]');
                const newClient = {
                    id: Date.now(),
                    ...data,
                    created_at: new Date().toISOString()
                };
                clients.push(newClient);
                localStorage.setItem('clients', JSON.stringify(clients));
                
                // Показываем успешное сообщение
                form.style.display = 'none';
                phoneDisplay.style.display = 'block';
                
                // Автоматически закрываем модальное окно через 5 секунд
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    form.reset();
                    phoneDisplay.style.display = 'none';
                    form.style.display = 'block';
                }, 5000);
                
                // В реальном проекте здесь будет:
                // const response = await fetch('https://your-api.vercel.app/api/clients', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('Ошибка при сохранении заявки', 'error');
            }
        });
    }
}

// Функция показа сообщений для модального окна
function showMessage(text, type) {
    // Удаляем существующие сообщения
    const existingMessage = document.querySelector('.modal-body .message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Создаем новое сообщение
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Вставляем в модальное окно
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
        modalBody.insertBefore(message, modalBody.firstChild);
    }
    
    // Автоматически убираем через 5 секунд
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
} 