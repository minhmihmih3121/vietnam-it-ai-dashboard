// Vietnamese IT/AI Job Market Dashboard - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-color-scheme', savedTheme);
    updateThemeToggleIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    });
    
    function updateThemeToggleIcon(theme) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('.section');
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Animate stat cards on scroll
    const statCards = document.querySelectorAll('.stat-card');
    const skillCards = document.querySelectorAll('.skill-card');
    const hubCards = document.querySelectorAll('.hub-card');
    const timelineItems = document.querySelectorAll('.timeline__item');
    const roadmapItems = document.querySelectorAll('.roadmap__item');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Add initial styles and observe elements
    const animatedElements = [...statCards, ...skillCards, ...hubCards, ...timelineItems, ...roadmapItems];
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Counter animation for stat cards
    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Parse target value
            let numericTarget = 0;
            let suffix = '';
            
            if (target.includes('tỷ')) {
                numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
                suffix = ' tỷ USD';
            } else if (target.includes('triệu')) {
                numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
                suffix = ' triệu';
            } else if (target.includes('%')) {
                numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
                suffix = '%';
            } else {
                numericTarget = parseInt(target.replace(/[^\d]/g, ''));
                if (target.includes(',')) {
                    suffix = target.includes('27,600') ? '' : '';
                }
            }
            
            const current = Math.floor(progress * numericTarget);
            
            if (target.includes('27,600')) {
                element.textContent = current.toLocaleString();
            } else if (target.includes('+')) {
                element.textContent = '+' + current + suffix;
            } else {
                element.textContent = current + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Trigger counter animations when stat cards come into view
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('.stat-card__value');
                const targetValue = valueElement.textContent;
                animateCounter(valueElement, targetValue);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => {
        statObserver.observe(card);
    });
    
    // Skill cards hover effect with enhanced animation
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Hub cards interactive effects
    hubCards.forEach(card => {
        card.addEventListener('click', function() {
            const city = this.querySelector('.hub-card__city').textContent;
            
            // Create a simple notification
            showNotification(`Tìm hiểu thêm về cơ hội việc làm tại ${city}`);
        });
    });
    
    // Call-to-action button functionality
    const ctaButtons = document.querySelectorAll('.cta__buttons .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Công việc Esuhai') {
                showNotification('Đang chuyển hướng đến trang thông tin chi tiết...');
                window.location.href = "https://esuhai.vn/tuyen-dung-viec-lam-esuhai.html";
                // In a real application, this would redirect to a detailed page
            } else if (buttonText === 'Đăng ký talent tại Esuhai') {
                showNotification('Đang chuyển hướng đến trang thông tin chi tiết...');
                window.location.href = "https://landing-page-theta-rust.vercel.app/";
                
            }
        });
    });
    
    // Share functionality
    function shareContent() {
        if (navigator.share) {
            navigator.share({
                title: 'Thị trường lao động IT/AI Việt Nam 2022-2025',
                text: 'Khám phá cơ hội vàng trong ngành IT/AI tại Việt Nam!',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Đã sao chép liên kết vào clipboard!');
            });
        }
    }
    
    // Notification system
    function showNotification(message) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-primary);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add loading states for chart images
    const chartImages = document.querySelectorAll('.chart-image');
    
    chartImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Không thể tải biểu đồ';
        });
    });
    
    // Timeline items staggered animation
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        timelineObserver.observe(item);
    });
    
    // Roadmap items staggered animation
    const roadmapObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                roadmapObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    roadmapItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        roadmapObserver.observe(item);
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any notifications
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.remove();
            }
        }
    });
    
    // Add focus indicators for better accessibility
    const focusableElements = document.querySelectorAll('button, a, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Performance optimization: Lazy loading for chart images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Note: In this case, images are already loaded, but this shows the pattern
        chartImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }
    
    console.log('Vietnamese IT/AI Job Market Dashboard loaded successfully! 🚀');
});