// Navigation functionality
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Smooth scroll for navigation links
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Active navigation link on scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
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
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statCard = entry.target;
        const statNumber = statCard.querySelector(".stat-number");
        const target = parseInt(statCard.getAttribute("data-count"));

        if (!statCard.classList.contains("animated")) {
          statCard.classList.add("animated");
          animateCounter(statNumber, target);
        }
      }
    });
  },
  {
    threshold: 0.5,
  }
);

document.querySelectorAll(".stat-card").forEach((card) => {
  statsObserver.observe(card);
});

// Fade in animation on scroll
const fadeInObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

// Apply fade-in to various elements
const fadeElements = document.querySelectorAll(
  ".player-card, .match-card, .gallery-item, .about-text, .about-image"
);
fadeElements.forEach((element) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  fadeInObserver.observe(element);
});

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  const netPattern = document.querySelector(".net-pattern");

  if (hero && scrolled < window.innerHeight) {
    if (netPattern) {
      netPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }
});

// Gallery modal functionality
const createGalleryModal = () => {
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <button class="modal-prev">&#8249;</button>
            <button class="modal-next">&#8250;</button>
            <img class="modal-image" src="" alt="">
            <video class="modal-video" controls playsinline></video>
            <div class="modal-indicators"></div>
        </div>
    `;
  document.body.appendChild(modal);
  return modal;
};

const galleryModal = createGalleryModal();
const modalImage = galleryModal.querySelector(".modal-image");
const modalVideo = galleryModal.querySelector(".modal-video");
const modalOverlay = galleryModal.querySelector(".modal-overlay");
const modalClose = galleryModal.querySelector(".modal-close");
const modalPrev = galleryModal.querySelector(".modal-prev");
const modalNext = galleryModal.querySelector(".modal-next");
const modalIndicators = galleryModal.querySelector(".modal-indicators");

let currentImageIndex = 0;
let galleryImages = [];
let touchStartX = 0;
let touchEndX = 0;

// Get all gallery items (images + video)
const updateGalleryImages = () => {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const media = [];

  items.forEach((item) => {
    const isVideo = item.dataset.galleryType === "video";
    if (isVideo) {
      const src = item.dataset.videoSrc;
      if (!src) return;
      const alt = item.dataset.videoAlt || "Видео";
      const poster = item.dataset.videoPoster || "";
      item.dataset.galleryIndex = String(media.length);
      media.push({
        type: "video",
        src,
        alt,
        poster,
      });
    } else {
      const img = item.querySelector("img");
      if (!img) return;
      item.dataset.galleryIndex = String(media.length);
      media.push({
        type: "image",
        src: img.src,
        alt: img.alt,
      });
    }
  });

  galleryImages = media;
  createIndicators();
};

// Create indicators for gallery images
const createIndicators = () => {
  modalIndicators.innerHTML = "";
  galleryImages.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.className = "modal-indicator";
    if (index === currentImageIndex) {
      indicator.classList.add("active");
    }
    indicator.addEventListener("click", () => {
      openModal(index);
    });
    modalIndicators.appendChild(indicator);
  });
};

// Update indicators
const updateIndicators = () => {
  const indicators = modalIndicators.querySelectorAll(".modal-indicator");
  indicators.forEach((indicator, index) => {
    if (index === currentImageIndex) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
};

// Open modal with specific image
const openModal = (index) => {
  if (galleryImages.length === 0) return;
  currentImageIndex = index;
  const media = galleryImages[currentImageIndex];
  if (media.type === "video") {
    modalImage.style.display = "none";
    modalVideo.style.display = "block";
    modalVideo.src = media.src;
    modalVideo.poster = media.poster || "";
    modalVideo.load();
  } else {
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.style.display = "none";
    modalImage.style.display = "block";
    modalImage.style.opacity = "1";
    modalImage.src = media.src;
    modalImage.alt = media.alt;
  }
  galleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
  updateIndicators();
};

// Close modal
const closeModal = () => {
  galleryModal.classList.remove("active");
  document.body.style.overflow = "";
  modalVideo.pause();
};

// Navigate to previous image
const showPrevious = () => {
  currentImageIndex =
    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  changeImage();
};

// Navigate to next image
const showNext = () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  changeImage();
};

// Change image with fade animation
const changeImage = () => {
  const media = galleryImages[currentImageIndex];
  if (media.type === "video") {
    modalImage.style.display = "none";
    modalVideo.style.display = "block";
    modalVideo.pause();
    modalVideo.src = media.src;
    modalVideo.poster = media.poster || "";
    modalVideo.load();
    updateIndicators();
    return;
  }

  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.style.display = "none";
  modalImage.style.display = "block";
  modalImage.style.opacity = "0";
  setTimeout(() => {
    modalImage.src = media.src;
    modalImage.alt = media.alt;
    modalImage.style.opacity = "1";
    updateIndicators();
  }, 150);
};

// Gallery item click - open modal
const initGallery = () => {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length === 0) return;

  updateGalleryImages();

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.galleryIndex);
      if (Number.isNaN(index)) return;
      openModal(index);
    });
  });
};

// Initialize gallery when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGallery);
} else {
  initGallery();
}

// Close modal events
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

// Navigation events
modalPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  showPrevious();
});

modalNext.addEventListener("click", (e) => {
  e.stopPropagation();
  showNext();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (galleryModal.classList.contains("active")) {
    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowLeft") {
      showPrevious();
    } else if (e.key === "ArrowRight") {
      showNext();
    }
  }
});

// Touch/swipe support for mobile
let isSwiping = false;

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
  isSwiping = true;
};

const handleTouchMove = (e) => {
  if (!isSwiping) return;
  // Prevent default to avoid scrolling while swiping
  e.preventDefault();
};

const handleTouchEnd = (e) => {
  if (!isSwiping) return;
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  isSwiping = false;
};

const handleSwipe = () => {
  const swipeThreshold = 50; // Minimum distance for swipe
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next image
      showNext();
    } else {
      // Swipe right - previous image
      showPrevious();
    }
  }
};

// Add touch events to modal content for better swipe support
const modalContent = galleryModal.querySelector(".modal-content");
modalContent.addEventListener("touchstart", handleTouchStart, {
  passive: false,
});
modalContent.addEventListener("touchmove", handleTouchMove, { passive: false });
modalContent.addEventListener("touchend", handleTouchEnd, { passive: true });

// Player card hover effect enhancement
document.querySelectorAll(".player-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const playerImage = card.querySelector(".player-image");
    playerImage.style.transform = "scale(1.05)";
  });

  card.addEventListener("mouseleave", () => {
    const playerImage = card.querySelector(".player-image");
    playerImage.style.transform = "scale(1)";
  });
});

// Add dynamic particles to hero section
const createParticle = () => {
  const particle = document.createElement("div");
  particle.style.position = "absolute";
  particle.style.width = "4px";
  particle.style.height = "4px";
  particle.style.background = "#FF6B35";
  particle.style.borderRadius = "50%";
  particle.style.opacity = "0.6";
  particle.style.boxShadow = "0 0 10px #FF6B35";

  const hero = document.querySelector(".hero");
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  particle.style.left = x + "px";
  particle.style.top = y + "px";

  hero.appendChild(particle);

  const duration = 3000 + Math.random() * 2000;
  const targetY = y - 200 - Math.random() * 300;

  particle.animate(
    [
      { transform: "translateY(0) scale(1)", opacity: 0.6 },
      { transform: `translateY(${targetY - y}px) scale(0)`, opacity: 0 },
    ],
    {
      duration: duration,
      easing: "ease-out",
    }
  ).onfinish = () => {
    particle.remove();
  };
};

// Create particles periodically
setInterval(createParticle, 500);

// Add typing effect to hero description (optional enhancement)
const heroDescription = document.querySelector(".hero-description");
if (heroDescription) {
  const text = heroDescription.textContent;
  heroDescription.textContent = "";
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
  const progressBar = document.createElement("div");
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.width = "0%";
  progressBar.style.height = "3px";
  progressBar.style.background = "linear-gradient(90deg, #FF6B35, #FF8C5A)";
  progressBar.style.zIndex = "10000";
  progressBar.style.transition = "width 0.1s ease";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });
};

createScrollProgress();

// Add ripple effect to buttons
document.querySelectorAll(".cta-button").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.5)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s ease-out";
    ripple.style.pointerEvents = "none";

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const style = document.createElement("style");
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
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});
