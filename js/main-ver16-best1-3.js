/**
 * Custom JavaScript for Portfolio Website
 * Optimized for performance and reduced lag
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize navigation
  initNavigation();

  // Initialize hero effect loader
  initHeroEffectLoader();

  // Initialize lazy loading for GIFs
  initLazyLoading();

  // Initialize back to top button with throttling
  initBackToTop();

  // Initialize responsive carousel with optimized animations
  initResponsiveCarousel();

  // Initialize project slideshows
  initProjectSlideshows();

  // Initialize project modals with dynamic loading
  initProjectModals();

  // Initialize language switcher
  initLanguageSwitcher();
  // handleLanguagePersistency();

  // Preload critical resources
  preloadCriticalResources();
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
 * Preload critical resources to improve initial load performance
 */
function preloadCriticalResources() {
  // Preload main images that will be visible immediately
  const criticalImages = [
    'img/project1/slide1.png',
    'img/project2/slide1.png',
    'img/project3/slide1.png',
    'vids/test.png',
    'newgif/hero-effect.gif',
  ];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * Initialize navigation with performance optimizations
 */
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

  // Close menu when a link is clicked - Using event delegation for better performance
  if (navMenu) {
    navMenu.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Smooth scrolling for navigation links - Using event delegation
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
      const href = e.target.getAttribute('href');

      if (href && href.startsWith('#') && href !== '#') {
        e.preventDefault();

        const targetSection = document.querySelector(href);
        if (targetSection) {
          // Calculate offset based on nav height and any additional space needed
          const navHeight = mainNav.offsetHeight;
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
    }
  });

  // Throttled scroll event for performance
  let ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          // Fixed navigation on scroll
          if (window.scrollY > 100) {
            mainNav.classList.add('active');
          } else {
            mainNav.classList.remove('active');
          }

          // Highlight active section in navigation
          highlightActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initialize active section
  highlightActiveSection();

  /**
   * Highlight active section in navigation with optimized calculations
   */
  function highlightActiveSection() {
    const scrollPosition = window.scrollY;
    const navHeight = mainNav.offsetHeight;
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
      // Check other sections - using DocumentFragment for better performance
      const sections = document.querySelectorAll('section[id]');

      // Find the current section in view
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

    // Update active class only if section changed
    navLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${currentSection}`) {
        if (!link.classList.contains('active')) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
}

/**
 * Initialize responsive carousel - Performance optimized
 */
function initResponsiveCarousel() {
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselImages = document.querySelectorAll('.carousel-image');

  if (!carouselTrack || carouselImages.length === 0) return;

  let resizeDebounce;

  // Function to update the carousel animation based on image size
  function updateCarouselAnimation() {
    // Cancel any pending updates
    if (resizeDebounce) {
      cancelAnimationFrame(resizeDebounce);
    }

    // Schedule update in next animation frame for better performance
    resizeDebounce = requestAnimationFrame(() => {
      const firstImage = carouselImages[0];

      if (firstImage.complete && firstImage.naturalWidth) {
        // Calculate dimensions once
        const singleImageWidth = firstImage.offsetWidth;
        const totalWidth = singleImageWidth * carouselImages.length;

        // Batch DOM operations
        carouselTrack.style.cssText = `width: ${totalWidth}px;`;

        // Update CSS variable for animation
        document.documentElement.style.setProperty(
          '--carousel-animation-distance',
          `-${singleImageWidth}px`
        );

        // Restart animation for smoother transition
        carouselTrack.style.animation = 'none';
        // Force reflow
        void carouselTrack.offsetWidth;
        carouselTrack.style.animation = 'infiniteScroll 30s linear infinite';
      }
    });
  }

  // Use passive event listeners for better performance
  window.addEventListener('load', updateCarouselAnimation, { passive: true });

  // Throttle resize events
  let isResizing = false;
  window.addEventListener(
    'resize',
    () => {
      if (!isResizing) {
        isResizing = true;
        setTimeout(() => {
          updateCarouselAnimation();
          isResizing = false;
        }, 150);
      }
    },
    { passive: true }
  );

  // Initial load of images
  carouselImages.forEach((img) => {
    if (img.complete) {
      updateCarouselAnimation();
    } else {
      img.addEventListener('load', updateCarouselAnimation, {
        once: true,
        passive: true,
      });
    }
  });
}

/**
 * Initialize optimized lazy loading for GIFs
 */
function initLazyLoading() {
  loadPortfolioGifs();
}

/**
 * Load portfolio GIFs as they scroll into view with optimized loading
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
              // Use staggered loading to reduce network contention
              const delay = 100 * Math.random();
              setTimeout(() => {
                const img = new Image();
                img.decoding = 'async'; // Use async decoding for better performance
                img.onload = function () {
                  requestAnimationFrame(() => {
                    gif.src = src;
                    gif.classList.add('loaded');
                  });
                };
                img.src = src;
                observer.unobserve(gif);
              }, delay);
            }
          }
        });
      },
      {
        rootMargin: '200px 0px', // Preload images before they become visible
        threshold: 0.01,
      }
    );

    lazyGifs.forEach((gif) => {
      gifObserver.observe(gif);
    });
  } else {
    // Fallback with throttled scroll event for older browsers
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

    // Throttled scroll event
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
 * Initialize back to top button with throttled scroll
 */
function initBackToTop() {
  const goTopBtn = document.getElementById('go-top');

  if (!goTopBtn) return;

  // Throttled scroll event
  let ticking = false;
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 300) {
            goTopBtn.classList.add('active');
          } else {
            goTopBtn.classList.remove('active');
          }
          ticking = false;
        });
        ticking = true;
      }
    },
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
 * With reduced event listeners and optimized animation
 */
function initProjectSlideshows() {
  const slideshows = document.querySelectorAll('.project-slideshow');

  slideshows.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll('.slide');
    const prevBtn = slideshow.querySelector('.prev');
    const nextBtn = slideshow.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;
    let isPaused = false;

    // Function to show a specific slide
    function showSlide(index) {
      if (slides.length <= 1) return;

      slides.forEach((slide) => slide.classList.remove('active'));

      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    }

    // Auto advance slides
    function startSlideshow() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }

      if (!isPaused && slides.length > 1) {
        slideInterval = setInterval(() => {
          showSlide(currentSlide + 1);
        }, 5000);
      }
    }

    // Stop slideshow on hover
    slideshow.addEventListener('mouseenter', () => {
      isPaused = true;
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    });

    // Resume slideshow when mouse leaves
    slideshow.addEventListener('mouseleave', () => {
      isPaused = false;
      startSlideshow();
    });

    // Next and previous buttons
    if (prevBtn && slides.length > 1) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering modal open
        showSlide(currentSlide - 1);
      });
    }

    if (nextBtn && slides.length > 1) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering modal open
        showSlide(currentSlide + 1);
      });
    }

    // Only activate slideshow if multiple slides exist
    if (slides.length > 1) {
      startSlideshow();
    } else {
      // Hide navigation if only one slide
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  });
}

/**
 * Initialize modal functionality for project details
 * With dynamic content loading for improved performance
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

  // Track currently open project
  let currentProjectId = null;
  let currentSlide = 0;

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

    // Set slides - Using DocumentFragment for better performance
    modalSlidesContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    project.images.forEach((image, index) => {
      const slide = document.createElement('img');
      slide.src = image;
      slide.alt = project.title;
      slide.className = 'slide';
      if (index === 0) {
        slide.classList.add('active');
      }
      fragment.appendChild(slide);
    });

    modalSlidesContainer.appendChild(fragment);
    currentSlide = 0;

    // Initialize modal slideshow with optimized event handlers
    const modalSlides = modalSlidesContainer.querySelectorAll('.slide');

    // Only set up slideshow controls if there are multiple slides
    if (modalSlides.length > 1) {
      modalPrevBtn.style.display = '';
      modalNextBtn.style.display = '';

      // Use single function for showing slides
      function showModalSlide(index) {
        modalSlides.forEach((slide) => slide.classList.remove('active'));
        currentSlide = (index + modalSlides.length) % modalSlides.length;
        modalSlides[currentSlide].classList.add('active');
      }

      // Clear old event listeners and set new ones
      modalPrevBtn.onclick = () => showModalSlide(currentSlide - 1);
      modalNextBtn.onclick = () => showModalSlide(currentSlide + 1);
    } else {
      // Hide navigation buttons if only one slide
      modalPrevBtn.style.display = 'none';
      modalNextBtn.style.display = 'none';
    }

    // Show modal with a slight delay to allow DOM updates
    requestAnimationFrame(() => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  }

  // Function to update modal content based on current language
  function updateModalContent(project) {
    // Set title and description based on language
    if (currentLang === 'en' && project.titleEn) {
      modalTitle.textContent = project.titleEn;
      modalDescription.innerHTML = project.descriptionEn;
    } else {
      modalTitle.textContent = project.title;
      modalDescription.innerHTML = project.description;
    }

    // Set tech stack - Using DocumentFragment for better performance
    modalTech.innerHTML = '';
    const techFragment = document.createDocumentFragment();

    project.tech.forEach((tech) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = tech;
      techFragment.appendChild(tag);
    });

    modalTech.appendChild(techFragment);

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

  // Add Escape key support for closing modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      currentProjectId = null;
    }
  });

  // Set up event listeners for all project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    const projectId = index + 1; // Assuming IDs start from 1

    // Use event delegation for better performance
    card.addEventListener('click', (e) => {
      // Check if clicking on navigation buttons or project links
      if (
        !e.target.closest('.slide-nav') &&
        !e.target.closest('.project-link-btn')
      ) {
        openProjectModal(projectId);
      }
    });

    // Specific handler for details button
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
 * With optimized DOM updates and event handling
 */

// function initLanguageSwitcher() {
//   const langButtons = document.querySelectorAll('.lang-btn');
//   const langElements = document.querySelectorAll('[data-lang-key]');

//   // Language dictionaries - No change needed here
//   const translations = {
//     // Your existing translations object
//     en: {
//       'live-demo': 'LIVE DEMO',
//       'source-code': 'SOURCE CODE',
//       'see-more-articles': 'see more articles',
//       demo: 'DEMO',
//       'view-details': 'View Details',
//       github: 'GitHub',
//       'resume-ko': 'Resume (Korean)',
//       'portfolio-pdf': 'Portfolio PDF (Korean)',
//       'portfolio-pdf-eng': 'Portfolio PDF (English)',
//       blog: 'Blog',
//       'resume-en': 'Resume (English)',
//       'project1-title': 'AI Interview & Feedback Assistant',
//       'project1-description':
//         'During my job search, I experienced firsthand the importance of interview preparation and the lack of effective practice methods.',
//       'project2-title': 'PodStream - Podcast Radio Platform',
//       'project2-description':
//         'A streaming platform that allows users to easily share and view/listen to audio and video podcasts.',
//       'project3-title':
//         'SMS Subscription & Marketing Service for Offline Stores',
//       'project3-description':
//         'Developed an integrated marketing platform to address the challenges of digital transformation in the restaurant industry.',
//       'project4-title': 'E-commerce Site',
//       'project4-description':
//         'Through this e-commerce platform development project, I wanted to demonstrate my technical skills and problem-solving abilities.',
//       'project5-title': 'Speedy Hero - Mobile Game',
//       'project5-description':
//         'A runner game where a character with super-speed ability runs endlessly avoiding obstacles.',
//       'project6-title': 'Hyper Casual Game Project',
//       'project6-description':
//         'Successfully developed 22 hyper casual games using the Unity engine. During the development process, I conducted thorough market research and continuously improved gameplay mechanisms based on user feedback through rapid prototyping and iterative development cycles.',
//     },
//     ko: {
//       'live-demo': '라이브 데모',
//       'source-code': '소스 코드',
//       'see-more-articles': '블로그 더보기',
//       demo: '데모',
//       'view-details': '상세 보기',
//       github: '깃허브',
//       'resume-ko': '이력서',
//       'portfolio-pdf': '포트폴리오 PDF',
//       'portfolio-pdf-eng': '포트폴리오 PDF 영문',
//       blog: 'Blog',
//       'resume-en': '이력서 영문',
//       'project1-title': 'AI 면접 & 피드백 도우미',
//       'project1-description':
//         '취업 준비 과정에서 면접은 가장 중요한 관문임에도 불구하고, 효과적인 연습 방법이 부족하다는 점을 직접 경험했습니다.',
//       'project2-title': 'PodStream - 팟캐스트 라디오 플랫폼',
//       'project2-description':
//         '사용자들이 오디오와 비디오 팟캐스트를 쉽게 공유하고 시청/청취할 수 있는 스트리밍 플랫폼입니다.',
//       'project3-title': '오프라인 매장을 위한 문자 구독 & 마케팅 서비스',
//       'project3-description':
//         '레스토랑 업계가 직면한 디지털 전환의 어려움을 해결하고자 통합 마케팅 플랫폼을 개발하였습니다.',
//       'project4-title': '이커머스 사이트',
//       'project4-description':
//         '이커머스 플랫폼 개발 프로젝트를 통해 제가 가진 기술력과 문제 해결 능력을 증명하고자 했습니다.',
//       'project5-title': 'Speedy Hero - 모바일 게임',
//       'project5-description':
//         '초고속 이동이 가능한 캐릭터가 장애물을 피하며 끝없이 달리는 러너(Runner) 게임입니다.',
//       'project6-title': 'Hyper Casual Game 프로젝트',
//       'project6-description':
//         'Unity 엔진을 활용하여 22개의 하이퍼 캐주얼 게임을 성공적으로 개발했습니다. 개발 과정에서는 철저한 시장 조사를 실시하고, 신속한 prototyping과 반복적인 개발 주기를 통해 사용자 피드백을 기반으로 게임플레이 메커니즘을 지속적으로 개선했습니다.',
//     },
//   };

//   // Detect user's preferred language
//   function detectUserLanguage() {
//     // Check browser language
//     const browserLang = navigator.language || navigator.userLanguage;
//     if (browserLang && browserLang.startsWith('ko')) {
//       return 'ko';
//     }

//     // Default to Korean
//     return 'ko';
//   }

//   // Declare global variable for language state
//   window.currentLang =
//     localStorage.getItem('preferredLanguage') || detectUserLanguage();

//   // Set initial language
//   updateLanguage(window.currentLang);

//   // Set active button
//   document
//     .querySelector(`.lang-btn[data-lang="${window.currentLang}"]`)
//     .classList.add('active');

//   // Add click event to language buttons - Using event delegation
//   const langSwitchContainer = document.querySelector('.language-switch');
//   if (langSwitchContainer) {
//     langSwitchContainer.addEventListener('click', (e) => {
//       if (e.target.classList.contains('lang-btn')) {
//         const lang = e.target.getAttribute('data-lang');

//         // Skip if already using this language
//         if (lang === window.currentLang) return;

//         // Update active button
//         langButtons.forEach((button) => button.classList.remove('active'));
//         e.target.classList.add('active');

//         // Update language
//         updateLanguage(lang);
//       }
//     });
//   }

//   // Update all translatable elements with improved batch updates
//   function updateLanguage(lang) {
//     window.currentLang = lang;

//     // Use DocumentFragment for batch DOM updates
//     requestAnimationFrame(() => {
//       langElements.forEach((el) => {
//         const key = el.getAttribute('data-lang-key');
//         if (translations[lang] && translations[lang][key]) {
//           if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
//             el.value = translations[lang][key];
//           } else {
//             el.innerHTML = translations[lang][key];
//           }
//         }
//       });
//     });

//     // Update modal if it's open
//     if (typeof window.updateModalForLanguage === 'function') {
//       window.updateModalForLanguage();
//     }

//     // Store language preference
//     localStorage.setItem('preferredLanguage', lang);
//   }
// }

/**
 * Initialize language switcher functionality
 * With optimized DOM updates and event handling
 */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  const langElements = document.querySelectorAll('[data-lang-key]');

  // Language dictionaries - No change needed here

  // Language dictionaries - No change needed here
  const translations = {
    // Your existing translations object
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
    },
  };

  // Detect user's preferred language
  function detectUserLanguage() {
    // Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('ko')) {
      return 'ko';
    }

    // Default to Korean
    return 'ko';
  }

  // Declare global variable for language state
  window.currentLang =
    localStorage.getItem('preferredLanguage') || detectUserLanguage();

  // Set initial language
  updateLanguage(window.currentLang);

  // Clear all active classes first
  langButtons.forEach((button) => button.classList.remove('active'));

  // Set active button
  const activeButton = document.querySelector(
    `.lang-btn[data-lang="${window.currentLang}"]`
  );
  if (activeButton) {
    activeButton.classList.add('active');
  }

  // Add click event to language buttons - Using event delegation
  const langSwitchContainer = document.querySelector('.language-switch');
  if (langSwitchContainer) {
    langSwitchContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('lang-btn')) {
        const lang = e.target.getAttribute('data-lang');

        // Skip if already using this language
        if (lang === window.currentLang) return;

        // Update active button
        langButtons.forEach((button) => button.classList.remove('active'));
        e.target.classList.add('active');

        // Update language
        updateLanguage(lang);
      }
    });
  }

  // Update all translatable elements with improved batch updates
  function updateLanguage(lang) {
    window.currentLang = lang;

    // Use DocumentFragment for batch DOM updates
    requestAnimationFrame(() => {
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
    });

    // Update modal if it's open
    if (typeof window.updateModalForLanguage === 'function') {
      window.updateModalForLanguage();
    }

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
  }
}

// Add this function to handle language persistency on page load
function handleLanguagePersistency() {
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    // Clear all active classes first
    langButtons.forEach((btn) => btn.classList.remove('active'));
    // Set active class on correct button
    const targetButton = document.querySelector(
      `.lang-btn[data-lang="${storedLang}"]`
    );
    if (targetButton) {
      targetButton.classList.add('active');
    }
  }
}

/**
 * Optimized image loading - creates a non-blocking sequential load
 * to prevent too many requests at once
//  */
// document.addEventListener('DOMContentLoaded', function () {
//   // Create a queue for image loading
//   const imageQueue = Array.from(
//     document.querySelectorAll('img:not(.lazy-gif):not([loading="lazy"])')
//   );

//   // Add loading="lazy" to images below the fold
//   document
//     .querySelectorAll('img:not(.carousel-image):not(.lazy-gif)')
//     .forEach((img) => {
//       if (!isInViewport(img)) {
//         img.setAttribute('loading', 'lazy');
//       }
//     });

//   function isInViewport(el) {
//     const rect = el.getBoundingClientRect();
//     return (
//       rect.top >= 0 &&
//       rect.bottom <=
//         (window.innerHeight || document.documentElement.clientHeight)
//     );
//   }

//   const loadBatchSize = 4; // Load 4 images at a time

//   function loadNextBatch() {
//     if (imageQueue.length === 0) return;

//     const batch = imageQueue.splice(0, loadBatchSize);

//     Promise.all(
//       batch.map((img) => {
//         return new Promise((resolve) => {
//           if (img.complete) {
//             resolve();
//           } else {
//             img.onload = img.onerror = resolve;
//           }
//         });
//       })
//     ).then(() => {
//       // Once the batch is loaded, load the next batch on next frame
//       if (imageQueue.length > 0) {
//         requestAnimationFrame(loadNextBatch);
//       }
//     });
//   }

//   // Start loading images in batches
//   if (imageQueue.length > 0) {
//     loadNextBatch();
//   }
// });

/**
 * Handle page visibility changes to optimize performance
 * Pause animations when page is not visible
 */
document.addEventListener('visibilitychange', function () {
  const carousel = document.querySelector('.carousel-track');
  const slideshows = document.querySelectorAll('.project-slideshow');

  if (document.hidden) {
    // Pause animations when tab is not visible
    if (carousel) {
      carousel.style.animationPlayState = 'paused';
    }

    // Pause all slideshows
    slideshows.forEach((slideshow) => {
      const interval = slideshow._slideInterval;
      if (interval) {
        clearInterval(interval);
        slideshow._wasPaused = true;
      }
    });
  } else {
    // Resume animations when tab becomes visible again
    if (carousel) {
      carousel.style.animationPlayState = 'running';
    }

    // Resume slideshows that were running
    slideshows.forEach((slideshow) => {
      if (slideshow._wasPaused) {
        const slides = slideshow.querySelectorAll('.slide');
        let currentSlide = 0;

        // Find current active slide
        slides.forEach((slide, index) => {
          if (slide.classList.contains('active')) {
            currentSlide = index;
          }
        });

        // Restart slideshow
        slideshow._slideInterval = setInterval(() => {
          currentSlide = (currentSlide + 1) % slides.length;
          slides.forEach((s) => s.classList.remove('active'));
          slides[currentSlide].classList.add('active');
        }, 5000);

        slideshow._wasPaused = false;
      }
    });
  }
});

/**
 * Optimize for mobile to improve performance
//  */

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
window.addEventListener('load', optimizeForMobile);

// function optimizeForMobile() {
//   const isMobile = window.innerWidth < 768;

//   if (isMobile) {
//     // Reduce animation complexity on mobile
//     document.documentElement.classList.add('reduce-motion');

//     // Get items to lazy load
//     const hiddenItems = document.querySelectorAll(
//       '.masonry-item:nth-child(n+10)'
//     );

//     // Early exit if no items to process
//     if (!hiddenItems.length) return;

//     // Initially hide items with opacity (keeps layout intact)
//     hiddenItems.forEach((item) => {
//       item.style.opacity = '0';
//       item.style.transform = 'translateY(20px)'; // Subtle animation
//       item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
//     });

//     // Create a single IntersectionObserver instance for all items
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const item = entry.target;

//             // Staggered reveal with small random delay
//             setTimeout(() => {
//               item.style.opacity = '1';
//               item.style.transform = 'translateY(0)';

//               // Stop observing after animation
//               setTimeout(() => {
//                 observer.unobserve(item);
//               }, 500);
//             }, 100 * Math.random());
//           }
//         });
//       },
//       {
//         rootMargin: '200px', // Load before they come into view
//         threshold: 0.1, // Trigger when at least 10% visible
//       }
//     );

//     // Observe all hidden items with the single observer
//     hiddenItems.forEach((item) => observer.observe(item));

//     // Optimize image loading
//     document.querySelectorAll('img:not([loading])').forEach((img) => {
//       // Skip critical images
//       if (img.closest('#home') || img.closest('#carousel-section')) {
//         return;
//       }

//       // Add lazy loading for non-critical images
//       img.setAttribute('loading', 'lazy');
//       img.setAttribute('decoding', 'async');
//     });
//   }
// }

// // Run mobile optimizations
// window.addEventListener('load', optimizeForMobile);

// function initCarouselAnimation() {
//   const carouselTrack = document.querySelector('.carousel-track');
//   if (!carouselTrack) return;

//   const carouselImage = carouselTrack.querySelector('.carousel-image');

//   // Function to start the animation
//   function startAnimation() {
//     // First remove any existing animation
//     carouselTrack.style.animation = 'none';

//     // Force a reflow
//     void carouselTrack.offsetWidth;

//     // Set the proper animation distance
//     const width = carouselImage.offsetWidth;
//     document.documentElement.style.setProperty(
//       '--carousel-animation-distance',
//       `-${width}px`
//     );

//     // Apply the animation
//     carouselTrack.style.animation = 'infiniteScroll 30s linear infinite';
//   }

//   // Start animation when image is loaded
//   if (carouselImage.complete) {
//     // Image is already loaded (e.g., from cache)
//     startAnimation();
//   } else {
//     // Wait for image to load
//     carouselImage.onload = startAnimation;
//   }
// }

// function initCarouselAnimation() {
//   const carousel = document.querySelector('.carousel-track');
//   if (!carousel) return;

//   // Force a reflow to ensure animation starts correctly
//   void carousel.offsetWidth;

//   // Restart animation for smoother transition
//   carousel.style.animation = 'none';
//   // Apply animation with JavaScript to ensure it runs
//   carousel.style.animation = 'infiniteScroll 30s linear infinite';
// }

// document.addEventListener('DOMContentLoaded', initCarouselAnimation);

// Use passive event listeners for better performance
// window.addEventListener('load', initCarouselAnimation, { passive: true });

// Project data
const projectsData = [
  {
    id: 1,
    title: 'AI 면접 & 피드백 도우미',
    description: `
        <p>취업 준비 과정에서 면접은 가장 중요한 관문임에도 불구하고, 효과적인 연습 방법이 부족하다는 점을 직접 경험했습니다. 특히 혼자서는 객관적인 피드백을 받기 어렵고, 직무에 특화된 질문을 준비하는 데 한계가 있다는 점이 가장 큰 문제였습니다.</p>
        <p><strong>Solution:</strong></p>
        <p>이러한 문제를 해결하기 위해 AI 기술을 활용한 모의면접 플랫폼을 개발하게 되었습니다. 단순히 정해진 질문을 반복하는 것이 아닌, 사용자의 직무와 경력 수준에 맞춘 맞춤형 질문을 제공하고, 실시간으로 피드백을 제공하는 것을 목표로 했습니다.</p>
        
        <div class="screenshot-container">
            <img src="img/project1/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>개발 기간:</strong></p>
          <ul>
            <li>기획 및 설계, 디자인: 2024.04.01 ~ 2024.04.15</li>
            <li>개발: 2024.04.16 ~ 2024.05.28</li>
            <li>테스트 및 배포: 2024.05.29 ~ 2024.06.05</li>
          </ul>
        </div>
        
            <div class="optimization-section">
          <p><strong>담당 역할:</strong></p>
          <ul>
            <li>PM, 프론트엔드, 백엔드</li>
            <li>서비스 기획 및 방향성 설정</li>
            <li>메인 로직 구현 (프론트엔드, 백엔드), API design, DB 설계</li>
              </ul>
        </div>
        
        <div class="environment-section">
          <p><strong>개발환경:</strong></p>
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>Next.js 13 (App Router를 활용한 서버 사이드 렌더링 및 라우팅 구현)</li>
              <li>React (컴포넌트 기반 UI 개발 및 Hooks를 활용한 상태 관리)</li>
              <li>Tailwind CSS (반응형 디자인 및 커스텀 UI 구현)</li>
              <li>Lucide React (아이콘 시스템)</li>
              <li>Clerk (사용자 인증 시스템)</li>
              <li>Shadcn UI (재사용 가능한 컴포넌트 라이브러리 활용)</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>PostgreSQL (관계형 데이터베이스 설계 및 구현)</li>
              <li>Drizzle ORM (타입 안전성이 보장된 데이터베이스 쿼리 작성)</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>State Management:</strong></p>
            <ul>
              <li>React Context를 활용한 언어 설정 관리</li>
              <li>useState를 통한 로컬 상태 관리</li>
              <li>useEffect를 활용한 실시간 업데이트</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>APIs and Integration:</strong></p>
            <ul>
              <li>Google Gemini AI API (맞춤형 면접 질문 생성 및 답변 평가)</li>
              <li>음성 입력을 위한 Speech Recognition API</li>
              <li>WebRTC (실시간 음성 인식 및 처리)</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>핵심 기능 구현:</strong></p>
          
          <div class="feature-category">
            <p><strong>AI 면접 시스템:</strong></p>
            <ul>
              <li>Google Gemini AI를 활용한 직무별 맞춤형 면접 질문 생성</li>
              <li>음성 인식 API를 통한 실시간 답변 수집 및 텍스트 변환</li>
              <li>다국어 지원 시스템 설계 및 구현 (한국어, 영어, 일본어, 중국어)</li>
              <li>답변에 대한 AI 기반 실시간 평가 및 피드백 제공</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>크레딧 시스템:</strong></p>
            <ul>
              <li>사용자별 크레딧 관리 시스템 구현</li>
              <li>실시간 크레딧 자동 충전 기능 (1분당 1크레딧)</li>
              <li>React Hooks와 Moment.js를 활용한 실시간 타이머 구현</li>
              <li>크레딧 사용 및 충전 히스토리 관리</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>면접 관리 시스템:</strong></p>
            <ul>
              <li>과거 면접 기록 저장 및 검토 기능</li>
              <li>종합적인 피드백 이력 관리</li>
              <li>상세한 성과 지표 제공</li>
              <li>개선 영역 식별 및 학습 방향 제시</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>종합 분석 대시보드:</strong></p>
            <ul>
              <li>Recharts 라이브러리를 활용한 면접 데이터 시각화</li>
              <li>개인별 면접 성과 추적 및 상세 분석</li>
              <li>답변 품질 평가 및 개선점 도출</li>
              <li>직무별 성과 분석 및 맞춤형 학습 방향 제시</li>
              <li>시간에 따른 성장 과정 모니터링</li>
            </ul>
          </div>
        </div>
        
        <div class="challenges-section">
          <p><strong>기술적 도전:</strong></p>
          
          <div class="challenge-category">
            <p><strong>실시간 처리 최적화:</strong></p>
            <ul>
              <li>음성 인식 및 AI 응답 처리 지연 문제 해결</li>
              <li>WebSocket을 활용한 실시간 데이터 동기화</li>
              <li>브라우저 호환성 이슈 해결</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>상태 관리 최적화:</strong></p>
            <ul>
              <li>React Context와 Custom Hooks를 활용한 전역 상태 관리</li>
              <li>크레딧 시스템의 동시성 이슈 해결</li>
              <li>캐싱 전략 구현으로 성능 개선</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>다국어 처리:</strong></p>
            <ul>
              <li>동적 언어 전환 시스템 구현</li>
              <li>AI 모델의 다국어 처리 최적화</li>
              <li>언어별 폰트 및 레이아웃 대응</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>프론트엔드 최적화:</strong></p>
            <ul>
              <li>Code Splitting을 통한 초기 로딩 시간 단축</li>
              <li>이미지 최적화 및 레이지 로딩 구현</li>
              <li>컴포넌트 메모이제이션을 통한 리렌더링 최소화</li>
            </ul>
          </div>
        </div>
        
        <div class="user-flow-section">
        
          
          <p><strong>홈페이지:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s3.png" alt="홈페이지 1" class="flow-screenshot">
            
          </div>
          
          <p><strong>대시보드, 다국어 지원, 크레딧 관리 및 자동 충천:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s4.png" alt="대시보드 1" class="flow-screenshot">
            
          </div>
          
          <p><strong>AI를 활용한 직무별 맞춤형 면접 질문 생성, 음성 인식을 통한 실시간 답변 수집 및 텍스트 변환:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s5.png" alt="면접 시스템 1" class="flow-screenshot">
            
          </div>
          
          <p><strong>답변에 대한 AI 기반 실시간 평가 및 피드백 제공:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s6.png" alt="피드백 1" class="flow-screenshot">
            
          </div>
          
          <p><strong>과거 면접 모든 질문 저장 및 검토 기능, 피드백 및 추천 답변 이력 관리:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s7.png" alt="이력 관리 1" class="flow-screenshot">
            
          </div>
          
          <p><strong>종합 분석 대시보드, 면접 데이터 시각화, 개인별 면접 성과 추적 및 상세 분석, 답변 품질 평가 및 개선점 도출:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s8.png" alt="분석 1" class="flow-screenshot">
            
          </div>
        </div>
      `,
    titleEn: 'AI Interview & Feedback Assistant',
    descriptionEn: `
        <p>During my job search, I experienced firsthand the importance of interview preparation and the lack of effective practice methods. The biggest challenge was obtaining objective feedback when practicing alone and the limitations in preparing job-specific questions.</p>
        <p><strong>Solution:</strong></p>
        <p>To address these issues, I developed an AI-powered mock interview platform. Rather than simply repeating predetermined questions, the goal was to provide customized questions based on the user's job and career level, and to offer real-time feedback.</p>
        
        <div class="screenshot-container">
            <img src="img/project1/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>Development Period:</strong></p>
          <ul>
            <li>Planning, design: 2024.04.01 ~ 2024.04.15</li>
            <li>Development: 2024.04.16 ~ 2024.05.28</li>
            <li>Testing and deployment: 2024.05.29 ~ 2024.06.05</li>
          </ul>
        </div>
        
            <div class="optimization-section">
          <p><strong>My Role:</strong></p>
          <ul>
            <li>Project Manager, Frontend, Backend</li>
            <li>Service planning and direction setting</li>
            <li>Main logic implementation (frontend, backend), API design, DB architecture</li>
              </ul>
        </div>
        
        <div class="environment-section">
          <p><strong>Development Environment:</strong></p>
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>Next.js 13 (Server-side rendering and routing with App Router)</li>
              <li>React (Component-based UI development and state management with Hooks)</li>
              <li>Tailwind CSS (Responsive design and custom UI implementation)</li>
              <li>Lucide React (Icon system)</li>
              <li>Clerk (User authentication system)</li>
              <li>Shadcn UI (Reusable component library)</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>PostgreSQL (Relational database design and implementation)</li>
              <li>Drizzle ORM (Type-safe database queries)</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>State Management:</strong></p>
            <ul>
              <li>React Context for language settings</li>
              <li>useState for local state management</li>
              <li>useEffect for real-time updates</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>APIs and Integration:</strong></p>
            <ul>
              <li>Google Gemini AI API (Custom interview question generation and answer evaluation)</li>
              <li>Speech Recognition API for voice input</li>
              <li>WebRTC (Real-time voice recognition and processing)</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>Core Features:</strong></p>
          
          <div class="feature-category">
            <p><strong>AI Interview System:</strong></p>
            <ul>
              <li>Custom interview question generation by job type using Google Gemini AI</li>
              <li>Real-time answer collection and text conversion through Speech Recognition API</li>
              <li>Multi-language support (Korean, English, Japanese, Chinese)</li>
              <li>AI-based real-time evaluation and feedback on answers</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Credit System:</strong></p>
            <ul>
              <li>User-specific credit management system</li>
              <li>Automatic credit recharge (1 credit per minute)</li>
              <li>Real-time timer implementation using React Hooks and Moment.js</li>
              <li>Credit usage and recharge history management</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Interview Management System:</strong></p>
            <ul>
              <li>Past interview storage and review functionality</li>
              <li>Comprehensive feedback history management</li>
              <li>Detailed performance metrics</li>
              <li>Identification of improvement areas and learning direction guidance</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Comprehensive Analysis Dashboard:</strong></p>
            <ul>
              <li>Interview data visualization using Recharts library</li>
              <li>Individual interview performance tracking and detailed analysis</li>
              <li>Answer quality evaluation and improvement point derivation</li>
              <li>Job-specific performance analysis and customized learning direction</li>
              <li>Growth process monitoring over time</li>
            </ul>
          </div>
        </div>
        
        <div class="challenges-section">
          <p><strong>Technical Challenges:</strong></p>
          
          <div class="challenge-category">
            <p><strong>Real-time Processing Optimization:</strong></p>
            <ul>
              <li>Resolving speech recognition and AI response processing delay issues</li>
              <li>Real-time data synchronization using WebSocket</li>
              <li>Browser compatibility issues</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>State Management Optimization:</strong></p>
            <ul>
              <li>Global state management using React Context and Custom Hooks</li>
              <li>Resolving concurrency issues in the credit system</li>
              <li>Performance improvement through caching strategies</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>Multi-language Processing:</strong></p>
            <ul>
              <li>Dynamic language switching system implementation</li>
              <li>Optimization of AI model's multi-language processing</li>
              <li>Font and layout adaptation for different languages</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>Frontend Optimization:</strong></p>
            <ul>
              <li>Initial loading time reduction through Code Splitting</li>
              <li>Image optimization and lazy loading implementation</li>
              <li>Minimizing re-rendering through component memoization</li>
            </ul>
          </div>
        </div>
        
        <div class="user-flow-section">
          <p><strong>Homepage:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s3.png" alt="Homepage 1" class="flow-screenshot">
          </div>
          
          <p><strong>Dashboard, Multi-language Support, Credit Management:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s4.png" alt="Dashboard 1" class="flow-screenshot">
          </div>
          
          <p><strong>AI-powered Job-specific Interview Questions and Voice Recognition:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s5.png" alt="Interview System 1" class="flow-screenshot">
          </div>
          
          <p><strong>AI-based Real-time Evaluation and Feedback:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s6.png" alt="Feedback 1" class="flow-screenshot">
          </div>
          
          <p><strong>Interview History and Feedback Management:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s7.png" alt="History Management 1" class="flow-screenshot">
          </div>
          
          <p><strong>Comprehensive Analysis Dashboard and Performance Tracking:</strong></p>
          <div class="screenshot-container">
            <img src="img/project1/s8.png" alt="Analysis 1" class="flow-screenshot">
          </div>
        </div>
      `,
    tech: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'PostgreSQL',
      'Google Gemini AI',
      'WebRTC',
    ],
    demo: 'https://ai-interview-app-u24p.vercel.app/',
    code: 'https://github.com/whd793/AI-Interview-App',
    images: [
      'img/project1/slide1.png',
      'img/project1/slide2.png',
      'img/project1/slide3.png',
      'img/project1/slide4.png',
    ],
  },
  {
    id: 2,
    title: 'PodStream - 팟캐스트 라디오 플랫폼',
    description: `
        <p>PodStream은 사용자들이 오디오와 비디오 팟캐스트를 쉽게 공유하고 시청/청취할 수 있는 스트리밍 플랫폼입니다. React와 Node.js를 기반으로 개발되었으며, 직관적인 UI/UX와 안정적인 스트리밍 서비스를 제공합니다. 이 프로젝트를 통해 현대적인 웹 애플리케이션 개발에 필요한 다양한 기술과 방법론을 실제로 적용하고 배울 수 있었습니다. 특히 사용자 경험과 성능 최적화에 중점을 두어 실제 서비스 수준의 애플리케이션을 구현하였습니다.</p>
        
         <div class="screenshot-container">
            <img src="img/project2/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>개발 기간:</strong></p>
          <ul>
            <li>기획 및 설계, 디자인: 2024.01.15 ~ 2024.01.29</li>
            <li>개발: 2024.01.30 ~ 2024.03.05</li>
            <li>테스트 및 배포: 2024.03.06 ~ 2024.03.13</li>
          </ul>
        </div>
        
           <div class="optimization-section">
          <p><strong>담당 역할:</strong></p>
          <ul>
            <li>PM, 프론트엔드, 백엔드</li>
            <li>서비스 기획 및 방향성 설정</li>
            <li>메인 로직 구현 (프론트엔드, 백엔드), API design, DB 설계</li>
              </ul>
        </div>


        <div class="environment-section">
          <p><strong>개발 환경:</strong></p>
          
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>React (컴포넌트 기반 아키텍처를 통한 효율적인 UI 구현)</li>
              <li>Redux Toolkit (상태 관리)</li>
              <li>Styled-Components (스타일링)</li>
              <li>Material-UI (UI 컴포넌트)</li>
              <li>i18next를 활용한 한/영 다국어 지원 기능 구현</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>Node.js (RESTful API, 메인 로직 구축)</li>
              <li>Express.js</li>
              <li>JWT와 카카오 OAuth를 활용한 사용자 인증 시스템 구현</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>DB:</strong></p>
            <ul>
              <li>MongoDB (데이터베이스)</li>
              <li>AWS S3 (파일 스토리지)</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>핵심 기능 구현:</strong></p>
          
          <div class="feature-category">
            <p><strong>사용자 인증 및 보안 시스템 구현:</strong></p>
            <ul>
              <li>JWT 토큰 기반의 보안 인증 시스템 설계 및 구현</li>
              <li>카카오 OAuth를 활용한 소셜 로그인 통합</li>
              <li>이메일 인증 및 비밀번호 재설정 기능 개발</li>
              <li>사용자 세션 관리 및 권한 기반 접근 제어 구현</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>멀티미디어 스트리밍 시스템 개발:</strong></p>
            <ul>
              <li>실시간 재생 진행률 추적 및 동기화 기능이 포함된 커스텀 오디오 플레이어 구현</li>
              <li>재생 속도 조절, 볼륨 제어 등 고급 플레이어 기능 개발</li>
              <li>사용자별 재생 기록 저장 및 이어듣기 기능 구현</li>
              <li>모바일 환경에서의 백그라운드 재생 지원</li>
              <li>이전/다음 에피소드 전환</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>클라우드 기반 미디어 관리 시스템:</strong></p>
            <ul>
              <li>AWS S3를 활용한 대용량 미디어 파일 업로드/다운로드 시스템 구축</li>
              <li>미디어 파일 메타데이터 관리 및 최적화</li>
              <li>안정적인 스트리밍을 위한 파일 포맷 처리 및 저장소 관리</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>콘텐츠 관리:</strong></p>
            <ul>
              <li>팟캐스트 업로드 및 관리</li>
              <li>에피소드 추가 및 수정</li>
              <li>카테고리별 콘텐츠 분류</li>
              <li>즐겨찾기 기능</li>
            </ul>
          </div>

            <div class="feature-category">
            <p><strong>UI/UX 및 다국어 지원:</strong></p>
            <ul>
              <li>Redux Toolkit을 활용한 효율적인 상태 관리 구현
</li>
              <li>i18next를 활용한 한국어/영어 다국어 처리 시스템 개발
</li>
              <li>반응형 디자인으로 모바일/데스크톱 환경 모두 지원
</li>
            </ul>
          </div>

 <div class="feature-category">
            <p><strong>성능 최적화:</strong></p>
            <ul>
              <li>지연 로딩을 통한 초기 로딩 시간 최적화


</li>
              <li>React.memo를 활용한 불필요한 리렌더링 방지

</li>
              <li>컴포넌트 메모이제이션을 통한 렌더링 성능 개선

</li>
<li>Redux Toolkit을 활용한 효율적인 상태 관리
</li>
            </ul>
          </div>
          
        </div>
        
        <div class="user-flow-section">
          <p><strong>프로젝트를 통해 배운 점:</strong></p>
          <ol>
            <li>React와 Node.js를 활용한 풀스택 개발 경험</li>
            <li>JWT를 활용한 인증 시스템 구현 방법</li>
            <li>미디어 스트리밍 서비스 개발 노하우</li>
            <li>MongoDB를 활용한 데이터 모델링</li>
            <li>Redux 상태 관리 라이브러리 활용 방법</li>
          </ol>
          
          <p><strong>홈페이지 및 인기 오디오, 카테고리별 콘텐츠 분류, 멀티미디어 스트리밍 시스템:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s2.png" alt="홈페이지" class="flow-screenshot">
            
          </div>
          
          <p><strong>라이트 & 다크 모드, 한국어/영어 다국어:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s3.png" alt="테마 모드" class="flow-screenshot">
            
          </div>
          
          <p><strong>회원가입 & 로그인:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s4.png" alt="인증 1" class="flow-screenshot">
          </div>
          
          <p><strong>프로필 페이지, 팟캐스트 업로드 및 관리:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s5.png" alt="프로필" class="flow-screenshot">
          </div>

           <p><strong>검색 & 카테고리 페이지:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s6.png" alt="프로필" class="flow-screenshot">
          </div>

           <p><strong>라디오 상세 및 에피소드 페이지:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s7.png" alt="프로필" class="flow-screenshot">
          </div>

           <p><strong>즐겨찾기:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s8.png" alt="프로필" class="flow-screenshot">
          </div>

           <p><strong>오디오 업로드:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s9.png" alt="프로필" class="flow-screenshot">
          </div>
        </div>
      `,
    titleEn: 'PodStream - Podcast Radio Platform',
    descriptionEn: `
        <p>PodStream is a streaming platform that allows users to easily share and listen to audio and video podcasts. Developed with React and Node.js, it provides an intuitive UI/UX and stable streaming service. Through this project, I was able to apply and learn various technologies and methodologies needed for modern web application development. I particularly focused on user experience and performance optimization to implement an application at the actual service level.</p>
        
         <div class="screenshot-container">
            <img src="img/project2/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>Development Period:</strong></p>
          <ul>
            <li>Planning and design: 2024.01.15 ~ 2024.01.29</li>
            <li>Development: 2024.01.30 ~ 2024.03.05</li>
            <li>Testing and deployment: 2024.03.06 ~ 2024.03.13</li>
          </ul>
        </div>
        
           <div class="optimization-section">
          <p><strong>My Role:</strong></p>
          <ul>
            <li>Project Manager, Frontend, Backend</li>
            <li>Service planning and direction setting</li>
            <li>Main logic implementation, API design, DB architecture</li>
              </ul>
        </div>


        <div class="environment-section">
          <p><strong>Development Environment:</strong></p>
          
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>React (Component-based architecture for efficient UI implementation)</li>
              <li>Redux Toolkit (State management)</li>
              <li>Styled-Components (Styling)</li>
              <li>Material-UI (UI components)</li>
              <li>i18next for Korean/English multi-language support</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>Node.js (RESTful API, main logic)</li>
              <li>Express.js</li>
              <li>JWT and Kakao OAuth for user authentication</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Database:</strong></p>
            <ul>
              <li>MongoDB (Database)</li>
              <li>AWS S3 (File storage)</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>Core Features:</strong></p>
          
          <div class="feature-category">
            <p><strong>User Authentication and Security System:</strong></p>
            <ul>
              <li>JWT token-based security authentication system</li>
              <li>Social login integration with Kakao OAuth</li>
              <li>Email verification and password reset functionality</li>
              <li>User session management and permission-based access control</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Multimedia Streaming System:</strong></p>
            <ul>
              <li>Custom audio player with real-time playback progress tracking and synchronization</li>
              <li>Advanced player features such as playback speed control and volume control</li>
              <li>User-specific playback history storage and resume listening functionality</li>
              <li>Background playback support in mobile environments</li>
              <li>Previous/next episode navigation</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Cloud-based Media Management System:</strong></p>
            <ul>
              <li>Large media file upload/download system using AWS S3</li>
              <li>Media file metadata management and optimization</li>
              <li>File format processing and storage management for stable streaming</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Content Management:</strong></p>
            <ul>
              <li>Podcast upload and management</li>
              <li>Episode addition and modification</li>
              <li>Category-based content classification</li>
              <li>Favorites functionality</li>
            </ul>
          </div>

            <div class="feature-category">
            <p><strong>UI/UX and Multi-language Support:</strong></p>
            <ul>
              <li>Efficient state management using Redux Toolkit</li>
              <li>Korean/English multi-language processing system using i18next</li>
              <li>Responsive design supporting both mobile and desktop environments</li>
            </ul>
          </div>

 <div class="feature-category">
            <p><strong>Performance Optimization:</strong></p>
            <ul>
              <li>Initial loading time optimization through lazy loading</li>
              <li>Prevention of unnecessary re-rendering using React.memo</li>
              <li>Improved rendering performance through component memoization</li>
              <li>Efficient state management using Redux Toolkit</li>
            </ul>
          </div>
          
        </div>
        
        <div class="user-flow-section">
          <p><strong>Lessons Learned:</strong></p>
          <ol>
            <li>Full-stack development experience using React and Node.js</li>
            <li>Implementing authentication systems using JWT</li>
            <li>Media streaming service development know-how</li>
            <li>Data modeling with MongoDB</li>
            <li>Utilizing Redux state management library</li>
          </ol>
          
          <p><strong>Homepage and Popular Audio, Category-based Content Classification, Multimedia Streaming System:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s2.png" alt="Homepage" class="flow-screenshot">
          </div>
          
          <p><strong>Light & Dark Mode, Korean/English Multi-language:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s3.png" alt="Theme Mode" class="flow-screenshot">
          </div>
          
          <p><strong>Registration & Login:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s4.png" alt="Authentication" class="flow-screenshot">
          </div>
          
          <p><strong>Profile Page, Podcast Upload and Management:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s5.png" alt="Profile" class="flow-screenshot">
          </div>

           <p><strong>Search & Category Page:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s6.png" alt="Search" class="flow-screenshot">
          </div>

           <p><strong>Radio Details and Episode Page:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s7.png" alt="Episode" class="flow-screenshot">
          </div>

           <p><strong>Favorites:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s8.png" alt="Favorites" class="flow-screenshot">
          </div>

           <p><strong>Audio Upload:</strong></p>
          <div class="screenshot-container">
            <img src="img/project2/s9.png" alt="Upload" class="flow-screenshot">
          </div>
        </div>
      `,
    tech: ['React', 'Node.js', 'Redux Toolkit', 'MongoDB', 'AWS S3', 'Express'],
    demo: 'https://podcastaudio.netlify.app/',
    code: 'https://github.com/whd793/podcast',
    images: [
      'img/project2/slide1.png',
      'img/project2/slide2.png',
      'img/project2/slide3.png',
      'img/project2/slide4.png',
    ],
  },
  {
    id: 3,
    title: '오프라인 매장을 위한 문자 구독 & 마케팅 서비스',
    description: `
        <p>레스토랑 업계가 직면한 디지털 전환의 어려움을 해결하고자 통합 마케팅 플랫폼을 개발하였습니다. 현장에서 식당 운영자들과 대화를 나누며, 고객과의 소통, 마케팅, 로열티 프로그램 운영 등에서 겪는 어려움을 직접 확인할 수 있었습니다. 특히 디지털 도구의 부재로 인한 비효율적인 운영과 고객 관리의 한계를 극복하고자, 식당 운영자와 고객 모두에게 도움이 되는 솔루션을 만들어보고자 했습니다.</p>
        
          <div class="screenshot-container">
            <img src="img/project3/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>개발 기간:</strong></p>
          <ul>
            <li>기획 및 설계, 디자인: 2024.07.23 ~ 2024.08.13</li>
            <li>개발: 2024.08.14 ~ 2024.12.11</li>
            <li>테스트 및 배포: 2024.12.12 ~ 2024.12.26</li>
          </ul>
        </div>
        
            <div class="optimization-section">
          <p><strong>담당 역할:</strong></p>
          <ul>
            <li>프론트엔드, 백엔드</li>
            <li>서비스 기획 및 방향성 설정</li>
            <li>메인 로직 구현 (프론트엔드, 백엔드), API design, DB 설계</li>
              </ul>
        </div>

        <div class="environment-section">
          <p><strong>개발환경:</strong></p>
          
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>핵심 프레임워크: React 18</li>
              <li>상태 관리: React Query, Context API</li>
              <li>라우팅 관리: React Router</li>
              <li>API 통신: Axios</li>
              <li>스타일링: Tailwind CSS, Framer Motion</li>
              <li>폼 관리: React Hook Form, Yup</li>
              <li>결제 모듈: Stripe Elements</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>런타임: Node.js 18</li>
              <li>프레임워크: Express.js</li>
              <li>데이터베이스: MongoDB/Mongoose</li>
              <li>캐싱: Redis</li>
              <li>인증: JWT Authentication, bcrypt</li>
              <li>파일 저장소: AWS S3</li>
              <li>SMS 서비스: Twilio API</li>
              <li>Stripe API: 결제 시스템</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>핵심 기능:</strong></p>
          
          <div class="feature-category">
            <p><strong>점주용 기능:</strong></p>
            <ul>
              <li><strong>계정 관리:</strong> 회원가입 및 로그인, 프로필 관리, 비밀번호 변경, 계정 삭제 기능</li>
              <li><strong>텍스트 메시지 관리:</strong> 마케팅 메시지 작성 및 예약 발송, 메시지 템플릿 저장, 이미지 첨부 기능, 반복 발송 설정, Twilio API 연동, 예약 발송 시스템</li>
              <li><strong>스탬프 시스템:</strong> 스탬프 적립 규칙 설정, 일일 제한 및 쿨다운 시스템, 리워드 교환 시스템, 고객별 스탬프 현황 확인, NFC 태그 기반 스탬프 적립</li>
              <li><strong>구독자 관리:</strong> 구독자 목록 확인, 구독자 통계, 구독 해지 관리</li>
              <li><strong>식당 관리:</strong> 식당 정보 등록/수정/삭제, 식당 프로필 이미지 업로드, QR 코드 자동 생성, 영업 시간 및 위치 정보 관리</li>
              <li><strong>쿠폰 시스템:</strong> 쿠폰 생성 및 관리, QR 코드 기반 쿠폰 인증, 쿠폰 만료일 관리 로직 구현, 사용 현황 추적, 타겟팅 옵션</li>
                          <li><strong>이미지 처리 시스템:</strong> AWS S3 기반 이미지 업로드 </li>
                          <li><strong>검색 및 필터링:</strong> 고급 검색 기능, 다중 필터링 옵션
, 정렬 기능
, 실시간 검색 결과
</li>

              </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>고객용 기능:</strong></p>
            <ul>
              <li><strong>계정 관리:</strong> 휴대폰 번호 기반 회원가입, OTP 인증, 프로필 설정, 계정 설정 관리</li>
              <li><strong>식당 구독:</strong> QR 코드 스캔으로 구독, 구독 중인 식당 목록 확인, 구독 취소 기능</li>
              <li><strong>플레이리스트 기능:</strong> 즐겨찾기, 좋아하는 식당 저장, 커스텀 플레이리스트 생성, 플레이리스트 관리</li>
              <li><strong>쿠폰 관리:</strong> 발급받은 쿠폰 목록 확인, 쿠폰 사용 및 관리, 만료 예정 쿠폰 확인</li>
              <li><strong>스탬프 적립:</strong> NFC 태그/QR 코드로 스탬프 적립, 적립 현황 확인, 리워드 교환</li>
            </ul>
          </div>
        </div>
        
        <div class="feature-category">
          <p><strong>구독 시스템:</strong></p>
          <p>Stripe API를 활용한 구독 시스템을 개발했습니다. 사용자가 다양한 구독 플랜을 선택하고 관리할 수 있으며, 신용카드 결제, 플랜 업그레이드/다운그레이드, 크레딧 구매 등의 기능을 제공합니다.</p>
          <ul>
            <li>무료/유료 구독 플랜 관리 시스템 구축</li>
            <li>플랜 변경 시 자동 비례 배분(proration) 시스템 개발</li>
            <li>구독 갱신, 업그레이드, 다운그레드 로직 구현</li>
            <li>무료 플랜 및 3가지 유료 구독 플랜 (Basic, Pro, Premium) 구현</li>
            <li>플랜 업그레이드시 즉시 반영 및 차액 정산
</li>
<li>다운그레이드시 현재 구독 기간 종료 후 자동 변경
</li>
<li>구독 취소 및 재활성화 기능
</li>
          </ul>
          <p><strong>크레딧 시스템:</strong></p>
<ul>
<li>크레딧 시스템(구독/구매) 설계 및 구현
</li>
<li>자동 크레딧 갱신 및 이월 시스템 개발 (Webhook)
</li>
<li>구독 플랜별 기본 크레딧 제공
</li>

</ul>

                    <p><strong>결제 시스템 통합 구현:</strong></p>
<ul>
<li>Stripe Elements를 활용한 PCI 준수 결제 프로세스 구현 및 안전한 카드 결제 시스템
</li>
<li>다중 결제 수단 관리 기능 개발
</li>
<li>자동 결제 및 실패 복구 시스템 구축
</li>
<li>기본 결제 수단 설정 기능
</li>
<li>결제 내역 조회 및 영수증/인보이스 다운로드
</li>
<li>결제 실패 자동 복구 시스템
</li>
<li>환불 처리 자동화
</li>
<li>결제 데이터 동기화 시스템
</li>

</ul>
        </div>
        
        <div class="challenges-section">
          <p><strong>기술적 문제 해결:</strong></p>
          
          <div class="challenge-category">
            <p><strong>프론트엔드:</strong></p>
            <ul>
              <li>사용자 인터페이스의 성능 최적화를 위해 컴포넌트 메모이제이션을 통한 렌더링 최적화, React.memo, useCallback, useMemo 등의 메모이제이션 기법을 적극 활용했으며, 커스텀 훅을 개발하여 비즈니스 로직의 재사용성을 높였습니다
</li>
              <li>상태 관리 측면에서는 Context API를 활용하여 전역 상태를 관리했으며, 특히 인증 상태와 같은 중요 데이터의 일관성을 유지하기 위해 노력했습니다.
</li>
            </ul>
          </div>

             <div class="challenge-category">
            <p><strong>백엔드:</strong></p>
            <ul>
              <li>로딩 상태, 에러 처리, 성공/실패 메시지 등을 toast 알림으로 구현하여 사용자에게 즉각적인 피드백을 제공

</li>
              <li>MongoDB 트랜잭션 처리로 데이터 일관성 보장

</li>
<li>인덱싱을 통해 쿼리 성능을 최적화

</li>
<li>결제 실패 시 자동 복구 메커니즘 구현


</li>
<li>보안 측면에서는 JWT를 활용한 토큰 기반 인증 시스템을 구현했으며, bcrypt를 사용하여 비밀번호를 안전하게 해시화했습니다. 특히 사용자 인증 과정에서 OTP 시스템을 구현하여 이중 인증을 제공



</li>
<li>rate limiting을 적용하여 무차별 공격을 방지했습니다.




</li>
<li>데이터베이스 쿼리 최적화, 캐싱 전략 수립, 페이지네이션 구현 등을 통해 대규모 데이터 처리 시에도 빠른 응답 속도를 보장했습니다. 특히 Redis를 활용하여 자주 접근하는 데이터를 캐싱하고, 세션 관리를 효율적으로 수행했습니다.





</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>동시성 제어 문제 해결:</strong></p>
            <ul>
              <li>락 메커니즘 구현으로 동시 접근 제어</li>
              <li>결제 처리 시 고유한 idempotency key 사용</li>
              <li>데이터베이스 레벨의 트랜잭션 락 적용</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>데이터 정합성 보장. 구독 플랜 변경 시 결제와 데이터 업데이트의 정합성 문제가 발생했습니다. 이를 해결하기 위해:</strong></p>
            <ul>
              <li>MongoDB 트랜잭션 도입</li>
              <li>결제 실패 시 자동 롤백 메커니즘 구현</li>
            </ul>
          </div>
        </div>
        
        <div class="user-flow-section">
        <p><strong>System Architecture:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s66.png" alt="홈페이지 1" class="flow-screenshot">
          </div>

          <p><strong>홈페이지:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s2.png" alt="홈페이지 1" class="flow-screenshot">
          </div>
          
          <p><strong>점주용 대시보드, 비즈니스 정보 등록/수정/삭제, 프로필 이미지 업로드:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s3.png" alt="대시보드 1" class="flow-screenshot">
          </div>

           <p><strong>점주용 계정 설정, 프로필 관리, 비밀번호 변경, 계정 삭제 기능:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s4.png" alt="대시보드 1" class="flow-screenshot">
          </div>
          
          <p><strong>구독 시스템, 무료/유료 플랜, 플랜 변경 및 자동 비례 배분(proration), 플랜 변경 내역:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s5.png" alt="구독 1" class="flow-screenshot">
          </div>

           <p><strong>구독 결제 시스템, 다중 결제 수단 관리, 기본 결제 수단 설정:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s6.png" alt="구독 1" class="flow-screenshot">
          </div>
          
          <p><strong>크레딧 사용 내역, 자동 크레딧 갱신:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s7.png" alt="크레딧 1" class="flow-screenshot">
          </div>

           <p><strong>비즈니스 상세 대시보드:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s8.png" alt="크레딧 1" class="flow-screenshot">
          </div>
          
          <p><strong>마케팅 메시지 관리, 예약 발송 시스템, 발송 상태 추적, 검색 기능, 다중 필터링, 정렬 기능:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s9.png" alt="마케팅 1" class="flow-screenshot">
          </div>

          <p><strong>마케팅 메시지 작성 및 예약 발송, 메시지 템플릿 저장, 이미지 첨부, 반복 발송 설정, 예약 발송, 대량 메시지 발송,처리, 문자 & 쿠폰 미리보기:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s10.png" alt="마케팅 1" class="flow-screenshot">
          </div>
          
          <p><strong>쿠폰 생성 및 관리, QR 코드 기반 쿠폰 인증, 쿠폰 만료일 관리, 사용 현황 추적, 자동 만료 설정:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s11.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong>식당 QR 코드 다운로드, QR 코드 스캔 비즈니스 마케팅 구독:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s12.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong>구독자 메시지,쿠폰 자동 발생, 메시지 작성, 템플릿 저장:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s13.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

            <p><strong>스탬프 적립 규칙 설정, 일일 제한 쿨다운 시스템, 리워드 교환 시스템, 만료일 관리, 메시지,쿠폰 자동 발송:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s14.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

            <p><strong>자동 구독 취소 문자 답장 설정:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s15.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong>식당 정보 수정/삭제:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s16.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong>고객용 비즈니스 상세 페이지, 구독 및 취소, 즐겨찾기, 좋아하는 식당 저장, 커스텀 플레이리스트 생성 및 관리, 발급받은 쿠폰 목록 확인, 적립 현황, 리워드 교환:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s17.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong>식당 구독, OTP 인증:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s18.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

            <p><strong>플레이리스트 관리:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s19.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

             <p><strong>          구독 중인 비즈니스 목록 확인:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s20.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

           <p><strong> 고객 계정 설정 관리:</strong></p>
          <div class="screenshot-container">
            <img src="img/project3/s21.png" alt="쿠폰 1" class="flow-screenshot">
          </div>

        </div>
      `,
    titleEn: 'SMS Subscription & Marketing Service for Offline Stores',
    descriptionEn: `
        <p>I developed an integrated marketing platform to address the challenges of digital transformation in the restaurant industry. By talking with restaurant operators in the field, I could directly identify the difficulties they face in customer communication, marketing, and loyalty program operations. I aimed to create a solution that benefits both restaurant operators and customers, particularly to overcome inefficient operations and customer management limitations due to the lack of digital tools.</p>
        
        <div class="screenshot-container">
            <img src="img/project3/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

        <div class="period-section">
          <p><strong>Development Period:</strong></p>
          <ul>
            <li>Planning and design: 2024.07.23 ~ 2024.08.13</li>
            <li>Development: 2024.08.14 ~ 2024.12.11</li>
            <li>Testing and deployment: 2024.12.12 ~ 2024.12.26</li>
          </ul>
        </div>
        
        <div class="optimization-section">
          <p><strong>My Role:</strong></p>
          <ul>
            <li>Frontend, Backend</li>
            <li>Service planning and direction setting</li>
            <li>Main logic implementation, API design, DB architecture</li>
          </ul>
        </div>

        <div class="environment-section">
          <p><strong>Development Environment:</strong></p>
          
          <div class="env-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>Core framework: React 18</li>
              <li>State management: React Query, Context API</li>
              <li>Routing: React Router</li>
              <li>API communication: Axios</li>
              <li>Styling: Tailwind CSS, Framer Motion</li>
              <li>Form management: React Hook Form, Yup</li>
              <li>Payment module: Stripe Elements</li>
            </ul>
          </div>
          
          <div class="env-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>Runtime: Node.js 18</li>
              <li>Framework: Express.js</li>
              <li>Database: MongoDB/Mongoose</li>
              <li>Caching: Redis</li>
              <li>Authentication: JWT, bcrypt</li>
              <li>File storage: AWS S3</li>
              <li>SMS service: Twilio API</li>
              <li>Payment system: Stripe API</li>
            </ul>
          </div>
        </div>
        
        <div class="features-section">
          <p><strong>Core Features:</strong></p>
          
          <div class="feature-category">
            <p><strong>Business Owner Features:</strong></p>
            <ul>
              <li><strong>Account Management:</strong> Registration and login, profile management, password change, account deletion</li>
              <li><strong>Text Message Management:</strong> Marketing message creation and scheduled sending, message template storage, image attachment, recurring sending, Twilio API integration</li>
              <li><strong>Stamp System:</strong> Stamp accrual rules configuration, daily limits and cooldown system, reward exchange system, customer stamp status tracking, NFC tag-based stamp collection</li>
              <li><strong>Subscriber Management:</strong> Subscriber list viewing, subscriber statistics, subscription cancellation management</li>
              <li><strong>Restaurant Management:</strong> Restaurant information registration/editing/deletion, profile image upload, automatic QR code generation, business hours and location management</li>
              <li><strong>Coupon System:</strong> Coupon creation and management, QR code-based coupon authentication, coupon expiration management, usage tracking, targeting options</li>
              <li><strong>Image Processing System:</strong> AWS S3-based image upload</li>
              <li><strong>Search and Filtering:</strong> Advanced search functionality, multi-filtering options, sorting features, real-time search results</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Customer Features:</strong></p>
            <ul>
              <li><strong>Account Management:</strong> Phone number-based registration, OTP authentication, profile settings, account settings management</li>
              <li><strong>Restaurant Subscription:</strong> Subscription via QR code scan, subscribed restaurant list viewing, subscription cancellation</li>
              <li><strong>Playlist Features:</strong> Favorites, saving preferred restaurants, custom playlist creation, playlist management</li>
              <li><strong>Coupon Management:</strong> Viewing issued coupons, coupon usage and management, expiring coupon alerts</li>
              <li><strong>Stamp Collection:</strong> Stamp collection via NFC tag/QR code, viewing collection status, reward redemption</li>
            </ul>
          </div>
        </div>
        
        <div class="feature-category">
          <p><strong>Subscription System:</strong></p>
          <p>I developed a subscription system using the Stripe API. Users can select and manage various subscription plans, with features including credit card payments, plan upgrades/downgrades, and credit purchases.</p>
          <ul>
            <li>Free/paid subscription plan management system</li>
            <li>Automatic proration system for plan changes</li>
            <li>Subscription renewal, upgrade, downgrade logic implementation</li>
            <li>Free plan and 3 paid subscription plans (Basic, Pro, Premium)</li>
            <li>Immediate application and balance settlement for plan upgrades</li>
            <li>Automatic change after current subscription period for downgrades</li>
            <li>Subscription cancellation and reactivation functionality</li>
          </ul>

          <p><strong>Credit System:</strong></p>
          <ul>
            <li>Credit system (subscription/purchase) design and implementation</li>
            <li>Automatic credit renewal and carryover system (Webhook)</li>
            <li>Basic credits provided by subscription plan</li>
          </ul>

          <p><strong>Payment System Integration:</strong></p>
          <ul>
            <li>PCI-compliant payment process using Stripe Elements and secure card payment system</li>
            <li>Multiple payment method management</li>
            <li>Automatic payment and failure recovery system</li>
            <li>Default payment method setting</li>
            <li>Payment history viewing and receipt/invoice download</li>
            <li>Automatic payment failure recovery system</li>
            <li>Automated refund processing</li>
            <li>Payment data synchronization system</li>
          </ul>
        </div>
        
        <div class="challenges-section">
          <p><strong>Technical Problem Solving:</strong></p>
          
          <div class="challenge-category">
            <p><strong>Frontend:</strong></p>
            <ul>
              <li>For user interface performance optimization, I utilized component memoization for rendering optimization, actively applying memoization techniques such as React.memo, useCallback, and useMemo. I also developed custom hooks to enhance business logic reusability.</li>
              <li>For state management, I used Context API to manage global state, with particular effort to maintain consistency of important data such as authentication state.</li>
            </ul>
          </div>

          <div class="challenge-category">
            <p><strong>Backend:</strong></p>
            <ul>
              <li>Implemented toast notifications for loading states, error handling, and success/failure messages to provide immediate feedback to users</li>
              <li>Ensured data consistency through MongoDB transaction processing</li>
              <li>Optimized query performance through indexing</li>
              <li>Implemented automatic recovery mechanisms for payment failures</li>
              <li>For security, implemented token-based authentication with JWT and secure password hashing with bcrypt. Particularly implemented an OTP system in the user authentication process for two-factor authentication</li>
              <li>Applied rate limiting to prevent brute force attacks</li>
              <li>Ensured fast response times even with large-scale data processing through database query optimization, caching strategy establishment, and pagination implementation. Particularly used Redis to cache frequently accessed data and efficiently manage sessions</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>Concurrency Control Problem Solving:</strong></p>
            <ul>
              <li>Implemented lock mechanisms for concurrent access control</li>
              <li>Used unique idempotency keys for payment processing</li>
              <li>Applied database-level transaction locks</li>
            </ul>
          </div>
          
          <div class="challenge-category">
            <p><strong>Data Consistency Guarantee. When subscription plans were changed, issues with payment and data update consistency arose. To solve this:</strong></p>
            <ul>
              <li>Introduced MongoDB transactions</li>
              <li>Implemented automatic rollback mechanisms for payment failures</li>
            </ul>
          </div>
        </div>
      `,
    tech: [
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'Twilio API',
      'Stripe API',
      'AWS S3',
    ],
    demo: 'https://smsbiz.netlify.app/',
    code: 'https://github.com/whd793/sms-startup',
    images: [
      'img/project3/slide1.png',
      'img/project3/slide2.png',
      'img/project3/slide3.png',
      'img/project3/slide4.png',
    ],
  },
  {
    id: 4,
    title: '이커머스 사이트',
    description: `
        <p>이커머스 플랫폼 개발 프로젝트를 통해 제가 가진 기술력과 문제 해결 능력을 증명하고자 했습니다. React와 Firebase를 기반으로 한 이 프로젝트는 단순한 기술 구현을 넘어, 실제 사용자 경험을 고려한 서비스를 만드는 것을 목표로 했습니다. 특히 상태 관리, 성능 최적화, 반응형 디자인 구현 과정에서 프론트엔드 개발자로서의 역량을 크게 향상시킬 수 있었습니다.</p>
        
        <p>이커머스 플랫폼으로, 실시간 상품 업데이트, 사용자 인증, 장바구니 관리, 위시리스트 기능, 상품 리뷰 등 종합적인 쇼핑 경험을 제공합니다.</p>
        
         <div class="screenshot-container">
            <img src="img/project4/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

          
        <div class="period-section">
          <p><strong>개발 기간:</strong></p>
          <ul>
            <li>기획 및 설계, 디자인: 2023.08.20 ~ 2023.08.27</li>
            <li>개발: 2023.08.28 ~ 2023.10.09</li>
            <li>테스트 및 배포: 2023.10.10 ~ 2023.10.17</li>
          </ul>
        </div>
        
         <div class="optimization-section">
          <p><strong>담당 역할:</strong></p>
          <ul>
            <li>프론트엔드, 백엔드</li>
            <li>서비스 기획 및 방향성 설정</li>
            <li>메인 로직 구현 (프론트엔드, 백엔드), API design, DB 설계</li>
              </ul>
        </div>
        

        <div class="environment-section">
          <p><strong>개발 환경:</strong></p>
          <ul>
            <li><strong>프론트엔드 코어:</strong> React 18, Redux Toolkit</li>
            <li><strong>스타일링:</strong> Styled-components</li>
            <li><strong>백엔드:</strong> Firebase (Auth, Firestore)</li>
            <li><strong>상태 관리:</strong> Redux Toolkit, Redux-persist</li>
            <li><strong>라우팅:</strong> React Router v6</li>
          </ul>
        </div>
        
        <div class="features-section">
          <p><strong>핵심 기능:</strong></p>
          
          <div class="feature-category">
            <p><strong>Redux Toolkit을 활용한 전역 상태 관리 시스템 구축:</strong></p>
            <ul>
              <li>장바구니, 위시리스트, 사용자 인증 상태를 효율적으로 관리</li>
              <li>Selector 패턴 적용으로 불필요한 리렌더링 최적화</li>
              <li>Redux slice 패턴으로 상태 관리 로직 모듈화</li>
              <li>Redux 상태 정규화로 데이터 중복 제거</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>Firebase 기반 사용자 인증 시스템 구현:</strong></p>
            <ul>
              <li>이메일/비밀번호 및 Google OAuth 로그인</li>
              <li>Firestore 데이터베이스 설계 및 쿼리 최적화</li>
              <li>보안 규칙 설정으로 데이터 접근 제어</li>
              <li>실시간 사용자 세션 관리 구현</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>상품 관리:</strong></p>
            <ul>
              <li>카테고리별 상품 필터링</li>
              <li>추천 상품 섹션</li>
              <li>상세 상품 페이지</li>
              <li>상품 이미지 최적화</li>
              <li>최근 본 상품 추적</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>장바구니 및 결제 시스템:</strong></p>
            <ul>
              <li>실시간 장바구니 업데이트</li>
              <li>수량 조절 기능</li>
              <li>장바구니 상태 유지</li>
              <li>장바구니 요약</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>사용자 경험 최적화:</strong></p>
            <ul>
              <li>Toast 알림 시스템 구현으로 사용자 액션 피드백 제공</li>
              <li>모던한 반응형 디자인</li>
              <li>인터랙티브 상품 카드</li>
            </ul>
          </div>
          
          <div class="feature-category">
            <p><strong>성능 최적화:</strong></p>
            <ul>
              <li>Code Splitting을 통한 초기 로딩 시간 최적화</li>
              <li>React.memo와 useMemo를 활용한 컴포넌트 최적화</li>
              <li>이미지 레이지 로딩 구현</li>
            </ul>
          </div>
        </div>
        
        <div class="user-flow-section">
          <p><strong>홈페이지, 카테고리 쇼케이스, 추천 상품:</strong></p>
          <div class="screenshot-container">
            <img src="img/project4/s2.png" alt="홈페이지" class="flow-screenshot">
          </div>
          
          <p><strong>상세 상품 페이지, 상품 이미지 최적화, 최근 본 상품 추적, 상품 리뷰 시스템:</strong></p>
          <div class="screenshot-container">
            <img src="img/project4/s3.png" alt="상품 1" class="flow-screenshot">
          </div>
          
          <p><strong>장바구니 요약, 수량 조절 기능:</strong></p>
          <div class="screenshot-container">
            <img src="img/project4/s4.png" alt="장바구니 1" class="flow-screenshot">
          </div>
        </div>
      `,
    titleEn: 'E-commerce Site',
    descriptionEn: `
        <p>Through this e-commerce platform development project, I wanted to demonstrate my technical skills and problem-solving abilities. Based on React and Firebase, this project aimed to create a service that considers real user experience beyond simple technical implementation. I significantly improved my capabilities as a frontend developer through the process of state management, performance optimization, and responsive design implementation.</p>
        
        <p>As an e-commerce platform, it provides a comprehensive shopping experience including real-time product updates, user authentication, shopping cart management, wishlist functionality, and product reviews.</p>
        
         <div class="screenshot-container">
            <img src="img/project4/s1.png" alt="User Flow" class="flow-screenshot">
          </div>

          
        <div class="period-section">
          <p><strong>Development Period:</strong></p>
          <ul>
            <li>Planning and design: 2023.08.20 ~ 2023.08.27</li>
            <li>Development: 2023.08.28 ~ 2023.10.09</li>
            <li>Testing and deployment: 2023.10.10 ~ 2023.10.17</li>
          </ul>
        </div>
        
         <div class="optimization-section">
          <p><strong>My Role:</strong></p>
         <ul>
           <li>Frontend, Backend</li>
           <li>Service planning and direction setting</li>
           <li>Main logic implementation, API design, DB architecture</li>
         </ul>
       </div>
       

       <div class="environment-section">
         <p><strong>Development Environment:</strong></p>
         <ul>
           <li><strong>Frontend Core:</strong> React 18, Redux Toolkit</li>
           <li><strong>Styling:</strong> Styled-components</li>
           <li><strong>Backend:</strong> Firebase (Auth, Firestore)</li>
           <li><strong>State Management:</strong> Redux Toolkit, Redux-persist</li>
           <li><strong>Routing:</strong> React Router v6</li>
         </ul>
       </div>
       
       <div class="features-section">
         <p><strong>Core Features:</strong></p>
         
         <div class="feature-category">
           <p><strong>Global State Management System using Redux Toolkit:</strong></p>
           <ul>
             <li>Efficient management of shopping cart, wishlist, and user authentication states</li>
             <li>Optimization of unnecessary re-rendering through Selector pattern</li>
             <li>Modularization of state management logic through Redux slice pattern</li>
             <li>Elimination of data duplication through Redux state normalization</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>Firebase-based User Authentication System:</strong></p>
           <ul>
             <li>Email/password and Google OAuth login</li>
             <li>Firestore database design and query optimization</li>
             <li>Data access control through security rules configuration</li>
             <li>Real-time user session management implementation</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>Product Management:</strong></p>
           <ul>
             <li>Category-based product filtering</li>
             <li>Recommended products section</li>
             <li>Detailed product pages</li>
             <li>Product image optimization</li>
             <li>Recently viewed products tracking</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>Shopping Cart and Checkout System:</strong></p>
           <ul>
             <li>Real-time shopping cart updates</li>
             <li>Quantity adjustment functionality</li>
             <li>Shopping cart state persistence</li>
             <li>Cart summary</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>User Experience Optimization:</strong></p>
           <ul>
             <li>Toast notification system for user action feedback</li>
             <li>Modern responsive design</li>
             <li>Interactive product cards</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>Performance Optimization:</strong></p>
           <ul>
             <li>Initial loading time optimization through Code Splitting</li>
             <li>Component optimization using React.memo and useMemo</li>
             <li>Implementation of image lazy loading</li>
           </ul>
         </div>
       </div>
       
       <div class="user-flow-section">
         <p><strong>Homepage, Category Showcase, Recommended Products:</strong></p>
         <div class="screenshot-container">
           <img src="img/project4/s2.png" alt="Homepage" class="flow-screenshot">
         </div>
         
         <p><strong>Detailed Product Page, Product Image Optimization, Recently Viewed Products Tracking, Product Review System:</strong></p>
         <div class="screenshot-container">
           <img src="img/project4/s3.png" alt="Product" class="flow-screenshot">
         </div>
         
         <p><strong>Shopping Cart Summary, Quantity Adjustment Functionality:</strong></p>
         <div class="screenshot-container">
           <img src="img/project4/s4.png" alt="Shopping Cart" class="flow-screenshot">
         </div>
       </div>
     `,
    tech: [
      'React',
      'Redux Toolkit',
      'Firebase',
      'Styled-components',
      'React Router',
    ],
    demo: 'https://clothing-shop-ecom.netlify.app/',
    code: 'https://github.com/whd793/Shopping-ecommerce',
    images: [
      'img/project4/slide1.png',
      'img/project4/slide2.png',
      'img/project4/slide3.png',
      'img/project4/slide4.png',
    ],
  },
  {
    id: 5,
    title: 'Speedy Hero - 모바일 게임',
    description: `
       <p>Speedy Hero는 초고속 이동이 가능한 캐릭터가 장애물을 피하며 끝없이 달리는 러너(Runner) 게임입니다. 플레이어는 속도를 조절하며 장애물을 회피하고, AI 적들을 따돌리며 높은 점수를 기록하는 것이 목표입니다. 절제된 물리 엔진 사용, AI와의 상호작용, 그리고 최적화된 그래픽과 성능이 주요 기술적 특징입니다.</p>
       
       <p>Unity 기반의 게임 개발에 필요한 물리 엔진, AI, 그래픽 최적화, 비동기 로딩, 입력 시스템, UI/UX 설계 등의 다양한 기술을 학습하고 실전에서 적용하였습니다. 이 프로젝트를 통해 기획부터 프로토타입 개발, 최적화, 배포까지 전 과정을 경험할 수 있었으며, 특히 성능 최적화와 플레이어 경험 향상을 위한 다양한 해결책을 고민하는 과정에서 개발자로서 한층 성장할 수 있었습니다.</p>
       
         <div class="screenshot-container">
           <img src="img/project5/s1.png" alt="User Flow" class="flow-screenshot">
         </div>


       <div class="period-section">
         <p><strong>개발 기간:</strong></p>
         <ul>
           <li>기획 및 설계: 2017.01.24 ~ 2017.02.07</li>
           <li>개발: 2017.02.08 ~ 2017.04.12</li>
           <li>테스트 및 배포, 최적화: 2017.04.13 ~ 2017.05.04</li>
         </ul>
       </div>
       
       <div class="environment-section">
         <p><strong>사용 기술:</strong></p>
         <p>Unity (C#), NavMesh AI, Universal Render Pipeline (URP), ShaderLab, Raycasting, Object Pooling, Game Analytics, Facebook Analytics</p>
       </div>
       
         <div class="optimization-section">
         <p><strong>담당 역할:</strong></p>
         <ul>
           <li>게임 디자인: 게임의 컨셉, 캐릭터, 레벨 디자인 등 기획 및 구현</li>
           <li>프로그래밍: Unity와 C#을 이용한 게임 로직 및 인터랙션 구현</li>
           <li>테스트 및 배포: 다양한 기기에서의 테스트를 통해 버그 수정 및 최적화 작업</li>
             </ul>
       </div>
       
       <p><strong>성과:</strong> 다운로드 수 50,000회 돌파, 사용자 평점 4.5/5 달성, Retention: D1 45%, D7 12%</p>
       
       <div class="features-section">
         <p><strong>핵심 기능:</strong></p>
         
         <div class="feature-category">
           <p><strong>플레이어 이동 및 게임플레이 핵심 시스템 개발:</strong></p>
           <ul>
             <li>고속 이동 및 충돌 처리: Unity의 Rigidbody 물리를 사용하여 부드럽고 현실적인 속도 기반 모션 구현</li>
             <li>캐릭터 능력: Rigidbody.AddForce와 Raycasting을 사용한 대시, 회피 메카닉</li>
             <li>Raycast를 활용한 고속 이동 시 충돌 감지 보완 (Continuous Collision Detection 적용)</li>
             <li>DashController.cs를 개발하여 순간 가속(Dash) 기능 및 재사용 대기시간(Cooldown) 적용</li>
             <li>동적 장애물 생성: 장애물이 절차적으로 생성되어 매 실행마다 고유한 경험 제공</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>AI 및 적(Enemy) NPC 시스템 개발:</strong></p>
           <ul>
             <li>AI Pathfinding 및 추격 시스템: Unity의 NavMesh를 활용하여 AI가 동적으로 플레이어를 추격하도록 구현</li>
             <li>Finite State Machine (FSM) 적용 (Idle, Chase, Attack 상태 전환)</li>
             <li>장애물과의 충돌을 피하도록 NavMeshObstacle 추가</li>
             <li>동적 난이도 조절(DDA): 플레이어 성능에 기반한 적 스폰 비율 조절</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>그래픽 및 성능 최적화:</strong></p>
           <ul>
             <li>최적화된 렌더링 파이프라인: 성능 향상을 위해 Unity의 URP(Universal Render Pipeline) 사용</li>
             <li>ShaderLab 기반의 커스텀 셰이더 개발: 초고속 이동 시 모션 블러(Motion Blur) 효과 적용, 속도에 따른 트레일 효과(Afterimage Shader) 구현</li>
             <li>LOD (Level of Detail) 시스템 적용: 멀리 있는 오브젝트의 디테일을 낮추어 성능 개선</li>
             <li>비동기(Asynchronous) 씬 로딩 적용: 배경 및 맵을 비동기 방식으로 로딩하여 부드러운 씬 전환 구현</li>
             <li>Object Pooling 기법 적용: 빈번한 생성/소멸 대신 오브젝트 재사용을 위한 풀 매니저 활용</li>
           </ul>
         </div>
       </div>
       
       <div class="challenges-section">
         <p><strong>게임 최적화 및 기능적 문제 해결:</strong></p>
         <ul>
           <li>퀄리티 설정 최적화: 대부분 게임은 높은 설정이 필요하지 않음, 비용이 많이 드는 프로젝트에서는 그림자를 비활성화하고 캐릭터 아래 가짜 원형 이미지로 대체</li>
           <li>LOD(Level of Detail) 활용: 카메라 거리에 따라 메시를 단순화하는 스크립트, 성능 측면에서 많은 리소스 절약 가능</li>
           <li>캐싱 사용: Unity 컴포넌트 getter 함수는 참조를 가져오는 데 한 번만 사용</li>
           <li>2의 제곱 텍스처 사용: UI 요소도 포함하여 항상 2의 제곱 텍스처 사용 (그렇지 않으면 압축 비활성화)</li>
           <li>프로파일러 사용: CPU 사용량으로 성능 문제 파악, 렌더링, 물리 또는 그래픽 사용량 문제 발견</li>
           <li>압축 도구: 많은 드로우 콜은 Android에서 CPU 및 성능 문제 발생, 장면의 메시 병합으로 드로우 콜 수 감소</li>
         </ul>
       </div>
       
       <div class="user-flow-section">
         <p><strong>게임 플레이:</strong></p>
         <div class="screenshot-container">
           <img src="img/project5/s2.png" alt="게임플레이 1" class="flow-screenshot">
         </div>
       </div>
     `,
    titleEn: 'Speedy Hero - Mobile Game',
    descriptionEn: `
       <p>Speedy Hero is a runner game where a character with super-speed ability runs endlessly avoiding obstacles. Players aim to achieve high scores by adjusting speed, avoiding obstacles, and outrunning AI enemies. The key technical features include disciplined use of physics engines, interaction with AI, and optimized graphics and performance.</p>
       
       <p>I learned and applied various technologies necessary for Unity-based game development, such as physics engines, AI, graphics optimization, asynchronous loading, input systems, and UI/UX design. Through this project, I experienced the entire process from planning to prototype development, optimization, and deployment. I particularly grew as a developer by considering various solutions for performance optimization and player experience enhancement.</p>
       
         <div class="screenshot-container">
           <img src="img/project5/s1.png" alt="User Flow" class="flow-screenshot">
         </div>


       <div class="period-section">
         <p><strong>Development Period:</strong></p>
         <ul>
           <li>Planning and design: 2017.01.24 ~ 2017.02.07</li>
           <li>Development: 2017.02.08 ~ 2017.04.12</li>
           <li>Testing, deployment, optimization: 2017.04.13 ~ 2017.05.04</li>
         </ul>
       </div>
       
       <div class="environment-section">
         <p><strong>Technologies Used:</strong></p>
         <p>Unity (C#), NavMesh AI, Universal Render Pipeline (URP), ShaderLab, Raycasting, Object Pooling, Game Analytics, Facebook Analytics</p>
       </div>
       
         <div class="optimization-section">
         <p><strong>My Role:</strong></p>
         <ul>
           <li>Game Design: Planning and implementation of game concept, characters, level design</li>
           <li>Programming: Implementation of game logic and interactions using Unity and C#</li>
           <li>Testing and Deployment: Bug fixes and optimization work through testing on various devices</li>
             </ul>
       </div>
       
       <p><strong>Results:</strong> Over 50,000 downloads, 4.5/5 user rating, Retention: D1 45%, D7 12%</p>
       
       <div class="features-section">
         <p><strong>Core Features:</strong></p>
         
         <div class="feature-category">
           <p><strong>Player Movement and Core Gameplay System Development:</strong></p>
           <ul>
             <li>High-speed movement and collision handling: Smooth and realistic velocity-based motion using Unity's Rigidbody physics</li>
             <li>Character abilities: Dash and evasion mechanics using Rigidbody.AddForce and Raycasting</li>
             <li>Enhanced collision detection during high-speed movement with Raycast (Continuous Collision Detection applied)</li>
             <li>Development of DashController.cs for instant acceleration (Dash) functionality and cooldown implementation</li>
             <li>Dynamic obstacle generation: Procedurally generated obstacles providing a unique experience with each run</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>AI and Enemy NPC System Development:</strong></p>
           <ul>
             <li>AI Pathfinding and pursuit system: Implementation allowing AI to dynamically chase the player using Unity's NavMesh</li>
             <li>Finite State Machine (FSM) application (Idle, Chase, Attack state transitions)</li>
             <li>NavMeshObstacle addition to avoid collisions with obstacles</li>
             <li>Dynamic Difficulty Adjustment (DDA): Enemy spawn rate adjustment based on player performance</li>
           </ul>
         </div>
         
         <div class="feature-category">
           <p><strong>Graphics and Performance Optimization:</strong></p>
           <ul>
             <li>Optimized rendering pipeline: Use of Unity's URP (Universal Render Pipeline) for performance improvement</li>
             <li>Custom shader development based on ShaderLab: Motion Blur effect during high-speed movement, trail effect (Afterimage Shader) implementation based on speed</li>
             <li>LOD (Level of Detail) system application: Performance improvement by reducing the detail of distant objects</li>
             <li>Asynchronous scene loading: Smooth scene transition by loading backgrounds and maps asynchronously</li>
             <li>Object Pooling technique: Utilizing a pool manager for object reuse instead of frequent creation/destruction</li>
           </ul>
         </div>
       </div>
       
       <div class="challenges-section">
         <p><strong>Game Optimization and Functional Problem Solving:</strong></p>
         <ul>
           <li>Quality settings optimization: Most games don't need high settings; in cost-intensive projects, disabled shadows and replaced them with fake circular images below characters</li>
           <li>LOD (Level of Detail) utilization: Scripts to simplify meshes according to camera distance, saving significant resources in terms of performance</li>
           <li>Caching use: Unity component getter functions used only once to fetch references</li>
           <li>Power-of-two textures: Always used power-of-two textures including UI elements (otherwise compression is disabled)</li>
           <li>Profiler use: Identifying performance issues through CPU usage, detecting rendering, physics, or graphics usage problems</li>
           <li>Compression tools: Many draw calls cause CPU and performance issues on Android; reduced the number of draw calls by merging scene meshes</li>
         </ul>
       </div>
       
       <div class="user-flow-section">
         <p><strong>Gameplay:</strong></p>
         <div class="screenshot-container">
           <img src="img/project5/s2.png" alt="Gameplay 1" class="flow-screenshot">
         </div>
       </div>
     `,
    tech: ['Unity', 'C#', 'AI', 'ShaderLab', 'Game Analytics', 'Mobile'],
    demo: 'https://www.youtube.com/watch?v=tH6Hlx6yb9I',
    code: 'https://github.com/whd793/speed-hero-prototype',
    images: ['img/project5/slide1.png'],
  },
  {
    id: 6,
    title: 'Hyper Casual Game 프로젝트',
    description: `
       <p>Unity 엔진을 활용하여 22개의 하이퍼 캐주얼 게임을 성공적으로 개발했습니다. 개발 과정에서는 철저한 시장 조사를 실시하고, 신속한 prototyping과 반복적인 개발 주기를 통해 사용자 피드백을 기반으로 게임플레이 메커니즘을 지속적으로 개선했습니다. C# 프로그래밍을 사용하여 정교한 시스템을 구현했으며, 모듈화되고 재사용 가능한 코드 아키텍처를 만들어 개발 프로세스를 효율화하고 높은 코드 품질 표준을 유지했습니다.</p>
       
       <p>Game Analytics와 Facebook Analytics를 활용한 철저한 A/B 테스트와 데이터 분석을 통해 사용자 행동 패턴과 수익화 전략에 대한 깊은 통찰력을 얻을 수 있었습니다. 이러한 데이터 기반 접근 방식을 통해 주요 성과 지표를 최적화할 수 있었고, 그 결과 인상적인 리텐션율, user session과 사용자 참여도를 달성했습니다.</p>
       
       <p>이 프로젝트는 게임 개발에서의 제 기술적 역량뿐만 아니라 시장 수요를 이해하고 대응하는 능력을 배웠습니다. 이러한 경험을 통해 데이터 분석, 사용자 경험 디자인, 비즈니스 전략 수립 능력이 한층 강화되었습니다.</p>
       
         <div class="screenshot-container">
           <img src="img/project6/s1.png" alt="User Flow" class="flow-screenshot">
         </div>

       <div class="period-section">
         <p><strong>개발 기간:</strong> 2023.08 ~ 2024.03</p>
       </div>
       
       <div class="environment-section">
         <p><strong>사용 기술:</strong> Unity (C#), Game Analytics, Facebook Analytics</p>
       </div>
       
       
        <div class="optimization-section">
         <p><strong>담당 역할:</strong></p>
         <ul>
           <li>게임 디자인: 게임의 컨셉, 캐릭터, 레벨 디자인 등 기획 및 구현</li>
           <li>프로그래밍: Unity와 C#을 이용한 게임 로직 및 인터랙션 구현</li>
           <li>테스트 및 배포: 다양한 기기에서의 테스트를 통해 버그 수정 및 최적화 작업</li>
             </ul>
       </div>

       <div class="case-study-section">
         <p><strong>Case Study:</strong></p>
         <p>데이터 기반의 의사결정을 위해 핵심 성과 지표(KPI)를 설정하고 추적하는 시스템을 구축했습니다. Game Analytics와 Facebook Analytics를 활용하여 사용자 행동을 분석했고, A/B 테스트를 통해 게임의 주요 요소들을 최적화했습니다. 그 결과, D1 리텐션을 48%까지 끌어올렸습니다. 또한 세션 시간은 평균 5분으로 증가시켰으며, 광고 최적화를 통해 US 시장 CPI를 $0.62까지 낮추는데 성공했습니다.</p>
       </div>
 <div class="user-flow-section">
         <div class="screenshot-container">
           <img src="img/project6/s2.png" alt="게임플레이 1" class="flow-screenshot">
         </div>
       </div>

        <div class="case-study-section">
         <p>데이터 기반의 의사결정을 위해 핵심 성과 지표(KPI)를 설정하고 추적하는 시스템을 구축했습니다. Game Analytics와 Facebook Analytics를 활용하여 사용자 행동을 분석했고, A/B 테스트를 통해 게임의 주요 요소들을 최적화했습니다. 그 결과, D1 리텐션을 42%까지 끌어올렸습니다. 또한 세션 시간은 평균 5분으로 증가시켰으며, 광고 최적화를 통해 US 시장 CPI를 $0.55까지 낮추는데 성공했습니다.</p>
       </div>
 <div class="user-flow-section">
         <div class="screenshot-container">
           <img src="img/project6/s3.png" alt="게임플레이 1" class="flow-screenshot">
         </div>
       </div>



       <div class="optimization-section">
         <p><strong>게임 최적화 및 기능적 문제 해결:</strong></p>
         <ul>
           <li><strong>퀄리티 설정 최적화:</strong> 대부분 게임은 높은 설정이 필요하지 않음, 비용이 많이 드는 프로젝트에서는 그림자를 비활성화하고 캐릭터 아래 가짜 원형 이미지로 대체</li>
           <li><strong>LOD(Level of Detail) 활용:</strong> 카메라 거리에 따라 메시를 단순화하는 스크립트, 성능 측면에서 많은 리소스 절약 가능</li>
           <li><strong>캐싱 사용:</strong> Unity 컴포넌트 getter 함수는 참조를 가져오는 데 한 번만 사용</li>
           <li><strong>2의 제곱 텍스처 사용:</strong>
           <ul>
             <li>UI 요소도 포함하여 항상 2의 제곱 텍스처 사용 (그렇지 않으면 압축 비활성화)</li>
             <li>예시: 작은 이미지 - 128x128, 256x256, 중간 이미지 - 512x512, 1024x1024</li>
             <li>화면에서 차지하는 영역에 비례하여 이미지 해상도 결정
</li>
<li>2의 제곱이 아닌 이미지는 일반적으로 기기 메모리에 4배 더 부담
</li>
           </ul>
           </li>
           <li><strong>Android 햅틱 최적화:</strong> 많은 Android 기기는 햅틱으로 과잉반응하여 발열이나 지연 발생, Android에서는 가벼운 햅틱만 사용, 연속 햅틱 사용 금지</li>
           <li><strong>압축 도구:</strong> 많은 드로우 콜은 Android에서 CPU 및 성능 문제 발생, 장면의 메시 병합으로 드로우 콜 수 감소</li>
         </ul>
       </div>
       
       <div class="user-flow-section">
         <p><strong>게임 플레이:</strong></p>
         <div class="screenshot-container">
           <img src="img/project6/s4.png" alt="게임 1" class="flow-screenshot">
           <img src="img/project6/s5.png" alt="게임 2" class="flow-screenshot">
           <img src="img/project6/s6.png" alt="게임 3" class="flow-screenshot">
           <img src="img/project6/s7.png" alt="게임 4" class="flow-screenshot">
         </div>
       </div>
     `,
    titleEn: 'Hyper Casual Game Project',
    descriptionEn: `
       <p>Successfully developed 22 hyper casual games using the Unity engine. During the development process, I conducted thorough market research and continuously improved gameplay mechanisms based on user feedback through rapid prototyping and iterative development cycles. I implemented sophisticated systems using C# programming and created modular, reusable code architecture to streamline the development process and maintain high code quality standards.</p>
       
       <p>Through rigorous A/B testing and data analysis using Game Analytics and Facebook Analytics, I gained deep insights into user behavior patterns and monetization strategies. This data-driven approach allowed me to optimize key performance indicators, resulting in impressive retention rates, user session lengths, and user engagement.</p>
       
       <p>This project taught me not only my technical capabilities in game development but also my ability to understand and respond to market demands. Through this experience, my skills in data analysis, user experience design, and business strategy formulation were significantly strengthened.</p>
       
         <div class="screenshot-container">
           <img src="img/project6/s1.png" alt="User Flow" class="flow-screenshot">
         </div>

       <div class="period-section">
         <p><strong>Development Period:</strong> 2023.08 ~ 2024.03</p>
       </div>
       
       <div class="environment-section">
         <p><strong>Technologies Used:</strong> Unity (C#), Game Analytics, Facebook Analytics</p>
       </div>
       
       
        <div class="optimization-section">
         <p><strong>My Role:</strong></p>
         <ul>
           <li>Game Design: Planning and implementation of game concept, characters, level design</li>
           <li>Programming: Implementation of game logic and interactions using Unity and C#</li>
           <li>Testing and Deployment: Bug fixes and optimization work through testing on various devices</li>
             </ul>
       </div>

       <div class="case-study-section">
         <p><strong>Case Study:</strong></p>
         <p>I built a system to set and track key performance indicators (KPIs) for data-driven decision making. I analyzed user behavior using Game Analytics and Facebook Analytics, and optimized key game elements through A/B testing. As a result, I increased D1 retention to 48%. I also increased average session time to 5 minutes and successfully reduced CPI in the US market to $0.62 through ad optimization.</p>
       </div>
         
       <div class="user-flow-section">

         <p><strong>Case Study:</strong></p>
         <div class="screenshot-container">
           <img src="img/project6/s2.png" alt="Gameplay 1" class="flow-screenshot">
         </div>
       </div>

        <div class="case-study-section">
         <p>I established a system for setting and tracking key performance indicators (KPIs) to enable data-driven decision making. Using Game Analytics and Facebook Analytics, I analyzed user behavior and optimized key game elements through A/B testing. As a result, I was able to increase D1 retention to 42%. Additionally, I increased average session time to 5 minutes and successfully reduced CPI in the US market to $0.55 through ad optimization.</p>
       </div>
 <div class="user-flow-section">
         <div class="screenshot-container">
           <img src="img/project6/s3.png" alt="Gameplay 1" class="flow-screenshot">
         </div>
       </div>

       <div class="optimization-section">
         <p><strong>Game Optimization and Functional Problem Solving:</strong></p>
         <ul>
           <li><strong>Quality Settings Optimization:</strong> Most games don't need high settings; in cost-intensive projects, disabled shadows and replaced with fake circular images under characters</li>
           <li><strong>LOD (Level of Detail) Utilization:</strong> Scripts to simplify meshes based on camera distance, saving substantial resources in terms of performance</li>
           <li><strong>Caching Usage:</strong> Unity component getter functions used only once to retrieve references</li>
           <li><strong>Power-of-Two Textures:</strong>
           <ul>
             <li>Always used power-of-two textures including UI elements (otherwise compression is disabled)</li>
             <li>Examples: Small images - 128x128, 256x256, Medium images - 512x512, 1024x1024</li>
             <li>Image resolution determined proportionally to screen area occupied</li>
             <li>Non-power-of-two images typically burden device memory 4 times more</li>
           </ul>
           </li>
           <li><strong>Android Haptic Optimization:</strong> Many Android devices overreact to haptics causing heating or lag; used only light haptics on Android, avoided continuous haptic use</li>
           <li><strong>Compression Tools:</strong> Many draw calls cause CPU and performance issues on Android; reduced draw call count by merging scene meshes</li>
         </ul>
       </div>
       
       <div class="user-flow-section">
         <p><strong>Gameplay:</strong></p>
         <div class="screenshot-container">
           <img src="img/project6/s4.png" alt="Game 1" class="flow-screenshot">
           <img src="img/project6/s5.png" alt="Game 2" class="flow-screenshot">
           <img src="img/project6/s6.png" alt="Game 3" class="flow-screenshot">
           <img src="img/project6/s7.png" alt="Game 4" class="flow-screenshot">
         </div>
       </div>
     `,
    tech: ['Unity', 'C#', 'Game Analytics', 'Mobile', 'Optimization'],
    demo: '',
    code: '',
    images: [
      'img/project6/slide1.png',
      'img/project6/slide2.webp',
      'img/project6/slide3.webp',
      'img/project6/slide4.webp',
    ],
  },
];
