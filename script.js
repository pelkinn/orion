// Navigation functionality
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Animated counter for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCard = entry.target;
            const statNumber = statCard.querySelector('.stat-number');
            const target = parseInt(statCard.getAttribute('data-count'));
            
            if (!statCard.classList.contains('animated')) {
                statCard.classList.add('animated');
                animateCounter(statNumber, target);
            }
        }
    });
}, {
    threshold: 0.5
});

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// Fade in animation on scroll
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Apply fade-in to various elements
const fadeElements = document.querySelectorAll('.player-card, .match-card, .gallery-item, .about-text, .about-image');
fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const netPattern = document.querySelector('.net-pattern');
    
    if (hero && scrolled < window.innerHeight) {
        if (netPattern) {
            netPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
});

// Gallery item click effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 200);
    });
});

// Player card hover effect enhancement
document.querySelectorAll('.player-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const playerImage = card.querySelector('.player-image');
        playerImage.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        const playerImage = card.querySelector('.player-image');
        playerImage.style.transform = 'scale(1)';
    });
});

// Add dynamic particles to hero section
const createParticle = () => {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = '#FF6B35';
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0.6';
    particle.style.boxShadow = '0 0 10px #FF6B35';
    
    const hero = document.querySelector('.hero');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    hero.appendChild(particle);
    
    const duration = 3000 + Math.random() * 2000;
    const targetY = y - 200 - Math.random() * 300;
    
    particle.animate([
        { transform: 'translateY(0) scale(1)', opacity: 0.6 },
        { transform: `translateY(${targetY - y}px) scale(0)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    }).onfinish = () => {
        particle.remove();
    };
};

// Create particles periodically
setInterval(createParticle, 500);

// Add typing effect to hero description (optional enhancement)
const heroDescription = document.querySelector('.hero-description');
if (heroDescription) {
    const text = heroDescription.textContent;
    heroDescription.textContent = '';
    let index = 0;
    
    const typeText = () => {
        if (index < text.length) {
            heroDescription.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    };
    
    // Start typing after a delay
    setTimeout(typeText, 1000);
}

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #FF6B35, #FF8C5A)';
    progressBar.style.zIndex = '10000';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

createScrollProgress();

// Add ripple effect to buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

