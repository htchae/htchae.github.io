/**
 * Custom JavaScript for Portfolio Website
 * Optimized for performance and faster loading
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize navigation
  initNavigation();

  // Initialize animations
  initAnimations();

  // Initialize hero effect loader
  initHeroEffectLoader();

  // Initialize lazy loading for GIFs
  initLazyLoading();

  // Initialize back to top button
  initBackToTop();

  // Initialize responsive carousel
  initResponsiveCarousel();

  // Initialize project slideshows
  initProjectSlideshows();

  // Initialize project modals
  initProjectModals();

  // Initialize language switcher
  initLanguageSwitcher();

  // Optimize images loading
  optimizeImagesLoading();
});

/**
 * Initialize hero effect with progressive enhancement
 */
function initHeroEffectLoader() {
  const heroEffect = document.querySelector('.hero-effect');
  if (!heroEffect) return;

  // Preload the GIF
  const img = new Image();
  img.onload = function () {
    // Once loaded, add the 'loaded' class to apply the effect
    heroEffect.classList.add('loaded');
  };
  img.src = 'newgif/hero-effect.gif';
}

/**
 * Utility function to throttle frequent events
 */
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mainNav = document.getElementById('main-nav');
  const menuOverlay = document.getElementById('menu-overlay');

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Close menu when clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Smooth scrolling for navigation links - UPDATED
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();

        const targetSection = document.querySelector(href);
        if (targetSection) {
          // Calculate offset based on nav height and any additional space needed
          const navHeight = document.getElementById('main-nav').offsetHeight;
          const horizontalButtonContainer = document.querySelector(
            '.horizontal-button-container'
          );
          const additionalOffset = horizontalButtonContainer
            ? horizontalButtonContainer.offsetHeight
            : 0;
          const totalOffset = navHeight + additionalOffset;

          window.scrollTo({
            top: targetSection.offsetTop - totalOffset,
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // Active navigation on scroll - use throttling for better performance
  window.addEventListener(
    'scroll',
    throttle(function () {
      // Fixed navigation on scroll
      if (window.scrollY > 100) {
        mainNav.classList.add('active');
      } else {
        mainNav.classList.remove('active');
      }

      // Highlight active section in navigation
      highlightActiveSection();
    }, 100), // Throttle to 100ms
    { passive: true }
  );

  // Initialize active section
  highlightActiveSection();

  // Updated highlight active section function
  function highlightActiveSection() {
    const scrollPosition = window.scrollY;
    const navHeight = document.getElementById('main-nav').offsetHeight;
    const horizontalButtonContainer = document.querySelector(
      '.horizontal-button-container'
    );
    const additionalOffset = horizontalButtonContainer
      ? horizontalButtonContainer.offsetHeight
      : 0;
    const totalOffset = navHeight + additionalOffset + 5; // Add small buffer

    let currentSection = '';

    // Special case for home section when at the very top
    if (scrollPosition < 50) {
      currentSection = 'home';
    } else {
      // Check other sections
      const sections = document.querySelectorAll('section[id]');

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - totalOffset;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = sectionId;
        }
      });
    }

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * Initialize animations using Intersection Observer for performance
 */
function initAnimations() {
  const animatedElements = document.querySelectorAll('.animated');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.dataset.animation;
          const delay = parseInt(element.dataset.delay || 0);

          setTimeout(() => {
            element.classList.add(animation);
          }, delay);

          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Initialize responsive carousel - Performance optimized
//  */

function initResponsiveCarousel() {
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselImages = document.querySelectorAll('.carousel-image');

  if (!carouselTrack || carouselImages.length === 0) return;

  // Prioritize first carousel image
  if (carouselImages.length > 0) {
    carouselImages[0].setAttribute('loading', 'eager');
    carouselImages[0].setAttribute('fetchpriority', 'high');
  }

  // Use requestAnimationFrame for smoother animation
  let position = 0;
  let animationId;
  let isRunning = true;

  function moveCarousel() {
    if (!isRunning) return;

    position -= 0.5; // Adjust speed as needed
    carouselTrack.style.transform = `translateX(${position}px)`;

    // Reset position when we've moved enough
    const firstImageWidth = carouselImages[0].offsetWidth;
    if (Math.abs(position) >= firstImageWidth) {
      // Clone first image and append to end for infinite loop effect
      const firstImage = carouselTrack.firstElementChild;
      const clone = firstImage.cloneNode(true);
      carouselTrack.appendChild(clone);

      // Remove original first element after cloning
      carouselTrack.removeChild(firstImage);

      // Reset position
      position = 0;
      carouselTrack.style.transform = `translateX(${position}px)`;
    }

    animationId = requestAnimationFrame(moveCarousel);
  }

  // Start animation if visible
  if (!document.hidden) {
    animationId = requestAnimationFrame(moveCarousel);
  }

  // Pause/resume when visibility changes
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationId);
    } else {
      isRunning = true;
      animationId = requestAnimationFrame(moveCarousel);
    }
  });

  // Pause on window blur for performance
  window.addEventListener('blur', function () {
    isRunning = false;
    cancelAnimationFrame(animationId);
  });

  // Resume on window focus
  window.addEventListener('focus', function () {
    if (!isRunning) {
      isRunning = true;
      animationId = requestAnimationFrame(moveCarousel);
    }
  });
}

/**
 * Optimize image loading using Intersection Observer
 */
function optimizeImagesLoading() {
  const images = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Load images before they enter viewport
        threshold: 0.01,
      }
    );

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }
}

/**
 * Initialize lazy loading for GIFs
 * High priority for hero carousel, lower priority for others
 */
function initLazyLoading() {
  // Prioritize loading the main carousel GIF first
  loadCarouselGifs();

  // Then load the rest of the GIFs as they become visible
  loadPortfolioGifs();
}

/**
 * Load the main carousel GIFs immediately
 */
function loadCarouselGifs() {
  const carouselGifs = document.querySelectorAll('.carousel-image.lazy-gif');

  carouselGifs.forEach((gif, index) => {
    const src = gif.getAttribute('data-src');
    if (src) {
      // Set first image as high priority
      if (index === 0) {
        gif.setAttribute('fetchpriority', 'high');
        gif.setAttribute('loading', 'eager');
      }

      // Preload hero carousel images with high priority
      const img = new Image();
      img.onload = function () {
        gif.src = src;
        gif.classList.add('loaded');
        // Update carousel dimensions after image loads
        if (typeof initResponsiveCarousel === 'function') {
          initResponsiveCarousel();
        }
      };
      img.src = src;
    }
  });
}

/**
 * Load portfolio GIFs as they scroll into view
 */
function loadPortfolioGifs() {
  const lazyGifs = document.querySelectorAll('.masonry-item .lazy-gif');

  if ('IntersectionObserver' in window) {
    const gifObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gif = entry.target;
            const src = gif.getAttribute('data-src');

            if (src) {
              // Use timeout to stagger loading and prevent jank
              setTimeout(() => {
                gif.src = src;
                gif.classList.add('loaded');
                observer.unobserve(gif);
              }, 100 * Math.random()); // Slight randomization to prevent all GIFs loading at once
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Load images 200px before they become visible
        threshold: 0.01,
      }
    );

    lazyGifs.forEach((gif) => {
      gifObserver.observe(gif);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    function lazyLoad() {
      lazyGifs.forEach((gif) => {
        if (isInViewport(gif)) {
          const src = gif.getAttribute('data-src');
          if (src) {
            gif.src = src;
            gif.classList.add('loaded');
          }
        }
      });
    }

    // Simple check if element is in viewport
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    // Use throttled scroll event as fallback
    let scrollTimeout;
    window.addEventListener(
      'scroll',
      function () {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(lazyLoad, 200);
      },
      { passive: true }
    );

    // Initial check
    lazyLoad();
  }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const goTopBtn = document.getElementById('go-top');

  if (!goTopBtn) return;

  window.addEventListener(
    'scroll',
    throttle(function () {
      if (window.scrollY > 300) {
        goTopBtn.classList.add('active');
      } else {
        goTopBtn.classList.remove('active');
      }
    }, 100), // Throttle to 100ms
    { passive: true }
  );

  goTopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * Initialize slideshow functionality for key projects
 */
function initProjectSlideshows() {
  const slideshows = document.querySelectorAll('.project-slideshow');

  slideshows.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll('.slide');
    const prevBtn = slideshow.querySelector('.prev');
    const nextBtn = slideshow.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;

    // Function to show a specific slide
    function showSlide(index) {
      slides.forEach((slide) => slide.classList.remove('active'));

      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Auto advance slides
    function startSlideshow() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }

      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, 5000);
    }

    // Stop slideshow on hover
    slideshow.addEventListener('mouseenter', () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    });

    // Resume slideshow when mouse leaves
    slideshow.addEventListener('mouseleave', () => {
      startSlideshow();
    });

    // Next and previous buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering modal open
        showSlide(currentSlide - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering modal open
        showSlide(currentSlide + 1);
      });
    }

    // Start the slideshow
    if (slides.length > 1) {
      startSlideshow();
    }
  });
}

/**
 * Initialize modal functionality for project details
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = modal.querySelector('.modal-close');
  const modalContent = modal.querySelector('.modal-content');
  const modalSlidesContainer = modal.querySelector('.modal-slides-container');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDescription = modal.querySelector('.modal-description');
  const modalTech = modal.querySelector('.modal-tech');
  const modalDemoLink = modal.querySelector('.modal-demo-link');
  const modalCodeLink = modal.querySelector('.modal-code-link');
  const modalPrevBtn = modal.querySelector('.modal-prev');
  const modalNextBtn = modal.querySelector('.modal-next');

  // Project data - skipped as requested
  // ...

  // Track currently open project
  let currentProjectId = null;

  // Function to open modal with project details
  function openProjectModal(projectId) {
    const project = projectsData.find((p) => p.id === projectId);

    if (!project) return;

    // Store the current project ID
    currentProjectId = projectId;

    // Reset modal scroll position when opening
    modalContent.scrollTop = 0;

    // Set modal content based on current language
    updateModalContent(project);

    // Set slides
    modalSlidesContainer.innerHTML = '';
    project.images.forEach((image, index) => {
      const slide = document.createElement('img');
      slide.src = image;
      slide.alt = project.title;
      slide.className = 'slide';
      if (index === 0) {
        slide.classList.add('active');
      }
      modalSlidesContainer.appendChild(slide);
    });

    // Initialize modal slideshow
    let currentSlide = 0;
    const modalSlides = modalSlidesContainer.querySelectorAll('.slide');

    function showModalSlide(index) {
      modalSlides.forEach((slide) => slide.classList.remove('active'));
      currentSlide = (index + modalSlides.length) % modalSlides.length;
      modalSlides[currentSlide].classList.add('active');
    }

    modalPrevBtn.onclick = () => showModalSlide(currentSlide - 1);
    modalNextBtn.onclick = () => showModalSlide(currentSlide + 1);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Function to update modal content based on current language
  function updateModalContent(project) {
    // Set title based on language
    if (currentLang === 'en' && project.titleEn) {
      modalTitle.textContent = project.titleEn;
      modalDescription.innerHTML = project.descriptionEn;
    } else {
      modalTitle.textContent = project.title;
      modalDescription.innerHTML = project.description;
    }

    // Set tech stack
    modalTech.innerHTML = '';
    project.tech.forEach((tech) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = tech;
      modalTech.appendChild(tag);
    });

    // Set links
    modalDemoLink.href = project.demo;
    modalCodeLink.href = project.code;

    // Hide links if not available
    if (!project.demo || project.demo === '') {
      modalDemoLink.style.display = 'none';
    } else {
      modalDemoLink.style.display = '';
    }

    if (!project.code || project.code === '') {
      modalCodeLink.style.display = 'none';
    } else {
      modalCodeLink.style.display = '';
    }
  }

  // Close modal when clicking the close button
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
    currentProjectId = null; // Clear current project
  });

  // Close modal when clicking outside the content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
      currentProjectId = null; // Clear current project
    }
  });

  // Set up event listeners for all project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const projectId = index + 1; // Assuming IDs start from 1

    // Open modal when clicking the card (except when clicking navigation buttons)
    card.addEventListener('click', (e) => {
      // Check if clicking on navigation buttons or project links
      if (
        !e.target.closest('.slide-nav') &&
        !e.target.closest('.project-link-btn')
      ) {
        openProjectModal(projectId);
      }
    });

    // Open modal when clicking "View Details" button
    const detailsBtn = card.querySelector('.project-details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent duplicate triggers
        openProjectModal(projectId);
      });
    }
  });

  // Expose functions needed for language switching
  window.updateModalForLanguage = function () {
    if (currentProjectId) {
      const project = projectsData.find((p) => p.id === currentProjectId);
      if (project) {
        updateModalContent(project);
      }
    }
  };
}

/**
 * Initialize language switcher functionality
 */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  const langElements = document.querySelectorAll('[data-lang-key]');

  // Language dictionaries
  const translations = {
    en: {
      'live-demo': 'LIVE DEMO',
      'source-code': 'SOURCE CODE',
      'see-more-articles': 'see more articles',
      demo: 'DEMO',
      'view-details': 'View Details',
      github: 'GitHub',
      'resume-ko': 'Resume (Korean)',
      'portfolio-pdf': 'Portfolio PDF (Korean)',
      'portfolio-pdf-eng': 'Portfolio PDF (English)',
      blog: 'Blog',
      'resume-en': 'Resume (English)',
      'project1-title': 'AI Interview & Feedback Assistant',
      'project1-description':
        'During my job search, I experienced firsthand the importance of interview preparation and the lack of effective practice methods.',
      'project2-title': 'PodStream - Podcast Radio Platform',
      'project2-description':
        'A streaming platform that allows users to easily share and view/listen to audio and video podcasts.',
      'project3-title':
        'SMS Subscription & Marketing Service for Offline Stores',
      'project3-description':
        'Developed an integrated marketing platform to address the challenges of digital transformation in the restaurant industry.',
      'project4-title': 'E-commerce Site',
      'project4-description':
        'Through this e-commerce platform development project, I wanted to demonstrate my technical skills and problem-solving abilities.',
      'project5-title': 'Speedy Hero - Mobile Game',
      'project5-description':
        'A runner game where a character with super-speed ability runs endlessly avoiding obstacles.',
      'project6-title': 'Hyper Casual Game Project',
      'project6-description':
        'Successfully developed 22 hyper casual games using the Unity engine. During the development process, I conducted thorough market research and continuously improved gameplay mechanisms based on user feedback through rapid prototyping and iterative development cycles.',
      'main-projects': 'MAIN PROJECTS',
    },
    ko: {
      'live-demo': '라이브 데모',
      'source-code': '소스 코드',
      'see-more-articles': '블로그 더보기',
      demo: '데모',
      'view-details': '상세 보기',
      github: '깃허브',
      'resume-ko': '이력서',
      'portfolio-pdf': '포트폴리오 PDF',
      'portfolio-pdf-eng': '포트폴리오 PDF 영문',
      blog: 'Blog',
      'resume-en': '이력서 영문',
      'project1-title': 'AI 면접 & 피드백 도우미',
      'project1-description':
        '취업 준비 과정에서 면접은 가장 중요한 관문임에도 불구하고, 효과적인 연습 방법이 부족하다는 점을 직접 경험했습니다.',
      'project2-title': 'PodStream - 팟캐스트 라디오 플랫폼',
      'project2-description':
        '사용자들이 오디오와 비디오 팟캐스트를 쉽게 공유하고 시청/청취할 수 있는 스트리밍 플랫폼입니다.',
      'project3-title': '오프라인 매장을 위한 문자 구독 & 마케팅 서비스',
      'project3-description':
        '레스토랑 업계가 직면한 디지털 전환의 어려움을 해결하고자 통합 마케팅 플랫폼을 개발하였습니다.',
      'project4-title': '이커머스 사이트',
      'project4-description':
        '이커머스 플랫폼 개발 프로젝트를 통해 제가 가진 기술력과 문제 해결 능력을 증명하고자 했습니다.',
      'project5-title': 'Speedy Hero - 모바일 게임',
      'project5-description':
        '초고속 이동이 가능한 캐릭터가 장애물을 피하며 끝없이 달리는 러너(Runner) 게임입니다.',
      'project6-title': 'Hyper Casual Game 프로젝트',
      'project6-description':
        'Unity 엔진을 활용하여 22개의 하이퍼 캐주얼 게임을 성공적으로 개발했습니다. 개발 과정에서는 철저한 시장 조사를 실시하고, 신속한 prototyping과 반복적인 개발 주기를 통해 사용자 피드백을 기반으로 게임플레이 메커니즘을 지속적으로 개선했습니다.',
      'main-projects': '주요 프로젝트',
    },
  };

  // Try to detect user's preferred language
  function detectUserLanguage() {
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('ko')) {
      return 'ko';
    }

    // Default to Korean
    return 'ko';
  }

  // Set initial language
  window.currentLang = detectUserLanguage();
  updateLanguage(window.currentLang);

  // Set active button
  document
    .querySelector(`.lang-btn[data-lang="${window.currentLang}"]`)
    .classList.add('active');

  // Add click event to language buttons
  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');

      // Update active button
      langButtons.forEach((button) => button.classList.remove('active'));
      btn.classList.add('active');

      // Update language
      updateLanguage(lang);
    });
  });

  // Update all translatable elements
  function updateLanguage(lang) {
    window.currentLang = lang;

    langElements.forEach((el) => {
      const key = el.getAttribute('data-lang-key');
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = translations[lang][key];
        } else {
          el.innerHTML = translations[lang][key];
        }
      }
    });

    // Update modal if it's open
    if (typeof window.updateModalForLanguage === 'function') {
      window.updateModalForLanguage();
    }

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
  }

  // Check for saved language preference
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && (savedLang === 'en' || savedLang === 'ko')) {
    window.currentLang = savedLang;
    updateLanguage(window.currentLang);

    // Update active button
    langButtons.forEach((btn) => btn.classList.remove('active'));
    document
      .querySelector(`.lang-btn[data-lang="${window.currentLang}"]`)
      .classList.add('active');
  }
}

/**
 * Remove blocking resources on mobile to improve performance
 */
function optimizeForMobile() {
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.classList.add('reduce-motion');

    // Delay loading of non-visible masonry items
    const hiddenItems = document.querySelectorAll(
      '.masonry-item:nth-child(n+10)'
    );

    hiddenItems.forEach((item) => {
      // Use visibility instead of display to maintain layout
      item.style.visibility = 'hidden';
      item.style.opacity = '0';

      // Lazily reveal them as user scrolls
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                item.style.visibility = '';
                item.style.opacity = '1';
                item.style.transition = 'opacity 0.3s ease';
              }, 100 * Math.random()); // Stagger loading
              observer.unobserve(item);
            }
          });
        },
        { rootMargin: '200px' }
      );

      observer.observe(item);
    });
  }
}

// Register service worker for caching and faster subsequent loads
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered');
      })
      .catch((err) => {
        console.log('ServiceWorker registration failed', err);
      });
  });
}

// Run mobile optimizations
window.addEventListener('load', optimizeForMobile);

document.addEventListener('DOMContentLoaded', function () {
  // Create a queue for image loading
  const imageQueue = Array.from(
    document.querySelectorAll('img:not(.lazy-gif):not([loading="lazy"])')
  );

  // Add loading="lazy" to images below the fold
  document
    .querySelectorAll('img:not(.carousel-image):not(.lazy-gif)')
    .forEach((img) => {
      if (!isInViewport(img)) {
        img.setAttribute('loading', 'lazy');
      }
    });

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  const loadBatchSize = 4; // Load 4 images at a time

  function loadNextBatch() {
    if (imageQueue.length === 0) return;

    const batch = imageQueue.splice(0, loadBatchSize);

    Promise.all(
      batch.map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = img.onerror = resolve;
          }
        });
      })
    ).then(() => {
      // Once the batch is loaded, load the next batch on next frame
      if (imageQueue.length > 0) {
        requestAnimationFrame(loadNextBatch);
      }
    });
  }

  // Start loading images in batches
  if (imageQueue.length > 0) {
    loadNextBatch();
  }
});
